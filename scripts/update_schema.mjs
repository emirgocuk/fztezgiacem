import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

const pb = new PocketBase(pbUrl);

async function main() {
    try {
        await pb.collection('_superusers').authWithPassword(email, password);
        console.log("Authenticated as admin.");

        const collection = await pb.collections.getOne('posts');

        // Check if views field exists
        const hasViews = collection.schema.find(f => f.name === 'views');
        if (!hasViews) {
            console.log("Adding 'views' field...");
            collection.schema.push({
                name: 'views',
                type: 'number',
                required: false,
                options: {
                    min: 0,
                    max: null,
                    noDecimal: true
                }
            });
            await pb.collections.update('posts', collection);
            console.log("Schema updated.");
        } else {
            console.log("'views' field already exists.");
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
