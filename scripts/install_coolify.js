import { Client } from 'ssh2';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@',
};

const conn = new Client();

conn.on('ready', () => {
    console.log('Client :: ready');

    // Commands to clean up and install Coolify
    // 1. Stop fztezgiacem service (PocketBase manual setup)
    // 2. Stop nginx (if running)
    // 3. Install Coolify
    const commands = [
        'echo "Stopping existing services..."',
        'systemctl stop fztezgiacem || true',
        'systemctl disable fztezgiacem || true',
        'systemctl stop nginx || true',
        'systemctl disable nginx || true',
        'echo "Starting Coolify Installation (this may take a while)..."',
        'curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash'
    ];

    const command = commands.join(' && ');

    conn.exec(command, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).connect(config);
