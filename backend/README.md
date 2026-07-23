# StudyHub Backend

Production-ready backend for StudyHub - a collaborative AI-powered learning platform.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 14+
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Deployment**: Vercel / Railway / Render

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
psql -d your_database < sql/schema.sql

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

## Project Structure

```
backend/
├── src/
│   ├── index.js                 # Express server entry point
│   ├── db.js                    # PostgreSQL connection pool
│   ├── controllers/
│   │   └── authController.js    # Auth business logic
│   ├── routes/
│   │   └── auth.js              # Auth API routes
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── validation.js        # Request validation
│   └── utils/
│       └── auth.js              # Password & token utilities
├── sql/
│   └── schema.sql               # Database schema
├── docs/
│   └── MODULE_1_AUTHENTICATION.md
├── .env.example                 # Environment template
├── package.json
└── README.md
```

## Available Modules

### Module 1: Authentication ✓ COMPLETE

User registration, login, password management, JWT sessions.

- POST `/api/auth/register` - Create new account
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile
- POST `/api/auth/change-password` - Change password
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password
- POST `/api/auth/logout` - Logout

[Full Authentication Documentation](docs/MODULE_1_AUTHENTICATION.md)

### Module 2: Room System (NEXT)

Collaborative learning workspaces with shared resources.

### Module 3: Notes & Flashcards (PLANNED)

Personal and shared study materials.

### Module 4: Quizzes & Assessment (PLANNED)

Quiz creation, submission, and grading system.

### Module 5: Discussion & Messaging (PLANNED)

Room-level discussions and messaging.

## API Response Format

All responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "errors": [...]
}
```

## Environment Variables

```
DATABASE_URL=postgresql://user:pass@localhost/studyhub_dev
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Scripts

```bash
# Development
npm run dev              # Start with auto-reload

# Production
npm start                # Start server
npm run build            # (No build needed for Node.js)

# Testing
npm test                 # Run tests

# Database
npm run seed             # Seed test data
```

## Security Features

✓ Password hashing with bcrypt  
✓ JWT token-based authentication  
✓ SQL injection prevention  
✓ CORS configuration  
✓ Request validation  
✓ Token revocation on logout  
✓ Password reset tokens with expiration  

## Deployment

### Vercel

```bash
vercel deploy --prod
```

See [SETUP.md](SETUP.md) for detailed deployment instructions.

### Railway

```bash
railway up
```

### Render

Connect GitHub repository and deploy.

## Database Setup

### Local PostgreSQL

```bash
createdb studyhub_dev
psql studyhub_dev < backend/sql/schema.sql
```

### Neon (Cloud)

1. Create project at https://console.neon.tech
2. Copy connection string to DATABASE_URL
3. Run schema initialization

## API Testing

### cURL Example

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
```

### Postman

Import API collection: `backend/postman_collection.json`

## Frontend Integration

The frontend connects to this backend via:

```javascript
// src/services/authService.js
apiClient.post("/auth/login", { email, password })
```

Frontend environment:
```
VITE_API_URL=http://localhost:5000/api
```

## Performance

- JWT tokens are stateless (no DB lookup per request)
- Database connection pooling (20 connections max)
- Indexed queries on email, user_id, status
- Bcrypt password hashing is async and non-blocking

## Scalability

- Horizontal scaling supported (stateless with JWT)
- Database sharding by user_id for massive scale
- Redis caching for user profiles
- CDN for static assets
- Load balancing ready

## Monitoring

Development logs to console:

```
[SERVER] Running on http://localhost:5000
[DB] Executed query in 45ms
```

Production logs available via:

```bash
vercel logs              # Vercel
railway logs             # Railway
```

## Troubleshooting

**Port already in use:**
```bash
lsof -i :5000
kill -9 <PID>
```

**Database connection refused:**
```bash
psql $DATABASE_URL -c "SELECT 1"
```

**Invalid token error:**
- Token may be expired
- Token may be revoked (logout)
- Check JWT_SECRET

See [SETUP.md](SETUP.md) for more troubleshooting.

## Testing

```bash
npm test
```

Tests located in `tests/` directory.

## Documentation

- [Setup Guide](SETUP.md) - Installation and deployment
- [Module 1: Authentication](docs/MODULE_1_AUTHENTICATION.md) - Complete auth docs

## Development Roadmap

- [x] Module 1: Authentication
- [ ] Module 2: Room System
- [ ] Module 3: Notes & Flashcards
- [ ] Module 4: Quizzes
- [ ] Module 5: Discussion
- [ ] Module 6: Activity Logging
- [ ] Rate Limiting
- [ ] Email Service Integration
- [ ] Two-Factor Authentication
- [ ] OAuth Integration

## Contributing

1. Follow existing code patterns
2. Add tests for new features
3. Update documentation
4. Test locally before pushing

## License

MIT

## Support

For issues or questions:

1. Check [SETUP.md](SETUP.md) troubleshooting section
2. Review [MODULE_1_AUTHENTICATION.md](docs/MODULE_1_AUTHENTICATION.md)
3. Check logs: `npm run dev` or `vercel logs`
4. Create an issue in the repository

---

**Version**: 1.0.0  
**Status**: Production-ready (Authentication module)  
**Last Updated**: 2024-01-01
