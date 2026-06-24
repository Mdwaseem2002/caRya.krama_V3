const { Client } = require('ssh2');

const VPS_IP = '31.97.207.239';
const VPS_USER = 'root';
const VPS_PASS = 'Pentacloud@2026';
const APP_DIR = '/var/www/caryakrama';
const NEW_PORT = 3002; // AdStudioX is on 3000, whatzupp is on 3001

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

conn.on('ready', async () => {
  console.log(`🔗 Connected to VPS\n`);
  console.log(`🔧 Moving caRya.krama to port ${NEW_PORT} (port 3000 is taken by AdStudioX)\n`);

  try {
    // Stop and delete old crashed caryakrama process
    await runCommand(conn, `
      pm2 stop caryakrama 2>/dev/null || true
      pm2 delete caryakrama 2>/dev/null || true
      echo "Old process cleared"
    `, 'Clearing crashed PM2 process');

    // Kill anything on port 3002 just in case
    await runCommand(conn, `
      fuser -k ${NEW_PORT}/tcp 2>/dev/null || true
      sleep 1
      echo "Port ${NEW_PORT} cleared"
    `, `Clearing port ${NEW_PORT}`);

    // Start caryakrama on port 3002
    await runCommand(conn, `
      cd ${APP_DIR}
      PORT=${NEW_PORT} pm2 start npm --name "caryakrama" -- start -- -p ${NEW_PORT}
      pm2 save
      echo "PM2 started on port ${NEW_PORT}"
    `, `Starting caRya.krama on port ${NEW_PORT}`);

    // Wait for startup
    await runCommand(conn, `sleep 5 && echo "Waited 5s"`, 'Waiting for startup');

    // Check if port is now listening
    await runCommand(conn, `
      if ss -tlnp | grep -q :${NEW_PORT}; then
        echo "✅ Port ${NEW_PORT} is active - app is running!"
      else
        echo "⚠️  Port ${NEW_PORT} not yet active, checking logs..."
        pm2 logs caryakrama --lines 20 --nostream 2>&1
      fi
    `, 'Verifying app is running');

    // Update Nginx to point to port 3002
    await runCommand(conn, `
      cat > /etc/nginx/sites-available/caryakrama << 'NGINXEOF'
server {
    server_name caryakrama.com www.caryakrama.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:${NEW_PORT};
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

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/caryakrama.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/caryakrama.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = www.caryakrama.com) {
        return 301 https://$host$request_uri;
    }
    if ($host = caryakrama.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name caryakrama.com www.caryakrama.com;
    return 404;
}
NGINXEOF

      nginx -t && systemctl reload nginx
      echo "Nginx updated to proxy caryakrama.com → port ${NEW_PORT}"
    `, 'Updating Nginx to port 3002');

    // Final PM2 status
    await runCommand(conn, `
      echo ""
      echo "=== FINAL PM2 STATUS ==="
      pm2 status
      echo ""
      echo "=== PORT CHECK ==="
      ss -tlnp | grep -E ':(3000|3001|3002)'
      echo ""
      echo "✅ Fix complete! caRya.krama should now be live at https://caryakrama.com"
    `, 'Final status');

  } catch(e) {
    console.error('\n❌ Error:', e.message);
  } finally {
    conn.end();
  }
});

conn.connect({ host: VPS_IP, port: 22, username: VPS_USER, password: VPS_PASS, readyTimeout: 30000 });
