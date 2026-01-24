#!/bin/bash

# Configuration
BACKUP_DIR="$HOME/backup_fztezgiacem_$(date +%s)"
PROJECT_DIR="/var/www/fztezgiacem"
PB_DIR="$HOME/pocketbase"
REPO_URL="https://github.com/emirgocuk/fztezgiacem.git" # Update if private or different

echo "⚠️  STARTING LEGACY MIGRATION PROTOCOL ⚠️"
echo "This will STOP Docker services and switch to PM2."
echo "Backup Directory: $BACKUP_DIR"
sleep 3

# 1. PREPARATION & BACKUP
mkdir -p "$BACKUP_DIR"

echo ">> Step 1: Backing up PocketBase Data..."
PB_CONTAINER=$(docker ps | grep -i pocketbase | awk '{print $1}' | head -n 1)
if [ -z "$PB_CONTAINER" ]; then
    echo "❌ PocketBase container not found running! Trying to find stopped containers..."
    PB_CONTAINER=$(docker ps -a | grep -i pocketbase | awk '{print $1}' | head -n 1)
fi

if [ -n "$PB_CONTAINER" ]; then
    echo "Found container: $PB_CONTAINER. Copying data..."
    docker cp "$PB_CONTAINER":/pb/pb_data "$BACKUP_DIR/pb_data" || echo "Failed to copy via docker cp, trying volume inspection..."
    echo "✅ Backup complete -> $BACKUP_DIR/pb_data"
else
    echo "⚠️  WARNING: Could not find PocketBase container. Please verify data backup manually if needed."
    read -p "Press ENTER to continue anyway or Ctrl+C to abort..."
fi

# 2. CLEANUP
echo ">> Step 2: Stopping and Correcting Environment..."
docker stop $(docker ps -aq) 2>/dev/null
# Optional: Remove containers to free ports definitely
# docker rm $(docker ps -aq) 2>/dev/null

systemctl stop coolify 2>/dev/null
systemctl disable coolify 2>/dev/null

# 3. INSTALLATION
echo ">> Step 3: Verifying Prerequisites..."
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

if ! command -v unzip &> /dev/null; then
    apt-get install -y unzip
fi

# 4. POCKETBASE SETUP
echo ">> Step 4: Setting up PocketBase..."
mkdir -p "$PB_DIR"
cd "$PB_DIR"

# Download PB (Linux/AMD64)
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_linux_amd64.zip -O pb.zip
unzip -o pb.zip
rm pb.zip

# Restore Data
if [ -d "$BACKUP_DIR/pb_data" ]; then
    echo "Restoring data..."
    rm -rf pb_data
    cp -r "$BACKUP_DIR/pb_data" .
fi

# Start PB
pm2 stop pocketbase 2>/dev/null
pm2 delete pocketbase 2>/dev/null
pm2 start ./pocketbase --name "pocketbase" -- serve --http="0.0.0.0:8090"

# 5. ASTRO SETUP
echo ">> Step 5: Setting up Astro..."
mkdir -p "$PROJECT_DIR"
# Clone or Pull
if [ -d "$PROJECT_DIR/.git" ]; then
    cd "$PROJECT_DIR"
    git reset --hard
    git pull
else
    git clone "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

echo "Installing dependencies..."
npm install

echo "Building Astro..."
# Ensure internal IP URL is set to localhost for build/runtime in this legacy mode
export INTERNAL_POCKETBASE_URL="http://127.0.0.1:8090"
npm run build

echo "Starting Astro with PM2..."
pm2 stop fztezgiacem 2>/dev/null
pm2 delete fztezgiacem 2>/dev/null
pm2 start dist/server/entry.mjs --name "fztezgiacem"

# Save PM2 list
pm2 save
pm2 startup | tail -n 1 > /tmp/pm2_startup_cmd
bash /tmp/pm2_startup_cmd

# 6. NGINX SETUP
echo ">> Step 6: configuring Nginx..."
cp nginx_legacy.conf /etc/nginx/sites-available/fztezgiacem
ln -sf /etc/nginx/sites-available/fztezgiacem /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

echo "✅ MIGRATION COMPLETE!"
echo "Verify functionality at https://fztezgiacem.com"
