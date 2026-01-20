#!/bin/bash

# Renkli ciktilar
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Fzt. Ezgi Acem - SSR Mode Kurulum Scripti ===${NC}"

# Trap for cleanup
cleanup() {
    echo -e "\n${YELLOW}Servisler durduruluyor...${NC}"
    kill $PB_PID 2>/dev/null
    kill $ASTRO_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# 1. Node.js Kontrolu
if ! command -v node &> /dev/null; then
    echo -e "${RED}HATA: Node.js bulunamadi!${NC}"
    echo "Lutfen Node.js 18+ yukleyin: curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs"
    exit 1
fi

echo -e "${CYAN}Node.js version: $(node --version)${NC}"

# 2. Dist Kontrolu (SSR Mode)
if [ ! -d "dist/server" ] || [ ! -d "dist/client" ]; then
    echo -e "${RED}HATA: SSR build bulunamadi! (dist/server ve dist/client olmali)${NC}"
    echo "Lutfen 'npm run build' calistirin."
    exit 1
fi

# 3. PocketBase Kontrolu ve Indirme (Otomatik)
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

# 4. Otomatik Admin Olusturma (Eger yoksa)
./pocketbase superuser create superadmin@test.com 1234567890 >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Otomatik Admin Olusturuldu: superadmin@test.com / 1234567890${NC}"
fi

# 5. Servis Kurulumu (Systemd) - SSR Mode
if [ "$1" == "install-service" ]; then
    if [ "$EUID" -ne 0 ]; then 
        echo -e "${RED}HATA: Servis kurulumu icin root yetkisi gerekir.${NC}"
        exit 1
    fi

    SITE_DIR=$(pwd)
    
    # PocketBase Service
    PB_SERVICE="/etc/systemd/system/fztezgiacem-pocketbase.service"
    echo -e "${YELLOW}PocketBase servis dosyasi olusturuluyor: $PB_SERVICE${NC}"
    
    cat > "$PB_SERVICE" <<EOF
[Unit]
Description=Fzt. Ezgi Acem - PocketBase API
After=network.target

[Service]
Type=simple
User=root
Group=root
LimitNOFILE=4096
Restart=always
RestartSec=5s
WorkingDirectory=${SITE_DIR}
ExecStart=${SITE_DIR}/pocketbase serve --hooksDir=${SITE_DIR}/pb_hooks --http="127.0.0.1:8090"

[Install]
WantedBy=multi-user.target
EOF

    # Astro SSR Service
    ASTRO_SERVICE="/etc/systemd/system/fztezgiacem-astro.service"
    echo -e "${YELLOW}Astro SSR servis dosyasi olusturuluyor: $ASTRO_SERVICE${NC}"
    
    cat > "$ASTRO_SERVICE" <<EOF
[Unit]
Description=Fzt. Ezgi Acem - Astro SSR Server
After=network.target fztezgiacem-pocketbase.service

[Service]
Type=simple
User=root
Group=root
Restart=always
RestartSec=5s
WorkingDirectory=${SITE_DIR}
Environment="HOST=127.0.0.1"
Environment="PORT=4321"
ExecStart=/usr/bin/node ${SITE_DIR}/dist/server/entry.mjs

[Install]
WantedBy=multi-user.target
EOF

    echo -e "${GREEN}Servisler kuruldu.${NC}"
    echo "Reloading daemon..."
    systemctl daemon-reload
    
    # Remove old service if exists
    systemctl disable fztezgiacem.service 2>/dev/null
    systemctl stop fztezgiacem.service 2>/dev/null
    
    echo "Enabling services to start on boot..."
    systemctl enable fztezgiacem-pocketbase.service
    systemctl enable fztezgiacem-astro.service
    
    echo "Starting services now..."
    systemctl restart fztezgiacem-pocketbase.service
    systemctl restart fztezgiacem-astro.service
    
    echo -e "${GREEN}===============================================${NC}"
    echo -e "${GREEN}Tebrikler! SSR sitesi artik arka planda calisiyor.${NC}"
    echo -e "${GREEN}Sunucuyu kapatsaniz bile site acik kalacak.${NC}"
    echo -e "Durumu kontrol etmek icin:"
    echo -e "  ${YELLOW}systemctl status fztezgiacem-pocketbase${NC}"
    echo -e "  ${YELLOW}systemctl status fztezgiacem-astro${NC}"
    echo -e "${GREEN}===============================================${NC}"
    exit 0
fi

# 6. Normal Baslatma (SSR Mode)
echo -e "${GREEN}-------------------------------------${NC}"
if [ "$1" == "prod" ]; then
    echo -e "${GREEN}MOD: PRODUCTION SSR (Canli Sunucu)${NC}"
    echo -e "${CYAN}PocketBase API: http://127.0.0.1:8090${NC}"
    echo -e "${CYAN}Astro SSR:      http://127.0.0.1:4321${NC}"
    echo -e "${YELLOW}Durdurmak icin CTRL + C basin.${NC}"
    echo -e "${GREEN}-------------------------------------${NC}"
    
    # Start PocketBase in background
    ./pocketbase serve --hooksDir=./pb_hooks --http="127.0.0.1:8090" &
    PB_PID=$!
    echo -e "${GREEN}PocketBase baslatildi (PID: $PB_PID)${NC}"
    
    # Wait a bit for PocketBase to start
    sleep 2
    
    # Start Astro SSR Server
    HOST=127.0.0.1 PORT=4321 node ./dist/server/entry.mjs &
    ASTRO_PID=$!
    echo -e "${GREEN}Astro SSR baslatildi (PID: $ASTRO_PID)${NC}"
    
    # Wait for both processes
    wait
else
    echo -e "${GREEN}MOD: DEVELOPMENT SSR (Test)${NC}"
    echo -e "${CYAN}PocketBase API: http://0.0.0.0:8090${NC}"
    echo -e "${CYAN}Astro SSR:      http://0.0.0.0:4321${NC}"
    echo "Admin Paneli: http://0.0.0.0:8090/_/"
    echo -e "${YELLOW}Durdurmak icin CTRL + C basin.${NC}"
    echo -e "${GREEN}-------------------------------------${NC}"

    # Start PocketBase in background
    ./pocketbase serve --hooksDir=./pb_hooks --http="0.0.0.0:8090" &
    PB_PID=$!
    echo -e "${GREEN}PocketBase baslatildi (PID: $PB_PID)${NC}"
    
    # Wait a bit for PocketBase to start
    sleep 2
    
    # Start Astro SSR Server
    HOST=0.0.0.0 PORT=4321 node ./dist/server/entry.mjs &
    ASTRO_PID=$!
    echo -e "${GREEN}Astro SSR baslatildi (PID: $ASTRO_PID)${NC}"
    
    # Wait for both processes
    wait
fi
