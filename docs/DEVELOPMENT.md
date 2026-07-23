# StudyHub Development Setup Guide

## Prerequisites

Ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## Quick Start (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/Ckrestene-Catapang/STUDYHUB.git
cd STUDYHUB
git checkout new  # Development branch
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Setup PostgreSQL Database
```bash
# Create database
createdb studyhub_dev

# Or via psql interactive shell
psql -U postgres
# In psql:
# CREATE DATABASE studyhub_dev;
# \q
```

### 5. Configure Environment Variables

**Frontend** - Create `.env.development.local`:
```bash
cp .env.example .env.development.local
```
Edit and update `VITE_API_URL=http://localhost:5000/api`

**Backend** - Create `.env`:
```bash
cd backend
cp .env.example .env
cd ..
```
Edit `backend/.env` with your database connection:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/studyhub_dev
JWT_SECRET=dev-secret-key-change-in-production
```

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

### 7. Verify Setup

1. Open http://localhost:3000 in browser
2. You should see the StudyHub landing page
3. Try registering a new account
4. Check backend logs for successful requests

## Detailed Setup

### PostgreSQL Setup

#### Option 1: Using Docker (Recommended)
```bash
docker run --name studyhub-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Connect to database
psql -U postgres -h localhost
```

#### Option 2: Local Installation
```bash
# macOS (via Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Linux (Ubuntu)
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows - Use installer from https://www.postgresql.org/download/windows/
```

#### Create Development Database
```bash
psql -U postgres -h localhost

# In psql shell:
CREATE DATABASE studyhub_dev OWNER postgres;
CREATE USER studyhub_dev WITH PASSWORD 'dev-password';
ALTER ROLE studyhub_dev CREATEDB;
\q
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.development.local

# Edit .env.development.local
# VITE_API_URL=http://localhost:5000/api

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
# Example:
# DATABASE_URL=postgresql://studyhub_dev:dev-password@localhost:5432/studyhub_dev
# JWT_SECRET=your-dev-secret-key-here
# PORT=5000
# NODE_ENV=development
# CORS_ORIGIN=http://localhost:3000

# Start dev server (auto-initializes database schema)
npm run dev

# View database (psql)
psql studyhub_dev -U studyhub_dev
```

## Project Structure

```
studyhub/
├── src/                    # Frontend React app
│   ├── pages/             # Page components
│   ├── components/        # UI components
│   ├── services/          # API clients
│   ├── context/           # React context
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilities
│   └── App.jsx            # Root component
│
├── backend/                # Express.js server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # Route definitions
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── database/      # Database helpers
│   │   ├── utils/         # Utilities
│   │   ├── config/        # Configuration
│   │   └── index.js       # Server entry point
│   ├── sql/
│   │   └── schema.sql     # Database schema
│   └── package.json
│
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   └── DEVELOPMENT.md
│
├── .env.example           # Frontend env template
├── package.json           # Frontend dependencies
└── README.md              # Project overview
```

## Common Workflows

### Running Both Servers

**Using Make (if available):**
```bash
make dev  # Runs both servers in parallel
```

**Using npm-run-all (recommended):**
```bash
npm install -g npm-run-all

# Add to package.json scripts
npm run dev:all
```

**Manual Setup:**
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd .. && npm run dev
```

### Database Debugging

```bash
# Connect to database
psql studyhub_dev -U studyhub_dev

# List tables
\dt

# View table structure
\d users

# Run SQL query
SELECT id, email, created_at FROM users LIMIT 10;

# Exit
\q
```

### API Testing

**Using curl:**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'

# Get current user (requires token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Using Postman:**
1. Import collection from `backend/postman_collection.json` (if available)
2. Set environment variables (BASE_URL, TOKEN)
3. Run requests

### Code Quality

```bash
# Lint frontend
npm run lint

# Lint backend
cd backend && npm run lint

# Format code (if configured)
npm run format

# Type check (TypeScript)
npm run type-check
```

## Debugging

### Frontend Debugging

**Browser DevTools:**
1. Open http://localhost:3000
2. Press F12 to open DevTools
3. Use Console tab to see logs
4. Use Network tab to inspect API requests
5. Use Application tab to view localStorage

**VS Code Debugging:**
1. Install "Debugger for Chrome" extension
2. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverride": {}
    }
  ]
}
```
3. Press F5 to start debugging

### Backend Debugging

**Console Logs:**
```javascript
// Log with v0 prefix for clarity
console.log("[v0] Variable:", variableName)
```

**VS Code Debugging:**
1. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/index.js",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```
2. Set breakpoints in code
3. Press F5 to start debugging

### Database Debugging

```bash
# Enable query logging in backend
# Set LOG_LEVEL=debug in .env

# View database logs
psql studyhub_dev -U studyhub_dev -c "SELECT * FROM pg_stat_statements;"

# Monitor active queries
watch -n 1 'psql studyhub_dev -U studyhub_dev -c "SELECT pid, usename, application_name, query FROM pg_stat_activity WHERE state != '"'"'idle'"'"';"'
```

## Testing

### Unit Tests
```bash
cd backend
npm run test

cd ..
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

## Performance Profiling

### Frontend
```javascript
// Performance API
const startTime = performance.now()
// ... code to measure
const endTime = performance.now()
console.log(`Took ${endTime - startTime}ms`)

// React Profiler (wrap components)
import { Profiler } from 'react'
<Profiler id="componentName" onRender={onRenderCallback}>
  <Component />
</Profiler>
```

### Backend
```bash
# Use clinic.js for profiling
npm install -g clinic
clinic doctor -- node backend/src/index.js

# View results
open clinic-X.html
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000 (backend)
lsof -i :5000
# Kill process
kill -9 <PID>

# Find process using port 3000 (frontend)
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
psql -U postgres -h localhost

# Check DATABASE_URL in backend/.env
# Format: postgresql://user:password@host:port/database

# Restart PostgreSQL
sudo systemctl restart postgresql  # Linux
brew services restart postgresql  # macOS
```

### Module Not Found
```bash
# Clean and reinstall node_modules
rm -rf node_modules package-lock.json
npm install

# Same for backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Check CORS_ORIGIN in backend/.env matches frontend URL
- Ensure backend is running on correct port
- Check browser console for exact error

## IDE Setup

### VS Code Configuration

Create `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/.DS_Store": true
  }
}
```

Recommended Extensions:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)
- PostgreSQL (SQL client)

## Deployment Preview

### Local Production Build

```bash
# Frontend production build
npm run build
npm run preview

# Backend production mode
cd backend
NODE_ENV=production npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# View deployment
vercel --prod
```

## Next Steps

1. ✅ **Local Setup Complete** - Start developing!
2. 📚 Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand system design
3. 🗄️ Read [DATABASE.md](./DATABASE.md) to understand data schema
4. 🚀 Read backend README for API documentation
5. 📝 Create your first feature branch

## Getting Help

- **Errors:** Check console logs with `[v0]` prefix
- **Database Issues:** Use `psql` to connect and inspect
- **API Issues:** Test endpoints with curl or Postman
- **Build Issues:** Clean node_modules and reinstall
- **Deployment Issues:** Check Vercel logs and environment variables

## Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
