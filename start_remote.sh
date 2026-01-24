#!/bin/bash

# Configuration
APP_NAME="fztezgiacem"
PORT=80
PB_PORT=8090 # Internal port, but we might run on 80/443 directly if using PB serve.
# Ideally, we allow PB to bind to 80/443.

echo "=== Server Setup & Start Script ==="

# 1. Check/Install Node.js & PM2
if ! command -v npm >/dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# 2. Check/Download PocketBase
if [ ! -f "pocketbase" ]; then
    echo "PocketBase not found. Installing..."
     # Simple detection avoiding complex logic if possible, or copied from start.sh
     # Assuming AMD64 for VPS usually
     wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_linux_amd64.zip -O pb.zip
     unzip -o pb.zip
     rm pb.zip
     chmod +x pocketbase
fi

# 3. Stop existing processes
echo "Stopping existing processes..."
pm2 delete $APP_NAME 2>/dev/null
# Also kill any manual pocketbase instances
pkill -f pocketbase

# 4. Start PocketBase with PM2
echo "Starting Application with PM2..."
# We run PocketBase to serve both backend and frontend (via --publicDir)
# This binds to port 80 and 443 (autossl)
pm2 start ./pocketbase --name "$APP_NAME" -- serve fztezgiacem.com --publicDir=./dist --http="0.0.0.0:80" --https="0.0.0.0:443"

# 5. Save PM2 list
pm2 save
pm2 startup | tail -n 1 > /tmp/pm2_startup_cmd
bash /tmp/pm2_startup_cmd

echo "=== Deployment Complete ==="
pm2 status
