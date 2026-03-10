import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindv4 from '@tailwindcss/vite';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    react(),
    sitemap(),
  ],
  site: 'https://fztezgiacem.com',
  vite: {
    plugins: [tailwindv4()],
    ssr: {
      noExternal: ['pocketbase', 'framer-motion', 'react-toastify'],
    },
  },
});
