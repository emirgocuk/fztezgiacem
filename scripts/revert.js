
import { Client } from 'ssh2';
import path from 'path';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

console.log('🔙 Reverting changes on server...');

const conn = new Client();

conn.on('ready', () => {
    conn.sftp((err, sftp) => {
        if (err) throw err;

        // 1. Upload the restored hook
        const localHook = path.resolve('pb_hooks/main.pb.js');
        const remoteHook = '/root/site/pb_hooks/main.pb.js';

        console.log(`📤 Restoring hook file...`);
        sftp.fastPut(localHook, remoteHook, (err) => {
            if (err) throw err;
            console.log('✅ Hook restored.');

            // 2. Delete the migration file and Restart
            // Also deleting the file from server to avoid confusion
            const cmd = "rm -f /root/site/pb_migrations/1772648000_create_settings.js && systemctl restart fztezgiacem";

            console.log("Executing revert command: " + cmd);
            conn.exec(cmd, (err, stream) => {
                if (err) throw err;

                stream.on('close', (code, signal) => {
                    console.log('✅ Revert and restart completed (Exit code: ' + code + ')');
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
