
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
    console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
    process.exit(1);
}

const pb = new PocketBase(pbUrl);

async function main() {
    try {
        await pb.collection('_superusers').authWithPassword(email, password);
        console.log("Logged in as admin.");
    } catch (e) {
        console.error("Authentication failed:", e.message);
        return;
    }

    const data = {
        title: "Pediatrik Fizyoterapi",
        slug: "pediatrik-fizyoterapi",
        icon: "🏃‍♂️",
        color: "purple",
        summary: "Kas-iskelet sistemi ve postür bozukluklarında çocuğunuza özel egzersiz ve manuel terapi odaklı yaklaşımlar.",
        details: "Pediatrik fizyoterapi, çocukların kas-iskelet sistemi gelişimini destekleyen, postür bozukluklarını (skolyoz, kifoz vb.) düzeltmeyi hedefleyen ve motor becerileri (yürüme, denge, koordinasyon) geliştiren kapsamlı bir rehabilitasyon alanıdır. Çocuğun yaşına ve ihtiyaçlarına uygun oyun temelli egzersizler ve manuel terapi teknikleri ile yaşam kalitesini artırıyoruz.",
        image: "https://img.freepik.com/free-photo/kids-playing-grass_1098-13838.jpg" // Using existing image logic
    };

    try {
        // Check duplication
        const existing = await pb.collection('specializations').getList(1, 1, {
            filter: `slug = "${data.slug}"`
        });

        if (existing.items.length > 0) {
            console.log("Updating existing record...");
            await pb.collection('specializations').update(existing.items[0].id, data);
        } else {
            console.log("Creating new record...");
            await pb.collection('specializations').create(data);
        }
        console.log("Success: Operation completed.");
    } catch (e) {
        console.log("Error operating on DB:", e.message);
        if (e.data) console.log(e.data);
    }
}

main();
