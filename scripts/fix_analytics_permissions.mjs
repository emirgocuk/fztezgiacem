import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function fixRules() {
    try {
        await pb.admins.authWithPassword('superadmin@test.com', '1234567890');
        console.log("Authenticated as superadmin.");

        const collection = await pb.collections.getOne('post_view_logs');

        // Update listRule to allow any authenticated user
        // If admins are in 'users' collection, this will allow them.
        await pb.collections.update(collection.id, {
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''"
        });

        console.log("Updated 'post_view_logs' rules to allow authenticated users.");

    } catch (err) {
        console.error("Fix failed:", err);
    }
}

fixRules();
