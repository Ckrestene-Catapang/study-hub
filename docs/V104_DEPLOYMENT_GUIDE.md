# StudyHub v1.0.4 - Deployment & Testing Guide

## Quick Start for Beta

```bash
# Install dependencies
npm install

# Run database schema (if new deployment)
psql -d studyhub -f backend/sql/schema.sql

# Start development server
npm run dev

# Backend will run on http://localhost:3001
# Frontend will run on http://localhost:5173
```

---

## What Changed in v1.0.4

### Files Modified (4 Files)
1. `backend/src/middleware/auth.js` - Enhanced error handling
2. `backend/sql/schema.sql` - Added 6 indexes + schema fixes
3. `src/pages/NotesPage.jsx` - Added error/empty states
4. `src/pages/QuizzesPage.jsx` - Complete rewrite
5. `vercel.json` - Fixed SPA routing

### Files Created (3 Files)
1. `/docs/BETA_TESTING_CHECKLIST.md` - Testing guide (310 lines)
2. `/docs/V104_RELEASE_NOTES.md` - Release notes (268 lines)
3. `/V104_IMPLEMENTATION_SUMMARY.md` - Summary (289 lines)

### No Breaking Changes
- All changes backward compatible
- No database migrations needed
- No API contract changes
- Existing users unaffected

---

## Testing Deployment

### 1. Local Testing
```bash
# Start dev server
npm run dev

# In another terminal, start backend
cd backend
npm run dev

# Test in browser: http://localhost:5173
```

### 2. Pre-Deployment Verification
- [ ] User can register
- [ ] User can create room
- [ ] User can add notes to room
- [ ] User can refresh page without 404
- [ ] User can log out and back in
- [ ] All data persists
- [ ] Error messages appear on failures
- [ ] Retry buttons work

### 3. Database Schema
New indexes will be created automatically when schema.sql runs. To verify:

```bash
psql -d studyhub -c "SELECT indexname FROM pg_indexes WHERE tablename='notes';"
```

Should show:
- idx_notes_user_id
- idx_notes_room_id
- idx_notes_status ← NEW
- idx_notes_is_favorite

---

## Key Features to Test

### Error Handling
- [ ] Network error → shows Alert with retry button
- [ ] Invalid credentials → clear error message
- [ ] Expired token → redirects to login
- [ ] 403 Forbidden → shows permission error
- [ ] 404 Not found → shows not found message

### State Management
- [ ] Loading skeleton appears while fetching
- [ ] Empty state shown when no data
- [ ] Filtered search returns empty state (not error)
- [ ] Toast notification on success
- [ ] Toast notification on error

### SPA Routing
- [ ] Navigate to `/rooms` → works
- [ ] Refresh `/rooms` → no 404
- [ ] Navigate to `/notes` → works
- [ ] Refresh `/notes` → no 404
- [ ] Navigate to `/quizzes` → works
- [ ] Refresh `/quizzes` → no 404
- [ ] Deep link to any route → works

### Authorization
- [ ] Owner can delete room
- [ ] Non-owner cannot delete room (403)
- [ ] Creator can edit note
- [ ] Non-creator cannot edit note (403)
- [ ] Creator can delete quiz
- [ ] Non-creator cannot delete quiz (403)
- [ ] Only members can view room content

### Data Persistence
- [ ] Close browser → session persists on reopen
- [ ] Refresh page → data intact
- [ ] Log out → clear all data
- [ ] Log in → data restored
- [ ] Create content → visible immediately
- [ ] Deleted content → no longer visible

---

## Environment Variables

### Required for Backend
```
DATABASE_URL=postgresql://user:pass@localhost:5432/studyhub
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=7d
NODE_ENV=production
```

### For Local Development
```
NODE_ENV=development
JWT_SECRET=dev-secret-key (unsafe, change in production)
```

---

## Database Setup

### First Time Setup
```bash
# Create database
createdb studyhub

# Apply schema
psql -d studyhub -f backend/sql/schema.sql

# Verify tables
psql -d studyhub -c "\dt"
```

### Apply New Indexes (v1.0.4)
```bash
# Already included in schema.sql, but can run individually:
psql -d studyhub -c "
  CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON quizzes(user_id);
  CREATE INDEX IF NOT EXISTS idx_quizzes_status ON quizzes(status);
  CREATE INDEX IF NOT EXISTS idx_quiz_submissions_quiz_id ON quiz_submissions(quiz_id);
  CREATE INDEX IF NOT EXISTS idx_notes_status ON notes(status);
  CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);
  CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
"
```

---

## Common Issues & Solutions

### Issue: Refresh shows 404
**Solution:** Verify vercel.json rewrites are configured (they are in v1.0.4)

### Issue: API calls fail with 500
**Solution:** Check JWT_SECRET matches between frontend and backend

### Issue: Buttons disabled after error
**Solution:** Normal - retry button should be visible. Click to retry.

### Issue: Empty list shows forever
**Solution:** Check browser console for errors. Hit retry if error state appears.

### Issue: User lost after refresh
**Solution:** Check localStorage for 'studyhub-token'. Verify JWT_EXPIRY.

---

## Performance Monitoring

### Check Index Usage
```bash
psql -d studyhub -c "SELECT * FROM pg_stat_user_indexes ORDER BY idx_scan DESC;"
```

### Monitor Slow Queries
```bash
# Enable query logging in PostgreSQL
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1 second
SELECT pg_reload_conf();
```

### Frontend Performance
- Open DevTools → Performance tab
- Record user flow
- Check for layout shifts (CLS)
- Verify no long tasks blocking main thread

---

## Rollback Plan

If critical issue found:

### Rollback to v1.0.3
1. Revert these files from git:
   - `backend/src/middleware/auth.js`
   - `backend/sql/schema.sql`
   - `src/pages/NotesPage.jsx`
   - `src/pages/QuizzesPage.jsx`
   - `vercel.json`

2. Keep documentation files (no impact on code)

3. Redeploy

### Database Rollback
- Indexes are safe to keep (won't hurt)
- No data structure changed
- No migration needed

---

## Sign-Off Checklist

Before going live with beta:

- [ ] All tests in BETA_TESTING_CHECKLIST.md pass
- [ ] No critical errors in browser console
- [ ] No critical errors in server logs
- [ ] Database indexes created
- [ ] Vercel routing configured
- [ ] Error handling tested
- [ ] Loading states visible
- [ ] Empty states tested
- [ ] Authorization working
- [ ] Retry buttons functional
- [ ] End-to-end flow works
- [ ] Team reviewed changes
- [ ] Deployment approved

---

## Support During Beta

### For Users
Direct to: `/docs/BETA_TESTING_CHECKLIST.md`

### For Technical Issues
1. Check error message code in browser console
2. Verify JWT token in localStorage
3. Check server logs for API errors
4. Review `/docs/V104_RELEASE_NOTES.md` for details

### Feedback Tracking
Document any issues with:
- User action that caused it
- Error code or message
- Expected vs actual behavior
- Browser/device info
- Timestamp

---

## Next Steps After v1.0.4

Once beta users confirm reliability:
- Gather feedback on usability
- Monitor error rates
- Track performance metrics
- Document user pain points
- Plan v1.0.5 features

---

**Deployment Status: Ready for Beta**
