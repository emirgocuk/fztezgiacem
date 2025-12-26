import PocketBase from 'pocketbase';

// Singleton PocketBase instance
// Logic: 
// - If Server-Side (SSR): Use direct local address (fastest, reliable internal network)
// - If Client-Side (Browser): Use relative URL "/" (Proxied by Vite/Ngrok automatically)
const isServer = typeof window === 'undefined';
const DEFAULT_URL = isServer ? 'http://127.0.0.1:8090' : '/';

const PB_URL = import.meta.env.PUBLIC_POCKETBASE_URL || DEFAULT_URL;
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
}

// Helper to get image URL
export function getPbImageURL(collectionId: string, recordId: string, fileName: string) {
  if (fileName.startsWith('http')) {
    return fileName;
  }
  return `${PB_URL}/api/files/${collectionId}/${recordId}/${fileName}`;
}
