# StudyHub Database Schema

## Overview

StudyHub uses PostgreSQL as the primary data store. The schema is designed to support a room-based collaborative learning platform with user authentication, note-taking, flashcards, quizzes, and discussions.

## Database Connection

### Local Development
```sql
postgresql://user:password@localhost:5432/studyhub_dev
```

### Production
```sql
postgresql://user:password@db-host:5432/studyhub_prod
```

## Schema Initialization

The schema is automatically initialized when the backend server starts:

```bash
npm run dev  # Initializes database from backend/sql/schema.sql
```

## Core Tables

### 1. Users Table
Stores user account information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  plan VARCHAR(50) DEFAULT 'free',  -- free, pro, premium
  status VARCHAR(50) DEFAULT 'active',  -- active, suspended, deleted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);
```

**Indexes:**
- `idx_users_email` - Fast email lookups for authentication
- `idx_users_status` - Filter active users

### 2. Sessions Table
Tracks active user sessions and JWT tokens.

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,  -- SHA256 hash of token
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP  -- NULL until explicitly revoked (logout)
);
```

**Indexes:**
- `idx_sessions_user_id` - Look up sessions by user
- `idx_sessions_expires_at` - Clean up expired sessions

### 3. Password Reset Tokens Table
Handles password reset requests.

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,  -- NULL until token is used
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Rooms Table
Represents collaborative study rooms (subject collections).

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(10) UNIQUE,  -- Invite code for joining
  status VARCHAR(50) DEFAULT 'active',  -- active, archived, deleted
  settings JSONB DEFAULT '{}',  -- Flexible settings storage
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_rooms_owner_id` - Get user's owned rooms

### 5. Room Members Table
Tracks room membership and roles.

```sql
CREATE TABLE room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'student',  -- owner, teacher, moderator, student, guest
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(room_id, user_id)
);
```

**Constraints:**
- One user can only have one role per room

**Indexes:**
- `idx_room_members_room_id` - Get room members
- `idx_room_members_user_id` - Get user's rooms

### 6. Notes Table
Stores user notes within rooms.

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],  -- Array of tags
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_notes_room_id` - Get notes in a room
- `idx_notes_user_id` - Get user's notes

### 7. Flashcards Table
Stores flashcard decks for spaced repetition learning.

```sql
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  front TEXT NOT NULL,  -- Question/Term
  back TEXT NOT NULL,   -- Answer/Definition
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Flashcard Progress Table
Tracks user progress through flashcards (spaced repetition algorithm).

```sql
CREATE TABLE flashcard_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mastery_level INTEGER DEFAULT 0,  -- 0-5 scale
  review_count INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(flashcard_id, user_id)
);
```

### 9. Quizzes Table
Stores quiz assessments.

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  time_limit INTEGER,  -- in minutes
  shuffle_questions BOOLEAN DEFAULT false,
  show_answers BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Quiz Questions Table
Stores individual quiz questions.

```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type VARCHAR(50) DEFAULT 'multiple_choice',
  options TEXT[],  -- For multiple choice
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  order INTEGER
);
```

### 11. Quiz Submissions Table
Tracks user quiz attempts.

```sql
CREATE TABLE quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  total_points DECIMAL(5,2),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  time_taken INTEGER  -- in seconds
);
```

## Data Relationships

```
users (1) ──→ (many) sessions
  ↓
users (1) ──→ (many) rooms (owner)
  ↓
rooms (1) ──→ (many) room_members (members)
  ↓
room_members (many) ←─ (many) users

users (1) ──→ (many) notes
  ↓
rooms (1) ──→ (many) notes

users (1) ──→ (many) flashcards
  ↓
rooms (1) ──→ (many) flashcards
  ↓
flashcards (1) ──→ (many) flashcard_progress

users (1) ──→ (many) quiz_submissions
  ↓
quizzes (1) ──→ (many) quiz_submissions
```

## Performance Optimization

### Indexes
All frequently queried columns have indexes:
- Email lookups (authentication)
- User relationships (notes, flashcards, quizzes)
- Room membership queries
- Session expiration queries

### Query Patterns

**Get user's rooms:**
```sql
SELECT r.* FROM rooms r
JOIN room_members rm ON r.id = rm.room_id
WHERE rm.user_id = $1 AND r.status = 'active'
```

**Get room members with user details:**
```sql
SELECT rm.*, u.email, u.name, u.avatar_url FROM room_members rm
JOIN users u ON rm.user_id = u.id
WHERE rm.room_id = $1
```

**Get user's study progress:**
```sql
SELECT fp.*, f.front, f.back FROM flashcard_progress fp
JOIN flashcards f ON fp.flashcard_id = f.id
WHERE fp.user_id = $1
ORDER BY fp.last_reviewed_at ASC
```

## Scalability

### Connection Pooling
- 20 concurrent connections (configurable)
- Automatic cleanup of idle connections

### Partitioning (Future)
For high-traffic scenarios:
- Partition notes by room_id
- Partition quiz_submissions by user_id
- Archive old submissions

### Backup Strategy
- Daily backups (production)
- Point-in-time recovery enabled
- WAL archiving for durability

## Maintenance

### Regular Tasks
- Monitor query performance
- Analyze and VACUUM tables monthly
- Update table statistics
- Archive old sessions
- Clean up expired password reset tokens

### Example Cleanup Queries
```sql
-- Remove expired sessions
DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;

-- Remove used password reset tokens older than 7 days
DELETE FROM password_reset_tokens 
WHERE used_at < CURRENT_TIMESTAMP - INTERVAL '7 days';

-- Archive old submissions (if using partitioning)
DELETE FROM quiz_submissions 
WHERE submitted_at < CURRENT_TIMESTAMP - INTERVAL '1 year';
```

## Schema Migration

For production updates:
1. Write migration scripts in `backend/sql/migrations/`
2. Test on staging database first
3. Apply with downtime (or use zero-downtime migration strategies)
4. Verify data integrity
5. Update schema.sql with new definition

## Constraints & Integrity

- Primary keys: UUID (collision-resistant, can generate offline)
- Foreign keys: Cascade on delete (orphaned data cleanup)
- Unique constraints: Email per user, one session per token
- Check constraints: Can be added for enums (status, role, etc.)

## Extensions

PostgreSQL extensions used:
- `pgcrypto` - UUID generation (gen_random_uuid())
