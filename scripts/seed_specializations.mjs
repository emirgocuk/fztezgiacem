
import PocketBase from 'pocketbase';
import { specializations } from '../src/data/specializations.js';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = 'superadmin@test.com';
const ADMIN_PASSWORD = '1234567890';

async function migrate() {
    console.log('🚀 Uzmanlık Alanları Migrasyonu Başlıyor...');

    try {
        await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Admin girişi başarılı.');
    } catch (err) {
        console.error('❌ Admin girişi başarısız:', err);
        return;
    }

    // 1. Reset Collection

    try {
        await pb.collections.delete('specializations');
        console.log('🗑️ Eski koleksiyon silindi.');
    } catch {
        // Ignore if not found
    }

    console.log('✨ "specializations" koleksiyonu oluşturuluyor...');
    try {
        await pb.collections.create({
            name: 'specializations',
            type: 'base',
            fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'slug', type: 'text', required: true }, // Removed 'unique' constraint for simplicity in definition, usually handled by index or rule
                { name: 'icon', type: 'text' },
                { name: 'image', type: 'url' },
                { name: 'color', type: 'select', maxSelect: 1, values: ['orange', 'yellow', 'blue', 'green', 'purple'] },
                { name: 'summary', type: 'text' },
                { name: 'details', type: 'editor' }
            ],
            listRule: '', // Public
            viewRule: '', // Public
            createRule: null, // Admin only
            updateRule: null, // Admin only
            deleteRule: null  // Admin only
        });

        console.log('✅ Koleksiyon oluşturuldu.');
    } catch (err) {
        console.error('❌ Koleksiyon oluşturulamadı:', err);
        return;
    }

    // 2. Seed Data
    console.log(`📦 ${specializations.length} adet kayıt işleniyor...`);

    for (const spec of specializations) {
        // Check if exists by slug
        try {
            const existing = await pb.collection('specializations').getFirstListItem(`slug="${spec.id}"`);
            console.log(`ℹ️ "${spec.title}" zaten var, güncelleniyor...`);
            await pb.collection('specializations').update(existing.id, {
                title: spec.title,
                icon: spec.icon,
                image: spec.image,
                color: spec.color,
                summary: spec.summary,
                details: spec.details
            });
        } catch (err) {
            // Not found, create
            console.log(`➕ "${spec.title}" ekleniyor...`);
            await pb.collection('specializations').create({
                title: spec.title,
                slug: spec.id, // Map ID to slug
                icon: spec.icon,
                image: spec.image,
                color: spec.color,
                summary: spec.summary,
                details: spec.details
            });
        }
    }

    console.log('🎉 Migrasyon tamamlandı!');
}

migrate();
