# Deploy Script for Fzt. Ezgi Acem Website
$ErrorActionPreference = "Stop"
$ServerIP = "45.155.19.221"

Write-Host "=== Fzt. Ezgi Acem - Yukleme Scripti ===" -ForegroundColor Green
Write-Host "Build islemi zaten yapildi. Dosyalar yukleniyor..." -ForegroundColor Yellow
Write-Host "Sunucu: $ServerIP" -ForegroundColor Cyan
Write-Host "NOT: Sifre istendiginde lutfen sunucu sifresini girin (yazarken gorunmez)." -ForegroundColor Magenta

# Create directory first to avoid issues
ssh root@$ServerIP "rm -rf /root/site/pb_migrations && mkdir -p /root/site/pb_migrations"
scp -r dist pb_migrations pb_hooks start.sh deploy_package/nginx_site.conf "root@$($ServerIP):/root/site"

# Fix: Rename dist to pb_public so PocketBase serves the new files
ssh root@$ServerIP "rm -rf /root/site/pb_public && mv /root/site/dist /root/site/pb_public"

# Nginx Setup Remote Command
ssh root@$ServerIP "mv /root/site/nginx_site.conf /etc/nginx/sites-available/fztezgiacem && ln -sf /etc/nginx/sites-available/fztezgiacem /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && systemctl enable nginx && systemctl restart nginx && systemctl restart fztezgiacem"

Write-Host "`n===========================================" -ForegroundColor Green
Write-Host "YUKLEME BASARILI!" -ForegroundColor Green
Write-Host "Simdi sunucuya baglanip su komutu calistirin:" -ForegroundColor White
Write-Host "ssh root@$ServerIP" -ForegroundColor Yellow
Write-Host "cd /root/site && ./start.sh prod" -ForegroundColor Cyan
Write-Host "==========================================="
