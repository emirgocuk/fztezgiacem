import 'dotenv/config';
import PocketBase from 'pocketbase';
import axios from 'axios';
import sharp from 'sharp';
import FormData from 'form-data';
import { createWriteStream, unlinkSync } from 'fs';
import { pipeline } from 'stream/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const IMGBB_API_KEY = process.env.PUBLIC_IMGBB_API_KEY;
const pb = new PocketBase('http://127.0.0.1:8090');

// Admin login
await pb.admins.authWithPassword(
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_PASSWORD
);

console.log('✅ PocketBase authenticated');

/**
 * Download image from URL
 */
async function downloadImage(url, filepath) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    await pipeline(response.data, createWriteStream(filepath));
}

/**
 * Convert image to WebP
 */
async function convertToWebP(inputPath, outputPath) {
    await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);
}

/**
 * Upload to imgbb
 */
async function uploadToImgbb(imagePath) {
    const form = new FormData();
    form.append('image', createWriteStream(imagePath));

    const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        form,
        {
            headers: form.getHeaders()
        }
    );

    return response.data.data.url;
}

/**
 * Process single image: download -> convert -> upload -> return URL
 */
async function processImage(imageUrl, recordId) {
    try {
        console.log(`📥 Processing: ${imageUrl.substring(0, 50)}...`);

        // Skip if already imgbb
        if (imageUrl.includes('i.ibb.co')) {
            console.log('⏭️  Already on imgbb, skipping');
            return imageUrl;
        }

        const tempInput = join(tmpdir(), `${recordId}_input.jpg`);
        const tempWebP = join(tmpdir(), `${recordId}_output.webp`);

        // Download
        await downloadImage(imageUrl, tempInput);
        console.log('  ✓ Downloaded');

        // Convert to WebP
        await convertToWebP(tempInput, tempWebP);
        console.log('  ✓ Converted to WebP');

        // Upload to imgbb
        const imgbbUrl = await uploadToImgbb(tempWebP);
        console.log(`  ✓ Uploaded: ${imgbbUrl}`);

        // Cleanup
        unlinkSync(tempInput);
        unlinkSync(tempWebP);

        return imgbbUrl;
    } catch (error) {
        console.error(`❌ Error processing ${imageUrl}:`, error.message);
        return null;
    }
}

/**
 * Migrate collection
 */
async function migrateCollection(collectionName, imageField = 'image') {
    console.log(`\n🔄 Migrating collection: ${collectionName}`);

    const records = await pb.collection(collectionName).getFullList();
    console.log(`Found ${records.length} records`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const record of records) {
        const imageUrl = record[imageField];

        if (!imageUrl) {
            skipped++;
            continue;
        }

        const newUrl = await processImage(imageUrl, record.id);

        if (newUrl && newUrl !== imageUrl) {
            // Update record
            await pb.collection(collectionName).update(record.id, {
                [imageField]: newUrl
            });
            migrated++;
            console.log(`  ✅ Updated record ${record.id}`);
        } else if (!newUrl) {
            failed++;
        } else {
            skipped++;
        }
    }

    console.log(`\n📊 ${collectionName} Summary:`);
    console.log(`  ✅ Migrated: ${migrated}`);
    console.log(`  ⏭️  Skipped: ${skipped}`);
    console.log(`  ❌ Failed: ${failed}`);
}

// Main migration
console.log('🚀 Starting image migration to imgbb (WebP)\n');

await migrateCollection('specializations', 'image');
await migrateCollection('posts', 'image');

// Check if settings collection exists and has logo field
try {
    const settings = await pb.collection('settings').getFirstListItem('');
    if (settings.logo) {
        await migrateCollection('settings', 'logo');
    }
} catch (e) {
    console.log('⏭️  No settings collection or logo field');
}

console.log('\n✅ Migration complete!');
