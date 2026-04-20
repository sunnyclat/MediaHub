import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let userRolesReady;

export async function ensureUserRolesReady() {
  if (userRolesReady) {
    return userRolesReady;
  }

  userRolesReady = (async () => {
    const [rows] = await pool.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'role'
       LIMIT 1`
    );

    if (rows.length === 0) {
      await pool.query(
        "ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' AFTER password_hash"
      );
    }
  })();

  return userRolesReady;
}
