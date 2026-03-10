import 'dotenv/config';
import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    host: process.env.SERVER_HOST || '45.155.19.221',
    port: 22,
    username: process.env.SERVER_USER || 'root',
    password: process.env.SERVER_PASSWORD
};

const localArchive = path.resolve(__dirname, '../site_build.tar.gz');

console.log('🚀 Starting deployment of SSR build...');

async function deploy() {
    try {
        console.log('🧹 Cleaning up old archive...');
        if (fs.existsSync(localArchive)) {
            fs.unlinkSync(localArchive);
        }

        console.log('📦 Taring up the dist folder and package files...');
        // tar dist folder AND package files
        const { stdout, stderr } = await execPromise('tar -cvzf site_build.tar.gz dist package.json package-lock.json', { cwd: path.resolve(__dirname, '..') });
        console.log('STDOUT (tar):', stdout.substring(0, 500) + '...');
        console.log('✅ Archive created successfully.');

        const conn = new Client();
        conn.on('ready', () => {
            console.log('✅ SSH Client :: ready');

            conn.sftp((err, sftp) => {
                if (err) throw err;

                console.log(`📤 Uploading archive to /root/site/site_build.tar.gz...`);
                sftp.fastPut(localArchive, '/root/site/site_build.tar.gz', (err) => {
                    if (err) throw err;
                    console.log('✅ File uploaded successfully!');

                    console.log('🔄 Extracting, installing dependencies, and restarting SSR service...');
                    const cmd = `cd /root/site && rm -rf dist && tar -xzf site_build.tar.gz && rm site_build.tar.gz && npm install --omit=dev && systemctl restart fztezgiacem-astro`;

                    conn.exec(cmd, (err, stream) => {
                        if (err) throw err;

                        stream.on('close', (code, signal) => {
                            console.log('✅ Deployment command executed (Exit code: ' + code + ')');
                            console.log('🎉 DEPLOYMENT COMPLETE! Site should be updated and SSR running.');
                            conn.end();

                            // Clean up local tar
                            if (fs.existsSync(localArchive)) {
                                fs.unlinkSync(localArchive);
                            }
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
        console.error('Failed to deploy', err);
    }
}

deploy();
