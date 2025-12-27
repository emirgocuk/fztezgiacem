
import { Client } from 'ssh2';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

console.log('🐳 Checking Docker on Server...');

const conn = new Client();

conn.on('ready', () => {
    // Check docker version and docker compose version
    const cmd = "docker --version && docker compose version";

    conn.exec(cmd, (err, stream) => {
        if (err) throw err;

        stream.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Docker is installed.');
            } else {
                console.log('❌ Docker is NOT installed command failed.');
            }
            conn.end();
        }).on('data', (d) => console.log(d.toString().trim()));
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
