import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function seed() {
    try {
        await pb.admins.authWithPassword('superadmin@test.com', '1234567890');
        console.log("Logged in.");

        const posts = await pb.collection('posts').getFullList();
        if (!posts.length) { console.log("No posts."); return; }

        console.log(`Seeding views for ${posts.length} posts...`);

        let logs = [];
        const now = new Date();

        // 1. Generate data for the last HOUR (for 1S chart) - Minute granularity
        for (let m = 0; m < 60; m++) {
            if (Math.random() > 0.7) continue; // Not every minute has a view
            const d = new Date(now);
            d.setMinutes(d.getMinutes() - m);

            logs.push({
                post: posts[Math.floor(Math.random() * posts.length)].id,
                created: d.toISOString(),
                updated: d.toISOString()
            });
        }

        // 2. Generate data for the last 24 HOURS (for 1G chart) - Hourly granularity
        for (let h = 0; h < 24; h++) {
            const viewsInHour = Math.floor(Math.random() * 5); // 0-4 views per hour
            for (let i = 0; i < viewsInHour; i++) {
                const d = new Date(now);
                d.setHours(d.getHours() - h);
                d.setMinutes(Math.floor(Math.random() * 60)); // Random minute

                logs.push({
                    post: posts[Math.floor(Math.random() * posts.length)].id,
                    created: d.toISOString(),
                    updated: d.toISOString()
                });
            }
        }

        // 3. Generate data for the last 30 DAYS (for 1H and 1A chart) - Daily granularity
        for (let day = 0; day < 30; day++) {
            const viewsInDay = Math.floor(Math.random() * 15) + 5; // 5-20 views per day
            for (let i = 0; i < viewsInDay; i++) {
                const d = new Date(now);
                d.setDate(d.getDate() - day);
                d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

                logs.push({
                    post: posts[Math.floor(Math.random() * posts.length)].id,
                    created: d.toISOString(),
                    updated: d.toISOString()
                });
            }
        }

        console.log(`Generated ${logs.length} entries. Saving to DB...`);

        // Batch create (approx)
        // PB doesn't have a massive bulk insert, so we define a helper
        // created field override usually requires "Update Created" property set in Admin UI or Superuser.
        // As Superuser (admin), we usually can set it if we send it.

        for (const log of logs) {
            await pb.collection('post_view_logs').create(log).catch(e => console.error("Err", e.message));
            process.stdout.write(".");
        }

        console.log("\nDone!");

    } catch (e) {
        console.error("Critical Error:", e);
    }
}

seed();
