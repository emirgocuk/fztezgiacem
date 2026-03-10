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
│  │ Domain: pb.         │  Domain: (www.)           │    │
│  │ → localhost:8090    │  → localhost:4321         │    │
│  └─────────────────────┴───────────────────────────┘    │
└────────────────────────┬────────────────────────────────┘
                    ↓              ↓
┌──────────────────────┐  ┌─────────────────────────────┐
│     PocketBase       │  │      Astro SSR Server       │
│    (Port 8090)       │  │       (Port 4321)           │
│  ┌────────────────┐  │  │  ┌───────────────────────┐  │
│  │ REST API       │  │  │  │ Page Rendering        │  │
│  │ Admin UI       │  │  │  │ Image Optimization    │  │
│  │ File Storage   │  │  │  │ (via Sharp at runtime)│  │
│  │ Authentication │  │  │  └───────────────────────┘  │
│  └───────┬────────┘  │  │             ↓               │
│          ↓           │  │  Fetches data from PB API   │
│  ┌────────────────┐  │  │  (via pb subdomain)         │
│  │ SQLite DB      │  │  └─────────────────────────────┘
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
- Fixed aggressive iOS caching issues

**Trade-offs**:
- Requires Node.js and `sharp` on server
- Requires active service monitoring (systemd)

### 2. Dual Service & Subdomain Architecture (March 2026)
**Decision**: Separate systemd services and dedicated subdomains for PocketBase and Astro

**Rationale**:
- Clear separation of concerns (API vs Frontend)
- Solved port conflicts between PocketBase auto-TLS and Nginx
- Frontend talks to `pb.fztezgiacem.com` for data, avoiding path-based proxy complexity

**Implementation**:
```
fztezgiacem.service (PB)        → ./pocketbase serve --http=127.0.0.1:8090
fztezgiacem-astro.service       → node dist/server/entry.mjs
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
- `quiz_questions` - (Optional) Interactive quiz content

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
│   ├── quiz/ (Interactive Sensory Quiz)
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
2. Image: Upload → crop → PocketBase
3. Submit: POST /api/collections/posts/records (to pb.fztezgiacem.com)
4. Result: PocketBase saves to SQLite
5. Public: SSR fetches fresh list on page load
```

### Image Optimization Pipeline
```
1. Upload: User selects image
2. Crop: react-easy-crop (client-side)
3. Upload: Send to PocketBase
4. Request: Visitor requests page
5. Optimize: Sharp (at runtime on server) converts to WebP
6. Serve: Optimized image served from /_image endpoint
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
- Common error messages like "Veriler yüklenirken hata oluştu" for UI state

### Backend (PocketBase)
- Custom validators in pb_hooks/
- API responses with standard HTTP status codes

### Deployment
- Systemd auto-restart on failure (Restart=always)
- Nginx reverse proxy logs for diagnostic traces

## Performance Patterns

### Caching Strategy
```nginx
# Static assets: aggressive caching in dist/client
location /_astro/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# SSR pages: no-cache to ensure fresh data
location / {
    add_header Cache-Control "no-cache, must-revalidate";
}
```

### Image Optimization
- Astro `<Image>` component for automatic optimization
- **Sharp** library installed on VPS for server-side processing
- WebP conversion triggered at runtime for all non-optimized assets
