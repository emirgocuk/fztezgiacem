// @ts-check 

import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';


import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321,
    allowedHosts: [
      '.ngrok-free.app',
      'fztezgiacem.com',
      'www.fztezgiacem.com',
      '45.155.19.221'
    ]
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': process.env.INTERNAL_POCKETBASE_URL || 'http://127.0.0.1:8090',
        '/_/': process.env.INTERNAL_POCKETBASE_URL || 'http://127.0.0.1:8090',
      }
    }
  },

  integrations: [react(), sitemap()],
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'fizyoterapist-demo.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.freepik.com' },
    ],
    domains: ['i.ibb.co', '127.0.0.1', 'localhost', 'images.unsplash.com', 'img.freepik.com'],
  },
  site: 'https://fztezgiacem.com',
  output: 'static',
  prefetch: true,
  devToolbar: {
    enabled: false
  }
});