
import fs from 'fs';
import path from 'path';
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Setup Env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const imgbbKey = process.env.PUBLIC_IMGBB_API_KEY;

if (!email || !password || !imgbbKey) {
    console.error("❌ Missing env vars (ADMIN_EMAIL, ADMIN_PASSWORD, PUBLIC_IMGBB_API_KEY)");
    process.exit(1);
}

const pb = new PocketBase(pbUrl);

// Data Mapping
const updates = [
    {
        file: 'spec_neuro.png',
        titleMatch: "Nöromotor",
    },
    {
        file: 'spec_feeding.png',
        titleMatch: "Beslenme",
    },
    {
        file: 'spec_sensory.png',
        titleMatch: "Duyu Bütünleme",
    }
];

async function uploadToImgBB(filename) {
    const filePath = path.join(process.cwd(), 'public', filename);
    if (!fs.existsSync(filePath)) {
        console.error(`File missing: ${filePath}`);
        return null;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    const formData = new FormData();
    formData.append("image", base64Image);

    try {
        console.log(`Uploading ${filename} to ImgBB...`);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
            method: 'POST',
            body: formData,
        });
        const json = await res.json();
        if (json.success) {
            console.log(`✅ Uploaded: ${json.data.url}`);
            return json.data.url;
        } else {
            console.error(`ImgBB Error:`, json.error);
            return null;
        }
    } catch (e) {
        console.error(`Upload failed for ${filename}:`, e.message);
        return null;
    }
}

async function main() {
    try {
        await pb.collection('_superusers').authWithPassword(email, password);
        console.log("Logged in as admin.");

        const records = await pb.collection('specializations').getFullList();

        for (const item of updates) {
            // 1. Upload
            const newUrl = await uploadToImgBB(item.file);
            if (!newUrl) continue;

            // 2. Find Record
            const record = records.find(r => r.title.includes(item.titleMatch));
            if (record) {
                console.log(`Updating DB for "${record.title}"...`);
                await pb.collection('specializations').update(record.id, {
                    image: newUrl
                });
                console.log(`✅ Database updated.`);
            } else {
                console.warn(`⚠️ No record found matching "${item.titleMatch}"`);
            }
        }

    } catch (e) {
        console.error("Script error:", e.message);
    }
}

main();
