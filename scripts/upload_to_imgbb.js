
import fs from 'fs';
import path from 'path';

// 1. Read .env manually
const envPath = path.resolve(process.cwd(), '.env');
let apiKey = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/PUBLIC_IMGBB_API_KEY=(.+)/);
    if (match) {
        apiKey = match[1].trim().replace(/^["']|["']$/g, '');
    }
}

if (!apiKey) {
    console.error("API Key not found in .env");
    process.exit(1);
}

const images = [
    'blog_brachial_plexus_1766441445460.png',
    'blog_premature_development_1766441472046.png',
    'blog_risky_infant_1766441458862.png',
    'blog_spina_bifida_1766441490671.png',
    'blog_torticollis_therapy_1766441428561.png'
];

async function upload(filename) {
    const filePath = path.join(process.cwd(), 'public', filename);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');

    const formData = new FormData();
    formData.append("image", base64Image);

    try {
        console.log(`Uploading ${filename}...`);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });
        const json = await res.json();
        if (json.success) {
            return { filename, url: json.data.url };
        } else {
            console.error(`Failed to upload ${filename}:`, json.error);
            return null;
        }
    } catch (e) {
        console.error(`Error uploading ${filename}:`, e);
        return null;
    }
}

(async () => {
    const results = {};
    for (const img of images) {
        const res = await upload(img);
        if (res) {
            results[res.filename] = res.url;
        }
    }
    console.log("UPLOAD_RESULTS:", JSON.stringify(results));
    fs.writeFileSync('upload_results.json', JSON.stringify(results, null, 2));
})();
