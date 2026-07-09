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
        print(out)
    if err and "warning" not in err.lower() and "deprecated" not in err.lower():
        print("[err] " + err[:500])
    return out, err

print("Connecting to " + HOST + "...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=30)
    print("Connected OK!\n")

    # --- Step 1: Find project ---
    print("--- Finding project location ---")
    out1, _ = ssh_exec(client, "find / -maxdepth 7 -name 'next.config.*' 2>/dev/null | grep -v node_modules | head -10")
    out2, _ = ssh_exec(client, "pm2 jlist 2>/dev/null | python3 -c \"import json,sys; apps=json.load(sys.stdin); [print(a.get('name','?')+'  =>  '+a.get('pm2_env',{}).get('pm_cwd','?')) for a in apps]\" 2>/dev/null || echo 'pm2 parse failed'")
    out3, _ = ssh_exec(client, "ls /root/ 2>/dev/null")
    out4, _ = ssh_exec(client, "ls /var/www/ 2>/dev/null || echo 'no /var/www'")

    # Determine project path from findings
    project_path = None
    for line in (out1 + "\n" + out2).splitlines():
        line = line.strip()
        if "next.config" in line:
            import os
            project_path = os.path.dirname(line)
            break
        if "=>" in line:
            project_path = line.split("=>")[-1].strip()
            break

    if not project_path:
        # Try common paths
        for path in ["/root/caRya.krama_V3", "/root/app", "/root/caryakrama", "/var/www/caryakrama", "/root/pentacloud"]:
            out, _ = ssh_exec(client, "test -f " + path + "/package.json && echo EXISTS || echo NOTFOUND")
            if "EXISTS" in out:
                project_path = path
                break

    if not project_path:
        print("\nCould not auto-detect project. Listing /root to find it manually:")
        ssh_exec(client, "ls -la /root/")
        ssh_exec(client, "ls -la /var/www/ 2>/dev/null || true")
        sys.exit(1)

    print("\n>>> Project found at: " + project_path)

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
    import traceback
    traceback.print_exc()
    sys.exit(1)
finally:
    client.close()
