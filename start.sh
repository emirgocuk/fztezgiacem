#!/bin/bash

# Renkli ciktilar
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Fzt. Ezgi Acem - Kurulum ve Baslatma Scripti ===${NC}"

# 1. Dist Kontrolu
if [ ! -d "dist" ]; then
    echo -e "${RED}HATA: 'dist' klasoru bulunamadi!${NC}"
    echo "Lutfen projeyi 'git pull' ile tam cektiginizden emin olun."
    echo "Eger gelistiriciyseniz 'npm run build' calistirin."
    exit 1
fi

# 2. PocketBase Kontrolu ve Indirme (Otomatik)
if [ ! -f "pocketbase" ]; then
    echo -e "${YELLOW}PocketBase bulunamadi. Sistem icin uygun surum indiriliyor...${NC}"

    # Mimari Tespiti (Architecture Detection)
    ARCH=$(uname -m)
    VERSION="0.34.2"
    
    if [[ "$ARCH" == "aarch64" || "$ARCH" == "arm64" ]]; then
        PB_URL="https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/pocketbase_${VERSION}_linux_arm64.zip"
        echo "Tespit edilen sistem: ARM64 (Telefon/Raspberry Pi)"
    else
        PB_URL="https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/pocketbase_${VERSION}_linux_amd64.zip"
        echo "Tespit edilen sistem: AMD64 (Standart VPS/PC)"
    fi

    # Indir ve Cikar
    echo "Indiriliyor: $PB_URL"
    if command -v curl >/dev/null 2>&1; then
        curl -L -o pb.zip "$PB_URL"
    elif command -v wget >/dev/null 2>&1; then
        wget -O pb.zip "$PB_URL"
    else
        echo -e "${RED}HATA: curl veya wget bulunamadi. Lutfen yukleyin.${NC}"
        exit 1
    fi

    echo "Arsiv aciliyor..."
    unzip -o pb.zip
    rm pb.zip
    
    # Izin ver
    chmod +x pocketbase
    echo -e "${GREEN}PocketBase basariyla kuruldu!${NC}"
fi

# 3. Otomatik Admin Olusturma (Eger yoksa)
# Hata verirse (zaten varsa) gormezden gel
./pocketbase superuser create superadmin@test.com 1234567890 >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Otomatik Admin Olusturuldu: superadmin@test.com / 1234567890${NC}"
else
    # Zaten varsa sessizce devam et
    :
fi

# 4. Servis Kurulumu (Systemd)
if [ "$1" == "install-service" ]; then
    if [ "$EUID" -ne 0 ]; then 
        echo -e "${RED}HATA: Servis kurulumu icin root yetkisi gerekir.${NC}"
        exit 1
    fi

    SERVICE_FILE="/etc/systemd/system/fztezgiacem.service"

    echo -e "${YELLOW}Servis dosyasi olusturuluyor: $SERVICE_FILE${NC}"
    
    cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Fzt. Ezgi Acem Website (PocketBase)
After=network.target

[Service]
Type=simple
User=root
Group=root
LimitNOFILE=4096
Restart=always
RestartSec=5s
WorkingDirectory=/root/site
ExecStart=/root/site/pocketbase serve --publicDir=/root/site/dist --hooksDir=/root/site/pb_hooks --http="127.0.0.1:8090"

[Install]
WantedBy=multi-user.target
EOF

    echo -e "${GREEN}Servis kuruldu.${NC}"
    echo "Reloading daemon..."
    systemctl daemon-reload
    
    echo "Enabling service to start on boot..."
    systemctl enable fztezgiacem.service
    
    echo "Starting service now..."
    systemctl restart fztezgiacem.service
    
    echo -e "${GREEN}===============================================${NC}"
    echo -e "${GREEN}Tebrikler! Site artik arka planda calisiyor.${NC}"
    echo -e "${GREEN}Sunucuyu kapatsaniz bile site acik kalacak.${NC}"
    echo -e "Durumu kontrol etmek icin: ${YELLOW}systemctl status fztezgiacem${NC}"
    echo -e "${GREEN}===============================================${NC}"
    exit 0
fi

# 5. Normal Baslatma (Eger install-service degilse)
echo -e "${GREEN}-------------------------------------${NC}"
if [ "$1" == "prod" ]; then
    # Production Modu (80/443 Portlari)
    if [ "$EUID" -ne 0 ]; then 
        echo -e "${RED}HATA: Production modu icin root yetkisi gerekir (port 80/443).${NC}"
        exit 1
    fi
    echo -e "${GREEN}MOD: PRODUCTION (Canli Sunucu)${NC}"
    echo -e "${GREEN}Domain uzerinden SSL (HTTPS) otomatik aktiflesecek.${NC}"
    echo "Web Sitesi:   https://fztezgiacem.com (veya http://IP)"
    echo -e "${YELLOW}Durdurmak icin CTRL + C basin.${NC}"
    echo -e "${GREEN}-------------------------------------${NC}"
    
    # Port 8090 uzerinden baslat (Nginx Reverse Proxy onunde olacak)
    ./pocketbase serve --publicDir=./dist --http="127.0.0.1:8090"
else
    # Gelistirme Modu (8090 Portu)
    echo -e "${GREEN}MOD: DEVELOPMENT (Test)${NC}"
    echo "Web Sitesi:   http://0.0.0.0:8090"
    echo "Admin Paneli: http://0.0.0.0:8090/_/"
    echo -e "${YELLOW}Durdurmak icin CTRL + C basin.${NC}"
    echo -e "${GREEN}-------------------------------------${NC}"

    ./pocketbase serve --publicDir=./dist --http="0.0.0.0:8090"
fi
