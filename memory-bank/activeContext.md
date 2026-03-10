# Active Context

> **Last Updated**: March 11, 2026 (Modernization & SSR Update)

## Current Work Focus

### Just Completed: Full Dynamic Migration & Sensory Quiz ✅
The project has successfully transitioned to a robust SSR architecture and integrated a complex medical assessment tool.

**Key Achievements**:
1. **Full SSR Deployment**: Solved global caching issues (especially on iOS) by switching to `@astrojs/node` output.
2. **Architecture Refactor**: Separated the API layer into a dedicated `pb.fztezgiacem.com` subdomain, resolving persistent port conflicts between PocketBase and Nginx.
3. **Sensory Profile Quiz**: Implemented a 38-question assessment with logic-based scoring (Typical vs. Definite Difference) and visual result categories.
4. **Image Service Fix**: Restored broken images by installing `sharp` runtime dependencies on the production VPS.
5. **Project Organization**: Moved various diagnostic and maintenance utilities into `scripts/server-maintenance/` to clean the root directory.

## Recent Changes

| Date | Change | Impact |
|------|--------|--------|
| Mar 10, 2026 | **Sharp Fix** | Restored image optimization on production |
| Mar 10, 2026 | **Admin API URL Fix** | Admin panel correctly fetches data from `pb.fztezgiacem.com` |
| Mar 10, 2026 | **Nginx Subdomain Split** | Eliminated IPv6 and port-binding conflicts with PocketBase |
| Mar 10, 2026 | **Sensory Quiz Launch** | Added /quiz with 38-question medical assessment |
| Mar 10, 2026 | **SSR Infrastructure** | Site moved from Static to Server-Side Rendering |

## Next Steps (Priority Order)

### Immediate (Priority 1)
1. **YAPILACAKLAR.md Resolution**: Fix the merge conflicts in the local task tracking file.
2. **Maintenance Documentation**: Add a `README` to `scripts/server-maintenance` explaining the usage of `nuke_final.mjs` and other tools.

### Short Term (Priority 2)
1. **Email Routing**: Setup info@ address on Cloudflare.
2. **Transactional Email**: Integrate Brevo for the contact form.
3. **Automated Backups**: Create a cron job for PocketBase `pb_data` archiving.

## Active Decisions & Considerations

### Proxying vs. Subdomains
We moved from path-based proxying (`/api`) to subdomain-based proxying (`pb.`). 
- **Reason**: Simplifies Nginx configuration and allows PocketBase to handle its own admin interface without interfering with Astro's routing.
- **Outcome**: Improved stability and easier SSL management via a single wildcard or multi-domain cert.

### Runtime Optimization
Astro `<Image>` components now rely on `sharp` at runtime.
- **Constraint**: `sharp` must be included in the production `npm install` on the server. The `deploy_dist.js` script now ensures the environment is primed for this.

## Important Patterns & Preferences

### Deployment
- **Method**: Local build + SSR bundle upload via `scripts/deploy_dist.js`.
- **Infrastructure**: Always check `fztezgiacem-astro` and `fztezgiacem` services after updates.

### Code Structure
- **React**: Used for the Quiz and Admin Dashboards.
- **Astro**: Used for all SEO-critical landing pages and blog content.
- **Maintenance**: Always use scripts in `scripts/server-maintenance` for remote debugging to avoid manual terminal errors.

## Learnings & Project Insights
- **Port Conflict**: Never allow multiple services to claim ports 80/443. PocketBase's auto-TLS feature is powerful but conflicts with Nginx unless explicitly restricted to `127.0.0.1`.
- **Caching**: iOS Safari's cache is extremely aggressive. Standard Cache-Control headers often aren't enough for static sites; SSR with a `no-cache` header is the most reliable way to ensure fresh medical data/blog updates.
