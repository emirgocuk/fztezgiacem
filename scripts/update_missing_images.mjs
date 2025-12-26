
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
    console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
    process.exit(1);
}

const pb = new PocketBase(pbUrl);

async function main() {
    try {
        await pb.collection('_superusers').authWithPassword(email, password);
        console.log("Logged in as admin.");

        const updates = [
            {
                titleMatch: "Beslenme",
                newImage: "https://img.freepik.com/free-photo/baby-eating-healthy-food_329181-1934.jpg"
            },
            {
                titleMatch: "Nöromotor", // Matches "Nöromotor Gelişim Geriliği"
                newImage: "https://img.freepik.com/free-photo/physiotherapist-working-with-little-girl_23-2149348259.jpg"
            }
        ];

        const records = await pb.collection('specializations').getFullList();

        for (const update of updates) {
            const record = records.find(r => r.title.includes(update.titleMatch));
            if (record) {
                console.log(`Updating image for: ${record.title}`);
                await pb.collection('specializations').update(record.id, {
                    image: update.newImage
                });
                console.log(`✅ Updated ${record.title}`);
            } else {
                console.log(`⚠️ Could not find record matching: ${update.titleMatch}`);
            }
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
