# StudyHub v1.0.5 - Deployment Checklist

**Print this out and check off as you go!**

---

## 📋 PRE-DEPLOYMENT TASKS

### Code Fixes (15-30 minutes)

**Fix #1: Password Reset Token Logging** 🔴 CRITICAL
- [ ] Open `backend/src/controllers/authController.js`
- [ ] Find: `console.log(`[AUTH] Password reset token for ${email}: ${resetToken}`)`
- [ ] Delete the line
- [ ] Save file

**Fix #2: Console Debug in useAsync** 🟠 HIGH
- [ ] Open `src/hooks/useAsync.js`
- [ ] Find: `console.debug('[useAsync] Request already in flight, reusing promise')`
- [ ] Delete OR wrap in: `if (process.env.NODE_ENV === 'development') { ... }`
- [ ] Save file

**Fix #3: Debug Log in RoomsPage** 🟠 HIGH
- [ ] Open `src/pages/RoomsPage.jsx`
- [ ] Find: `console.log("[v0] Selected room:", room)`
- [ ] Delete the line
- [ ] Save file

**Fix #4: Email Service** 🔴 CRITICAL
- [ ] Choose one:
  - [ ] **Option A (Fastest):** Disable password reset feature
    - Remove endpoints from `authRoutes.js`
    - Remove UI elements
    - Document as Phase 2
  - [ ] **Option B:** Implement Nodemailer
    - Install: `npm install nodemailer`
    - Create `emailService.js`
    - Update authController
    - Add SMTP to `.env`
  - [ ] **Option C:** Use SendGrid
    - Install: `npm install @sendgrid/mail`
    - Create `emailService.js`
    - Update authController
    - Add API key to `.env`

### Build Verification (10 minutes)

**Backend**
- [ ] Run: `cd backend && npm install` (if added dependencies)
- [ ] Run: `npm start`
- [ ] Verify: "Server running on port 5000" (or similar)
- [ ] Stop: Ctrl+C

**Frontend**
- [ ] Run: `npm run build`
- [ ] Verify: Build completes without errors
- [ ] Run: `npm run dev`
- [ ] Verify: Dev server starts on port 3000
- [ ] Stop: Ctrl+C

### Environment Configuration (15 minutes)

**Generate Secrets**
- [ ] Open terminal
- [ ] Run: `openssl rand -base64 32`
- [ ] Copy the output (this is your JWT_SECRET)

**Create backend/.env**
```
[ ] DATABASE_URL=postgresql://user:pass@host:5432/studyhub
[ ] PORT=5000
[ ] JWT_SECRET=<paste-output-from-above>
[ ] CORS_ORIGIN=https://yourdomain.com
[ ] NODE_ENV=production
[ ] (If using email:)
    [ ] SMTP_SERVICE=gmail (or your service)
    [ ] SMTP_USER=your-email@gmail.com
    [ ] SMTP_PASSWORD=your-app-password
    [ ] SENDGRID_API_KEY=SG.xxxxx (if using SendGrid)
```

**Frontend Environment**
- [ ] Create `.env.production` or update `.env`:
  ```
  [ ] VITE_API_URL=https://api.yourdomain.com/api
  [ ] VITE_APP_NAME=StudyHub
  ```

### Testing (30 minutes)

**Local Testing**
- [ ] Start backend: `npm start` (in backend dir)
- [ ] In another terminal, start frontend: `npm run dev`
- [ ] Open browser to: http://localhost:3000

**Test User Registration**
- [ ] Navigate to signup page
- [ ] Enter: name@example.com / TestPass123 / Name
- [ ] Click: Register
- [ ] Verify: Redirected to login
- [ ] Result: ✅ or ❌

**Test User Login**
- [ ] Enter credentials from registration
- [ ] Click: Login
- [ ] Verify: Logged in dashboard appears
- [ ] Result: ✅ or ❌

**Test Core Features**
- [ ] Create study room: ✅ or ❌
- [ ] Join another room: ✅ or ❌
- [ ] Create note: ✅ or ❌
- [ ] Create flashcard: ✅ or ❌
- [ ] Create quiz: ✅ or ❌

