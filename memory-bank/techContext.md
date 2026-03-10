# Technical Context

## Technology Stack

### Frontend Framework
- **Astro 5.x** - Web framework for content-driven sites
  - Mode: `server` (SSR)
  - Adapter: `@astrojs/node`
- **React 19** - For interactive components (admin panel, sensory quiz)
- **TailwindCSS 4** - Utility-first styling

### Backend/Database
- **PocketBase** - Lightweight backend with SQLite
  - Version: latest stable
  - API Domain: `pb.fztezgiacem.com`
  - Internal Port: `127.0.0.1:8090`

### Hosting & Infrastructure
- **VPS**: Single Ubuntu server (45.155.19.221)
- **Nginx**: Reverse proxy and SSL termination (Let's Encrypt)
- **Cloudflare**: DNS, CDN, and Security
- **Systemd**: Service management for Astro and PocketBase

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
# Client-side
PUBLIC_POCKETBASE_URL=https://pb.fztezgiacem.com

# Server-side
INTERNAL_POCKETBASE_URL=http://127.0.0.1:8090
```

### Key Directories
```
/src
  /pages           # Astro pages (.astro files)
    /admin         # Admin panel (React-heavy)
    /blog          # Blog listing and dynamic posts
    /quiz          # Sensory Profile Quiz
  /components      # Reusable UI components
  /lib             # Utilities (pocketbase connection, state)
/scripts           # Deployment and maintenance scripts
  /server-maintenance # Diagnostic and fix utilities
/dist
  /client          # Prerendered assets
  /server          # Node entry for production execution
/pb_data           # PocketBase data and backups
```

## Deployment Architecture

### Server Setup (Production)
```
          [User Browser]
               ↓
        [Cloudflare CDN]
               ↓
    [Nginx Reverse Proxy :443]
      ↙                  ↘
[pb. subdomain]     [Main Domain]
      ↓                  ↓
[PocketBase :8090]  [Astro SSR :4321]
      ↓                  ↑
 [SQLite DB] ←←←←←←←←← [API Calls]
```

### Systemd Services
```bash
fztezgiacem.service          # PocketBase (listening on loopback)
fztezgiacem-astro.service    # Astro SSR application
```

### Deployment Workflow
```powershell
# From Windows:
npm run build
node scripts/deploy_dist.js    # Bundles, uploads, and restarts SSR
```

## Technical Constraints

### Performance Requirements
- Dynamic data delivery (no stale blog posts)
- Runtime image optimization (Sharp)
- Mobile-first responsiveness and WebP support

### Security Considerations
- PocketBase only accessible via Nginx proxy (no direct ports)
- Admin authentication required for sensitive collections
- Secure SMTP for contact forms (Cloudflare/Brevo)

## Dependencies (Key)

### Production
- `astro`, `@astrojs/node`, `@astrojs/react`
- `pocketbase` - SDK
- `sharp` - **Critical runtime dependency** for images
- `react`, `react-dom`
- `framer-motion` - For quiz animations

### Maintenance & DevOps
- `ssh2` - For automated remote deployment
- `node-archive` (tar) - For bundling builds

## Tool Usage Patterns

### Maintaining the Server
Diagnostic scripts are located in `scripts/server-maintenance`. These include:
- `nuke_final.mjs`: Forcefully kills port blockers and restarts all services.
- `diag_ports.mjs`: Lists active processes on ports 80/443.
- `check_images.mjs`: Scans the live site for 404/500 image errors.
