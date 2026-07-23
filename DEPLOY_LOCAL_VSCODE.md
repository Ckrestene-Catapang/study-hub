# StudyHub - Local Deployment with Visual Studio Code

## 📋 Quick Overview

This guide walks you through setting up and running StudyHub locally using Visual Studio Code. Perfect for development, testing, and learning.

**Time Required**: 15-20 minutes  
**Difficulty**: Easy  
**Prerequisites**: VS Code, Node.js 18+, PostgreSQL

---

## Table of Contents

1. [Installation](#installation)
2. [Database Setup](#database-setup)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)
6. [Development Tips](#development-tips)

---

## 🔧 Installation

### Step 1: Install Required Software

#### Windows
1. **Node.js** - Download from https://nodejs.org (LTS version)
   - Run installer and follow steps
   - Verify: `node --version` in PowerShell

2. **PostgreSQL** - Download from https://www.postgresql.org/download/windows/
   - Run installer, remember the password
   - Choose default port 5432
   - Verify: Open pgAdmin or run `psql --version`

3. **Visual Studio Code** - Download from https://code.visualstudio.com
   - Run installer
   - Recommended extensions (see Step 2)

#### macOS
```bash
# Install Node.js (using Homebrew)
brew install node

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Install VS Code
brew install visual-studio-code --cask

# Verify installations
node --version
postgres --version
```

#### Linux (Ubuntu/Debian)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Install VS Code
sudo apt-get install -y code

# Verify installations
node --version
psql --version
```

### Step 2: VS Code Extensions (Recommended)

Open VS Code and install these extensions (Ctrl+Shift+X or Cmd+Shift+X):

Essential:
- **ES7+ React/Redux/React-Native snippets** by dsznajder.es7-react-js-snippets
- **Prettier - Code formatter** by esbenp.prettier-vscode
- **ESLint** by Microsoft
- **Thunder Client** or **REST Client** for API testing

Optional:
- **PostgreSQL** by ms-vscode.cpptools-extension-pack
- **GitLens** by GitKraken
- **Thunder Client** for API testing
- **Tailwind CSS IntelliSense** by bradlc.vscode-tailwindcss

---

## 📊 Database Setup

### Step 1: Create Database

#### Windows (PowerShell)
```powershell
# Open PowerShell as Administrator
psql -U postgres

# In psql prompt:
CREATE DATABASE studyhub_dev;
CREATE USER studyhub_user WITH PASSWORD 'StudyHub123!';
ALTER ROLE studyhub_user SET client_encoding TO 'utf8';
ALTER ROLE studyhub_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE studyhub_user SET default_transaction_deferrable TO on;
ALTER ROLE studyhub_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE studyhub_dev TO studyhub_user;
\q
```

#### macOS/Linux
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# In psql prompt:
CREATE DATABASE studyhub_dev;
CREATE USER studyhub_user WITH PASSWORD 'StudyHub123!';
ALTER ROLE studyhub_user SET client_encoding TO 'utf8';
ALTER ROLE studyhub_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE studyhub_user SET default_transaction_deferrable TO on;
ALTER ROLE studyhub_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE studyhub_dev TO studyhub_user;
\q
```

### Step 2: Load Schema

Open Terminal in VS Code (Ctrl+` or Cmd+`) and run:

#### Windows
```powershell
cd backend
psql -U studyhub_user -d studyhub_dev -f sql/schema.sql -W
# Enter password: StudyHub123!
```

#### macOS/Linux
```bash
cd backend
sudo -u postgres psql -d studyhub_dev -f sql/schema.sql
```

**Verify**: Look for "CREATE TABLE" messages without errors.

---

## ⚙️ Configuration

### Step 1: Clone Repository

In VS Code Terminal:
```bash
git clone https://github.com/yourusername/studyhub.git
cd studyhub
```

Or open folder: File → Open Folder → Select studyhub folder

### Step 2: Frontend Environment

In VS Code, create `.env` file in project root:

```plaintext
# Frontend API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=StudyHub
```

File → New File → Type: `.env`

### Step 3: Backend Environment

In VS Code, open backend folder and create `backend/.env`:

```plaintext
# Backend Configuration
DATABASE_URL=postgresql://studyhub_user:StudyHub123!@localhost:5432/studyhub_dev
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Important**: Change `JWT_SECRET` to something unique!

### Step 4: Install Dependencies

#### Terminal 1: Frontend
```bash
npm install
```

#### Terminal 2: Backend (new Terminal)
```bash
cd backend
npm install
```

---

## 🚀 Running the Application

### Method 1: Using VS Code Terminals (Easiest)

**Step 1**: Open VS Code and your project folder

**Step 2**: Open 2 Terminals:
- Terminal → New Terminal (Ctrl+`)
- Terminal → Split Terminal (Ctrl+\)

**Step 3**: In Terminal 1 (Frontend):
```bash
npm run dev
```
Wait for: `Local: http://localhost:3000`

**Step 4**: In Terminal 2 (Backend):
```bash
cd backend
npm run dev
```
Wait for: `Server running on port 5000`

**Step 5**: Open browser:
- Navigate to http://localhost:3000
- Click "Get Started"
- Register a new account
- You should see the Dashboard ✅

### Method 2: Using VS Code Debug Configuration

**Step 1**: Create `.vscode/launch.json` in project root:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Frontend",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "preLaunchTask": "npm: dev"
    },
    {
      "name": "Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/index.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

**Step 2**: Run from Debug menu (Ctrl+Shift+D)

### Method 3: NPM Scripts

**Frontend + Backend (single terminal)**
```bash
# From root
npm install
cd backend
npm install
cd ..

# Run both (requires separate processes)
npm run dev  # Terminal 1 - Frontend
# Then in new terminal
cd backend && npm run dev  # Terminal 2 - Backend
```

---

## 🧪 Testing the Setup

### 1. Check Frontend

Open http://localhost:3000 in browser:
- [ ] Page loads without errors
- [ ] Navigation menu visible
- [ ] "Get Started" button works

### 2. Check Backend

In VS Code Terminal:
```bash
curl http://localhost:5000/api/auth/health
# Should respond with status 200
```

Or use Thunder Client extension:
- Click Thunder Client icon in VS Code
- New Request → GET → http://localhost:5000/api/auth/health
- Click Send → Should see response

### 3. Test Registration

In browser at http://localhost:3000:
1. Click "Get Started"
2. Enter:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Name: `Test User`
3. Click Register
4. Should redirect to Dashboard ✅

### 4. Test Login

1. Click Logout
2. Enter credentials from Step 3
3. Click Login
4. Should see Dashboard ✅

---

## 🐛 Troubleshooting

### Error: "Module not found"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Error: "Database connection refused"
1. Check PostgreSQL is running:
   - Windows: Services → PostgreSQL
   - macOS: `brew services list`
   - Linux: `sudo systemctl status postgresql`
2. Verify `.env` DATABASE_URL is correct
3. Verify database exists: `psql -U studyhub_user -l`

### Error: "Port 3000 already in use"
```bash
# Kill process using port 3000
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: "API request failed"
1. Check backend is running (see terminal)
2. Verify VITE_API_URL in frontend `.env`
3. Check backend logs for errors
4. Clear browser cache (Ctrl+Shift+Delete)

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
Fix: Check backend `.env` CORS_ORIGIN matches frontend URL

### Port Already in Use (Backend 5000)
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

---

## 💡 Development Tips

### Debug Mode

**Frontend Debugging**:
1. Open DevTools: F12
2. Go to Sources tab
3. Add breakpoints by clicking line numbers
4. Reload page to hit breakpoints

**Backend Debugging**:
1. Add `debugger;` statement in code
2. Run backend with: `node --inspect backend/src/index.js`
3. Open chrome://inspect in Chrome
4. Click "Inspect" next to your process

### Console Logging
```javascript
// Use consistent format for debugging
console.log("[v0] Component mounted")
console.log("[v0] User data:", userData)
console.log("[v0] API response:", response)

// Remove after debugging
```

### Hot Module Replacement (HMR)
- Frontend: Changes auto-reload ✅
- Backend: Restart required (auto with nodemon)

### Testing API Endpoints

Use Thunder Client (VS Code extension):
1. Click Thunder Client icon
2. New Request
3. Paste endpoint: `POST http://localhost:5000/api/auth/login`
4. Go to Body → JSON:
   ```json
   {
     "email": "test@example.com",
     "password": "TestPassword123!"
   }
   ```
5. Click Send

### File Organization

Good structure:
```
src/
├── components/      (Organized by feature)
├── pages/          (Page components)
├── services/       (API calls)
└── styles/         (Global styles)
```

Bad structure:
```
src/
├── Component1.jsx
├── Component2.jsx
├── api.js
└── styles.css
```

### Performance Testing

Check bundle size:
```bash
npm run build
# Output shows bundle size
```

---

## 🎓 Learning Resources

### Frontend (React/Vite)
- React Docs: https://react.dev
- Vite Guide: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com

### Backend (Node/Express)
- Express Docs: https://expressjs.com
- PostgreSQL: https://www.postgresql.org/docs

### Deployment (When Ready)
- Vercel: https://vercel.com/docs
- Railway: https://railway.app/docs
- GitHub Pages: https://pages.github.com

---

## ✅ Verification Checklist

Before moving to production, verify:

- [ ] Frontend loads on http://localhost:3000
- [ ] Backend responds on http://localhost:5000
- [ ] Database initialized with schema
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Dashboard displays data
- [ ] Can create subjects
- [ ] Can create notes
- [ ] Can navigate between pages
- [ ] Theme toggle works
- [ ] Responsive on mobile (F12 → Toggle device toolbar)

---

## 📞 Getting Help

### Quick Fixes
1. Restart terminals (Ctrl+C and rerun)
2. Restart VS Code
3. Check [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)
4. Review [BUG_FIXES_AND_DOCUMENTATION.md](./BUG_FIXES_AND_DOCUMENTATION.md)

### Still Stuck?
- Read [START_HERE.md](./START_HERE.md)
- Check backend logs for errors
- Review browser console for frontend errors
- See [PROJECT_README.md](./PROJECT_README.md) Support section

---

## 🚀 Next Steps

Once everything is running locally:

1. **Explore the Code**
   - Study component structure
   - Understand data flow
   - Review service layer

2. **Make Changes**
   - Create a new feature branch
   - Make code changes
   - See updates with HMR

3. **Test Changes**
   - Use verification checklist
   - Test new features
   - Fix any issues

4. **Deploy**
   - See [DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md) for GitHub
   - See [backend/SETUP.md](./backend/SETUP.md) for backend
   - See deployment guides

---

**Last Updated**: July 23, 2026  
**Difficulty**: ⭐ Easy (15-20 minutes)  
**Status**: ✅ Production Ready

For more info: [START_HERE.md](./START_HERE.md)
