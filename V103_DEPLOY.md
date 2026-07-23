# v1.0.3 Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- PostgreSQL database running
- Node.js 18+
- Git

### Step 1: Configure Environment

**Backend `.env`**
```bash
cd backend
cp .env.example .env
```

Edit `.env` with:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/studyhub_dev
JWT_SECRET=$(openssl rand -base64 32)
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend `.env.development.local`**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Initialize Database

```bash
cd backend
npm install

# Create schema
node -e "
const fs = require('fs');
const pg = require('pg');
require('dotenv').config();

const client = new pg.Client(process.env.DATABASE_URL);
client.connect().then(() => {
  const schema = fs.readFileSync('./sql/schema.sql', 'utf8');
  return client.query(schema);
}).then(() => {
  console.log('Database schema created');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
"
```

### Step 3: Seed Demo Data

```bash
node scripts/seed-demo.js
```

Output:
```
Demo Credentials:
Email: demo@studyhub.local
Password: demo123456
Room Invite Code: DEMO2024
```

### Step 4: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Listening on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Available at http://localhost:3000
```

### Step 5: Test Login

1. Visit http://localhost:3000
2. Click "Login"
3. Enter:
   - Email: `demo@studyhub.local`
   - Password: `demo123456`
4. You should see the dashboard with demo room and notes

## API Testing

### Using cURL

Get demo user's notes:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/notes
```

Create a note:
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Note",
    "content": "Note content here",
    "tags": ["learning", "study"]
  }'
```

### Using Postman

1. Create collection: `StudyHub API`
2. Add environment variable: `baseUrl` = `http://localhost:5000`
3. Add auth variable: `token` from login response
4. Import endpoints from API documentation

## Production Deployment

### Vercel Frontend

```bash
# Connect repo and deploy
vercel --prod

# Set environment:
# VITE_API_URL=https://your-api-domain.com/api
```

### Backend (Railway, Render, Fly.io, etc.)

```bash
# Set environment variables
DATABASE_URL=postgresql://...
JWT_SECRET=<generate-new>
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
PORT=3000

# Deploy
npm run build
npm start
```

## Troubleshooting

### "Connection refused to database"
- Verify PostgreSQL is running: `psql -U postgres -h localhost`
- Check DATABASE_URL in `.env`
- Ensure schema is created: `node scripts/init-db.js`

### "Failed to create quiz/note"
- Check JWT token expiry
- Verify user_id is in JWT payload
- Ensure room membership exists if using roomId

### "Room not found" on join
- Verify room exists: `SELECT * FROM rooms WHERE invite_code = 'DEMO2024'`
- Check room_id is valid UUID
- Ensure user is room member

### Frontend shows "Loading..." forever
- Check CORS_ORIGIN matches frontend URL
- Verify API_URL environment variable
- Check browser console for API errors

## Database Maintenance

### Backup Demo Database
```bash
pg_dump postgresql://user:password@localhost:5432/studyhub_dev > backup.sql
```

### Restore from Backup
```bash
psql postgresql://user:password@localhost:5432/studyhub_dev < backup.sql
```

### Clean Demo Data
```bash
# Delete demo user (cascades to notes/quizzes)
DELETE FROM users WHERE email = 'demo@studyhub.local';

# Or run seed again (creates new demo data)
node scripts/seed-demo.js
```

## Monitoring

### Check API Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

### Database Query Performance
```sql
-- Slow queries
SELECT * FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;

-- Check indexes
SELECT * FROM pg_indexes 
WHERE schemaname = 'public';
```

## Support

For deployment issues:
1. Check error logs: `journalctl -u studyhub-api`
2. Review browser console (frontend)
3. Check database connectivity
4. Verify all environment variables set
5. Run healthcheck endpoint

---

**Last Updated:** v1.0.3
**Status:** Production Ready
