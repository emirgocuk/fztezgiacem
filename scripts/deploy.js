
import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

const localFile = path.resolve('pb_hooks/main.pb.js');
const remoteFile = '/root/site/pb_hooks/main.pb.js';

console.log('🚀 Starting deployment...');

const conn = new Client();

conn.on('ready', () => {
    console.log('✅ SSH Client :: ready');

    conn.sftp((err, sftp) => {
        if (err) throw err;

        console.log(`📤 Uploading ${localFile} to ${remoteFile}...`);

        sftp.fastPut(localFile, remoteFile, (err) => {
            if (err) throw err;
            console.log('✅ File uploaded successfully!');

            console.log('🔄 Restarting PocketBase service...');
            conn.exec('systemctl restart fztezgiacem', (err, stream) => {
                if (err) throw err;

                stream.on('close', (code, signal) => {
                    console.log('✅ Service restart command executed (Exit code: ' + code + ')');
                    console.log('🎉 DEPLOYMENT COMPLETE! Test the form now.');
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
