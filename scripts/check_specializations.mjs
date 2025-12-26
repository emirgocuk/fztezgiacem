
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        const records = await pb.collection('specializations').getFullList();
        console.log("Found", records.length, "specializations:");
        records.forEach(r => {
            console.log(`- Title: ${r.title}`);
            console.log(`  ID: ${r.id}`);
            console.log(`  Slug: ${r.slug}`);
            console.log(`  Image: ${r.image ? r.image : "MISSING"}`);
            if (r.image && !r.image.startsWith('http')) {
                console.log(`  (Note: Image is likely a filename, needing getPbImageURL)`);
            }
            console.log('---');
        });
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
