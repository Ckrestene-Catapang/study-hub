/**
 * Data Models / Schemas
 * Defines the structure and validation rules for data entities
 */

/**
 * User Schema
 */
export const UserSchema = {
  id: 'UUID',
  email: 'VARCHAR(255) UNIQUE NOT NULL',
  name: 'VARCHAR(255) NOT NULL',
  password_hash: 'VARCHAR(255) NOT NULL',
  avatar_url: 'TEXT',
  bio: 'TEXT',
  plan: "VARCHAR(50) DEFAULT 'free'", // free, pro, premium
  status: "VARCHAR(50) DEFAULT 'active'", // active, suspended, deleted
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  last_login_at: 'TIMESTAMP',
}

/**
 * Room Schema
 */
export const RoomSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  owner_id: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE',
  name: 'VARCHAR(255) NOT NULL',
  description: 'TEXT',
  code: 'VARCHAR(10) UNIQUE', // Invite code
  status: "VARCHAR(50) DEFAULT 'active'", // active, archived, deleted
  settings: "JSONB DEFAULT '{}'", // Flexible settings storage
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
}

/**
 * Room Member Schema
 */
export const RoomMemberSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  room_id: 'UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE',
  user_id: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE',
  role: "VARCHAR(50) DEFAULT 'student'", // owner, teacher, moderator, student, guest
  joined_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
}

/**
 * Note Schema
 */
export const NoteSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  room_id: 'UUID REFERENCES rooms(id) ON DELETE CASCADE',
  user_id: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE',
  title: 'VARCHAR(255) NOT NULL',
  content: 'TEXT NOT NULL',
  tags: 'TEXT[]', // Array of tags
  is_pinned: 'BOOLEAN DEFAULT false',
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
}

/**
 * Flashcard Schema
 */
export const FlashcardSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  room_id: 'UUID REFERENCES rooms(id) ON DELETE CASCADE',
  user_id: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE',
  front: 'TEXT NOT NULL', // Question/Term
  back: 'TEXT NOT NULL', // Answer/Definition
  tags: 'TEXT[]',
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
}

/**
 * Flashcard Progress Schema
 */
export const FlashcardProgressSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  flashcard_id: 'UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE',
  user_id: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE',
  mastery_level: 'INTEGER DEFAULT 0', // 0-5 scale
  review_count: 'INTEGER DEFAULT 0',
  last_reviewed_at: 'TIMESTAMP',
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
}

/**
 * Quiz Schema
 */
export const QuizSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  room_id: 'UUID REFERENCES rooms(id) ON DELETE CASCADE',
  creator_id: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE',
  title: 'VARCHAR(255) NOT NULL',
  description: 'TEXT',
  time_limit: 'INTEGER', // in minutes
  shuffle_questions: 'BOOLEAN DEFAULT false',
  show_answers: 'BOOLEAN DEFAULT true',
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
}

/**
 * Quiz Question Schema
 */
export const QuizQuestionSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  quiz_id: 'UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE',
  question: 'TEXT NOT NULL',
  question_type: "VARCHAR(50) DEFAULT 'multiple_choice'", // multiple_choice, short_answer, true_false
  options: 'TEXT[]', // For multiple choice
  correct_answer: 'TEXT NOT NULL',
  points: 'INTEGER DEFAULT 1',
  order: 'INTEGER',
}

/**
 * Quiz Submission Schema
 */
export const QuizSubmissionSchema = {
  id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
  quiz_id: 'UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE',
  user_id: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE',
  score: 'DECIMAL(5,2)',
  total_points: 'DECIMAL(5,2)',
  submitted_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  time_taken: 'INTEGER', // in seconds
}

/**
 * Validation Rules
 */
export const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format',
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[A-Z])(?=.*[0-9])/, // At least one uppercase and one number
    message: 'Password must be at least 8 characters with uppercase and number',
  },
  name: {
    minLength: 2,
    maxLength: 255,
    message: 'Name must be 2-255 characters',
  },
  roomName: {
    minLength: 2,
    maxLength: 255,
    message: 'Room name must be 2-255 characters',
  },
  noteTitle: {
    minLength: 1,
    maxLength: 255,
    message: 'Note title must be 1-255 characters',
  },
}

export default {
  UserSchema,
  RoomSchema,
  RoomMemberSchema,
  NoteSchema,
  FlashcardSchema,
  FlashcardProgressSchema,
  QuizSchema,
  QuizQuestionSchema,
  QuizSubmissionSchema,
  ValidationRules,
}
