import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = 'superadmin@test.com';
const ADMIN_PASSWORD = '1234567890';

async function main() {
    try {
        console.log("Authenticating as Admin...");
        await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

        console.log("Creating/Updating 'site_settings' collection...");
        try {
            const collection = await pb.collections.getOne('site_settings');
            console.log("Collection 'site_settings' already exists. Updating rules...");
            collection.viewRule = '';
            await pb.collections.update(collection.id, collection);
            console.log("✅ Rules updated: viewRule is now public.");
        } catch (e) {
            await pb.collections.create({
                name: 'site_settings',
                type: 'base',
                fields: [
                    { name: 'contact_email', type: 'email' },
                    { name: 'phone', type: 'text' },
                    { name: 'address', type: 'text' },
                    { name: 'social_links', type: 'json' }
                ],
                listRule: '',
                viewRule: '',
                createRule: '@request.auth.id != ""',
                updateRule: '@request.auth.id != ""',
                deleteRule: null
            });
            console.log("✅ 'site_settings' collection created successfully!");
        }
    } catch (err) {
        console.error("Error:", err.originalError || err.message);
    }
}

main();
