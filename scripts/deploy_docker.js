import 'dotenv/config';
import { Client } from 'ssh2';
import path from 'path';

const config = {
    host: process.env.SERVER_HOST || '45.155.19.221',
    port: 22,
    username: process.env.SERVER_USER || 'root',
    password: process.env.SERVER_PASSWORD
};

const localTar = path.resolve('docker_deploy.tar');
const remoteTar = '/root/docker-site/deploy.tar';

console.log('🚀 RETRY DEPLOYING Docker Stack...');

const conn = new Client();

conn.on('ready', () => {
    // Re-run mkdir just in case
    const prepareCmd = `mkdir -p /root/docker-site/pb_public`;

    conn.exec(prepareCmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
            console.log('✅ Preparation done.');
            conn.sftp((err, sftp) => {
                if (err) throw err;
                console.log('📤 Uploading Tar...');
                sftp.fastPut(localTar, remoteTar, (err) => {
                    if (err) throw err;
                    console.log('✅ Upload finished.');

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
            });
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
