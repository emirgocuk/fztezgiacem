import 'dotenv/config';
import sharp from 'sharp';
import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';

const IMGBB_API_KEY = process.env.PUBLIC_IMGBB_API_KEY;

/**
 * Upload image file to imgbb as WebP
 * @param {string} filePath - Path to image file
 * @param {string} filename - Original filename for reference
 * @returns {Promise<string>} imgbb URL
 */
export async function uploadImageToImgbb(filePath, filename = 'image.webp') {
    try {
        // Convert to WebP
        const webpBuffer = await sharp(filePath)
            .webp({ quality: 85 })
            .toBuffer();

        // Encode to base64
        const base64Image = webpBuffer.toString('base64');

        // Upload to imgbb
        const formData = new FormData();
        formData.append('image', base64Image);
        formData.append('name', filename.replace(/\.[^.]+$/, '.webp'));

        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            formData,
            {
                headers: formData.getHeaders()
            }
        );

        if (response.data.success) {
            console.log(`✅ Uploaded to imgbb: ${response.data.data.url}`);
            return response.data.data.url;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('❌ Imgbb upload error:', error.message);
        throw error;
    }
}

/**
 * Helper: Upload from buffer instead of file
 */
export async function uploadBufferToImgbb(buffer, filename = 'image.webp') {
    try {
        const webpBuffer = await sharp(buffer)
            .webp({ quality: 85 })
            .toBuffer();

        const base64Image = webpBuffer.toString('base64');

        const formData = new FormData();
        formData.append('image', base64Image);
        formData.append('name', filename.replace(/\.[^.]+$/, '.webp'));

        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            formData,
            {
                headers: formData.getHeaders()
            }
        );

        if (response.data.success) {
            return response.data.data.url;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Imgbb upload error:', error.message);
        throw error;
    }
}
