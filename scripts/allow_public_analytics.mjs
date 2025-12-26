
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        // Authenticate as superuser to update collections
        const email = process.env.POCKETBASE_ADMIN_EMAIL || "admin@admin.com";
        const password = process.env.POCKETBASE_ADMIN_PASSWORD || "admin123456";

        await pb.admins.authWithPassword(email, password);
        console.log("Authenticated as admin.");

        const collection = await pb.collections.getOne("post_view_logs");

        // Update createRule to public ("") so visitors can log views
        // Update listRule/viewRule to allow admin viewing ("@request.auth.id != ''") or public
        await pb.collections.update(collection.id, {
            createRule: "", // Public write!
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''"
        });

        console.log("SUCCESS: 'post_view_logs' permissions updated.");
        console.log("createRule: Public");
        console.log("listRule: Authenticated Users");

    } catch (err) {
        console.error("Error updating permissions:", err);
    }
}

main();
