const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VPS_IP = '31.97.207.239';
const VPS_USER = 'root';
const VPS_PASS = 'Pentacloud@2026';
const APP_DIR = '/var/www/pentacloud';
const TAR_FILE = 'pentacloud-deploy.tar.gz';

// ── Path to Pentacloud Consulting project ────────────────────────────────────
const PENTACLOUD_DIR = 'C:\\Users\\zuhaib\\OneDrive\\Desktop\\Pentacloud Consulting';

// ── Step 1: Build the project ────────────────────────────────────────────────
console.log('🔨 Building Pentacloud Consulting for production...');
try {
  execSync('npm run build', {
    cwd: PENTACLOUD_DIR,
    stdio: 'inherit',
    shell: 'cmd.exe'
  });
  console.log('✅ Build complete!');
} catch (e) {
  console.error('❌ Build failed:', e.message);
  process.exit(1);
}

// ── Step 2: Create deployment archive ────────────────────────────────────────
const tarOut = path.join(PENTACLOUD_DIR, TAR_FILE);
console.log('\n📦 Creating deployment archive...');
try {
  // Use tar via cmd on Windows
  execSync(
    `tar -czf "${tarOut}" --exclude=node_modules --exclude=.git --exclude=".next\\cache" --exclude="${TAR_FILE}" .next public src package.json next.config.ts postcss.config.js tsconfig.json .env.local`,
    { cwd: PENTACLOUD_DIR, stdio: 'inherit', shell: 'cmd.exe' }
  );
  console.log('✅ Archive created:', TAR_FILE);
} catch (e) {
  console.error('❌ Archive creation failed:', e.message);
  process.exit(1);
}

const tarSize = fs.statSync(tarOut).size;
console.log(`📊 Archive size: ${(tarSize / 1024 / 1024).toFixed(2)} MB`);

// ── Step 3: SSH + Upload + Deploy ─────────────────────────────────────────────
const conn = new Client();

conn.on('ready', () => {
  console.log('\n🔗 SSH Connected to VPS:', VPS_IP);

  conn.sftp((err, sftp) => {
    if (err) {
      console.error('❌ SFTP error:', err.message);
      conn.end();
      return;
    }

    console.log('📤 Uploading archive to VPS...');
    const remoteTemp = `/tmp/${TAR_FILE}`;
    const writeStream = sftp.createWriteStream(remoteTemp);
    const readStream = fs.createReadStream(tarOut);
    let uploaded = 0;

    readStream.on('data', (chunk) => {
      uploaded += chunk.length;
      process.stdout.write(`\r   Progress: ${(uploaded / tarSize * 100).toFixed(1)}%  `);
    });

    writeStream.on('close', () => {
      console.log('\n✅ Upload complete!');
      sftp.end();
      runServerSetup(conn, remoteTemp);
    });

    writeStream.on('error', (e) => {
      console.error('❌ Upload failed:', e.message);
      conn.end();
    });

    readStream.pipe(writeStream);
  });
});

function runCommand(conn, cmd, label) {
  return new Promise((resolve, reject) => {
    console.log(`\n⚙️  ${label}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream.on('data', (d) => { out += d; process.stdout.write(d.toString()); });
      stream.stderr.on('data', (d) => { out += d; process.stdout.write(d.toString()); });
      stream.on('close', (code) => {
        if (code !== 0 && code !== null) console.warn(`   ⚠️  Exit code: ${code}`);
        resolve(out);
      });
    });
  });
}

async function runServerSetup(conn, remoteTar) {
  try {
    // Create app directory and extract
    await runCommand(conn, `
      mkdir -p ${APP_DIR}
      cd ${APP_DIR}
      tar -xzf ${remoteTar} .
      echo "✅ Extracted successfully"
    `, `Extracting app to ${APP_DIR}`);

    // Install production dependencies
    await runCommand(conn, `
      cd ${APP_DIR}
      echo "Installing production dependencies..."
      npm install --production --legacy-peer-deps
      echo "✅ Dependencies installed"
    `, 'Installing npm dependencies');

    // Write .env.production on server
    await runCommand(conn, `
      cat > ${APP_DIR}/.env.local << 'ENVEOF'
RESEND_API_KEY=re_3k765YXz_N6ig3FgQphCBQTmzDshzSJdr
CONTACT_EMAIL_TO=zuhaib@pentacloudconsulting.com
NEXTAUTH_URL=https://pentacloud.me
NODE_ENV=production
ENVEOF
      echo "✅ Environment file written"
    `, 'Writing .env.local');

    // Restart PM2 process
    await runCommand(conn, `
      pm2 stop pentacloud 2>/dev/null || true
      pm2 delete pentacloud 2>/dev/null || true
      cd ${APP_DIR}
      pm2 start npm --name "pentacloud" -- start -- -p 3001
      pm2 save
      pm2 startup systemd -u root --hp /root 2>/dev/null | tail -1 | bash 2>/dev/null || true
      echo "✅ PM2 process started"
      pm2 status
    `, 'Restarting PM2 process');

    // Configure Nginx for pentacloud.me
    await runCommand(conn, `
      cat > /etc/nginx/sites-available/pentacloud << 'NGINXEOF'
server {
    listen 80;
    server_name pentacloud.me www.pentacloud.me;

    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINXEOF

      ln -sf /etc/nginx/sites-available/pentacloud /etc/nginx/sites-enabled/pentacloud
      nginx -t && systemctl reload nginx
      echo "✅ Nginx configured and reloaded"
    `, 'Configuring Nginx for pentacloud.me');

    // SSL via certbot
    await runCommand(conn, `
      certbot --nginx -d pentacloud.me -d www.pentacloud.me \
        --non-interactive --agree-tos \
        --email zuhaib@pentacloudconsulting.com \
        --redirect 2>&1 || echo "⚠️  SSL may already be configured or needs manual setup"
    `, 'Setting up SSL certificate');

    // Final status
    await runCommand(conn, `
      echo ""
      echo "=== DEPLOYMENT STATUS ==="
      pm2 status
      echo ""
      echo "=== NGINX STATUS ==="
      systemctl status nginx --no-pager | head -10
      echo ""
      echo "✅ Pentacloud Consulting deployed!"
      echo "🌐 Site live at: https://pentacloud.me"
    `, 'Final status check');

    // Cleanup temp file
    await runCommand(conn, `rm -f ${remoteTar}`, 'Cleaning up temp files');

  } catch (e) {
    console.error('\n❌ Deployment error:', e.message);
  } finally {
    conn.end();
    // Clean up local tar
    try { fs.unlinkSync(tarOut); } catch(e) {}
    console.log('\n🔌 SSH connection closed');
  }
}

conn.on('error', (err) => {
  console.error('❌ SSH Error:', err.message);
});

conn.on('end', () => {
  console.log('\n✅ Done!');
});

console.log(`\n🚀 Deploying Pentacloud Consulting...`);
console.log(`📡 VPS: ${VPS_IP} → pentacloud.me\n`);

conn.connect({
  host: VPS_IP,
  port: 22,
  username: VPS_USER,
  password: VPS_PASS,
  readyTimeout: 30000,
});
