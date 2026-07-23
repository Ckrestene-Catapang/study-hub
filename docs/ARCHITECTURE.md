# StudyHub Architecture

## Overview

StudyHub is a modern, scalable learning platform built with a React frontend and Express.js backend, using PostgreSQL for data persistence.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                    (Vite + React Router)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            UI Layer (Components)                        │   │
│  │  ├── Pages (Dashboard, Subjects, Notes, etc.)          │   │
│  │  ├── Components (reusable UI building blocks)          │   │
│  │  └── Layouts (DashboardLayout, etc.)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Services Layer (API Clients)                 │   │
│  │  ├── authService (authentication)                       │   │
│  │  ├── roomService (room management)                      │   │
│  │  ├── noteService (note CRUD)                            │   │
│  │  ├── flashcardService (study cards)                     │   │
│  │  └── quizService (assessments)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            State Management (Context API)               │   │
│  │  ├── AuthContext (user auth state)                      │   │
│  │  └── Custom hooks (useAuth, etc.)                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            HTTP API Layer (Routes)                      │   │
│  │  ├── /api/auth/* (authentication)                       │   │
│  │  ├── /api/rooms/* (room management)                     │   │
│  │  ├── /api/notes/* (note operations)                     │   │
│  │  ├── /api/flashcards/* (study cards)                    │   │
│  │  └── /api/quizzes/* (assessments)                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Controllers Layer                            │   │
│  │  ├── authController (auth logic)                        │   │
│  │  ├── roomController (room logic)                        │   │
│  │  ├── noteController (note logic)                        │   │
│  │  └── ...                                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Services Layer (Business Logic)              │   │
│  │  ├── authService (user auth, sessions, tokens)          │   │
│  │  ├── roomService (room operations)                      │   │
│  │  ├── noteService (note operations)                      │   │
│  │  ├── flashcardService (study logic)                     │   │
│  │  └── quizService (quiz logic)                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Database Layer                               │   │
│  │  ├── Database queries                                   │   │
│  │  ├── Transaction management                             │   │
│  │  └── Query helpers                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ TCP/SQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Data Persistence Layer                       │   │
│  │  ├── users, sessions, password_reset_tokens            │   │
│  │  ├── rooms, room_members                                │   │
│  │  ├── notes                                              │   │
│  │  ├── flashcards, flashcard_progress                     │   │
│  │  ├── quizzes, quiz_questions, quiz_submissions          │   │
│  │  └── discussions, messages (Phase 2+)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **Vite 6** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client for API requests
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express 4** - Web framework
- **PostgreSQL 12+** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **express-validator** - Input validation

### Deployment
- **Vercel** - Frontend hosting
- **Railway / Neon / Render** - Database hosting

## Data Flow

### Authentication Flow
```
User Input → Login Form
    ↓
Frontend: authService.login()
    ↓
Axios POST /api/auth/login
    ↓
Backend: authController.login()
    ↓
Backend: authService.loginUser() (business logic)
    ↓
Database: Query users table
    ↓
Backend: Generate JWT token
    ↓
Frontend: Store token in localStorage
    ↓
Frontend: Update AuthContext
    ↓
Frontend: Redirect to dashboard
```

### API Request Flow
```
React Component
    ↓
Call Service Method (e.g., noteService.getNotes())
    ↓
Service prepares payload
    ↓
apiClient.get() sends HTTP request
    ↓
Backend receives request
    ↓
Middleware (auth, validation)
    ↓
Route handler
    ↓
Controller (request handling)
    ↓
Service (business logic)
    ↓
Database queries
    ↓
Controller formats response
    ↓
apiClient receives response
    ↓
Service processes data
    ↓
Component updates state
    ↓
UI re-renders
```

## Folder Structure

### Frontend
```
src/
├── pages/              # Page components
│   ├── DashboardPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── ...
├── components/         # Reusable UI components
│   ├── layout/        # Layout components
│   ├── ui/            # Basic UI components
│   └── shared/        # Shared components
├── services/          # API client services
│   ├── authService.js
│   ├── roomService.js
│   ├── noteService.js
│   └── ...
├── context/           # React Context providers
│   ├── AuthContext.jsx
│   └── ...
├── hooks/             # Custom React hooks
│   └── useAuth.js
├── utils/             # Utility functions
│   ├── errorHandler.js
│   └── ...
├── constants/         # Constants and enums
│   ├── routes.js
│   └── ...
└── App.jsx            # Root component
```

### Backend
```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   └── ...
│   ├── routes/         # API route definitions
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   └── ...
│   ├── services/       # Business logic
│   │   ├── authService.js
│   │   ├── roomService.js
│   │   ├── noteService.js
│   │   └── ...
│   ├── middleware/     # Express middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── database/       # Database helpers
│   │   └── queryHelpers.js
│   ├── models/         # Data schemas
│   │   └── schemas.js
│   ├── utils/          # Utilities
│   │   ├── errorHandler.js
│   │   ├── auth.js
│   │   └── logger.js
│   ├── config/         # Configuration
│   │   └── index.js
│   ├── db.js           # Database connection
│   └── index.js        # Server entry point
├── sql/
│   └── schema.sql      # Database schema
└── tests/              # Test files
```

## Authentication System

### JWT Flow
1. User registers/logs in
2. Backend creates JWT token containing userId and email
3. Frontend stores token in localStorage
4. Token is sent in Authorization header for all requests
5. Backend validates token on protected endpoints
6. Session is stored in database for tracking

### Session Management
- Sessions stored in `sessions` table
- Token hashes stored (never raw tokens)
- Expiry validation on token verification
- Logout revokes session

## Middleware Stack

### Frontend (Request Interceptor)
1. Add Authorization header with JWT
2. Send request
3. Handle 401 responses (expired token)

### Backend
1. CORS middleware (allow frontend origins)
2. Body parser (JSON)
3. Request logging
4. Authentication check (for protected routes)
5. Input validation
6. Error handling

## Scalability Considerations

- Database connection pooling (20 connections)
- Stateless JWT authentication (horizontal scaling ready)
- Modular service architecture (easy to split into microservices)
- Error codes standardized (enables client-side retry logic)
- Indexed database queries (room_id, user_id)

## Performance Optimization

- Frontend:
  - Code splitting with React.lazy()
  - Lazy loading routes
  - Memoization for components
  - Local caching of authentication state

- Backend:
  - Database indexes on frequently queried columns
  - Connection pooling
  - Input validation prevents invalid queries
  - Pagination support (ready for implementation)

## Future Enhancements

- Real-time features (WebSocket for chat)
- File uploads (notes, resources)
- Analytics and reporting
- Mobile app
- Offline support
- Advanced AI tutoring
