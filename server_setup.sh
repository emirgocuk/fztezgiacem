#!/bin/bash

# =============================================================================
# IDEMPOTENT SERVER SETUP SCRIPT
# Bu script hem ilk kurulum hem de guncellemeler icin kullanilabilir
# Her bir adim onceden kurulup kurulmadıgını kontrol eder
# =============================================================================

set -e  # Hata durumunda dur

# Renkli Ciktilar
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Domain ve Proje Ayarlari
DOMAIN="fztezgiacem.com"
TARGET_DIR="/root/fztezgiacem_v2"
REPO_URL="https://github.com/emirgocuk/fztezgiacem.git"

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   SUNUCU KURULUM & GUNCELLEME SCRIPTI          ║${NC}"
echo -e "${GREEN}║   Idempotent - Istediginiz Kadar Calistirin   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}\n"

# =============================================================================
# ADIM 1: SISTEM PAKETLERINI GUNCELLE
# =============================================================================
echo -e "${BLUE}[1/10]${NC} ${YELLOW}Sistem paketleri guncelleniyor...${NC}"
apt-get update -y > /dev/null 2>&1
echo -e "${GREEN}✓ Sistem paketleri guncellendi${NC}\n"

# =============================================================================
# ADIM 2: TEMEL ARACLARI KONTROL ET VE KUR
# =============================================================================
echo -e "${BLUE}[2/10]${NC} ${YELLOW}Temel araclar kontrol ediliyor (curl, git, unzip)...${NC}"

if ! command -v curl &> /dev/null; then
    echo "  → curl kuruluyor..."
    apt-get install -y curl > /dev/null 2>&1
else
    echo "  ✓ curl zaten kurulu"
fi

if ! command -v git &> /dev/null; then
    echo "  → git kuruluyor..."
    apt-get install -y git > /dev/null 2>&1
else
    echo "  ✓ git zaten kurulu ($(git --version | cut -d' ' -f3))"
fi

if ! command -v unzip &> /dev/null; then
    echo "  → unzip kuruluyor..."
    apt-get install -y unzip > /dev/null 2>&1
else
    echo "  ✓ unzip zaten kurulu"
fi

echo -e "${GREEN}✓ Temel araclar hazir${NC}\n"

# =============================================================================
# ADIM 3: NODE.JS 20 KONTROL ET VE KUR
# =============================================================================
echo -e "${BLUE}[3/10]${NC} ${YELLOW}Node.js kontrol ediliyor...${NC}"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 20 ]; then
        echo "  ✓ Node.js $(node -v) zaten kurulu"
    else
        echo "  → Node.js $NODE_VERSION eski, v20 kuruluyor..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
        apt-get install -y nodejs > /dev/null 2>&1
        echo "  ✓ Node.js $(node -v) kuruldu"
    fi
else
    echo "  → Node.js 20 kuruluyor..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
    apt-get install -y nodejs > /dev/null 2>&1
    echo "  ✓ Node.js $(node -v) kuruldu"
fi

echo -e "${GREEN}✓ Node.js hazir${NC}\n"

# =============================================================================
# ADIM 4: PM2 KONTROL ET VE KUR
# =============================================================================
echo -e "${BLUE}[4/10]${NC} ${YELLOW}PM2 process manager kontrol ediliyor...${NC}"

if command -v pm2 &> /dev/null; then
    echo "  ✓ PM2 zaten kurulu ($(pm2 -v))"
else
    echo "  → PM2 kuruluyor..."
    npm install -g pm2 > /dev/null 2>&1
    echo "  ✓ PM2 $(pm2 -v) kuruldu"
fi

echo -e "${GREEN}✓ PM2 hazir${NC}\n"

# =============================================================================
# ADIM 5: NGINX KONTROL ET VE KUR
# =============================================================================
echo -e "${BLUE}[5/10]${NC} ${YELLOW}Nginx kontrol ediliyor...${NC}"

if command -v nginx &> /dev/null; then
    echo "  ✓ Nginx zaten kurulu ($(nginx -v 2>&1 | cut -d'/' -f2))"
else
    echo "  → Nginx kuruluyor..."
    apt-get install -y nginx > /dev/null 2>&1
    systemctl enable nginx > /dev/null 2>&1
    echo "  ✓ Nginx kuruldu ve etkinlestirildi"
fi

# Nginx servisini baslat (zaten calisiyorsa skip)
if ! systemctl is-active --quiet nginx; then
    systemctl start nginx
    echo "  ✓ Nginx baslatildi"
else
    echo "  ✓ Nginx zaten calisiyor"
fi

echo -e "${GREEN}✓ Nginx hazir${NC}\n"

# =============================================================================
# ADIM 6: CERTBOT (SSL) KONTROL ET VE KUR
# =============================================================================
echo -e "${BLUE}[6/10]${NC} ${YELLOW}Certbot (SSL) kontrol ediliyor...${NC}"

if command -v certbot &> /dev/null; then
    echo "  ✓ Certbot zaten kurulu ($(certbot --version | cut -d' ' -f2))"
else
    echo "  → Certbot kuruluyor..."
    apt-get install -y certbot python3-certbot-nginx > /dev/null 2>&1
    echo "  ✓ Certbot kuruldu"
