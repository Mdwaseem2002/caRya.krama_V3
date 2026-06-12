const { Client } = require("ssh2");

const c = new Client();

function exec(conn, cmd) {
  return new Promise((resolve) => {
    console.log(`\n> ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) { console.error(err); resolve(""); return; }
      let out = "";
      stream.on("data", (d) => { out += d; process.stdout.write(d); });
      stream.stderr.on("data", (d) => { out += d; process.stderr.write(d); });
      stream.on("close", () => resolve(out));
    });
  });
}

c.on("ready", async () => {
  console.log("Connected!\n");

  // 1. Delete the crashing PM2 process
  console.log("=== Step 1: Delete crashing PM2 process ===");
  await exec(c, "pm2 delete caryakrama 2>/dev/null; echo done");

  // 2. Write new Nginx config pointing to port 3001
  console.log("\n=== Step 2: Update Nginx to port 3001 ===");
  await exec(c, `cat > /etc/nginx/sites-available/caryakrama << 'ENDCONF'
server {
    listen 80;
    server_name caryakrama.com www.caryakrama.com;
    client_max_body_size 50M;

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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:3001;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
ENDCONF`);

  await exec(c, "nginx -t 2>&1 && systemctl reload nginx && echo 'Nginx OK'");

  // 3. Start app on port 3001
  console.log("\n=== Step 3: Start app on port 3001 ===");
  await exec(c, "cd /var/www/caryakrama && PORT=3001 pm2 start npm --name caryakrama -- start 2>&1");

  // 4. Wait and check logs
  console.log("\n=== Step 4: Wait 8s and check ===");
  await exec(c, "sleep 8 && pm2 logs caryakrama --lines 15 --nostream 2>&1");

  // 5. Verify
  console.log("\n=== Step 5: Health check ===");
  await exec(c, "curl -sI http://localhost:3001 | head -5");

  // 6. Save PM2
  await exec(c, "pm2 save 2>&1");

  // 7. Re-run certbot
  console.log("\n=== Step 6: SSL ===");
  await exec(c, "certbot --nginx -d caryakrama.com -d www.caryakrama.com --non-interactive --agree-tos -m admin@caryakrama.com --redirect 2>&1");

  console.log("\n\n🎉 DONE! Site should be live at https://caryakrama.com");
  c.end();
});

c.connect({
  host: "31.97.207.239",
  port: 22,
  username: "root",
  password: "Pentacloud@2026",
});
