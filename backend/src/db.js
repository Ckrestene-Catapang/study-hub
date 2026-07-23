import pg from "pg";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (err) => {
  console.error("[DB] Unexpected pool error:", err);
});

/**
 * Execute query
 */
export async function query(text, params = []) {
  return pool.query(text, params);
}

/**
 * Get transaction client
 */
export async function getClient() {
  return pool.connect();
}

/**
 * Initialize database
 */
export async function initializeDatabase() {
  try {
    console.log("[DB] Loading schema...");

    const schema = await fs.readFile(
      new URL("../sql/schema.sql", import.meta.url),
      "utf8"
    );

    console.log("[DB] Executing schema...");

    await pool.query(schema);

    console.log("[DB] Database ready ✅");
  } catch (err) {
    console.error("[DB] Failed to initialize database:", err);
    throw err;
  }
}

export default pool;
