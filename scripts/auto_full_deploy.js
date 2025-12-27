
import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

const localFile = path.resolve('deploy_full.tar');
const remoteFile = '/root/site/deploy_full.tar';

console.log('🚀 Starting FULL deployment...');

const conn = new Client();

conn.on('ready', () => {
    console.log('✅ SSH Client :: ready');

    conn.sftp((err, sftp) => {
        if (err) throw err;

        console.log(`📤 Uploading ${localFile} to ${remoteFile}...`);

        sftp.fastPut(localFile, remoteFile, (err) => {
            if (err) throw err;
            console.log('✅ File uploaded successfully!');

            const cmd = `
                cd /root/site &&
                tar -xf deploy_full.tar &&
                rm deploy_full.tar &&
                systemctl restart fztezgiacem &&
                echo "✅ Service Restarted"
            `;

            console.log('🔄 Extracting and Restarting...');
            conn.exec(cmd, (err, stream) => {
                if (err) throw err;

                stream.on('close', (code, signal) => {
                    console.log('✅ Command executed (Exit code: ' + code + ')');
                    console.log('🎉 DEPLOYMENT COMPLETE!');
                    conn.end();
                }).on('data', (data) => {
                    console.log('STDOUT: ' + data);
                }).stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ Connection Error:', err);
}).connect(config);
