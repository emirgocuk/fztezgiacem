import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

const localDistFile = path.resolve(__dirname, '../dist.tar.gz');
const remoteDistDir = '/root/docker-site/pb_public';

console.log('🚀 Starting deployment of dist folder...');

import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

async function deploy() {
    try {
        console.log('📦 Taring up the dist folder...');
        await execPromise('tar -czf dist.tar.gz -C dist .', { cwd: path.resolve(__dirname, '..') });
        console.log('✅ Tar created successfully.');

        const conn = new Client();
        conn.on('ready', () => {
            console.log('✅ SSH Client :: ready');

            conn.sftp((err, sftp) => {
                if (err) throw err;

                console.log(`📤 Uploading archive to /root/docker-site/dist.tar.gz...`);
                sftp.fastPut(localDistFile, '/root/docker-site/dist.tar.gz', (err) => {
                    if (err) throw err;
                    console.log('✅ File uploaded successfully!');

                    console.log('🔄 Extracting and restarting PocketBase service...');
                    // Command based on deploy.yml: we will extract into pb_public and then restart container
                    const cmd = `cd /root/docker-site && rm -rf pb_public/* && tar -xzf dist.tar.gz -C pb_public && rm dist.tar.gz && docker compose restart pocketbase`;
                    conn.exec(cmd, (err, stream) => {
                        if (err) throw err;

                        stream.on('close', (code, signal) => {
                            console.log('✅ Service restart command executed (Exit code: ' + code + ')');
                            console.log('🎉 DEPLOYMENT COMPLETE! Site should be updated.');
                            conn.end();

                            // Clean up local tar
                            fs.unlinkSync(localDistFile);
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
    } catch (err) {
        console.error('Failed to create tar', err);
    }
}

deploy();