**Test Error Cases**
- [ ] Wrong password login: Shows error ✅ or ❌
- [ ] Missing required fields: Shows error ✅ or ❌
- [ ] Network error handling: Works ✅ or ❌

### Database Setup (Varies by provider)

**Create Production Database**
- [ ] Choose provider: Vercel Postgres / Supabase / AWS RDS / Digital Ocean
- [ ] Create new database
- [ ] Copy connection string
- [ ] Paste into backend/.env as DATABASE_URL
- [ ] Backend will auto-create schema on startup

**Verify Database**
- [ ] Run backend: `npm start`
- [ ] Check logs: "Loading schema..." or similar
- [ ] Verify: 12 tables created
- [ ] Stop backend: Ctrl+C

**Backup Database**
- [ ] Create backup of production database
- [ ] Store securely
- [ ] Document backup location

---

## 🚀 DEPLOYMENT TASKS

### Frontend Deployment

**Option 1: Vercel (Recommended for Vite)**
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Run: `vercel`
- [ ] Follow prompts
- [ ] Set environment variables in Vercel dashboard:
  - [ ] VITE_API_URL = https://api.yourdomain.com/api
- [ ] Deployment complete
- [ ] Test: Visit deployed URL

**Option 2: Netlify**
- [ ] Connect GitHub repo to Netlify
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test: Visit deployed URL

**Option 3: AWS S3 + CloudFront**
- [ ] Build: `npm run build`
- [ ] Create S3 bucket
- [ ] Upload `dist` folder contents
- [ ] Create CloudFront distribution
- [ ] Set custom domain
- [ ] Test: Visit deployed URL

**Frontend Result**
- [ ] ✅ Frontend deployed
- [ ] ✅ Can access frontend URL
- [ ] ✅ API calls to backend (will fail until backend deployed)

### Backend Deployment

**Option 1: Railway (Easiest)**
- [ ] Create Railway account
- [ ] Connect GitHub repo
- [ ] Select backend folder
- [ ] Add environment variables
- [ ] Deploy
- [ ] Get deployment URL
- [ ] Test: `curl https://your-backend-url/health`

**Option 2: Render**
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub
- [ ] Select backend folder
- [ ] Build: `npm install`
- [ ] Start: `npm start`
- [ ] Add environment variables
- [ ] Deploy
- [ ] Get deployment URL

**Option 3: AWS EC2**
- [ ] Launch EC2 instance
- [ ] SSH into instance
- [ ] Install Node.js
- [ ] Clone repo
- [ ] Create `.env` file with production values
- [ ] Run: `npm install && npm start`
- [ ] Set up nginx reverse proxy
- [ ] Get deployment URL

**Backend Result**
- [ ] ✅ Backend deployed
- [ ] ✅ Can access backend URL
- [ ] ✅ Database connected

### Update Frontend with Backend URL

