
import { Client } from 'ssh2';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

console.log('🔑 Setting up CI Keys...');

const conn = new Client();

conn.on('ready', () => {
    // 1. Generate Key (if not exists)
    // 2. Add to authorized_keys
    // 3. Print Private Key

    // Commands:
    // - ssh-keygen -t ed25519 -f /root/.ssh/github_actions -N "" || true (don't overwrite if exists? remove || true to fail if exists, or check first)
    // Let's overwrite? No, if we overwrite, we might break existing actions if run twice. 
    // Ideally check if exists.

    const cmds = `
        mkdir -p /root/.ssh
        if [ ! -f /root/.ssh/github_actions ]; then
            ssh-keygen -t ed25519 -f /root/.ssh/github_actions -N ""
        fi
        cat /root/.ssh/github_actions.pub >> /root/.ssh/authorized_keys
        echo "---PRIVATE KEY START---"
        cat /root/.ssh/github_actions
        echo "---PRIVATE KEY END---"
    `;

    conn.exec(cmds, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
            conn.end();
        }).on('data', (d) => console.log(d.toString()));
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
