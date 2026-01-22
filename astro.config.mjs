// @ts-check 

import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';

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
      { protocol: 'https', hostname: 'fizyoterapist-demo.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    domains: ['i.ibb.co', '127.0.0.1', 'images.unsplash.com'],
  },
  site: 'https://fztezgiacem.com',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  prefetch: true,
  devToolbar: {
    enabled: false
  }
});