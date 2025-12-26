// @ts-check 

import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['.ngrok-free.app'],
      proxy: {
        '/api': 'http://127.0.0.1:8090',
        '/_/': 'http://127.0.0.1:8090',
      }
    }
  },

  integrations: [react(), sitemap()],
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: 'fizyoterapist-demo.com' },
    ],
    domains: ['i.ibb.co', '127.0.0.1'],
  },
  site: 'https://fizyoterapist-demo.com',
  output: 'static',
  prefetch: true,
  devToolbar: {
    enabled: false
  }
});