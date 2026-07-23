# StudyHub - Detailed Fix Instructions

**Complete step-by-step guide to fix all critical issues.**

---

## STEP 1: Remove Password Reset Token Logging

### Location
File: `backend/src/controllers/authController.js`

### What to Find
Search for: `console.log` in the password reset function

Look for this code:
```javascript
const resetToken = generateSecureToken()
const resetTokenHash = hashToken(resetToken)
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

// TODO: Send email with reset link
console.log(`[AUTH] Password reset token for ${email}: ${resetToken}`)
```

### What to Delete
Delete this entire line:
```javascript
console.log(`[AUTH] Password reset token for ${email}: ${resetToken}`)
```

### After Fix
```javascript
const resetToken = generateSecureToken()
const resetTokenHash = hashToken(resetToken)
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

// TODO: Send email with reset link
// console.log removed - sensitive token should never be logged
```

### Why This Matters
🔴 **CRITICAL SECURITY:** This line logs password reset tokens to console/logs. Anyone with access to logs can reset user passwords.

### Verification
- [ ] Console.log line removed
- [ ] No compiler errors
- [ ] Backend still starts: `npm start`

---

## STEP 2: Remove Console.debug from useAsync

### Location
File: `src/hooks/useAsync.js`

### What to Find
Search for: `console.debug` in the file

Look for this code:
```javascript
const existing = statusRef.current.resolve
if (existing) {
  console.debug('[useAsync] Request already in flight, reusing promise')
  return existing
}
```

### Option A: Delete the Line (Fastest)
```javascript
const existing = statusRef.current.resolve
if (existing) {
  // Already in flight - reuse existing promise
  return existing
}
```

### Option B: Gate Behind Dev Flag (Better for Debugging)
```javascript
const existing = statusRef.current.resolve
if (existing) {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[useAsync] Request already in flight, reusing promise')
  }
  return existing
}
```

### After Fix
Choose one of the options above. Option B is recommended.

### Why This Matters
Development logging shouldn't appear in production builds. It clutters user console and can affect performance.

### Verification
- [ ] console.debug line removed or gated
- [ ] No compiler errors
- [ ] Frontend builds: `npm run build`

---

## STEP 3: Remove Debug Log from RoomsPage

### Location
File: `src/pages/RoomsPage.jsx`

### What to Find
Search for: `console.log("[v0]`

Look for this code (likely in a click handler):
```javascript
const handleSelectRoom = (room) => {
  console.log("[v0] Selected room:", room)
  setSelectedRoom(room)
  // ... rest of handler
}
```

### What to Delete
Delete this line:
```javascript
console.log("[v0] Selected room:", room)
```

### After Fix
```javascript
const handleSelectRoom = (room) => {
  setSelectedRoom(room)
  // ... rest of handler
}
```

### Why This Matters
This is development debug code. It should be removed before production deployment.

### Verification
- [ ] console.log line removed
- [ ] No compiler errors
- [ ] Frontend still compiles: `npm run build`

---

## STEP 4: Handle Email Service Implementation

### Option A: Disable Password Reset (Fastest - 5 minutes)

**Step 1: Remove endpoint from backend**

File: `backend/src/routes/authRoutes.js`

Find and delete:
```javascript
router.post('/request-password-reset', authController.requestPasswordReset)
router.post('/reset-password', authController.resetPassword)
```

**Step 2: Remove from frontend**

File: `src/pages/LoginPage.jsx`

Find and remove "Forgot Password?" link/button if present.

**Step 3: Document in README**

Add to FEATURES section:
```markdown
### Known Limitations (Phase 2)
- Password reset not available in v1.0
- Users must create new account if forgotten
- Coming in v1.1
```

**Verification:**
- [ ] Reset endpoints removed
- [ ] No broken links in UI
- [ ] Backend still compiles
- [ ] Frontend still compiles

---

### Option B: Implement Email with Nodemailer (30-45 minutes)

**Step 1: Install Nodemailer**

```bash
cd backend
npm install nodemailer
```

**Step 2: Create email service**

File: `backend/src/services/emailService.js` (create new)

```javascript
import nodemailer from 'nodemailer'

// Configure transporter with your email provider
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendPasswordResetEmail(email, token, resetLink) {
  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: 'StudyHub - Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>Token: ${token}</p>
      <p>This link expires in 24 hours.</p>
    `,
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) reject(error)
      else resolve(info)
    })
  })
}
```

**Step 3: Update authController**

File: `backend/src/controllers/authController.js`

Replace:
```javascript
console.log(`[AUTH] Password reset token for ${email}: ${resetToken}`)
```

With:
```javascript
import { sendPasswordResetEmail } from '../services/emailService.js'

