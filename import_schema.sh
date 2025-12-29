#!/bin/bash

# PocketBase Autosync Script
# Uses curl to authenticate and create collections.

echo "Autosyncing PocketBase Schema..."

EMAIL="tempadmin@test.com"
PASS="1234567890"
API_URL="http://127.0.0.1:8090/api"

# 1. Authenticate & Get Token
echo "Authenticating..."
# PocketBase v0.23+ uses _superusers collection for admins
AUTH_RESPONSE=$(curl -s -X POST "$API_URL/collections/_superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$EMAIL\",\"password\":\"$PASS\"}")

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Authentication failed!"
  echo "Response: $AUTH_RESPONSE"
  exit 1
fi

echo "Auth Token Acquired."

# 2. Define JSON Bodies (Single-line to be safe for Shell injection)

POSTS_JSON='{
    "name": "posts",
    "type": "base",
    "schema": [
      {"name": "title", "type": "text", "required": true},
      {"name": "slug", "type": "text", "required": true, "unique": true},
      {"name": "content", "type": "editor", "required": true},
      {"name": "excerpt", "type": "text"},
      {"name": "image", "type": "file", "options": { "mimeTypes": ["image/jpeg","image/png","image/webp"], "maxSize": 5242880 }},
      {"name": "published", "type": "bool"}
    ],
    "listRule": "", "viewRule": "", "createRule": "@request.auth.id != \"\"", "updateRule": "@request.auth.id != \"\"", "deleteRule": "@request.auth.id != \"\""
}'

SPECS_JSON='{
    "name": "specializations",
    "type": "base",
    "schema": [
      {"name": "title", "type": "text", "required": true},
      {"name": "content", "type": "editor", "required": true},
      {"name": "icon", "type": "text"}
    ],
     "listRule": "", "viewRule": "", "createRule": "@request.auth.id != \"\"", "updateRule": "@request.auth.id != \"\"", "deleteRule": "@request.auth.id != \"\""
}'

MESSAGES_JSON='{
    "name": "messages",
    "type": "base",
    "schema": [
      {"name": "name", "type": "text", "required": true},
      {"name": "email", "type": "email", "required": true},
      {"name": "message", "type": "text", "required": true}
    ],
     "listRule": "@request.auth.id != \"\"", "viewRule": "@request.auth.id != \"\"", "createRule": "", "updateRule": "@request.auth.id != \"\"", "deleteRule": "@request.auth.id != \"\""
}'

SETTINGS_JSON='{
    "name": "site_settings",
    "type": "base",
    "schema": [
        {"name": "key", "type": "text", "required": true, "unique": true},
        {"name": "value", "type": "json"}
    ],
    "listRule": "", "viewRule": ""
    
}'

# 3. Create Collections
echo "Creating Collections..."

curl -s -X POST "$API_URL/collections" -H "Authorization: Admin $TOKEN" -H "Content-Type: application/json" -d "$POSTS_JSON" > /dev/null
echo " - Posts collection synced."

curl -s -X POST "$API_URL/collections" -H "Authorization: Admin $TOKEN" -H "Content-Type: application/json" -d "$SPECS_JSON" > /dev/null
echo " - Specializations collection synced."

curl -s -X POST "$API_URL/collections" -H "Authorization: Admin $TOKEN" -H "Content-Type: application/json" -d "$MESSAGES_JSON" > /dev/null
echo " - Messages collection synced."

curl -s -X POST "$API_URL/collections" -H "Authorization: Admin $TOKEN" -H "Content-Type: application/json" -d "$SETTINGS_JSON" > /dev/null
echo " - Site Settings collection synced."

echo "DONE! Access the admin panel now."
