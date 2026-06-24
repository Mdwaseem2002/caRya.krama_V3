const { Client } = require('ssh2');

const VPS_IP = '31.97.207.239';
const VPS_USER = 'root';
const VPS_PASS = 'Pentacloud@2026';
const APP_DIR = '/var/www/caryakrama';

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
  console.log('🔗 Connected to VPS\n');

  try {
    // Check what's in the app dir
    await runCommand(conn, `ls -la ${APP_DIR}/`, 'Listing app directory');

    // Check PM2 logs for caryakrama
    await runCommand(conn, `pm2 logs caryakrama --lines 50 --nostream 2>&1 || echo "No logs found"`, 'PM2 logs for caryakrama');

    // Check what port adstudiox is running on
    await runCommand(conn, `pm2 show adstudiox-frontend 2>&1 | grep -E "port|exec path|script"`, 'AdStudioX port info');

    // Check all nginx configs
    await runCommand(conn, `ls /etc/nginx/sites-enabled/`, 'Nginx enabled sites');
    await runCommand(conn, `cat /etc/nginx/sites-enabled/caryakrama`, 'Current caryakrama nginx config');

    // Check what process is on port 3000
    await runCommand(conn, `ss -tlnp | grep :3000 || echo "Nothing on port 3000"`, 'Port 3000 check');
    await runCommand(conn, `ss -tlnp | grep :3001 || echo "Nothing on port 3001"`, 'Port 3001 check');
    await runCommand(conn, `ss -tlnp | grep :3002 || echo "Nothing on port 3002"`, 'Port 3002 check');

    // Check if .next folder is present
    await runCommand(conn, `ls ${APP_DIR}/.next/ 2>&1 | head -20`, 'Checking .next folder');
    
    // Check package.json
    await runCommand(conn, `cat ${APP_DIR}/package.json`, 'package.json on server');

  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    conn.end();
  }
});

conn.connect({ host: VPS_IP, port: 22, username: VPS_USER, password: VPS_PASS, readyTimeout: 30000 });
