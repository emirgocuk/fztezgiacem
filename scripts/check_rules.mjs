
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = 'superadmin@test.com';
const ADMIN_PASSWORD = '1234567890';

async function checkRules() {
    console.log('🔍 Rules Check...');

    try {
        await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    } catch (err) {
        console.error('❌ Admin login failed');
        return;
    }

    try {
        const collection = await pb.collections.getOne('specializations');
        console.log('✅ Collection Found:', collection.name);
        console.log('📜 Rules:', {
            list: collection.listRule,
            view: collection.viewRule,
            create: collection.createRule,
            update: collection.updateRule,
            delete: collection.deleteRule,
        });
        console.log('📋 Fields/Schema:', collection.fields || collection.schema);

        console.log('🔄 Attempting ADMIN fetch...');
        try {
            const adminList = await pb.collection('specializations').getList(1, 10);
            console.log('✅ Admin fetch successful. Items:', adminList.totalItems);
        } catch (err) {
            console.error('❌ Admin fetch failed:', err.status, err.message);
        }

        console.log('🔄 Attempting PUBLIC fetch (no sort)...');
        // Create new client to simulate public user
        const publicPb = new PocketBase('http://127.0.0.1:8090');
        try {
            const list = await publicPb.collection('specializations').getList(1, 10);
            console.log('✅ Public fetch successful. Items:', list.totalItems);
        } catch (err) {
            console.error('❌ Public fetch failed:', err.status, err.message);
            if (err.response) console.log('Response:', err.response);
        }
    } catch (err) {
        console.error('❌ Outer Error:', err);
    }
}

checkRules();

