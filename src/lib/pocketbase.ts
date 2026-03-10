import PocketBase from 'pocketbase';

// Singleton PocketBase instance
// Logic: 
// - If Server-Side (SSR): Use direct local address (fastest, reliable internal network)
// - If Client-Side (Browser): Use relative URL "/" (Proxied by Vite/Ngrok automatically)
const isServer = typeof window === 'undefined';

// Docker Environment Logic
// Server (SSR): Needs to talk to 'pocketbase' container directly.
// Client (Browser): Needs to talk to 'localhost:8090' (Host).
const internalURL = isServer ? (process.env.INTERNAL_POCKETBASE_URL || 'http://127.0.0.1:8090') : null;
const publicURL = import.meta.env.PROD
  ? 'https://pb.fztezgiacem.com'
  : (import.meta.env.PUBLIC_POCKETBASE_URL || 'http://localhost:8090');

const PB_URL = internalURL || publicURL;

export const pb = new PocketBase(PB_URL);

// TypeScript Interface for 'posts' collection
export interface Post {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;

  title: string;
  slug: string;
  content: string; // HTML content
  summary: string;
  image: string; // filename
  category: 'Manuel Terapi' | 'DEHB' | 'Egzersiz' | 'Genel';
  published_date: string;
  views: number;
  is_featured?: boolean;
  featured_order?: number;

  // SEO Fields
  seo_title?: string;
  seo_description?: string;
  keywords?: string;
}

// Helper to get image URL
export function getPbImageURL(collectionId: string, recordId: string, fileName: string) {
  if (fileName.startsWith('http')) {
    return fileName;
  }
  // Images are always accessed by the client (browser), so we must use the Public URL.
  // Even if this runs on SSR, the resulting HTML <img src="..."> must point to the public address.
  return `${publicURL}/api/files/${collectionId}/${recordId}/${fileName}`;
}
