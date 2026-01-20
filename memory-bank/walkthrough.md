# Deployment Walkthrough - Jan 20, 2026

## Overview
Successful transition to Server-Side Rendering (SSR) and resolution of critical mobile and routing issues.

## 🚀 Key Changes

### 1. SSR Migration
- **Problem**: New blog posts weren't visible without a full site rebuild.
- **Solution**: Migrated from `output: 'static'` to `output: 'server'` using `@astrojs/node`.
- **Result**: Content updates are now instant.

### 2. iPhone/Mobile Flickering Fix
- **Problem**: `animate-blob` and heavy `backdrop-blur` caused flickering on iOS Safari.
- **Solution**: Added CSS media query to disable these effects on screens < 768px.
- **Result**: Smooth scrolling on mobile devices.

### 3. Blog Routing Fix
- **Problem**: Blog posts returned 404 errors.
- **Cause**: `getStaticPaths` was being used in SSR mode.
- **Solution**: Switched to dynamic routing using `Astro.params.slug`.

### 4. View Counter Fix
- **Problem**: Counter didn't increment (Client-side script tried to hit `127.0.0.1:8090`).
- **Solution**: Updated script to use relative URL `/` which Nginx proxies correctly.
- **Verification**: Confirmed count increments (1 -> 2) on page reload.

## ✅ Verification Results

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage | 🟢 Working | Mobile animations disabled |
| Blog List | 🟢 Working | Shows correct post count |
| Blog Detail| 🟢 Working | No 404s |
| Images | 🟢 Working | `sharp` confirmed working |
| View Count | 🟢 Working | Updates dynamically |

## Next Steps
- Implement Email Marketing System (Quiz + Lead Magnet)
