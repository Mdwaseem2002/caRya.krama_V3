/**
 * deploy-to-vps.js
 * Full automated deployment: Upload build + Setup server + Start app
 * Uses ssh2 (already in project deps) for password-based SSH/SFTP.
 */
const { Client } = require("ssh2");
const fs = require("fs");
const path = require("path");

const VPS = {
  host: "31.97.207.239",
  port: 22,
  username: "root",
  password: "Pentacloud@2026",
};

const LOCAL_ARCHIVE = path.join(__dirname, "deploy-upload.tar.gz");
const REMOTE_ARCHIVE = "/root/deploy-upload.tar.gz";
const APP_DIR = "/var/www/caryakrama";

// ── helpers ──────────────────────────────────────────────────────────────────
function sshExec(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\n⚡ Running: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = "";
      let stderr = "";
      stream.on("data", (d) => { stdout += d; process.stdout.write(d); });
      stream.stderr.on("data", (d) => { stderr += d; process.stderr.write(d); });
      stream.on("close", (code) => {
        if (code !== 0) console.warn(`⚠ exit code ${code}`);
        resolve({ stdout, stderr, code });
      });
    });
  });
}

function sftpUpload(conn, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const fileSize = fs.statSync(localPath).size;
      const readStream = fs.createReadStream(localPath);
      const writeStream = sftp.createWriteStream(remotePath);

      let uploaded = 0;
      let lastPct = -1;
      readStream.on("data", (chunk) => {
        uploaded += chunk.length;
        const pct = Math.floor((uploaded / fileSize) * 100);
        if (pct !== lastPct && pct % 5 === 0) {
          process.stdout.write(`\r📤 Uploading: ${pct}%  (${(uploaded / 1048576).toFixed(1)} / ${(fileSize / 1048576).toFixed(1)} MB)`);
          lastPct = pct;
        }
      });

      writeStream.on("close", () => { console.log("\n✅ Upload complete!"); resolve(); });
      writeStream.on("error", reject);
      readStream.on("error", reject);
      readStream.pipe(writeStream);
    });
  });
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const conn = new Client();

  conn.on("error", (err) => { console.error("SSH Error:", err.message); process.exit(1); });

  conn.on("ready", async () => {
    console.log("✅ SSH connected to", VPS.host);

    try {
      // ── 1. Upload the archive ────────────────────────────────────────────
      console.log("\n━━━ Step 1: Uploading build archive ━━━");
      await sftpUpload(conn, LOCAL_ARCHIVE, REMOTE_ARCHIVE);

      // ── 2. Install system dependencies ───────────────────────────────────
      console.log("\n━━━ Step 2: Installing system dependencies ━━━");
      await sshExec(conn, "apt-get update -y");
      await sshExec(conn, "apt-get install -y nginx certbot python3-certbot-nginx");

      // Check if Node is installed, install if not
      const nodeCheck = await sshExec(conn, "node -v 2>/dev/null || echo MISSING");
      if (nodeCheck.stdout.includes("MISSING")) {
        console.log("\n📦 Installing Node.js 20...");
        await sshExec(conn, "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -");
        await sshExec(conn, "apt-get install -y nodejs");
      }
      await sshExec(conn, "node -v && npm -v");

      // Install PM2
      const pm2Check = await sshExec(conn, "pm2 -v 2>/dev/null || echo MISSING");
      if (pm2Check.stdout.includes("MISSING")) {
        await sshExec(conn, "npm install -g pm2");
        await sshExec(conn, "pm2 startup systemd -u root --hp /root");
      }

      // ── 3. Extract and set up the app ────────────────────────────────────
      console.log("\n━━━ Step 3: Setting up application ━━━");
      await sshExec(conn, `mkdir -p ${APP_DIR}`);
      await sshExec(conn, `rm -rf ${APP_DIR}/.next ${APP_DIR}/public ${APP_DIR}/node_modules`);
      await sshExec(conn, `tar -xzf ${REMOTE_ARCHIVE} -C ${APP_DIR}`);

      // Rename .env.production to .env.local on server
      await sshExec(conn, `cd ${APP_DIR} && cp .env.production .env.local 2>/dev/null || true`);

      // Install production dependencies
      console.log("\n━━━ Step 4: Installing npm dependencies ━━━");
      await sshExec(conn, `cd ${APP_DIR} && npm install --production --legacy-peer-deps`);

      // ── 5. Configure Nginx ───────────────────────────────────────────────
      console.log("\n━━━ Step 5: Configuring Nginx ━━━");
      const nginxConf = `
server {
    listen 80;
    server_name caryakrama.com www.caryakrama.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
        proxy_cache_bypass \\$http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3002;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public {
        proxy_pass http://localhost:3002;
        add_header Cache-Control "public, max-age=86400";
    }
}`;
      await sshExec(conn, `cat > /etc/nginx/sites-available/caryakrama << 'ENDNGINX'${nginxConf}\nENDNGINX`);
      await sshExec(conn, "ln -sf /etc/nginx/sites-available/caryakrama /etc/nginx/sites-enabled/caryakrama");
      await sshExec(conn, "rm -f /etc/nginx/sites-enabled/default");
      await sshExec(conn, "nginx -t && systemctl reload nginx");

      // ── 6. Start/Restart the app with PM2 ───────────────────────────────
      console.log("\n━━━ Step 6: Starting application with PM2 ━━━");
      await sshExec(conn, `cd ${APP_DIR} && pm2 delete caryakrama 2>/dev/null; pm2 start npm --name caryakrama -- start -- -p 3002`);
      await sshExec(conn, "pm2 save");

      // ── 7. SSL Certificate ───────────────────────────────────────────────
      console.log("\n━━━ Step 7: Requesting SSL certificate ━━━");
      await sshExec(conn, "certbot --nginx -d caryakrama.com -d www.caryakrama.com --non-interactive --agree-tos -m admin@caryakrama.com --redirect");

      // ── 8. Verify ────────────────────────────────────────────────────────
      console.log("\n━━━ Step 8: Verifying deployment ━━━");
      await sshExec(conn, "pm2 list");
      await sshExec(conn, "curl -sI http://localhost:3002 | head -5");

      console.log("\n");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("  🎉 DEPLOYMENT COMPLETE!");
      console.log("  🌐 https://caryakrama.com");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    } catch (e) {
      console.error("\n❌ Deployment error:", e.message);
    } finally {
      conn.end();
    }
  });

  console.log(`🔗 Connecting to ${VPS.host}...`);
  conn.connect(VPS);
}

main();
