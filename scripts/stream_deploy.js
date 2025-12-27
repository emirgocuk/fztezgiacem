
import { Client } from 'ssh2';
import path from 'path';
import fs from 'fs';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

const localTar = path.resolve('docker_deploy.tar');

console.log('🚀 STREAM DEPLOYING Docker Stack...');

const conn = new Client();

conn.on('ready', () => {
    // 1. mkdir
    conn.exec('mkdir -p /root/docker-site/pb_public /root/docker-site/pb_data', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
            console.log('✅ Directories ready.');

            // 2. Stream Tar
            console.log('📤 Streaming Tar...');
            conn.exec('tar -xf - -C /root/docker-site', (err, stream) => {
                if (err) throw err;

                const fileStream = fs.createReadStream(localTar);
                fileStream.pipe(stream);

                stream.on('close', (code, signal) => {
                    console.log('✅ Stream finished.');

                    // 3. Docker Up
                    const upCmd = `
                        cd /root/docker-site
                        echo "🚀 Starting Docker Compose..."
                        docker compose up -d --build --remove-orphans
                        docker compose ps
                    `;
                    conn.exec(upCmd, (err, stream2) => {
                        if (err) throw err;
                        stream2.on('close', (code) => {
                            console.log(`✅ Docker Started (Exit: ${code})`);
                            conn.end();
                        }).on('data', (d) => console.log(d.toString().trim()));
                    });
                });
            });
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
