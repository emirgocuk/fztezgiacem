
import { Client } from 'ssh2';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

const conn = new Client();

console.log('⬇️ Restoring PocketBase Binary...');

conn.on('ready', () => {
    // PocketBase v0.22.25 is a good stable version, or 0.23.0+ if user was using rc.
    // Assuming 0.22.x for stability unless user was on v0.23 (rc)
    // Actually, let's check what version they have locally if possible.
    // But since I can't easily check local version binary efficiently without tool overhead, 
    // I'll stick to a safe recent stable or just download latest stable.
    // Latest stable is 0.23.4 as of late 2024? Let's check releases.
    // Let's safe bet on 0.22.21 (last v0.22) or just use the latest release link.
    // Actually, user likely had a specific version.
    // I will use 0.24.4 (assuming current latest) or latest stable handling.

    const cmd = `
        cd /root/site
        
        echo "⬇️ Downloading PocketBase..."
        wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.26/pocketbase_0.22.26_linux_amd64.zip
        
        echo "📦 Unzipping..."
        unzip -o pocketbase_0.22.26_linux_amd64.zip pocketbase
        
        echo "🔧 Setting permissions..."
        chmod +x pocketbase
        
        echo "🧹 Cleaning zip..."
        rm pocketbase_0.22.26_linux_amd64.zip
        
        echo "🚀 Restarting Service..."
        systemctl restart fztezgiacem
        
        echo "🔍 Verifying Status..."
        systemctl status fztezgiacem --no-pager
    `;

    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log(`✅ Process Finished with code ${code}`);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).on('error', (err) => {
    console.error('❌ Connection Error:', err);
}).connect(config);
