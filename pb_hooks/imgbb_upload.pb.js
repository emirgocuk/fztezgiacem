/// <reference path="../pb_data/types.d.ts" />

// Simple hook to log image uploads
// Full imgbb upload with WebP conversion needs external webhook or API endpoint

onRecordAfterCreateRequest((e) => {
    const collections = ['specializations', 'posts'];

    if (!collections.includes(e.collection.name)) return;

    console.log(`✅ New record created in ${e.collection.name}: ${e.record.id}`);

    // Log if image field exists
    if (e.record.get('image')) {
        console.log(`  📷 Image: ${e.record.get('image')}`);
        console.log(`  ⚠️  Manual action: Convert to WebP and upload to imgbb if needed`);
    }
});

onRecordAfterUpdateRequest((e) => {
    const collections = ['specializations', 'posts'];

    if (!collections.includes(e.collection.name)) return;

    console.log(`✅ Record updated in ${e.collection.name}: ${e.record.id}`);

    if (e.record.get('image')) {
        console.log(`  📷 Image: ${e.record.get('image')}`);
    }
});

console.log('🎣 Image upload logging hooks registered');
console.log('📝 Note: For automatic imgbb WebP upload, use the admin panel with custom upload script');
