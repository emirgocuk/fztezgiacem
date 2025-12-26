# Deploy Script for Fzt. Ezgi Acem Website
$ErrorActionPreference = "Stop"
$ServerIP = "45.155.19.221"

Write-Host "=== Fzt. Ezgi Acem - Yukleme Scripti ===" -ForegroundColor Green
Write-Host "Build islemi zaten yapildi. Dosyalar yukleniyor..." -ForegroundColor Yellow
Write-Host "Sunucu: $ServerIP" -ForegroundColor Cyan
Write-Host "NOT: Sifre istendiginde lutfen sunucu sifresini girin (yazarken gorunmez)." -ForegroundColor Magenta

# Create directory first to avoid issues
ssh root@$ServerIP "mkdir -p /root/site"

# Upload files
scp -r dist start.sh root@$ServerIP:/root/site

Write-Host "`n===========================================" -ForegroundColor Green
Write-Host "YUKLEME BASARILI!" -ForegroundColor Green
Write-Host "Simdi sunucuya baglanip su komutu calistirin:" -ForegroundColor White
Write-Host "ssh root@$ServerIP" -ForegroundColor Yellow
Write-Host "cd /root/site && ./start.sh prod" -ForegroundColor Cyan
Write-Host "==========================================="
