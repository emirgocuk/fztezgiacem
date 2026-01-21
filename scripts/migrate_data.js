
import { Client } from 'ssh2';

const config = {
    host: '45.155.19.221',
    port: 22,
    username: 'root',
    password: 'pRQSCT342g!diyo@'
};

const conn = new Client();

conn.on('ready', () => {
    console.log('Connected via SSH...');

    // Script to execute on server
    const remoteScript = `
        echo "--> Finding PocketBase Container..."
        CID=$(docker ps --filter "ancestor=ghcr.io/coollabsio/pocketbase:latest" --format "{{.ID}}" | head -n 1)
        
        if [ -z "$CID" ]; then
            echo "Error: No PocketBase container found!"
            exit 1
        fi
        
        echo "    Container ID: $CID"
        
        echo "--> Checking User (Info)"
        docker exec $CID id || echo "Could not check id, assuming root compatible"
        
        echo "--> Stopping Container..."
        docker stop $CID
        
        echo "--> Copying pb_data..."
        # Backup existing (just in case, though it is empty)
        # docker cp $CID:/app/pb_data /root/pb_data_backup_$(date +%s)
        
        # Copy old data OVER the new data
        # Note: 'docker cp' source dest
        # If dest is a dir, it copies INTO it.
        # We want to ensure proper structure.
        
        echo "    Source: /root/site/pb_data"
        echo "    Dest:   $CID:/app/pb_data/"
        
        # We assume /root/site/pb_data contains 'data.db' etc.
        docker cp /root/site/pb_data/. $CID:/app/pb_data/
        
        echo "--> Restarting Container..."
        docker start $CID
        
        echo "--> Done! PB should be up with old data."
    `;

    conn.exec(remoteScript, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).on('error', (err) => {
    console.error('SSH Connection Error:', err);
}).connect(config);
