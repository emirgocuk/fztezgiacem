#!/bin/bash

echo "=== SERVER DIAGNOSTIC REPORT ==="
echo ""

echo "1. PM2 Process Status:"
pm2 list
echo ""

echo "2. PocketBase Status:"
pm2 info pocketbase 2>/dev/null || echo "PocketBase not running in PM2"
echo ""

echo "3. Nginx Status:"
systemctl status nginx --no-pager | head -20
echo ""

echo "4. PocketBase Data Directory:"
ls -lah ~/pocketbase/pb_data/ 2>/dev/null || echo "Directory not found"
echo ""

echo "5. PocketBase Database File:"
if [ -f ~/pocketbase/pb_data/data.db ]; then
    ls -lh ~/pocketbase/pb_data/data.db
    echo "Database file exists"
else
    echo "❌ Database file NOT FOUND!"
fi
echo ""

echo "6. Docker Containers:"
docker ps -a
echo ""

echo "7. Port Listening:"
netstat -tlnp | grep -E ':(80|443|8090|4321)'
echo ""

echo "8. Recent Nginx Errors:"
tail -20 /var/log/nginx/error.log 2>/dev/null || echo "No nginx error log"
echo ""

echo "9. Disk Usage:"
df -h | grep -E '(Filesystem|/$|/var)'
echo ""

echo "=== END OF DIAGNOSTIC REPORT ==="