**After backend deployed:**
- [ ] Get backend deployment URL (e.g., https://studyhub-api.railway.app)
- [ ] Update frontend `.env.production`:
  ```
  VITE_API_URL=https://studyhub-api.railway.app/api
  ```
- [ ] Rebuild and redeploy frontend
- [ ] Verify API calls work

### Update Deployment Configurations

**CORS Setup**
- [ ] Backend `.env`: CORS_ORIGIN = https://yourdomain.com
- [ ] Restart backend
- [ ] Verify CORS headers in response

**Domain Configuration**
- [ ] Point custom domain to frontend hosting
- [ ] Point API subdomain to backend (if using subdomain)
- [ ] Update frontend .env to use custom domain URLs
- [ ] Test API calls work from custom domain

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Immediate Verification (Within 1 hour)

**Frontend**
- [ ] Website loads without errors
- [ ] No 404s in console
- [ ] CSS loads correctly
- [ ] Images display properly

**Backend**
- [ ] API endpoints respond
- [ ] Health check passes: `curl /api/health`
- [ ] No error logs

**Full Flow Test**
- [ ] Register new account: ✅
- [ ] Login with credentials: ✅
- [ ] Create study room: ✅
- [ ] Create note: ✅
- [ ] All operations work: ✅

### Monitoring Setup (Day 1)

**Error Tracking**
- [ ] Set up Sentry (or similar)
- [ ] Configure error notifications
- [ ] Test error capture

**Performance Monitoring**
- [ ] Set up monitoring dashboard
- [ ] Configure alerts for:
  - [ ] High response times (> 2 sec)
  - [ ] High error rates (> 5%)
  - [ ] Database connection issues

**Log Aggregation**
- [ ] Centralize logs (CloudWatch / ELK / DataDog)
- [ ] Set up log alerts
- [ ] Archive old logs

**Uptime Monitoring**
- [ ] Set up Pingdom / UptimeRobot
- [ ] Configure alerts for downtime
- [ ] Get notification setup verified

### 24-Hour Check (Next day)

- [ ] ✅ No critical errors in logs
- [ ] ✅ Response times acceptable
- [ ] ✅ User registrations working
- [ ] ✅ Data being saved correctly
- [ ] ✅ No database issues

### 1-Week Check

- [ ] ✅ Average response time < 500ms
- [ ] ✅ Error rate < 1%
- [ ] ✅ Zero 5xx errors (or minimal)
- [ ] ✅ Database performing well
- [ ] ✅ All features working
- [ ] ✅ Users happy (no complaints)

---

## 📞 TROUBLESHOOTING

### Backend Not Starting
- [ ] Check environment variables set
- [ ] Check DATABASE_URL is correct
- [ ] Check port 5000 not in use
- [ ] Check Node.js version compatible
- [ ] Run: `npm install` again
- [ ] Check error logs for details

### Frontend Build Fails
- [ ] Run: `npm install` again
- [ ] Check Node version
- [ ] Delete `node_modules` and `.npm`
- [ ] Run: `npm cache clean --force`
- [ ] Try build again

### API Calls Failing
- [ ] Check VITE_API_URL in frontend
- [ ] Check CORS_ORIGIN in backend
- [ ] Verify backend is running
- [ ] Check network tab in browser dev tools
- [ ] Check backend error logs

### Database Connection Error
- [ ] Verify DATABASE_URL correct
- [ ] Check database is running
- [ ] Verify credentials correct
- [ ] Check firewall rules allow connection
- [ ] Test connection string locally

### Login Not Working
- [ ] Check user exists in database
- [ ] Check password is correct
- [ ] Check JWT_SECRET set
- [ ] Check backend auth endpoint responding
- [ ] Check error response in console

---

## 🎯 FINAL SIGN-OFF

**Deployment Readiness:**
- [ ] All 4 code fixes applied
- [ ] Build verification passed
- [ ] Environment configured
- [ ] Local testing completed
- [ ] Production database ready

**Pre-Deployment:**
- [ ] All checklist items above marked
- [ ] No blockers or issues
- [ ] Team sign-off obtained

**Deployment:**
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] URLs configured
- [ ] Monitoring set up

**Post-Deployment:**
- [ ] Manual testing completed
- [ ] Users can register and login
- [ ] All features tested
- [ ] Error logs clean

**Status:** 
- [ ] ✅ **READY FOR PRODUCTION**
- [ ] ⚠️ **ISSUES FOUND - DO NOT DEPLOY**

---

## 📅 DEPLOYMENT SIGN-OFF

**Date Deployed:** _______________

**Deployed By:** _______________

**Approved By:** _______________

**Environment:** ☐ Staging  ☐ Production

**Version:** v1.0.5

**Issues Found:** ☐ None  ☐ Yes (describe below)

_________________________________________________________________

**Notes:**
_________________________________________________________________

---

**🎉 Congratulations! StudyHub v1.0.5 is now live!**

**Next Steps:**
1. Monitor logs for first 48 hours
2. Gather user feedback
3. Plan Phase 2 improvements
4. Celebrate! 🚀
