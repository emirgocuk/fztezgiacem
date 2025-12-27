
import { Client } from 'ssh2';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

console.log('🕵️ Checking Docker Deployment...');

const conn = new Client();

conn.on('ready', () => {
    const cmd = "cd /root/docker-site && docker compose ps";

    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
            console.log(`Exit: ${code}`);
            conn.end();
        }).on('data', (d) => console.log(d.toString().trim()));
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
