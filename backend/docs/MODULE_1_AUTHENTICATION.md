# Module 1: Authentication

## Overview

The Authentication module provides a complete user registration, login, and session management system using JWT tokens and bcrypt password hashing. This is the foundation for all other modules.

---

## Architecture

### Components

1. **Database Layer** (`src/db.js`)
   - PostgreSQL connection pooling
   - Query execution with error handling
   - Transaction support

2. **Utilities** (`src/utils/auth.js`)
   - Password hashing with bcrypt
   - JWT token generation and verification
   - Token storage hashing (never store raw tokens)
   - Random token generation for password resets

3. **Middleware** (`src/middleware/auth.js`, `src/middleware/validation.js`)
   - Authentication checks
   - Request validation
   - Error handling

4. **Controllers** (`src/controllers/authController.js`)
   - Business logic for all auth operations
   - User registration, login, profile management
   - Password changes and resets

5. **Routes** (`src/routes/auth.js`)
   - REST API endpoints
   - Request routing and middleware application

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  plan VARCHAR(50) DEFAULT 'free',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);
```

### Sessions Table

Tracks JWT tokens and their expiration for revocation/logout.

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP
);
```

### Password Reset Tokens Table

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Email Verification Tokens Table

```sql
CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Public Endpoints

#### 1. Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "plan": "free",
      "joinedAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "storageKey": "studyhub-token"
  }
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "plan": "free",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "storageKey": "studyhub-token"
  }
}
```

#### 3. Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "If an account exists, password reset email has been sent"
}
```

#### 4. Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset successfully. Please login with your new password."
}
```

### Protected Endpoints (require Authorization header)

#### 5. Get Current User
```
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": null,
      "bio": "User bio",
      "plan": "free",
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### 6. Update Profile
```
PUT /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "Jane Doe",
  "bio": "Updated bio"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Jane Doe",
      "avatar": null,
      "bio": "Updated bio",
      "plan": "free"
    }
  }
}
```

#### 7. Change Password
```
POST /api/auth/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass123"
}

Response: 200 OK
{
  "success": true,
  "message": "Password changed successfully. Please login again."
}
```

#### 8. Logout
```
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Validation Rules

### Registration
- **Email**: Valid email format, must be unique
- **Password**: Min 8 characters, must contain uppercase letter and number
- **Name**: Min 2 characters

### Login
- **Email**: Valid email format
- **Password**: Non-empty

### Password Change
- **Current Password**: Must match current password
- **New Password**: Min 8 characters, must contain uppercase letter and number

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Common Error Codes

- `MISSING_TOKEN` - 401: Authorization header missing
- `INVALID_TOKEN` - 401: Token is invalid or expired
- `EMAIL_EXISTS` - 409: Email already registered
- `INVALID_CREDENTIALS` - 401: Email or password incorrect
- `USER_NOT_FOUND` - 404: User does not exist
- `INVALID_PASSWORD` - 401: Current password incorrect
- `VALIDATION_ERROR` - 400: Invalid input data

---

## Security Features

1. **Password Hashing**: bcrypt with salt rounds 10
2. **JWT Tokens**: 7-day expiration by default
3. **Token Revocation**: Sessions can be revoked (logout)
4. **Password Reset**: 1-hour token expiration, tokens marked as used
5. **SQL Injection Prevention**: Parameterized queries
6. **CORS**: Configurable origin restriction
7. **Rate Limiting**: (To be added in future)
8. **Email Verification**: (To be added in future)

---

## Setup Instructions

### 1. Environment Variables

Create `.env` file in backend directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/studyhub_dev
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb studyhub_dev

# Run schema.sql
psql studyhub_dev < backend/sql/schema.sql
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

---

## Frontend Integration

### Update Environment Variables

Create `.env` in frontend root:

```
VITE_API_URL=http://localhost:5000/api
```

### Usage Example

```javascript
import { useAuth } from '@/context/AuthContext'

function LoginComponent() {
  const { login, isAuthenticated, user } = useAuth()

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'SecurePass123'
      })
      // User logged in, token stored in localStorage
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <button onClick={handleLogin} disabled={isAuthenticated}>
      {isAuthenticated ? `Logged in as ${user?.name}` : 'Login'}
    </button>
  )
}
```

---

## Testing

### Manual Testing with cURL

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
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Get Current User (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

### Automated Testing

```bash
npm test
```

Test files: `tests/auth.test.js`

---

## Performance Considerations

1. **Database Indexing**: Indexed on email, user_id, status for fast lookups
2. **Connection Pooling**: Max 20 connections to prevent connection leaks
3. **Password Hashing**: Bcrypt is CPU-intensive; consider async operations
4. **Token Verification**: JWT is stateless; no database hit needed on each request
5. **Session Cleanup**: Cron job needed to delete expired sessions (future)

---

## Scalability Notes

1. **Horizontal Scaling**: JWT tokens are stateless, can scale horizontally
2. **Database Sharding**: By user_id for very large deployments
3. **Redis Caching**: Cache user data, implement rate limiting
4. **CDN**: Static assets can be cached
5. **Load Balancing**: No sticky sessions required (stateless JWT)

---

## Future Enhancements

1. **Two-Factor Authentication (2FA)**
2. **OAuth Integration** (Google, GitHub)
3. **Email Verification**
4. **Rate Limiting** per IP
5. **Device Management** (logout from all devices)
6. **Session History** (login locations, devices)
7. **Audit Logging** (access attempts)
8. **Passwordless Login** (Magic links)

---

## Troubleshooting

### "ECONNREFUSED" Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists

### "Invalid token" Error
- Token may be expired (7 days default)
- Token may have been revoked (logout)
- Token storage key might not match ("studyhub-token")

### "Email already registered" on Register
- Email already exists in database
- Check for duplicate entries in database if needed

### CORS Errors in Frontend
- Ensure backend CORS_ORIGIN matches frontend URL
- Check credentials in apiClient configuration

---

## Contact & Support

For issues or questions, please refer to the main StudyHub documentation or create an issue in the repository.
