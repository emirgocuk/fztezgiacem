#!/bin/bash
set -e

echo "=== COMPLETE POCKETBASE RESTORATION ==="

# Stop PocketBase first
echo "1. Stopping PocketBase..."
pm2 stop pocketbase || true

# Find the Docker volume pb_data
echo "2. Locating Docker volume..."
DOCKER_PBDATA=$(find /var/lib/docker/volumes -type d -name "pb_data" 2>/dev/null | grep "_data" | sed 's|/_data||' | head -n 1)

if [ -z "$DOCKER_PBDATA" ]; then
    echo "❌ Could not find pb_data in Docker volumes"
    exit 1
fi

DOCKER_PBDATA="${DOCKER_PBDATA}/_data"
echo "✅ Found: $DOCKER_PBDATA"

# Backup current (broken) data
echo "3. Backing up broken data..."
mv ~/pocketbase/pb_data ~/pocketbase/pb_data_broken_$(date +%s) || true

# Create fresh directory
mkdir -p ~/pocketbase/pb_data

# Copy EVERYTHING from Docker volume
echo "4. Copying complete Docker data..."
cp -rp "$DOCKER_PBDATA"/* ~/pocketbase/pb_data/ 2>/dev/null || {
    # If glob copy fails, try explicit copy
    cd "$DOCKER_PBDATA"
    cp -rp . ~/pocketbase/pb_data/
}

echo "5. Verifying copied files..."
ls -lah ~/pocketbase/pb_data/

# Restart PocketBase
echo "6. Restarting PocketBase..."
cd ~/pocketbase
pm2 restart pocketbase || pm2 start ./pocketbase --name "pocketbase" -- serve --http="0.0.0.0:8090"

echo "7. Checking status..."
sleep 2
pm2 status pocketbase

echo "✅ RESTORATION COMPLETE!"
echo "Check: https://pb.fztezgiacem.com/_/"
