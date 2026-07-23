# Backend Implementation Verification Checklist

Use this checklist to verify that Module 1: Authentication is properly set up and working.

---

## Phase 1: Setup & Installation

- [ ] **Node.js Version**
  ```bash
  node --version  # Should be 18+
  ```

- [ ] **PostgreSQL Installation**
  ```bash
  psql --version  # Should be 14+
  ```

- [ ] **Backend Dependencies Installed**
  ```bash
  cd backend
  npm install  # Should complete without errors
  ```

- [ ] **Environment File Created**
  ```bash
  ls backend/.env  # File should exist
  cat backend/.env  # Should contain DATABASE_URL, JWT_SECRET, etc.
  ```

- [ ] **Database Created**
  ```bash
  psql -l | grep studyhub  # Should show studyhub_dev database
  ```

- [ ] **Database Schema Applied**
  ```bash
  psql studyhub_dev -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';"
  # Should return 7+ (users, sessions, password_reset_tokens, etc.)
  ```

---

## Phase 2: Backend Server

- [ ] **Server Starts**
  ```bash
  cd backend && npm run dev
  # Should show: [SERVER] Running on http://localhost:5000
  ```

- [ ] **Health Check**
  ```bash
  curl http://localhost:5000/health
  # Response: {"status":"ok","timestamp":"..."}
  ```

- [ ] **Server Logs Show Database Connection**
  ```
  [DB] Initializing database...
  [DB] Database initialized successfully
  [SERVER] Running on http://localhost:5000
  ```

- [ ] **No Port Conflicts**
  ```bash
  lsof -i :5000  # Should show only node process
  ```

---

## Phase 3: API Endpoints

### Register Endpoint

- [ ] **Register New User**
  ```bash
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "testuser@example.com",
      "password": "TestPass123",
      "name": "Test User"
    }'
  
  # Response should include:
  # - success: true
  # - user object (id, email, name, plan, joinedAt)
  # - token (JWT)
  # - storageKey: "studyhub-token"
  ```

- [ ] **Duplicate Email Rejection**
  ```bash
  # Try to register same email again
  # Response should be: 409 Conflict, "Email already registered"
  ```

- [ ] **Weak Password Rejection**
  ```bash
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "another@example.com",
      "password": "weak",
      "name": "User"
    }'
  
  # Response: 400 Bad Request, validation errors
  ```

### Login Endpoint

- [ ] **Successful Login**
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "testuser@example.com",
      "password": "TestPass123"
    }'
  
  # Response: 200 OK with token
  ```

- [ ] **Invalid Credentials**
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "testuser@example.com",
      "password": "WrongPassword"
    }'
  
  # Response: 401 Unauthorized, "Invalid email or password"
  ```

- [ ] **User Not Found**
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "nonexistent@example.com",
      "password": "AnyPassword"
    }'
  
  # Response: 401 Unauthorized
  ```

### Protected Endpoints (Require Token)

- [ ] **Get Current User (with token)**
  ```bash
  TOKEN="<jwt_token_from_login>"
  
  curl -X GET http://localhost:5000/api/auth/me \
    -H "Authorization: Bearer $TOKEN"
  
  # Response: 200 OK with user data
  ```

- [ ] **Get Current User (without token)**
  ```bash
  curl -X GET http://localhost:5000/api/auth/me
  
  # Response: 401 Unauthorized, "Missing authentication token"
  ```

- [ ] **Get Current User (expired token)**
  ```bash
  # Use old/invalid token
  curl -X GET http://localhost:5000/api/auth/me \
    -H "Authorization: Bearer invalid_token"
  
  # Response: 401 Unauthorized, "Invalid or expired token"
  ```

### Update Profile

- [ ] **Update Name**
  ```bash
  TOKEN="<valid_jwt_token>"
  
  curl -X PUT http://localhost:5000/api/auth/profile \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name": "Updated Name"}'
  
  # Response: 200 OK with updated user
  ```

- [ ] **Update Bio**
  ```bash
  curl -X PUT http://localhost:5000/api/auth/profile \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"bio": "My learning journey..."}'
  
  # Response: 200 OK
  ```

### Change Password

- [ ] **Successful Password Change**
  ```bash
  curl -X POST http://localhost:5000/api/auth/change-password \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "currentPassword": "TestPass123",
      "newPassword": "NewPass123"
    }'
  
  # Response: 200 OK
  ```

- [ ] **Wrong Current Password**
  ```bash
  curl -X POST http://localhost:5000/api/auth/change-password \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "currentPassword": "WrongPassword",
      "newPassword": "NewPass123"
    }'
  
  # Response: 401 Unauthorized
  ```

- [ ] **Can Login with New Password**
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "testuser@example.com",
      "password": "NewPass123"
    }'
  
  # Response: 200 OK with new token
  ```

