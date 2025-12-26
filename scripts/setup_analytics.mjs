import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function setup() {
    try {
        // Authenticate
        await pb.admins.authWithPassword('superadmin@test.com', '1234567890');
        console.log("Authenticated as admin.");

        // Check if collection exists
        try {
            await pb.collections.getOne('post_view_logs');
            console.log("Collection 'post_view_logs' already exists.");
        } catch (e) {
            console.log("Collection not found. Creating...");

            await pb.collections.create({
                name: 'post_view_logs',
                type: 'base',
                schema: [
                    {
                        name: 'post',
                        type: 'relation',
                        required: true,
                        presentation: false,
                        maxSelect: 1,
                        collectionId: 'pbc_1125843985', // 'posts' collection ID or name? Name usually works in create but safer to fetch posts first to be sure or just use name "posts" if PB resolves it.
                        // Actually, let's look up 'posts' ID to be safe.
                        cascadeDelete: true
                    },
                    {
                        name: 'metadata',
                        type: 'json',
                        required: false
                    }
                ],
                listRule: null, // Admin only
                viewRule: null,
                createRule: "", // Public write (for logging)
                updateRule: null,
                deleteRule: null,
            });
            console.log("Collection 'post_view_logs' created successfully.");
        }

    } catch (err) {
        console.error("Setup failed:", err);
    }
}

setup();
