
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        const email = "superadmin@test.com";
        const password = "1234567890";

        await pb.admins.authWithPassword(email, password);
        console.log("Logged in as admin.");

        // 1. Create 'site_views' collection if not exists
        try {
            await pb.collections.getOne("site_views");
            console.log("'site_views' collection already exists.");
        } catch {
            console.log("Creating 'site_views' collection...");
            await pb.collections.create({
                name: "site_views",
                type: "base",
                schema: [
                    // No specific fields needed, just timestamps (created/updated) and id
                ],
                createRule: "", // Public create
                listRule: "@request.auth.id != ''", // Admin list
                viewRule: "@request.auth.id != ''"  // Admin view
            });
            console.log("Created 'site_views' collection.");
        }

        // 2. Ensure permissions are public for create
        const collection = await pb.collections.getOne("site_views");
        if (collection.createRule !== "") {
            await pb.collections.update(collection.id, { createRule: "" });
            console.log("Updated 'site_views' createRule to public.");
        }

        // 3. Seed Data (Last 30 Days)
        console.log("Seeding site views...");
        const now = new Date();
        let logs = [];

        // Generate ~1000 random views over last 30 days
        for (let i = 0; i < 1000; i++) {
            const d = new Date(now);
            // Random day in last 30 days
            d.setDate(d.getDate() - Math.floor(Math.random() * 30));
            // Random time
            d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            logs.push({ created: d.toISOString() });
        }

        console.log(`Pushing ${logs.length} seed entries (this might take a moment)...`);

        // Batch create helper
        for (let i = 0; i < logs.length; i += 100) {
            const batch = logs.slice(i, i + 100);
            await Promise.all(batch.map(d => pb.collection('site_views').create(d).catch(() => { })));
            process.stdout.write(".");
        }

        console.log("\nDone seeding site analytics.");

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
