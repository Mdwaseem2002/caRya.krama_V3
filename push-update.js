const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VPS_IP = '31.97.207.239';
const VPS_USER = 'root';
const VPS_PASS = 'Pentacloud@2026';
const APP_DIR = '/var/www/caryakrama';
const PORT = 3002;
const TAR_FILE = 'caryakrama-update.tar.gz';
const LOCAL_DIR = __dirname;

// ── Step 1: Create archive of the fresh build ─────────────────────────────
console.log('📦 Packaging updated build...');
try {
  execSync(
    `tar -czf ${TAR_FILE} .next public package.json next.config.mjs tailwind.config.ts postcss.config.js tsconfig.json .env.production`,
    { cwd: LOCAL_DIR, stdio: 'inherit' }
  );
  const size = fs.statSync(path.join(LOCAL_DIR, TAR_FILE)).size;
  console.log(`✅ Archive ready: ${(size / 1024 / 1024).toFixed(2)} MB`);
} catch (e) {
  console.error('❌ Archive failed:', e.message);
  process.exit(1);
}

const tarPath = path.join(LOCAL_DIR, TAR_FILE);
const tarSize = fs.statSync(tarPath).size;

// ── Step 2: SSH + Upload + Hot-swap ──────────────────────────────────────
const conn = new Client();

function runCommand(conn, cmd, label) {
  return new Promise((resolve, reject) => {
    console.log(`\n⚙️  ${label}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream.on('data', (d) => { out += d; process.stdout.write(d.toString()); });
      stream.stderr.on('data', (d) => { out += d; process.stdout.write(d.toString()); });
      stream.on('close', () => resolve(out));
    });
  });
}

conn.on('ready', () => {
  console.log('\n🔗 Connected to VPS:', VPS_IP);

  conn.sftp((err, sftp) => {
    if (err) { console.error('SFTP error:', err); conn.end(); return; }

    const remoteTar = `/tmp/${TAR_FILE}`;
    console.log('\n📤 Uploading updated build...');
    const writeStream = sftp.createWriteStream(remoteTar);
    const readStream = fs.createReadStream(tarPath);
    let uploaded = 0;

    readStream.on('data', (chunk) => {
      uploaded += chunk.length;
      process.stdout.write(`\r   ${(uploaded / tarSize * 100).toFixed(1)}% uploaded  `);
    });

    writeStream.on('close', async () => {
      console.log('\n✅ Upload complete!');
      sftp.end();

      try {
        // Stop current PM2 process
        await runCommand(conn, `
          pm2 stop caryakrama 2>/dev/null || true
          echo "Stopped caryakrama"
        `, 'Stopping running app');

        // Backup old .next just in case, then replace with new build
        await runCommand(conn, `
          cd ${APP_DIR}
          rm -rf .next.bak 2>/dev/null || true
          mv .next .next.bak 2>/dev/null || true
          tar -xzf ${remoteTar}
          echo "✅ New build extracted"
        `, 'Extracting new build on server');

        // Write env file fresh
        await runCommand(conn, `
cat > ${APP_DIR}/.env.production << 'ENVEOF'
MONGODB_URI=mongodb+srv://CaRyakarma:Lisa2026@caryakrama.oq1cpam.mongodb.net/Caryakrama?retryWrites=true&w=majority&appName=CaRyakrama
RAZORPAY_KEY_ID=rzp_live_SsInnvC0nkDfid
RAZORPAY_KEY_SECRET=ZfN6kzhD53SX8tTuTzJAUZO0
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SsInnvC0nkDfid
NEXTAUTH_URL=https://caryakrama.com
NODE_ENV=production
ENVEOF
          echo "Env file written"
        `, 'Writing .env.production');

        // Restart app on port 3002
        await runCommand(conn, `
          cd ${APP_DIR}
          pm2 delete caryakrama 2>/dev/null || true
          PORT=${PORT} pm2 start npm --name "caryakrama" -- start -- -p ${PORT}
          pm2 save
          echo "✅ App restarted on port ${PORT}"
        `, `Restarting app on port ${PORT}`);

        // Wait and verify
        await runCommand(conn, `sleep 6 && echo "waited"`, 'Waiting for startup');

        await runCommand(conn, `
          if ss -tlnp | grep -q :${PORT}; then
            echo "✅ Port ${PORT} ACTIVE — updated app is running!"
          else
            echo "❌ Port ${PORT} not responding — checking logs:"
            pm2 logs caryakrama --lines 30 --nostream 2>&1
          fi
        `, 'Verifying updated app is live');

        // Final status
        await runCommand(conn, `
          echo ""
          echo "=== PM2 STATUS ==="
          pm2 status
          echo ""
          echo "=== BUILD ID on server ==="
          cat ${APP_DIR}/.next/BUILD_ID
          echo ""
          echo "✅ Updated caRya.krama is LIVE at https://caryakrama.com"
        `, 'Final status');

        // Cleanup
        await runCommand(conn, `rm -f ${remoteTar} && rm -rf ${APP_DIR}/.next.bak`, 'Cleanup');

      } catch(e) {
        console.error('\n❌ Deployment error:', e.message);
      } finally {
        conn.end();
      }
    });

    writeStream.on('error', (e) => {
      console.error('❌ Upload error:', e.message);
      conn.end();
    });

    readStream.pipe(writeStream);
  });
});

conn.on('error', (e) => console.error('SSH Error:', e.message));
conn.on('end', () => {
  console.log('\n🔌 SSH closed. Cleaning up local archive...');
  try { fs.unlinkSync(tarPath); } catch(e) {}
  console.log('🎉 Deployment complete!');
});

console.log(`\n🚀 Pushing UPDATED code to https://caryakrama.com (port ${PORT})\n`);
conn.connect({ host: VPS_IP, port: 22, username: VPS_USER, password: VPS_PASS, readyTimeout: 30000 });