// In requestPasswordReset function:
const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
await sendPasswordResetEmail(email, resetToken, resetLink)
```

**Step 4: Add environment variables**

File: `backend/.env`

```
SMTP_SERVICE=gmail
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@studyhub.com
FRONTEND_URL=http://localhost:3000
```

**Step 5: Test email sending**

```bash
npm start
# Test with: curl -X POST http://localhost:5000/api/auth/request-password-reset \
#   -H "Content-Type: application/json" \
#   -d '{"email":"test@example.com"}'
```

**Verification:**
- [ ] Nodemailer installed
- [ ] Email service created
- [ ] AuthController updated
- [ ] Environment variables configured
- [ ] Backend starts without errors
- [ ] Test email sends successfully

---

### Option C: Use SendGrid (Alternative - 20 minutes)

**Step 1: Install SendGrid**

```bash
cd backend
npm install @sendgrid/mail
```

**Step 2: Create email service**

File: `backend/src/services/emailService.js`

```javascript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendPasswordResetEmail(email, token, resetLink) {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'StudyHub - Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 24 hours.</p>
    `,
  }

  return sgMail.send(msg)
}
```

**Step 3: Update authController**

Same as Nodemailer (Step 3 above)

**Step 4: Add environment variables**

File: `backend/.env`

```
SENDGRID_API_KEY=SG.your_key_here
SENDGRID_FROM_EMAIL=noreply@studyhub.com
FRONTEND_URL=http://localhost:3000
```

**Verification:**
- [ ] SendGrid installed
- [ ] API key configured
- [ ] Backend starts without errors
- [ ] Test email sends successfully

---

## Summary: Time Required by Option

| Option | Time | Complexity | Result |
|--------|------|-----------|--------|
| A: Disable | 5 min | Low | ❌ No password reset |
| B: Nodemailer | 45 min | Medium | ✅ Works with Gmail/providers |
| C: SendGrid | 20 min | Low | ✅ Works with SendGrid |

**Recommendation:** Use Option A for v1.0 (disable), implement Option B or C for v1.1

---

## FINAL VERIFICATION CHECKLIST

After completing all 4 fixes:

### Code Changes
- [ ] Fix #1: Password token logging removed
- [ ] Fix #2: console.debug removed or gated
- [ ] Fix #3: [v0] debug log removed
- [ ] Fix #4: Email service handled (pick option)

### Build Verification
```bash
# Backend
cd backend
npm install  # Install any new dependencies
npm start    # Should start without errors
# Ctrl+C to stop

# Frontend
npm run build  # Should build without errors
npm run dev    # Should start dev server
```

- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] No TypeScript errors
- [ ] No console warnings in dev

### Environment Setup (Before Deployment)
```bash
# Generate strong JWT_SECRET
openssl rand -base64 32
# Copy output to backend/.env JWT_SECRET

# Configure production URLs
# backend/.env:
#   DATABASE_URL=postgresql://...production...
#   VITE_API_URL=https://api.yourdomain.com/api

# backend/src/index.js should use these values
```

- [ ] JWT_SECRET configured
- [ ] DATABASE_URL points to production DB
- [ ] VITE_API_URL configured for production
- [ ] CORS_ORIGIN set to production domain

### Deployment Readiness
- [ ] All 4 fixes applied
- [ ] Backend compiles and starts
- [ ] Frontend builds successfully
- [ ] Environment variables configured
- [ ] Database backups taken
- [ ] Ready to deploy! 🚀

---

## Quick Command Reference

### Remove console statements (Linux/Mac)
```bash
# Find all console statements
grep -r "console\." backend/src src/

# Find specific ones to remove
grep -n "console.log.*\[v0\]" src/pages/RoomsPage.jsx
grep -n "console.log.*Password reset token" backend/src/controllers/authController.js
grep -n "console.debug.*useAsync" src/hooks/useAsync.js
```

### Install email dependencies
```bash
cd backend
npm install nodemailer  # For Nodemailer
# OR
npm install @sendgrid/mail  # For SendGrid
```

### Test backend after fixes
```bash
cd backend
npm start
# Server should start on port 5000
# No console warnings about removed statements
```

### Test frontend after fixes
```bash
npm run build
# Should complete without errors
npm run dev
# Should start dev server
```

---

**All fixes applied? You're ready to deploy!** 🚀

See `STUDYHUB_AUDIT_REPORT.md` for full audit details.
