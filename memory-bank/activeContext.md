# Active Context

> **Last Updated**: January 20, 2026

## Current Work Focus

### Just Completed: SSR Migration ✅
The site was converted from static generation to Server-Side Rendering to fix a critical caching issue where new blog posts weren't visible until page refresh.

**Changes Made**:
1. `astro.config.mjs` → `output: 'server'` + `@astrojs/node` adapter
2. `start.sh` → Runs both PocketBase (8090) and Astro (4321)
3. `nginx_site.conf` → Routes to appropriate service
4. `deploy.ps1` → Updated for SSR build structure
5. Server → Installed npm dependencies + sharp

**Result**: Blog shows **13 posts** correctly. New posts appear instantly without rebuild.

## Recent Changes

| Date | Change | Impact |
|------|--------|--------|
| Jan 20, 2026 | **View Counter Fix** | Fixed client-side URL for counting views |
| Jan 20, 2026 | **Blog 404 Fix** | SSR dynamic routing for blog posts |
| Jan 20, 2026 | **Mobile Perf Fix** | Disabled blob animations on iPhone to stop flickering |
| Jan 20, 2026 | SSR migration | Fresh data on every request |
| Jan 2, 2026 | WebP image conversion | Faster page loads |
| Dec 30, 2025 | Mobile layout optimization | Better PageSpeed scores |
| Dec 29, 2025 | Email display fixes | Plain text emails (not obfuscated) |

## Next Steps (Priority Order)

### Immediate (This Week)
1. **Email Integration** - Cloudflare email routing + Brevo for contact form
2. **Fix YAPILACAKLAR.md** - Has git merge conflicts, needs cleanup

### Short Term (This Month)
3. **PWA Support** - Service worker, installable app
4. **Contact Form** - Store submissions in PocketBase
5. **Docker Setup** - Containerization for easier deployment

### Medium Term (Next Quarter)
6. **Backup System** - Automated daily backups to cloud
7. **Interactive Quiz** - Child development assessment tool
8. **Google Reviews Widget** - Display Google Business reviews
9. **Calendly Integration** - Appointment scheduling

## Active Decisions & Considerations

### Email Configuration
- **Cloudflare Email Routing**: Forward `info@fztezgiacem.com` to personal email
- **Brevo (formerly Sendinblue)**: Send transactional emails from contact form
- **Consideration**: SMTP credentials need secure storage

### Docker vs Current Setup
- Current: Direct systemd services, works well
- Docker: More portable, easier to replicate
- Decision pending: Evaluate if complexity is worth it

## Important Patterns & Preferences

### Code Style
- TypeScript for type safety
- Astro components for public pages
- React only for admin interactivity
- Tailwind for styling (no custom CSS utilities)

### Deployment Preference
- Always test locally first
- Use `deploy.ps1` from Windows
- verify services after deployment
- Check browser for visual confirmation

### Content Management
- Admin creates posts via `/admin/blog/new`
- Images hosted on PocketBase (or imgbb for external)
- SEO fields: title, description, keywords per post

## Learnings & Project Insights

### SSR Lesson Learned
Static sites are great for performance but problematic when content updates frequently. SSR with PocketBase is the right balance - data is always fresh, and performance is still good.

### Sharp Dependency
When running Node.js SSR on server, `sharp` must be installed in production `node_modules`, not just dev dependencies. The `/_image` endpoint uses it for WebP conversion.

### Windows Line Endings
Always be careful with bash scripts created on Windows. Use `sed -i 's/\r$//' script.sh` on Linux to fix CRLF issues.

### Password in Deploy Scripts
The deploy process requires SSH password multiple times due to scp + ssh calls. Consider SSH key-based auth for smoother deployments.
