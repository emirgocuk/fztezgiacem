# Secure Deployment Script
$ErrorActionPreference = "Stop"
$ServerIP = "45.155.19.221"
$User = "root"
$RemotePath = "/root/site"
$BackupDate = Get-Date -Format "yyyyMMdd_HHmmss"
$LocalBackupPath = "$PWD\backups\$BackupDate"

Write-Host "=== Fzt. Ezgi Acem - Secure Deployment ===" -ForegroundColor Cyan

# 1. Backup Remote Database
Write-Host "1. Backing up remote database..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $LocalBackupPath | Out-Null
try {
    # Check if remote folder exists first (suppress error if not)
    scp -r "$User@${ServerIP}:$RemotePath/pb_data" "$LocalBackupPath"
    Write-Host "   Database backup saved to: $LocalBackupPath" -ForegroundColor Green
} catch {
    Write-Host "   Warning: Could not download pb_data. Maybe it doesn't exist yet?" -ForegroundColor Magenta
}

# 2. Build Project
Write-Host "2. Building project locally..." -ForegroundColor Yellow
cmd /c "set PUBLIC_POCKETBASE_URL=https://fztezgiacem.com && npm install && npm run build"
if ($LASTEXITCODE -ne 0) { throw "Build failed!" }

# 3. Clean Remote Server
Write-Host "3. Cleaning remote server directory..." -ForegroundColor Yellow
# We remove the directory but recreate it immediately
ssh "$User@$ServerIP" "rm -rf $RemotePath && mkdir -p $RemotePath"

# 4. Upload Files
Write-Host "4. Uploading new files..." -ForegroundColor Yellow
# Upload dist, start_remote.sh
scp -r dist start_remote.sh "$User@${ServerIP}:$RemotePath"

# 5. Restore Database
Write-Host "5. Restoring database..." -ForegroundColor Yellow
if (Test-Path "$LocalBackupPath\pb_data") {
    scp -r "$LocalBackupPath\pb_data" "$User@${ServerIP}:$RemotePath"
} else {
    Write-Host "   No database backup found to restore (clean install?)." -ForegroundColor Gray
}

# 6. Start Services
Write-Host "6. Starting remote services..." -ForegroundColor Yellow
ssh "$User@$ServerIP" "chmod +x $RemotePath/start_remote.sh && cd $RemotePath && ./start_remote.sh"

Write-Host "=== Deployment Successful! ===" -ForegroundColor Green
Write-Host "Verify at https://fztezgiacem.com" -ForegroundColor White
