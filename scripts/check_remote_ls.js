
import { Client } from 'ssh2';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

const conn = new Client();
conn.on('ready', () => {
    conn.exec('ls -la /root && ls -la /root/docker-site || echo "docker-site missing"', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => conn.end()).on('data', (d) => console.log(d.toString()));
    });
}).on('error', (e) => console.log(e)).connect(config);
