const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VPS_IP = '31.97.207.239';
const VPS_USER = 'root';
const VPS_PASS = 'Pentacloud@2026';
const APP_DIR = '/var/www/caryakrama';
const TAR_FILE = 'caryakrama-deploy.tar.gz';
const LOCAL_DIR = __dirname;

// ── Step 1: Create deployment archive ───────────────────────────────────────
console.log('📦 Creating deployment archive...');
try {
  execSync(
    `tar -czf ${TAR_FILE} --exclude=node_modules --exclude=.git --exclude=.next/cache --exclude=${TAR_FILE} --exclude=deploy-upload.tar.gz --exclude=deploy.tar.gz .next public src package.json next.config.mjs tailwind.config.ts postcss.config.js tsconfig.json .env.production`,
    { cwd: LOCAL_DIR, stdio: 'inherit' }
  );
  console.log('✅ Archive created:', TAR_FILE);
} catch (e) {
  console.error('❌ Archive creation failed:', e.message);
  process.exit(1);
}

const tarPath = path.join(LOCAL_DIR, TAR_FILE);
const tarSize = fs.statSync(tarPath).size;
console.log(`📊 Archive size: ${(tarSize / 1024 / 1024).toFixed(2)} MB`);

// ── Step 2: SSH + Upload + Setup ─────────────────────────────────────────────
const conn = new Client();

conn.on('ready', () => {
  console.log('\n🔗 SSH Connected to VPS:', VPS_IP);

  // Upload the tar file via SFTP first
  conn.sftp((err, sftp) => {
    if (err) {
      console.error('❌ SFTP error:', err.message);
      conn.end();
      return;
    }

    console.log('📤 Uploading archive to VPS...');
    const remoteTemp = `/tmp/${TAR_FILE}`;
    const writeStream = sftp.createWriteStream(remoteTemp);

    const readStream = fs.createReadStream(tarPath);
    let uploaded = 0;

    readStream.on('data', (chunk) => {
      uploaded += chunk.length;
      process.stdout.write(`\r   Progress: ${(uploaded / tarSize * 100).toFixed(1)}%  `);
    });

    writeStream.on('close', () => {
      console.log('\n✅ Upload complete!');
      sftp.end();

      // Now run server setup commands
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
        if (code !== 0 && code !== null) {
          console.warn(`   ⚠️  Exit code: ${code}`);
        }
        resolve(out);
      });
    });
  });
}

async function runServerSetup(conn, remoteTar) {
  try {
    // Check/install Node.js
    await runCommand(conn, `
      if ! command -v node &>/dev/null; then
        echo "Installing Node.js 20..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
      else
        echo "Node.js already installed: $(node -v)"
      fi
    `, 'Checking Node.js');

    // Check/install PM2
    await runCommand(conn, `
      if ! command -v pm2 &>/dev/null; then
        echo "Installing PM2..."
        npm install -g pm2
      else
        echo "PM2 already installed: $(pm2 -v)"
      fi
    `, 'Checking PM2');

    // Check/install Nginx
    await runCommand(conn, `
      if ! command -v nginx &>/dev/null; then
        echo "Installing Nginx..."
        apt-get update && apt-get install -y nginx
      else
        echo "Nginx already installed: $(nginx -v 2>&1)"
      fi
    `, 'Checking Nginx');

    // Create app directory and extract
    await runCommand(conn, `
      mkdir -p ${APP_DIR}
      cd ${APP_DIR}
      tar -xzf ${remoteTar} .
      echo "Extracted successfully"
    `, `Extracting app to ${APP_DIR}`);

    // Install production dependencies
    await runCommand(conn, `
      cd ${APP_DIR}
      echo "Installing production dependencies..."
      npm install --production --legacy-peer-deps
      echo "Dependencies installed"
    `, 'Installing npm dependencies');

    // Create .env.production on server
    await runCommand(conn, `
      cat > ${APP_DIR}/.env.production << 'ENVEOF'
MONGODB_URI=mongodb+srv://CaRyakarma:Lisa2026@caryakrama.oq1cpam.mongodb.net/Caryakrama?retryWrites=true&w=majority&appName=CaRyakrama
RAZORPAY_KEY_ID=rzp_live_SsInnvC0nkDfid
RAZORPAY_KEY_SECRET=ZfN6kzhD53SX8tTuTzJAUZO0
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SsInnvC0nkDfid
NEXTAUTH_URL=https://caryakrama.com
NODE_ENV=production
ENVEOF
      echo "Environment file written"
    `, 'Writing .env.production');

    // Stop existing PM2 process if running
    await runCommand(conn, `
      pm2 stop caryakrama 2>/dev/null || true
      pm2 delete caryakrama 2>/dev/null || true
      echo "Old PM2 process cleared"
    `, 'Clearing old PM2 process');

    // Start app with PM2
    await runCommand(conn, `
      cd ${APP_DIR}
      pm2 start npm --name "caryakrama" -- start -- -p 3000
      pm2 save
      pm2 startup systemd -u root --hp /root 2>/dev/null | tail -1 | bash 2>/dev/null || true
      echo "PM2 process started"
      pm2 status
    `, 'Starting app with PM2');

    // Configure Nginx
    await runCommand(conn, `
      cat > /etc/nginx/sites-available/caryakrama << 'NGINXEOF'
server {
    listen 80;
    server_name caryakrama.com www.caryakrama.com;

    # Max upload size for car images
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
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

      # Enable site
      ln -sf /etc/nginx/sites-available/caryakrama /etc/nginx/sites-enabled/caryakrama
      rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

      # Test and reload nginx
      nginx -t && systemctl reload nginx
      echo "Nginx configured and reloaded"
    `, 'Configuring Nginx reverse proxy');

    // Install Certbot and get SSL
    await runCommand(conn, `
      if ! command -v certbot &>/dev/null; then
        apt-get install -y certbot python3-certbot-nginx
        echo "Certbot installed"
      else
        echo "Certbot already installed"
      fi
    `, 'Checking Certbot');

    await runCommand(conn, `
      certbot --nginx -d caryakrama.com -d www.caryakrama.com \
        --non-interactive --agree-tos \
        --email admin@caryakrama.com \
        --redirect 2>&1 || echo "⚠️  SSL setup may need manual intervention"
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
      echo "✅ Deployment complete!"
      echo "🌐 Site should be live at: https://caryakrama.com"
    `, 'Final status check');

    // Cleanup temp file
    await runCommand(conn, `rm -f ${remoteTar}`, 'Cleaning up temp files');

  } catch (e) {
    console.error('\n❌ Deployment error:', e.message);
  } finally {
    conn.end();
    console.log('\n🔌 SSH connection closed');
  }
}

conn.on('error', (err) => {
  console.error('❌ SSH Error:', err.message);
});

conn.on('end', () => {
  console.log('\n✅ Done! Cleaning up local tar file...');
  try { fs.unlinkSync(tarPath); } catch(e) {}
});

console.log(`\n🚀 Deploying caRya.krama to https://caryakrama.com`);
console.log(`📡 VPS: ${VPS_IP}\n`);

conn.connect({
  host: VPS_IP,
  port: 22,
  username: VPS_USER,
  password: VPS_PASS,
  readyTimeout: 30000,
});
