
import { Client } from 'ssh2';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

const conn = new Client();

console.log('5️⃣0️⃣2️⃣ Debugging Bad Gateway...');

conn.on('ready', () => {
    const cmd = `
        echo "🔍 Service Status:"
        systemctl status fztezgiacem --no-pager
        
        echo "\n---------\n"
        
        echo "🎧 Listening Ports (8090):"
        ss -lptn 'sport = :8090'
        
        echo "\n---------\n"
        
        echo "📋 Service Logs (Last 20 lines):"
        journalctl -u fztezgiacem -n 30 --no-pager
        
        echo "\n---------\n"
        
        echo "📡 Testing Local Curl:"
        curl -I http://127.0.0.1:8090/_/ || echo "❌ Curl Failed"
    `;

    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('✅ Debug Complete');
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
