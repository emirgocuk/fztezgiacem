
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
const remoteTar = '/root/docker-site/deploy.tar';

console.log('🚀 MANUAL STREAM DEPLOY...');

const conn = new Client();

conn.on('ready', () => {
    // 1. mkdir
    conn.exec('mkdir -p /root/docker-site/pb_public /root/docker-site/pb_data', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
            console.log('✅ Directories ready.');

            conn.sftp((err, sftp) => {
                if (err) throw err;

                console.log('📤 Streaming Tar via SFTP Write Stream...');
                const readStream = fs.createReadStream(localTar);
                const writeStream = sftp.createWriteStream(remoteTar);

                writeStream.on('close', () => {
                    console.log('✅ Upload finished.');

                    // Extract & Up
                    const deployCmd = `
                        cd /root/docker-site
                        tar -xf deploy.tar
                        rm deploy.tar
                        echo "🚀 Starting Docker Compose..."
                        docker compose up -d --build --remove-orphans
                        docker compose ps
                    `;

                    conn.exec(deployCmd, (err, stream2) => {
                        if (err) throw err;
                        stream2.on('close', (code) => {
                            console.log(`✅ Docker Deploy Finished (Exit: ${code})`);
                            conn.end();
                        }).on('data', (d) => console.log(d.toString().trim()));
                    });
                });

                readStream.pipe(writeStream);
            });
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
