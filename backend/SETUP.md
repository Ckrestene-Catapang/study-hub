# StudyHub Backend - Setup Guide

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### Local Development

#### 1. Database Setup

```bash
# Create database
createdb studyhub_dev

# Initialize schema
psql studyhub_dev < backend/sql/schema.sql
```

#### 2. Environment Configuration

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

```
DATABASE_URL=postgresql://user:password@localhost:5432/studyhub_dev
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

#### 3. Install Dependencies

```bash
cd backend
npm install
```

#### 4. Start Server

```bash
npm run dev
```

Server running at: `http://localhost:5000`

#### 5. Test Connection

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## Frontend Configuration

### Update Frontend Environment

Create `.env` in frontend root:

```
VITE_API_URL=http://localhost:5000/api
```

The frontend will now connect to your local backend.

---

## Deployment to Vercel

### Option 1: Monorepo with Frontend

#### 1. Project Structure

```
studyhub/
├── src/                    # Frontend (React/Vite)
├── backend/                # Backend (Express/Node)
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── package.json
└── vercel.json
```

#### 2. Root package.json

```json
{
  "private": true,
  "workspaces": [".", "backend"]
}
```

#### 3. vercel.json (Root)

```json
{
  "version": 2,
  "projects": [
    {
      "src": "backend",
      "use": "@vercel/node"
    }
  ]
}
```

#### 4. backend/vercel.json

```json
{
  "version": 2,
  "buildCommand": "npm install",
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": {
      "value": "production"
    }
  }
}
```

#### 5. Environment Variables on Vercel

Go to project settings and add:

```
DATABASE_URL=postgresql://user:password@neon.tech/studyhub_prod
JWT_SECRET=<generate-random-secret>
JWT_EXPIRY=7d
CORS_ORIGIN=https://yourdomain.com
```

#### 6. Deploy

```bash
vercel deploy --prod
```

---

### Option 2: Separate Backend Deployment

If deploying backend separately:

#### Using Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

#### Using Render

1. Push backend folder to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy

---

## Neon PostgreSQL Setup

### Create Database

1. Go to https://console.neon.tech
2. Create project
3. Copy connection string to `DATABASE_URL`

```bash
# Update .env
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/studyhub
```

### Schema Initialization

```bash
# Connect to Neon and run schema
psql "postgresql://user:password@ep-xxxxx.neon.tech/studyhub" < backend/sql/schema.sql
```

---

## API Testing

### Using Postman

1. Import collection: `backend/postman_collection.json`
2. Set variables:
   - `base_url`: http://localhost:5000
   - `token`: (Auto-set after login)
3. Run requests

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }'

# Login
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.data.token')

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Monitoring & Logs

### Local Development

Logs are printed to console:

```
[SERVER] Running on http://localhost:5000
[DB] Executed query in 45ms
[API Error] 401: Invalid token
```

### Production (Vercel)

View logs:

```bash
vercel logs
```

Or through Vercel dashboard: Settings → Deployments → Logs

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### Database Connection Failed

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check credentials
echo $DATABASE_URL
```

### JWT Secret Issues

```bash
# Generate new secret
openssl rand -base64 32
```

### CORS Errors

Check that:
- Backend `CORS_ORIGIN` matches frontend URL
- Frontend `VITE_API_URL` is correct
- API calls include proper headers

---

## Performance Tuning

### Database

```sql
-- Create indexes for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

### Node.js

```bash
# Enable cluster mode (fork multiple processes)
# Edit src/index.js to use cluster module

# Or use PM2
npm install -g pm2
pm2 start src/index.js -i max
pm2 save
```

### Caching

Add Redis for:
- Session management
- Rate limiting
- User profile caching

---

## Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Use HTTPS in production
- [ ] Enable CORS only for known origins
- [ ] Keep dependencies updated: `npm audit fix`
- [ ] Use environment variables for secrets
- [ ] Enable database SSL connections
- [ ] Set up rate limiting
- [ ] Add request logging
- [ ] Enable database backups
- [ ] Set up alerting for errors

---

## Next Steps

1. **Run tests**: `npm test`
2. **Read Module 1 docs**: `docs/MODULE_1_AUTHENTICATION.md`
3. **Implement Module 2**: Room System
4. **Set up CI/CD**: GitHub Actions or similar
5. **Add monitoring**: Sentry or similar

---

## Support

For issues:

1. Check logs: `npm run dev` or `vercel logs`
2. Review MODULE_1_AUTHENTICATION.md troubleshooting section
3. Check database connection
4. Verify environment variables

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0
