import dotenv from 'dotenv'
import { pool } from '../src/db.js'
import { hashPassword } from '../src/utils/auth.js'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

/**
 * Seed demo account with sample notes and quizzes
 * Run: node scripts/seed-demo.js
 */

async function seedDemo() {
  const client = await pool.connect()

  try {
    console.log('[SEED] Starting demo data seeding...')

    // Create demo user
    const demoUserId = uuidv4()
    const demoEmail = 'demo@studyhub.local'
    const demoPassword = 'demo123456'
    const demoPasswordHash = await hashPassword(demoPassword)

    console.log('[SEED] Creating demo account...')

    // Check if demo user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [demoEmail]
    )

    if (existingUser.rows.length > 0) {
      console.log('[SEED] Demo account already exists, skipping user creation...')
    } else {
      await client.query(
        `INSERT INTO users (id, email, name, password_hash, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [demoUserId, demoEmail, 'Demo User', demoPasswordHash, 'active']
      )
      console.log('[SEED] Demo account created:', demoEmail)
    }

    // Get demo user ID (in case it already existed)
    const userResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [demoEmail]
    )
    const finalDemoUserId = userResult.rows[0].id

    // Create demo room
    console.log('[SEED] Creating demo room...')
    const roomId = uuidv4()
    const inviteCode = 'DEMO2024'

    await client.query(
      `INSERT INTO rooms (id, name, description, owner_id, invite_code, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO NOTHING`,
      [
        roomId,
        'Demo Study Room',
        'This is a demo room showcasing StudyHub features. Feel free to create your own notes and quizzes!',
        finalDemoUserId,
        inviteCode,
        true,
      ]
    )
    console.log('[SEED] Demo room created with code:', inviteCode)

    // Add demo user as owner to room
    await client.query(
      `INSERT INTO room_members (id, room_id, user_id, role, joined_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (room_id, user_id) DO NOTHING`,
      [uuidv4(), roomId, finalDemoUserId, 'owner']
    )

    // Create sample notes
    console.log('[SEED] Creating sample notes...')

    const sampleNotes = [
      {
        title: 'React Hooks Fundamentals',
        content:
          'useState: Manage component state\nuseEffect: Handle side effects\nuseContext: Access context without prop drilling\n\nKey rules:\n- Only call hooks at top level\n- Only call hooks from React components',
        tags: ['React', 'JavaScript', 'Frontend'],
      },
      {
        title: 'Database Design Principles',
        content:
          'Normalization: Reduce data redundancy\n\nForms:\n1NF: Atomic values only\n2NF: No partial dependencies\n3NF: No transitive dependencies\n\nIndexing improves query performance significantly.',
        tags: ['Databases', 'SQL', 'Backend'],
      },
      {
        title: 'API Best Practices',
        content:
          'RESTful principles:\n- Use correct HTTP methods (GET, POST, PUT, DELETE)\n- Use appropriate status codes (200, 201, 400, 401, 404, 500)\n- Version your APIs\n- Use meaningful error messages\n- Implement rate limiting and authentication',
        tags: ['API', 'Backend', 'Best Practices'],
      },
    ]

    for (const noteData of sampleNotes) {
      const noteId = uuidv4()
      await client.query(
        `INSERT INTO notes (id, user_id, room_id, title, content, tags, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          noteId,
          finalDemoUserId,
          roomId,
          noteData.title,
          noteData.content,
          JSON.stringify(noteData.tags),
        ]
      )
      console.log('[SEED] Note created:', noteData.title)
    }

    // Create sample quizzes
    console.log('[SEED] Creating sample quizzes...')

    const quizzes = [
      {
        title: 'JavaScript Basics',
        description: 'Test your knowledge of JavaScript fundamentals',
        questions: [
          {
            question: 'What is the difference between let and const?',
            type: 'short_answer',
            answer:
              'const cannot be reassigned, let can be reassigned but not redeclared in same scope',
            points: 2,
          },
          {
            question:
              'Which keyword is used to create an asynchronous function in JavaScript?',
            type: 'short_answer',
            answer: 'async',
            points: 1,
          },
          {
            question: 'What does JSON stand for?',
            type: 'short_answer',
            answer: 'JavaScript Object Notation',
            points: 1,
          },
        ],
      },
      {
        title: 'Web Development Concepts',
        description: 'General web development knowledge',
        questions: [
          {
            question: 'What does HTTP stand for?',
            type: 'short_answer',
            answer: 'HyperText Transfer Protocol',
            points: 1,
          },
          {
            question: 'What is the purpose of CSS?',
            type: 'short_answer',
            answer:
              'To style and layout web pages, control appearance and positioning of HTML elements',
            points: 2,
          },
        ],
      },
    ]

    for (const quizData of quizzes) {
      const quizId = uuidv4()

      await client.query(
        `INSERT INTO quizzes (id, room_id, user_id, title, description, is_published, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [quizId, roomId, finalDemoUserId, quizData.title, quizData.description, true]
      )
      console.log('[SEED] Quiz created:', quizData.title)

      // Add questions to quiz
      for (let i = 0; i < quizData.questions.length; i++) {
        const q = quizData.questions[i]
        await client.query(
          `INSERT INTO quiz_questions (id, quiz_id, question, question_type, correct_answer, points, order_num, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
          [
            uuidv4(),
            quizId,
            q.question,
            q.type,
            q.answer,
            q.points,
            i + 1,
          ]
        )
      }
    }

    console.log('\n[SEED] Demo seeding complete!')
    console.log('---------------------------------------')
    console.log('Demo Credentials:')
    console.log('Email:', demoEmail)
    console.log('Password:', demoPassword)
    console.log('Room Invite Code:', inviteCode)
    console.log('---------------------------------------\n')
  } catch (error) {
    console.error('[SEED] Error during seeding:', error.message)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Run seeding
seedDemo().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
