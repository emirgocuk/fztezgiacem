#!/bin/bash

# Renkli ciktilar icin
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Fzt. Ezgi Acem - Baslatma Scripti ===${NC}"

# 1. PocketBase'e calistirma izni ver
if [ -f "pocketbase" ]; then
    echo "PocketBase izni veriliyor..."
    chmod +x pocketbase
else
    echo "HATA: PocketBase dosyasi bulunamadi!"
    exit 1
fi

# 2. Sunucuyu Baslat
echo -e "${GREEN}Sunucu baslatiliyor...${NC}"
echo "Erisim Adresi: http://<IP-ADRESI>:8090"
echo "Admin Paneli: http://<IP-ADRESI>:8090/_/"

./pocketbase serve --publicDir=./dist --http=0.0.0.0:8090