### Password Reset

- [ ] **Request Password Reset**
  ```bash
  curl -X POST http://localhost:5000/api/auth/forgot-password \
    -H "Content-Type: application/json" \
    -d '{"email": "testuser@example.com"}'
  
  # Response: 200 OK, "If an account exists, password reset email has been sent"
  # In development, token may be returned: "resetToken": "..."
  ```

- [ ] **Reset with Token (development)**
  ```bash
  RESET_TOKEN="<token_from_forgot_password_response>"
  
  curl -X POST http://localhost:5000/api/auth/reset-password \
    -H "Content-Type: application/json" \
    -d '{
      "token": "'$RESET_TOKEN'",
      "password": "AnotherNewPass123"
    }'
  
  # Response: 200 OK
  ```

### Logout

- [ ] **Successful Logout**
  ```bash
  curl -X POST http://localhost:5000/api/auth/logout \
    -H "Authorization: Bearer $TOKEN"
  
  # Response: 200 OK, "Logged out successfully"
  ```

- [ ] **Token Revoked After Logout**
  ```bash
  # Try to use same token
  curl -X GET http://localhost:5000/api/auth/me \
    -H "Authorization: Bearer $TOKEN"
  
  # Response: 401 Unauthorized (token revoked)
  ```

---

## Phase 4: Frontend Integration

- [ ] **Frontend Environment Configured**
  ```bash
  cat .env  # Should contain: VITE_API_URL=http://localhost:5000/api
  ```

- [ ] **Frontend Server Running**
  ```bash
  npm run dev
  # Should show: [vite] ready in xxx ms
  ```

- [ ] **Frontend Connects to Backend**
  ```
  Open browser console (F12)
  No CORS errors should appear
  ```

- [ ] **Register via Frontend**
  - Navigate to /register
  - Fill out form and submit
  - Should successfully create account
  - Token should be stored in localStorage

- [ ] **Login via Frontend**
  - Navigate to /login
  - Enter credentials
  - Should successfully login
  - Redirected to dashboard
  - localStorage contains token

- [ ] **Session Persists**
  - Login to application
  - Refresh page (F5)
  - Should still be logged in
  - No need to re-enter credentials

- [ ] **Logout Works**
  - Click logout button
  - Should redirect to login
  - localStorage token should be removed
  - Refresh page should show login again

- [ ] **Protected Pages Require Login**
  - Logout from application
  - Try to navigate directly to /app/dashboard
  - Should be redirected to /login

---

## Phase 5: Database Verification

- [ ] **User Created in Database**
  ```bash
  psql studyhub_dev -c "SELECT id, email, name, plan FROM users;"
  # Should show registered user
  ```

- [ ] **Password Hash Stored (Not Plain Text)**
  ```bash
  psql studyhub_dev -c "SELECT email, password_hash FROM users LIMIT 1;"
  # password_hash should be bcrypt hash (starts with $2b$), not plain text
  ```

- [ ] **Session Created**
  ```bash
  psql studyhub_dev -c "SELECT user_id, expires_at, revoked_at FROM sessions;"
  # Should show sessions with user_id and expiration
  ```

- [ ] **Indexes Present**
  ```bash
  psql studyhub_dev -c "\di" | grep idx_
  # Should show indexes on users(email), sessions(user_id), etc.
  ```

---

## Phase 6: Security Verification

