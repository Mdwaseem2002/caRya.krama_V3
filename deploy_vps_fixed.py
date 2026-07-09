import paramiko
import sys
import time

HOST = "31.97.207.239"
PORT = 22
USER = "root"
PASS = "Pentacloud@2026"

def ssh_exec(client, cmd, timeout=180):
    print("\n$ " + cmd)
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        # Prevent charmap errors by replacing problematic characters for print
        print(out.encode('ascii', 'replace').decode('ascii'))
    if err and "warning" not in err.lower() and "deprecated" not in err.lower():
        print("[err] " + err[:500].encode('ascii', 'replace').decode('ascii'))
    return out, err

print("Connecting to " + HOST + "...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=30)
    print("Connected OK!\n")

    project_path = "/var/www/caryakrama"
    print("\n>>> Project path: " + project_path)

    # --- Step 2: Git pull ---
    print("\n--- Pulling latest code from GitHub ---")
    ssh_exec(client, "cd " + project_path + " && git fetch origin && git reset --hard origin/main && git log --oneline -3", timeout=120)

    # --- Step 3: Install deps ---
    print("\n--- Installing dependencies ---")
    ssh_exec(client, "cd " + project_path + " && npm install --legacy-peer-deps 2>&1 | tail -20", timeout=300)

    # --- Step 4: Build ---
    print("\n--- Building Next.js app ---")
    ssh_exec(client, "cd " + project_path + " && npm run build 2>&1 | tail -40", timeout=600)

    # --- Step 5: Restart with pm2 ---
    print("\n--- Restarting app with pm2 ---")
    ssh_exec(client, "pm2 restart all 2>&1 || pm2 start " + project_path + "/node_modules/.bin/next --name caryakrama -- start -p 3000 2>&1", timeout=60)
    time.sleep(3)
    ssh_exec(client, "pm2 list --no-color")

    print("\n=== DEPLOYMENT COMPLETE ===")
    print("Site should be live at https://caryakrama.com/")

except Exception as e:
    print("\nError: " + str(e))
    sys.exit(1)
finally:
    client.close()
