# System Patterns

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                       │
│                (DNS, SSL, Caching, WAF)                 │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   Nginx Reverse Proxy                    │
│                    (Port 80/443)                         │
│  ┌─────────────────────┬───────────────────────────┐    │
│  │ Route: /_/, /api/*  │  Route: Everything else   │    │
│  │      → :8090        │         → :4321           │    │
│  └─────────────────────┴───────────────────────────┘    │
└────────────────────────┬────────────────────────────────┘
                    ↓              ↓
┌──────────────────────┐  ┌─────────────────────────────┐
│     PocketBase       │  │      Astro SSR Server       │
│    (Port 8090)       │  │       (Port 4321)           │
│  ┌────────────────┐  │  │  ┌───────────────────────┐  │
│  │ REST API       │  │  │  │ Page Rendering        │  │
│  │ Admin UI (/_/) │  │  │  │ Image Optimization    │  │
│  │ File Storage   │  │  │  │ Static Asset Serving  │  │
│  │ Authentication │  │  │  └───────────────────────┘  │
│  └───────┬────────┘  │  │             ↓               │
│          ↓           │  │  Fetches data from PB API   │
│  ┌────────────────┐  │  └─────────────────────────────┘
│  │ SQLite DB      │  │
│  │ (pb_data/)     │  │
│  └────────────────┘  │
└──────────────────────┘
```

## Key Design Decisions

### 1. SSR over Static (January 2026)
**Decision**: Switched from `output: 'static'` to `output: 'server'`

**Rationale**: 
- Static build required rebuild for new content
- Admin added posts but visitors saw stale data
- SSR fetches fresh data from PocketBase on every request

**Trade-offs**:
- Slightly slower initial response (Node.js processing)
- Requires Node.js on server (previously just static files)

### 2. Dual Service Architecture
**Decision**: Separate systemd services for PocketBase and Astro

**Rationale**:
- Independent restart/monitoring
- Clear separation of concerns
- PocketBase can run even if Astro fails

**Implementation**:
```
fztezgiacem-pocketbase.service → ./pocketbase serve :8090
fztezgiacem-astro.service      → node dist/server/entry.mjs :4321
```

### 3. PocketBase as Backend
**Decision**: Use PocketBase instead of traditional CMS or custom API

**Rationale**:
- Single binary, no dependencies
- Built-in admin UI for emergencies
- SQLite = simple backups
- JS hooks for custom logic

**Collections**:
- `posts` - Blog articles
- `site_settings` - Global configuration
- `specializations` - Service areas

### 4. React for Admin Only
**Decision**: Use React components only in admin panel

**Rationale**:
- Astro handles public pages (faster, no JS by default)
- Admin needs interactivity (Tiptap editor, forms)
- Minimizes client-side JS bundle for visitors

## Component Relationships

```
BaseLayout.astro
├── Header (navigation, mobile menu)
├── [Page Content]
│   ├── index.astro (homepage)
│   ├── blog/index.astro (blog list)
│   ├── blog/[slug].astro (post detail)
│   └── admin/* (React components)
└── Footer (contact, links)

Admin Panel (React)
├── AdminLayout.tsx
├── TiptapEditor.tsx (rich text)
├── ImageCropper.tsx (image handling)
└── Forms (post create/edit)
```

## Critical Implementation Paths

### Blog Post Creation Flow
```
1. Admin: Fill form → TiptapEditor content
2. Image: Upload → crop → imgbb/PocketBase
3. Submit: POST /api/collections/posts/records
4. Result: PocketBase saves to SQLite
5. Public: SSR fetches fresh list on page load
```

### Image Optimization Pipeline
```
1. Upload: User selects image
2. Crop: react-easy-crop (client-side)
3. Upload: Send to PocketBase or imgbb
4. Request: Visitor requests page
5. Optimize: Sharp converts to WebP
6. Cache: Nginx caches static assets
```

### Authentication Pattern
```
Admin Routes:
1. Check PocketBase auth cookie
2. If missing → redirect to /admin/login
3. If valid → render admin page
4. API calls include auth token
```

## Error Handling Patterns

### Frontend
- Try-catch around PocketBase calls
- Fallback content if API fails
- Console logging for debugging

### Backend (PocketBase Hooks)
- Custom validators in pb_hooks/
- Error responses with meaningful messages

### Deployment
- Systemd auto-restart on failure
- Nginx health checks

## Performance Patterns

### Caching Strategy
```nginx
# Static assets: aggressive caching
location ~* \.(jpg|css|js|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# SSR pages: no caching (fresh data)
location / {
    add_header Cache-Control "no-cache";
}
```

### Image Optimization
- Astro `<Image>` component for automatic optimization
- Sharp library for WebP conversion
- Lazy loading for below-fold images
