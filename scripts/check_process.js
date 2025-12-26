
import { Client } from 'ssh2';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

console.log('🕵️ Checking Running Process...');

const conn = new Client();

conn.on('ready', () => {
    const cmd = "ps aux | grep pocketbase";

    conn.exec(cmd, (err, stream) => {
        if (err) throw err;

        stream.on('close', () => {
            conn.end();
        }).on('data', (data) => {
            console.log(data.toString());
        });
    });
}).on('error', (err) => {
    console.error('❌ Connection Error:', err);
}).connect(config);
