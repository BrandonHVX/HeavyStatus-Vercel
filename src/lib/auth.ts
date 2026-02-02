import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { query, User } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ] : []),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        const user = await getUserByEmail(credentials.email);

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (!user.password_hash) {
          throw new Error('Please sign in with Google');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await getUserByEmail(user.email!);

        if (!existingUser) {
          await createUserFromGoogle(user.email!, user.name || null);
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user || trigger === 'update') {
        const dbUser = await getUserByEmail(token.email!);

        if (dbUser) {
          token.userId = dbUser.id;
          token.subscriptionStatus = dbUser.subscription_status;
          token.stripeCustomerId = dbUser.stripe_customer_id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.userId;
        (session.user as any).subscriptionStatus = token.subscriptionStatus;
        (session.user as any).stripeCustomerId = token.stripeCustomerId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
};

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  return result.rows[0] || null;
}

export async function getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE stripe_customer_id = $1',
    [stripeCustomerId]
  );
  return result.rows[0] || null;
}

export async function createUser(email: string, password: string, name?: string): Promise<User | null> {
  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await query(
    `INSERT INTO users (email, password_hash, name) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [email.toLowerCase(), hashedPassword, name || null]
  );

  return result.rows[0] || null;
}

async function createUserFromGoogle(email: string, name: string | null): Promise<User | null> {
  const result = await query(
    `INSERT INTO users (email, name) 
     VALUES ($1, $2) 
     RETURNING *`,
    [email.toLowerCase(), name]
  );

  return result.rows[0] || null;
}

export async function updateUserSubscription(
  id: string,
  updates: {
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    subscription_status?: 'active' | 'canceled' | 'past_due' | 'inactive';
    subscription_end_date?: string;
  }
): Promise<User | null> {
  const setClauses: string[] = ['updated_at = NOW()'];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.stripe_customer_id !== undefined) {
    setClauses.push(`stripe_customer_id = $${paramIndex++}`);
    values.push(updates.stripe_customer_id);
  }
  if (updates.stripe_subscription_id !== undefined) {
    setClauses.push(`stripe_subscription_id = $${paramIndex++}`);
    values.push(updates.stripe_subscription_id);
  }
  if (updates.subscription_status !== undefined) {
    setClauses.push(`subscription_status = $${paramIndex++}`);
    values.push(updates.subscription_status);
  }
  if (updates.subscription_end_date !== undefined) {
    setClauses.push(`subscription_end_date = $${paramIndex++}`);
    values.push(updates.subscription_end_date);
  }

  values.push(id);

  const result = await query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

export async function updateUserByStripeCustomerId(
  stripeCustomerId: string,
  updates: {
    stripe_subscription_id?: string;
    subscription_status?: 'active' | 'canceled' | 'past_due' | 'inactive';
    subscription_end_date?: string;
  }
): Promise<User | null> {
  const setClauses: string[] = ['updated_at = NOW()'];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.stripe_subscription_id !== undefined) {
    setClauses.push(`stripe_subscription_id = $${paramIndex++}`);
    values.push(updates.stripe_subscription_id);
  }
  if (updates.subscription_status !== undefined) {
    setClauses.push(`subscription_status = $${paramIndex++}`);
    values.push(updates.subscription_status);
  }
  if (updates.subscription_end_date !== undefined) {
    setClauses.push(`subscription_end_date = $${paramIndex++}`);
    values.push(updates.subscription_end_date);
  }

  values.push(stripeCustomerId);

  const result = await query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE stripe_customer_id = $${paramIndex} RETURNING *`,
    values
  );

  return result.rows[0] || null;
}
