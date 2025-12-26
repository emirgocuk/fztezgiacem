
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        const email = "superadmin@test.com";
        const password = "1234567890";

        await pb.admins.authWithPassword(email, password);
        console.log("Logged in as admin.");

        // 1. Get collection
        const collection = await pb.collections.getOne("site_views");

        // 2. Add 'platform' field if not exists
        const hasField = collection.schema.some(f => f.name === 'platform');
        if (!hasField) {
            console.log("Adding 'platform' field to schema...");
            collection.schema.push({
                name: 'platform',
                type: 'text',
                required: false,
                options: {}
            });
            await pb.collections.update(collection.id, collection);
            console.log("Schema updated.");
        } else {
            console.log("Schema already has 'platform' field.");
        }

        // 3. Delete all existing logs (to clean up "broken" ones)
        console.log("Deleting old empty logs...");
        const oldLogs = await pb.collection("site_views").getFullList();
        for (const log of oldLogs) {
            await pb.collection("site_views").delete(log.id);
        }
        console.log(`Deleted ${oldLogs.length} old logs.`);

        // 4. Seed New Data (Last 30 Days)
        console.log("Seeding NEW site views...");
        const now = new Date();
        let logs = [];

        for (let i = 0; i < 500; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - Math.floor(Math.random() * 30));
            d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            logs.push({
                platform: 'web',
                created: d.toISOString(),
                updated: d.toISOString()
            });
        }

        // Batch create
        for (let i = 0; i < logs.length; i += 50) {
            const batch = logs.slice(i, i + 50);
            await Promise.all(batch.map(d => pb.collection('site_views').create(d).catch(e => console.log(e))));
            process.stdout.write(".");
        }

        console.log("\nDone fixing and seeding site analytics.");

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
