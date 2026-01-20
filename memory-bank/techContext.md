# Technical Context

## Technology Stack

### Frontend Framework
- **Astro 5.x** - Static site generator with SSR support
- **React 19** - For interactive components (admin panel, editor)
- **TailwindCSS 4** - Utility-first styling

### Backend/Database
- **PocketBase** - Lightweight backend with SQLite
  - Collections: `posts`, `site_settings`, `specializations`
  - REST API at `/_/` and `/api/`
  - Built-in admin panel at `/_/`

### Hosting & Infrastructure
- **VPS**: Single Ubuntu server (45.155.19.221)
- **Nginx**: Reverse proxy, SSL termination
- **Cloudflare**: DNS, CDN, DDoS protection
- **Let's Encrypt**: SSL certificates (auto-renewed via Certbot)
- **Systemd**: Service management

## Development Setup

### Local Development
```bash
# Start dev server
npm run dev           # Astro dev on :4321
./pocketbase serve    # PocketBase on :8090

# Build for production
npm run build         # Creates dist/client & dist/server
```

### Environment Variables
```env
PUBLIC_POCKETBASE_URL=/    # Client-side (proxied)
# Server uses http://127.0.0.1:8090 directly
```

### Key Directories
```
/src
  /pages           # Astro pages (.astro files)
    /admin         # Admin panel pages
    /blog          # Blog listing and posts
  /components      # Reusable components
  /layouts         # Page layouts (BaseLayout)
  /lib             # Utilities (pocketbase.ts, imgbb.ts)
/dist
  /client          # Static assets (CSS, JS, images)
  /server          # Node.js SSR server (entry.mjs)
/pb_data           # PocketBase data (SQLite, uploads)
/pb_hooks          # PocketBase JS hooks
/pb_migrations     # Database migrations
```

## Deployment Architecture

### Server Setup (Production)
```
        [Cloudflare CDN]
              ↓
    [Nginx :80/:443]
         ↓        ↓
[Astro SSR :4321] [PocketBase :8090]
                        ↓
                 [pb_data/SQLite]
```

### Systemd Services
```bash
# Two separate services:
fztezgiacem-pocketbase.service  # API + Admin
fztezgiacem-astro.service       # SSR Web Server
```

### Deployment Commands
```powershell
# From Windows:
npm run build
.\deploy.ps1    # Uploads to server, restarts services
```

## Technical Constraints

### Performance Requirements
- Mobile PageSpeed > 90
- First Contentful Paint < 2s
- Images auto-converted to WebP

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-first responsive design

### Security Considerations
- Admin behind PocketBase authentication
- HTTPS enforced via Cloudflare
- Security headers in Nginx

## Dependencies (Key)

### Production
- `astro` - Core framework
- `@astrojs/node` - SSR adapter
- `@astrojs/react` - React integration
- `pocketbase` - Backend SDK
- `sharp` - Image optimization
- `@tiptap/*` - Rich text editor

### Dev Only
- `playwright` - E2E testing
- `ssh2` - Deployment scripting

## Tool Usage Patterns

### Adding a Blog Post
1. Admin → `/admin/blog/new`
2. Fill form with Tiptap editor
3. Upload image (stored in PocketBase)
4. Submit → PocketBase record created
5. SSR fetches fresh data on next request

### Modifying Site Settings
1. Admin → `/admin/settings`
2. Update site name, description, social links
3. Submit → Stored in `site_settings` collection

### Image Handling
1. Upload via admin panel
2. Sharp optimizes server-side
3. Astro Image component serves WebP
