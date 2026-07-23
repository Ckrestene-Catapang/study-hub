# StudyHub - Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or pnpm

### Setup Frontend

```bash
cd /vercel/share/v0-project
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### Environment Variables

**Frontend (.env.development.local):**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/studyhub_dev
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Initialize Database

```bash
cd backend
npm run db:init  # Runs schema.sql
```

---

## Vercel Deployment

### Frontend to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Phase 2: Room System Complete"
   git push origin new
   ```

2. **Create Pull Request** (if needed)

3. **Deploy with Vercel CLI**
   ```bash
   npm i -g vercel
   vercel
   ```

4. **Configure Environment**
   - Set `VITE_API_URL` to your backend URL

### Backend Deployment Options

#### Option A: Vercel Functions (Recommended for small scale)
1. Create `/api/` folder for API routes
2. Deploy as serverless functions
3. Requires stateless design

#### Option B: Heroku / Railway / Render
1. Create `Procfile`:
   ```
   web: node backend/src/index.js
   ```

2. Deploy backend separately:
   ```bash
   vercel --env NODE_ENV=production
   ```

#### Option C: AWS / Google Cloud / Azure
- Run as standalone Node.js container
- Use managed PostgreSQL (RDS, Cloud SQL, etc)
- Set environment variables in cloud console

### Database for Production

**Recommended:** Supabase (PostgreSQL as a service)
1. Create free account at supabase.com
2. Create new project
3. Get connection string
4. Set `DATABASE_URL` in backend environment

**Alternative:** Neon (PostgreSQL serverless)
1. Create account at neon.tech
2. Create new project
3. Get connection string
4. Set `DATABASE_URL` in backend environment

### Security Checklist

- [ ] Generate strong `JWT_SECRET` (use `openssl rand -base64 32`)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Set proper CORS origin
- [ ] Rotate JWT_SECRET periodically
- [ ] Enable database backups
- [ ] Set up monitoring/logging
- [ ] Rate limiting on API endpoints
- [ ] SQL injection prevention (already using parameterized queries)
- [ ] CSRF protection enabled

### Environment Variables for Production

**Frontend:**
```
VITE_API_URL=https://api.yourdomain.com
```

**Backend:**
```
DATABASE_URL=postgresql://user:securepass@db-host:5432/studyhub
JWT_SECRET=generated-secret-key-min-32-chars
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

---

## Monitoring & Logging

### Backend Logs
```bash
npm run dev:inspect  # Debug mode
```

### Database Monitoring
- Use Supabase dashboard or Neon console
- Monitor connection pool
- Check slow queries
- Set up backup schedules

### Frontend Monitoring
- Use Vercel Analytics
- Monitor Core Web Vitals
- Set up error tracking (Sentry)

---

## Scaling Considerations

### Current Capacity
- Handles ~100 concurrent users
- ~1000 rooms per deployment
- Database connection pool: 20 connections

### For 1000+ Users
1. Implement database read replicas
2. Add Redis caching layer
3. Use CDN for static assets
4. Implement rate limiting
5. Add message queue for async tasks

### For 10000+ Users
1. Separate services architecture
2. Load balancing across multiple backends
3. Database sharding by user ID or room
4. WebSocket server for real-time features
5. Microservices for search, notifications, etc.

---

## Troubleshooting

### Backend won't start
```bash
# Check database connection
psql $DATABASE_URL

# Check port availability
lsof -i :5000

# Check environment variables
env | grep DATABASE_URL
```

### Frontend can't connect to backend
```bash
# Check CORS settings in backend .env
# Check VITE_API_URL in frontend .env
# Ensure backend is running on expected port
curl http://localhost:5000/health
```

### Database errors
```bash
# Check schema was applied
psql $DATABASE_URL -c "\dt"

# Recreate schema if needed
psql $DATABASE_URL < backend/sql/schema.sql
```

---

## Performance Optimization

### Frontend
- [ ] Enable code splitting (already done with lazy routes)
- [ ] Optimize images
- [ ] Enable gzip compression
- [ ] Use CDN for assets
- [ ] Enable browser caching headers

### Backend
- [ ] Enable query result caching with Redis
- [ ] Implement database connection pooling (already done)
- [ ] Add indexes to frequently queried columns (already done)
- [ ] Implement pagination for list endpoints
- [ ] Add request compression middleware

### Database
- [ ] Regular VACUUM and ANALYZE
- [ ] Monitor and optimize slow queries
- [ ] Archive old data if needed
- [ ] Enable WAL archiving for backups

---

## Backup & Recovery

### Database Backups
```bash
# Manual backup
pg_dump $DATABASE_URL > studyhub_backup.sql

# Restore
psql $DATABASE_URL < studyhub_backup.sql

# Using Supabase/Neon (automatic)
# Backups available in dashboard
```

### Code Backups
- Maintained in GitHub (remote backup)
- Use GitHub Actions for CI/CD automation
- Tag releases for version control

---

## Updates & Maintenance

### Applying Schema Changes
1. Create migration files
2. Test on staging environment
3. Apply to production during maintenance window
4. Verify all systems operational

### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update packages carefully
npm update  # patch updates
npm install @package@latest  # major updates (test first!)
```

### Post-Deployment Checklist
- [ ] Run smoke tests
- [ ] Verify all endpoints
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Confirm backups running
- [ ] Test failover procedures

---

## Support & Resources

- **Documentation**: See `/docs/` folder
- **API Docs**: See API endpoints in PHASE2_COMPLETE.md
- **Architecture**: See docs/ARCHITECTURE.md
- **Database Schema**: See docs/DATABASE.md

---

## Phase Roadmap

**Phase 1:** Foundation (COMPLETE)
**Phase 2:** Room System (COMPLETE)
**Phase 3:** Notes System (Ready)
**Phase 4:** Flashcard System (Ready)
**Phase 5:** Quiz System (Ready)
**Phase 6:** AI Tutor & Real-time Chat (Planned)

Each phase is deployable independently with proper environment setup.

---

## Questions?

Refer to:
- `docs/DEVELOPMENT.md` for local setup
- `docs/ARCHITECTURE.md` for system design
- Backend route definitions in `/backend/src/routes/`
- Frontend component patterns in `/src/components/`
