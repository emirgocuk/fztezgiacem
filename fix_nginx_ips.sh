#!/bin/bash

# Configuration
NGINX_CONF="/etc/nginx/sites-available/fztezgiacem"

# 1. Find Astro Container IP
# Helper function to get IP from container name fragment
get_ip() {
    local keyword=$1
    local container_id=$(docker ps --format "{{.ID}} {{.Names}}" | grep -i "$keyword" | awk '{print $1}' | head -n 1)
    
    if [ -z "$container_id" ]; then
        echo "Error: No container found matching '$keyword'"
        return 1
    fi
    
    local ip=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $container_id)
    echo "$ip"
}

echo "Detecting container IPs..."

ASTRO_IP=$(get_ip "astro")
if [ -z "$ASTRO_IP" ]; then
    # Fallback: maybe the image name contains fztezgiacem?
    ASTRO_IP=$(get_ip "fztezgiacem")
fi

POCKETBASE_IP=$(get_ip "pocketbase")

if [ -z "$ASTRO_IP" ] || [ -z "$POCKETBASE_IP" ]; then
    echo "Could not find one or both addresses. Astro: $ASTRO_IP, PocketBase: $POCKETBASE_IP"
    echo "Aborting config update."
    exit 1
fi

echo "Found IPs -> Astro: $ASTRO_IP | PocketBase: $POCKETBASE_IP"

# 2. Backup Config
echo "Backing up Nginx config..."
cp "$NGINX_CONF" "$NGINX_CONF.bak_$(date +%s)"

# 3. Update Nginx Config
# Replaces addresses matching the specific ports used in our config
echo "Updating configuration..."
sed -i "s|proxy_pass http://[0-9.]*:4321;|proxy_pass http://$ASTRO_IP:4321;|" "$NGINX_CONF"
sed -i "s|proxy_pass http://[0-9.]*:8090;|proxy_pass http://$POCKETBASE_IP:8090;|" "$NGINX_CONF"

# 4. Verify and Reload
echo "Verifying Nginx config..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Reloading Nginx..."
    systemctl reload nginx
    echo "Done! Site should be accessible."
else
    echo "Nginx config test failed! Reverting..."
    cp "$NGINX_CONF.bak_$(date +%s)" "$NGINX_CONF"
    systemctl reload nginx
    exit 1
fi
