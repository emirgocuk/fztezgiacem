#!/bin/bash
echo "Searching for lost database..."
# Find the first data.db in docker volumes (most likely candidate)
DB_FILE=$(find /var/lib/docker/volumes -name data.db 2>/dev/null | grep "_data/data.db" | head -n 1)

if [ -z "$DB_FILE" ]; then
    # Helper for another common path info
    DB_FILE=$(find / -name data.db 2>/dev/null | grep "coolify" | head -n 1)
fi

if [ -n "$DB_FILE" ]; then
  echo "✅ Found backup at: $DB_FILE"
  
  echo "Stopping PocketBase..."
  pm2 stop pocketbase
  
  echo "Restoring data..."
  # Backup current empty db just in case
  mv ~/pocketbase/pb_data/data.db ~/pocketbase/pb_data/data.db.empty_$(date +%s)
  
  cp "$DB_FILE" ~/pocketbase/pb_data/data.db
  
  # Try to find migrations too
  MIGRATIONS_DIR=$(dirname "$DB_FILE")/pb_migrations
  if [ -d "$MIGRATIONS_DIR" ]; then
      echo "Restoring migrations..."
      cp -r "$MIGRATIONS_DIR" ~/pocketbase/pb_data/
  fi
  
  echo "Restarting PocketBase..."
  pm2 restart pocketbase
  echo "🎉 RESTORE_SUCCESS: Database should be back!"
else
  echo "❌ FILE_NOT_FOUND: Could not find any data.db in Docker volumes."
fi
