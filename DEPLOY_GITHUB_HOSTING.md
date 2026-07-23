# StudyHub - GitHub Hosting & Deployment Guide

## 📋 Complete Guide to Deploying with GitHub

This guide covers deploying StudyHub from GitHub to production using various hosting platforms.

**Time Required**: 30-45 minutes  
**Difficulty**: Intermediate  
**Options**: Vercel, Railway, Render, AWS, DigitalOcean

---

## Table of Contents

1. [GitHub Setup](#github-setup)
2. [Deployment Options](#deployment-options)
3. [Vercel (Recommended)](#vercel-recommended)
4. [Railway](#railway)
5. [Render](#render)
6. [CI/CD with GitHub Actions](#cicd-with-github-actions)
7. [Custom Domain](#custom-domain)
8. [Environment Management](#environment-management)

---

## 🔗 GitHub Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `studyhub`
3. Description: "AI-Powered Learning Platform"
4. Visibility: Public (or Private if preferred)
5. DO NOT initialize README (we have one)
6. Click "Create repository"

### Step 2: Push Code to GitHub

In your local project root:

```bash
# Initialize git (if not already)
git init

# Add remote
git remote add origin https://github.com/yourusername/studyhub.git

# Create main branch
git branch -M main

# Stage all files
git add .

# Commit
git commit -m "Initial commit: StudyHub v1.0.1"

# Push to GitHub
git push -u origin main
```

**Verify**: Go to GitHub repo URL, should see your code.

### Step 3: Setup GitHub Secrets

For CI/CD deployments:

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets (values from your `.env`):

```
DATABASE_URL=postgresql://studyhub_user:password@host:5432/studyhub_prod
JWT_SECRET=your-super-secret-key-here
```

---

## 🚀 Deployment Options

### Quick Comparison

| Platform | Frontend | Backend | Database | Cost | Setup Time |
|----------|----------|---------|----------|------|------------|
| **Vercel** | ✅ Free | ✅ Free | Manual | Free-$20 | 5 min |
| **Railway** | ✅ $5/mo | ✅ $5/mo | ✅ $15/mo | $25/mo | 10 min |
| **Render** | ✅ Free | ✅ Free | ✅ $15/mo | $15/mo | 15 min |
| **AWS** | ✅ $0.50 | ✅ Varies | ✅ Varies | $20-50+ | 30 min |
| **DigitalOcean** | ✅ Free | ✅ $4-6/mo | ✅ Included | $4-12/mo | 20 min |

### Recommendation

**For Production**: Railway or Render (all-in-one, simple)  
**For Portfolio**: Vercel + Railway (free tier for frontend)  
**For Learning**: Render (free tier available)

---

## ✅ Vercel (Recommended for Frontend)

Vercel is perfect for React frontend. Backend needs separate hosting.

### Frontend on Vercel

**Step 1**: Connect Repository

1. Go to https://vercel.com
2. Sign up with GitHub (or use existing account)
3. Click "Import Project"
4. Select your `studyhub` repository
5. Choose "Continue"

**Step 2**: Configure

1. **Framework**: Select Vite
2. **Root Directory**: `./` (leave default)
3. **Environment Variables**: Add
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
4. Click "Deploy"

Wait 1-2 minutes. Should see "Deployment successful" ✅

**Step 3**: Custom Domain (Optional)

1. Go to project settings → Domains
2. Add your domain
3. Follow DNS configuration steps
4. Point domain to Vercel

**Result**: Frontend available at `https://studyhub.vercel.app`

---

## 🚂 Railway (Recommended for Backend)

Railway is easiest all-in-one solution.

### Backend + Database on Railway

**Step 1**: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway to access your repos

**Step 2**: Deploy Backend

1. Click "New" → "GitHub Repo"
2. Select `studyhub` repository
3. Select "Node.js" detection
4. Click "Deploy"

**Step 3**: Create PostgreSQL Database

1. Click "+" → "Add Database"
2. Select PostgreSQL
3. Wait for creation
4. Note the connection string

**Step 4**: Configure Environment

1. Go to project settings
2. Add environment variables:
   ```
   DATABASE_URL=<Railway PostgreSQL URL>
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   PORT=3000
   ```

**Step 5**: Add Domain

1. Settings → Domains
2. Add custom domain
3. Configure DNS records

**Result**: Backend and database on Railway

### Railway Environment Variables

Railway automatically provides:
- `DATABASE_URL` - PostgreSQL connection
- `PORT` - Application port

You add:
- `JWT_SECRET` - Your secret key
- `NODE_ENV` - Set to "production"

---

## 🎨 Render (Great Alternative)

Render offers free tier with good features.

### Backend + Database on Render

**Step 1**: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize access

**Step 2**: Create PostgreSQL Database

1. Click "New+" → "PostgreSQL"
2. Name: `studyhub-postgres`
3. Region: Choose closest to you
4. Click "Create Database"
5. Note the internal/external URL

**Step 3**: Deploy Backend Service

1. Click "New+" → "Web Service"
2. Choose "Deploy from GitHub repo"
3. Select `studyhub` repository
4. Configure:
   - Name: `studyhub-backend`
   - Runtime: Node
   - Build: `npm install && npm run build`
   - Start: `npm run start`
   - Region: Same as database

**Step 4**: Add Environment Variables

In Render dashboard:
1. Go to service → Environment
2. Add variables:
   ```
   DATABASE_URL=<PostgreSQL URL from Step 2>
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```

**Step 5**: Deploy

Click "Deploy" and wait 3-5 minutes

**Result**: Full stack on Render

---

## 🔄 CI/CD with GitHub Actions

Automate deployments on every push.

### Create GitHub Actions Workflow

**Step 1**: Create workflow file

In project root:
```
.github/workflows/deploy.yml
```

**Step 2**: Add deployment configuration

```yaml
name: Deploy StudyHub

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      run: npm ci
    
    - name: Build frontend
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
    
    - name: Install backend dependencies
      run: cd backend && npm ci
    
    - name: Run backend linter
      run: cd backend && npm run lint || true

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: vercel/action@master
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Railway
      run: |
        npm install -g railway
        railway up --prod
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### GitHub Secrets for CI/CD

Add to GitHub Settings → Secrets:

```
VERCEL_TOKEN=          # From Vercel account settings
VERCEL_ORG_ID=         # From Vercel project
VERCEL_PROJECT_ID=     # From Vercel project
RAILWAY_TOKEN=         # From Railway account settings
DATABASE_URL=          # Your database URL
JWT_SECRET=            # Your JWT secret
VITE_API_URL=          # Your backend URL
```

### Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Create token
3. Copy and add to GitHub Secrets

### Get Railway Token

1. Go to https://railway.app/account
2. Create API token
3. Copy and add to GitHub Secrets

---

## 🎯 Custom Domain Setup

### With Vercel Frontend

**Step 1**: Get domain

- GoDaddy, Namecheap, Google Domains, etc.
- Cost: ~$10-15/year

**Step 2**: Add to Vercel

1. Vercel dashboard → Project → Settings → Domains
2. Enter your domain
3. Follow Vercel's DNS instructions

**Step 3**: Update DNS at registrar

Follow Vercel's specific instructions for your domain registrar.

**Typical Records**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.20
```

### With Railway Backend

**Step 1**: Add to Railway

1. Railway project → Settings → Domains
2. Enter domain
3. Get Railway DNS value

**Step 2**: Update DNS

Add CNAME record:
```
Type: CNAME
Name: api
Value: <Railway domain>
```

**Result**: 
- Frontend: `https://yourdomain.com`
- Backend: `https://api.yourdomain.com`

---

## 🔐 Environment Management

### Production vs Development

**Development** (`.env`)
```
VITE_API_URL=http://localhost:5000/api
DATABASE_URL=postgresql://user:pass@localhost/studyhub_dev
JWT_SECRET=dev-key-change-in-production
NODE_ENV=development
```

**Production** (Set in hosting platform)
```
VITE_API_URL=https://api.yourdomain.com
DATABASE_URL=<Production PostgreSQL URL>
JWT_SECRET=<Long random string>
NODE_ENV=production
```

### Generate Secure JWT Secret

In terminal:
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Copy output and use as `JWT_SECRET`.

### Protecting Secrets

✅ DO:
- Store in environment variables
- Use GitHub Secrets for CI/CD
- Use platform-specific secret management
- Rotate regularly

❌ DON'T:
- Commit `.env` files
- Share in chat/email
- Use same key for dev and prod
- Push to public repositories

---

## 🧪 Verification Checklist

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] Backend health check responds
- [ ] Database connection works
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] API calls from frontend work
- [ ] Theme toggle works
- [ ] Mobile responsive
- [ ] HTTPS/SSL working
- [ ] Errors logged properly

### Test Commands

```bash
# Frontend
curl https://yourdomain.com/

# Backend
curl https://api.yourdomain.com/api/auth/health

# Database connection
# Check backend logs for errors
```

---

## 🆘 Troubleshooting

### Deployment Fails

1. Check build logs on platform
2. Verify environment variables are set
3. Check database connection string
4. Verify Node.js version compatibility

### Frontend Can't Connect to Backend

1. Check VITE_API_URL in frontend
2. Verify backend is running
3. Check CORS settings on backend
4. Test backend directly: `curl https://api.yoururl.com`

### Database Connection Error

1. Verify DATABASE_URL format
2. Check PostgreSQL is running
3. Verify credentials are correct
4. Check network access rules

### SSL/HTTPS Not Working

1. Wait 24 hours for DNS propagation
2. Check DNS records are correct
3. Try platform's built-in SSL (usually automatic)

---

## 📊 Deployment Workflow

### Full Deployment Process

```
Local Development
    ↓
Commit & Push to GitHub
    ↓
GitHub Actions (CI/CD)
    ↓
Run Tests & Lint
    ↓
Deploy Frontend (Vercel)
    ↓
Deploy Backend (Railway/Render)
    ↓
Verify Production
    ↓
Send Notifications
    ↓
✅ Live!
```

### Manual Deployment

If not using CI/CD:

**Frontend**:
```bash
npm run build
vercel deploy --prod
```

**Backend**:
```bash
cd backend
railway up --prod
# or
git push railway main
```

---

## 🎓 Advanced Topics

### Database Backups

**Railway**: Automatic daily backups included

**Render**: Enable automated backups in settings

**Manual backup**:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Monitoring

**Vercel Analytics**:
- Dashboard → Analytics
- View page performance

**Railway Logs**:
- Dashboard → Deployments → Logs
- View real-time logs

**Error Tracking**:
- Implement Sentry (optional)
- Monitor server errors

### Scaling

**When needed**:
- Upgrade instance size on Railway/Render
- Enable auto-scaling (if available)
- Optimize database queries
- Add caching

---

## 📞 Support Resources

### GitHub Documentation
- Creating repos: https://docs.github.com/en/get-started/quickstart/create-a-repo
- Secrets management: https://docs.github.com/en/actions/security-guides/encrypted-secrets

### Vercel Documentation
- Deployment: https://vercel.com/docs/getting-started-with-next
- Environment variables: https://vercel.com/docs/projects/environment-variables

### Railway Documentation
- Deployment: https://docs.railway.app/deploy/deploying-to-railway
- Databases: https://docs.railway.app/databases/postgresql

### Render Documentation
- Deployment: https://render.com/docs/deploy-node-express-app
- Databases: https://render.com/docs/databases

---

## ✅ Deployment Checklist

Before going live:

- [ ] Code pushed to GitHub
- [ ] Environment variables set on platform
- [ ] Database initialized
- [ ] Frontend builds successfully
- [ ] Backend starts without errors
- [ ] Frontend can connect to backend
- [ ] Registration works
- [ ] Login works
- [ ] Create note works
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Backup plan in place
- [ ] Performance acceptable
- [ ] All team notified

---

## 🚀 AI Prompt for ChatGPT/Claude

If you need AI assistance with deployment:

```
I'm deploying a StudyHub React/Express application using GitHub, 
Vercel (frontend), and Railway (backend).

Frontend: React with Vite, Node.js APIs
Backend: Express.js with PostgreSQL
Database: PostgreSQL

I need help with:
1. [Specific deployment issue]
2. [Environment variable setup]
3. [Custom domain configuration]

Current setup:
- Frontend URL: [your-frontend-url]
- Backend URL: [your-backend-url]
- Database: PostgreSQL on Railway

Error message: [paste error if applicable]

See documentation: github.com/yourusername/studyhub
```

---

## 🎉 Success!

Your StudyHub app is now:
- ✅ Hosted on GitHub
- ✅ Deployed to production
- ✅ Accessible via custom domain
- ✅ Automatically updated on commits
- ✅ Backed up automatically
- ✅ Monitored for errors
- ✅ Ready for users

---

**Last Updated**: July 23, 2026  
**Difficulty**: ⭐⭐ Intermediate (30-45 minutes)  
**Status**: ✅ Production Ready

## Next Steps

1. Choose your deployment platform
2. Follow steps for that platform
3. Test live application
4. Share with users
5. Monitor performance
6. Iterate and improve

For questions: See [START_HERE.md](./START_HERE.md)