- [ ] **JWT Secret is Strong**
  ```bash
  grep JWT_SECRET backend/.env
  # Should NOT be "test" or "secret" - should be random 32+ chars
  ```

- [ ] **CORS Configured**
  ```bash
  grep CORS_ORIGIN backend/.env
  # Should match frontend URL (http://localhost:3000)
  ```

- [ ] **No Credentials in Logs**
  ```bash
  # Check server logs, should NOT show passwords
  npm run dev 2>&1 | grep -i password
  # Should return nothing
  ```

- [ ] **Passwords Not in Response**
  ```bash
  # Login response should NOT include password or password_hash
  # Check browser console Network tab
  # Response should only have: user {id, email, name, ...}, token
  ```

- [ ] **SQL Injection Prevention**
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com OR 1=1--","password":"test"}'
  
  # Should safely reject, not return all users
  ```

---

## Phase 7: Error Handling

- [ ] **Validation Errors Return 400**
  ```bash
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"invalid"}' -w "\n%{http_code}"
  
  # Should return: 400 Bad Request
  ```

- [ ] **Not Found Returns 404**
  ```bash
  curl http://localhost:5000/api/nonexistent -w "\n%{http_code}"
  
  # Should return: 404 Not Found
  ```

- [ ] **Unauthorized Returns 401**
  ```bash
  curl http://localhost:5000/api/auth/me -w "\n%{http_code}"
  
  # Should return: 401 Unauthorized
  ```

- [ ] **Conflict Returns 409**
  ```bash
  # Try to register same email twice
  # Should return: 409 Conflict
  ```

---

## Phase 8: Performance Verification

- [ ] **Login Response Time < 1 second**
  ```bash
  time curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"TestPass123"}'
  
  # Real time should show < 1000ms
  ```

- [ ] **Database Connection Pooling Working**
  ```bash
  # Make multiple rapid requests
  for i in {1..10}; do
    curl -s http://localhost:5000/health
  done
  
  # All should succeed quickly
  ```

- [ ] **No N+1 Query Problems**
  ```bash
  # Check server logs during requests
  npm run dev | grep "\[DB\]"
  # Should see minimal queries per operation
  ```

---

## Final Checklist

**Setup & Infrastructure**
- [ ] Backend server runs without errors
- [ ] Database initializes successfully  
- [ ] All tables created with proper schema
- [ ] Indexes present for performance

**API Functionality**
- [ ] All 8 endpoints respond correctly
- [ ] Register creates user with hashed password
- [ ] Login returns valid JWT token
- [ ] Protected endpoints verify token
- [ ] Logout revokes session
- [ ] Error responses are consistent

**Frontend Integration**
- [ ] Frontend API client configured
- [ ] Token stored/retrieved from localStorage
- [ ] Login/logout workflows function end-to-end
- [ ] Session persists across page refreshes
- [ ] Protected pages require authentication

**Security**
- [ ] Passwords hashed with bcrypt
- [ ] Tokens are JWT signed
- [ ] No credentials logged
- [ ] CORS configured correctly
- [ ] SQL injection protected
- [ ] Token revocation works

**Database**
- [ ] User data persists
- [ ] Sessions tracked properly
- [ ] Timestamps recorded correctly
- [ ] Relationships enforced

---

## Success Criteria

✅ **All checks above pass** → Module 1 is successfully implemented!

```
Total Checks: 100+
Required to Pass: All of them
Status: Ready for Module 2 (Room System)
```

---

## Troubleshooting

**If any check fails:**

1. **Check logs**: `npm run dev` in backend folder
2. **Verify database**: `psql studyhub_dev -c "SELECT 1"`
3. **Clear environment**: Delete `.env` and recreate from `.env.example`
4. **Reset database**: Drop and recreate with schema
5. **Check frontend environment**: Ensure `.env` has VITE_API_URL

**See these files for detailed help:**
- Backend issues: `backend/SETUP.md`
- API issues: `backend/docs/MODULE_1_AUTHENTICATION.md`
- Frontend issues: `src/services/authService.js`

---

**Date**: 2024-01-01  
**Module**: Authentication (Module 1)  
**Status**: Ready for Verification
