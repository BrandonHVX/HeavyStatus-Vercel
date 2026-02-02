import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      subscription_status TEXT DEFAULT 'inactive',
      subscription_end_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  
  await query(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
  `);
  
  await query(`
    CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id)
  `);
}

export type User = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: 'active' | 'canceled' | 'past_due' | 'inactive' | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
};
