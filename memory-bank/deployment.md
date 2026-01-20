# Deployment Procedures

## Quick Reference

### Deploy from Windows
```powershell
# 1. Build locally
npm run build

# 2. Deploy to server
.\deploy.ps1

# Enter password when prompted (multiple times for SSH/SCP)
```

### Server Access
```bash
ssh root@45.155.19.221
# Password: [stored securely]
cd /root/site
```

## Full Deployment Workflow

### Prerequisites
- Node.js 18+ on local machine
- SSH access to server
- PocketBase server running

### Step 1: Local Build
```bash
npm run build
# Creates:
#   dist/client/  → Static assets (CSS, JS, images)
#   dist/server/  → SSR Node.js server (entry.mjs)
```

### Step 2: Upload Files
The `deploy.ps1` script handles:
1. Stops existing services
2. Uploads `dist/`, `pb_migrations/`, `pb_hooks/`, `start.sh`, `nginx_site.conf`
3. Restructures files on server
4. Updates Nginx config
5. Runs `./start.sh install-service`

### Step 3: Verify Deployment
```bash
# On server:
systemctl status fztezgiacem-pocketbase
systemctl status fztezgiacem-astro

# Test locally on server:
curl -I http://127.0.0.1:4321/
curl -I http://127.0.0.1:8090/api/health
```

### Step 4: Browser Verification
1. Visit https://fztezgiacem.com
2. Check homepage loads with images
3. Visit https://fztezgiacem.com/blog
4. Verify post count is correct

## Server Commands Reference

### Service Management
```bash
# Status
systemctl status fztezgiacem-pocketbase
systemctl status fztezgiacem-astro

# Restart
systemctl restart fztezgiacem-pocketbase
systemctl restart fztezgiacem-astro

# Logs
journalctl -u fztezgiacem-astro -f
journalctl -u fztezgiacem-pocketbase -f
```

### Nginx
```bash
# Test config
nginx -t

# Reload
systemctl reload nginx

# View config
cat /etc/nginx/sites-available/fztezgiacem
```

### Manual Server Start (for testing)
```bash
cd /root/site
./start.sh        # Development mode (0.0.0.0)
./start.sh prod   # Production mode (127.0.0.1)
```

## Troubleshooting

### Images Not Loading (500 Error)
```bash
# Install sharp on server
cd /root/site
npm install sharp
systemctl restart fztezgiacem-astro
```

### Line Ending Issues
```bash
# Fix Windows CRLF in bash scripts
sed -i 's/\r$//' start.sh
chmod +x start.sh
```

### Service Won't Start
```bash
# Check logs
journalctl -u fztezgiacem-astro -n 50

# Check if port is in use
lsof -i :4321
lsof -i :8090

# Kill stuck process
kill -9 <PID>
```

### Nginx 502 Bad Gateway
```bash
# Check if services are running
systemctl status fztezgiacem-astro
systemctl status fztezgiacem-pocketbase

# Restart services
systemctl restart fztezgiacem-pocketbase
systemctl restart fztezgiacem-astro
systemctl restart nginx
```

## Backup & Restore

### Manual Backup
```bash
# On server
cd /root/site
tar -czvf backup-$(date +%Y%m%d).tar.gz pb_data/

# Download to local
scp root@45.155.19.221:/root/site/backup-*.tar.gz ./backups/
```

### Restore from Backup
```bash
# Stop services
systemctl stop fztezgiacem-pocketbase

# Restore
cd /root/site
tar -xzvf backup-YYYYMMDD.tar.gz

# Restart
systemctl start fztezgiacem-pocketbase
```

## File Locations on Server

| Path | Description |
|------|-------------|
| `/root/site/` | Main application directory |
| `/root/site/dist/` | Built Astro application |
| `/root/site/pb_data/` | PocketBase database & uploads |
| `/root/site/node_modules/` | NPM dependencies |
| `/etc/nginx/sites-available/fztezgiacem` | Nginx config |
| `/etc/systemd/system/fztezgiacem-*.service` | Systemd services |
