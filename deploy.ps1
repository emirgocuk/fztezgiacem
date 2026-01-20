# Deploy Script for Fzt. Ezgi Acem Website (SSR Mode)
$ErrorActionPreference = "Stop"
$ServerIP = "45.155.19.221"

Write-Host "=== Fzt. Ezgi Acem - SSR Mode Yukleme Scripti ===" -ForegroundColor Green
Write-Host "Build islemi zaten yapildi. Dosyalar yukleniyor..." -ForegroundColor Yellow
Write-Host "Sunucu: $ServerIP" -ForegroundColor Cyan
Write-Host "NOT: Sifre istendiginde lutfen sunucu sifresini girin (yazarken gorunmez)." -ForegroundColor Magenta

# Stop services before updating
Write-Host "`nServisleri durduruluyor..." -ForegroundColor Yellow
ssh root@$ServerIP "systemctl stop fztezgiacem-astro 2>/dev/null; systemctl stop fztezgiacem-pocketbase 2>/dev/null; systemctl stop fztezgiacem 2>/dev/null; true"

# Create directory first to avoid issues
Write-Host "Uzak dizin hazirlaniyor..." -ForegroundColor Yellow
ssh root@$ServerIP "rm -rf /root/site/pb_migrations && mkdir -p /root/site/pb_migrations && mkdir -p /root/site/dist"

# Upload files (SSR build has dist/client and dist/server)
Write-Host "Dosyalar yukleniyor (SSR build)..." -ForegroundColor Yellow
scp -r dist/client dist/server pb_migrations pb_hooks start.sh deploy_package/nginx_site.conf "root@$($ServerIP):/root/site"

# Fix: Move client and server to correct location
Write-Host "Dosya yapisi duzenleniyor..." -ForegroundColor Yellow
ssh root@$ServerIP "rm -rf /root/site/dist/client /root/site/dist/server 2>/dev/null; mv /root/site/client /root/site/dist/client; mv /root/site/server /root/site/dist/server"

# Nginx Setup Remote Command
Write-Host "Nginx konfigurasyonu yukleniyor..." -ForegroundColor Yellow
ssh root@$ServerIP "mv /root/site/nginx_site.conf /etc/nginx/sites-available/fztezgiacem && ln -sf /etc/nginx/sites-available/fztezgiacem /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl restart nginx"

# Install services and start
Write-Host "SSR servisleri kuruluyor..." -ForegroundColor Yellow
ssh root@$ServerIP "cd /root/site && chmod +x start.sh && ./start.sh install-service"

Write-Host "`n===========================================" -ForegroundColor Green
Write-Host "SSR MODE YUKLEME BASARILI!" -ForegroundColor Green
Write-Host "Site artik her istekte guncel veri cekmektedir." -ForegroundColor Cyan
Write-Host ""
Write-Host "Durumu kontrol etmek icin:" -ForegroundColor White
Write-Host "  ssh root@$ServerIP" -ForegroundColor Yellow
Write-Host "  systemctl status fztezgiacem-pocketbase" -ForegroundColor Cyan
Write-Host "  systemctl status fztezgiacem-astro" -ForegroundColor Cyan
Write-Host "==========================================="