fi

echo -e "${GREEN}✓ Certbot hazir${NC}\n"

# =============================================================================
# ADIM 7: PROJEYI CEK VEYA GUNCELLE
# =============================================================================
echo -e "${BLUE}[7/10]${NC} ${YELLOW}Proje dosyalari kontrol ediliyor...${NC}"

if [ -d "$TARGET_DIR" ]; then
    echo "  ✓ Proje klasoru mevcut, guncelleniyor..."
    cd "$TARGET_DIR"
    
    # Eski processleri durdur
    pm2 delete fztezgiacem 2>/dev/null || true
    pkill -f pocketbase 2>/dev/null || true
    
    # Git guncellemesi
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        echo "  ✓ Kod zaten guncel (commit: ${LOCAL:0:7})"
    else
        echo "  → Yeni degisiklikler cekiliyor..."
        git reset --hard origin/main
        git pull
        echo "  ✓ Kod guncellendi (${REMOTE:0:7})"
    fi
else
    echo "  → Proje ilk kez klonlaniyor..."
    git clone "$REPO_URL" "$TARGET_DIR"
    cd "$TARGET_DIR"
    echo "  ✓ Proje klonlandi"
fi

echo -e "${GREEN}✓ Proje dosyalari hazir${NC}\n"

# =============================================================================
# ADIM 8: NPM BAGIMLILIKLARINI KONTROL ET VE YUKLE
# =============================================================================
echo -e "${BLUE}[8/10]${NC} ${YELLOW}NPM bagimliliklari kontrol ediliyor...${NC}"

if [ ! -d "node_modules" ]; then
    echo "  → node_modules bulunamadi, yukleniyor..."
    npm install
    echo "  ✓ Bagimlillar yuklendi"
else
    # package.json degismis mi kontrol et
    if [ "package.json" -nt "node_modules" ]; then
        echo "  → package.json degismis, bagimlillar yeniden yukleniyor..."
        npm install
        echo "  ✓ Bagimlillar guncellendi"
    else
        echo "  ✓ node_modules zaten guncel"
    fi
fi

echo -e "${GREEN}✓ NPM bagimliliklari hazir${NC}\n"

# =============================================================================
# ADIM 9: BUILD AL
# =============================================================================
echo -e "${BLUE}[9/10]${NC} ${YELLOW}Proje build ediliyor...${NC}"

# Build icin gecici PocketBase baslat
chmod +x start.sh
mkdir -p dist

echo "  → Gecici PocketBase baslatiliyor..."
./start.sh > /tmp/pb_temp.log 2>&1 &
PB_PID=$!
sleep 12

# Build al
echo "  → Build aliniyor (bu birkaç dakika surebilir)..."
set +e
npm run build > /tmp/build.log 2>&1
BUILD_STATUS=$?
set -e

# Gecici PocketBase'i durdur
kill $PB_PID 2>/dev/null || true
pkill -f pocketbase 2>/dev/null || true
sleep 2

if [ $BUILD_STATUS -ne 0 ]; then
    echo -e "${RED}✗ Build basarisiz! Log:${NC}"
    tail -n 20 /tmp/build.log
    exit 1
else
    echo -e "${GREEN}  ✓ Build basarili${NC}"
fi

echo -e "${GREEN}✓ Build tamamlandi${NC}\n"

# =============================================================================
# ADIM 10: PRODUCTION MODU (PM2 ILE)
# =============================================================================
echo -e "${BLUE}[10/10]${NC} ${YELLOW}Production modu baslatiliyor...${NC}"

# PM2 ile baslat
pm2 delete fztezgiacem 2>/dev/null || true
pm2 start start.sh --name fztezgiacem --interpreter bash -- prod
pm2 save > /dev/null 2>&1

# Sistem yeniden basladiginda PM2'yi otomatik baslat
pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true

echo -e "${GREEN}✓ Uygulama PM2 ile baslatildi${NC}\n"

# =============================================================================
# OZET VE SONRAKI ADIMLAR
# =============================================================================
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          KURULUM BASARIYLA TAMAMLANDI!         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}\n"

echo -e "${YELLOW}📋 Kurulu Bilesenler:${NC}"
echo "  ✓ Node.js $(node -v)"
echo "  ✓ PM2 $(pm2 -v)"
echo "  ✓ Nginx $(nginx -v 2>&1 | cut -d'/' -f2)"
echo "  ✓ Certbot $(certbot --version | cut -d' ' -f2)"

echo -e "\n${YELLOW}🔧 Sonraki Adimlar (SSL icin):${NC}"
echo "  1. DNS ayarlarinizin yapildigini dogrulayin:"
echo "     ${BLUE}dig $DOMAIN${NC}"
echo ""
echo "  2. SSL sertifikasi almak icin:"
echo "     ${BLUE}certbot --nginx -d $DOMAIN -d www.$DOMAIN${NC}"
echo ""
echo "  3. Durumu kontrol etmek icin:"
echo "     ${BLUE}pm2 status${NC}"
echo "     ${BLUE}pm2 logs fztezgiacem${NC}"

echo -e "\n${GREEN}🌐 Site: http://$DOMAIN${NC}"
echo -e "${GREEN}🎉 Basarili kurulum!${NC}\n"
