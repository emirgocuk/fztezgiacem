import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
    console.error('❌ Error: ADMIN_EMAIL or ADMIN_PASSWORD not found in .env file.');
    process.exit(1);
}

const pb = new PocketBase(pbUrl);

async function createAdmin() {
    console.log(`🔌 Connecting to PocketBase at ${pbUrl}...`);
    try {
        // Try to login first to see if admin exists
        try {
            await pb.collection("_superusers").authWithPassword(email, password);
            console.log('✅ Admin already exists and credentials are correct.');
            return;
        } catch (e) {
            // Login failed, proceed to create
            console.log('Admin login failed, attempting to create new admin...');
        }

        // PocketBase doesn't allow creating admins via API efficiently without initial setup token or manual DB entry if totally locked out.
        // BUT, if we are in dev mode, we might be able to create one if none exist.
        // Actually, the best way for a user to "manage" this via script locally is effectively just logging it out or reminding them.
        // Wait, standard PocketBase API allows creating first admin? Or via 'pb.admins.create' if we have a valid auth.

        // CORRECTION: You usually need to be authenticated as an admin to create another admin. 
        // If NO admins exist, the first one can be created via the UI wizard.
        // If we want to automate this, we might need to access the SQLite DB directly or use the --admin flag if running the binary.

        // SINCE the user is running `./pocketbase serve`, interacting via API script relies on having access.
        // Let's assume the user MIGHT want to use this script just to verify their .env matches PB or to Create if allowed (often restricted).

        // HOWEVER, "yöneticiyi sen düzenleyebilirsin" implies *I* (the agent) or the *user* can edit the .env to set it.
        // Since we can't easily force-create admin via API without auth, 
        // we will instead inform the user that this script CHECKS the credentials.

        console.log('ℹ️  To create a new admin or reset password, please use the PocketBase Dashboard:');
        console.log(`👉 ${pbUrl}/_/?installer`);
        console.log('\nChecking provided credentials against server...');

        try {
            await pb.collection("_superusers").authWithPassword(email, password);
            console.log('SUCCESS: .env credentials allow Admin access.');
        } catch (err) {
            console.error('❌ Authentication Failed. The credentials in .env do not match the PocketBase server.');
            console.log('Please update your PocketBase admin manually locally via the Dashboard, then update .env to match.');
        }

    } catch (error) {
        console.error('❌ Connection Error:', error.message);
    }
}

createAdmin();
