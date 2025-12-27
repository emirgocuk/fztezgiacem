
import { Client } from 'ssh2';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

console.log('🚨 EMERGENCY ROLLBACK STARTED 🚨');

const conn = new Client();

conn.on('ready', () => {
    // 1. Stop Docker
    // 2. Move data back
    // 3. Fix perms
    // 4. Start Systemd Services (PB + Nginx)

    // Check if pb_data is in docker-site, move it back
    const cmd = `
        echo "🛑 Stopping Docker..."
        docker compose down || true
        
        echo "📦 Restoring Data Location..."
        if [ -d "/root/docker-site/pb_data" ]; then
            mv /root/docker-site/pb_data /root/site/
        fi
        
        echo "🔧 Fixing Permissions..."
        chown -R root:root /root/site
        
        echo "🔄 Restarting Legacy Services..."
        systemctl enable fztezgiacem
        systemctl start fztezgiacem
        
        systemctl enable nginx
        systemctl start nginx
        
        echo "🩺 Checking Status..."
        systemctl status fztezgiacem --no-pager
        systemctl status nginx --no-pager
    `;

    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
            console.log(`✅ Rollback Sequence Finished (Exit: ${code})`);
            conn.end();
        }).on('data', (d) => console.log(d.toString().trim()));
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
