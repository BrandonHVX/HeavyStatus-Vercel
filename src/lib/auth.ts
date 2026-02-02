import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { supabaseAdmin, User } from './supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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

        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', credentials.email.toLowerCase())
          .single();

        if (error || !user) {
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
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', user.email!.toLowerCase())
          .single();

        if (!existingUser) {
          const { error } = await supabaseAdmin.from('users').insert({
            email: user.email!.toLowerCase(),
            name: user.name,
          });
          if (error) {
            console.error('Error creating user:', error);
            return false;
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const { data: dbUser } = await supabaseAdmin
          .from('users')
          .select('id, subscription_status, stripe_customer_id')
          .eq('email', user.email!.toLowerCase())
          .single();

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
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function createUser(email: string, password: string, name?: string): Promise<User | null> {
  const hashedPassword = await bcrypt.hash(password, 12);

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      name: name || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data as User;
}

export async function updateUserSubscription(
  userId: string,
  updates: {
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    subscription_status?: 'active' | 'canceled' | 'past_due' | 'inactive';
    subscription_end_date?: string;
  }
): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user subscription:', error);
    return null;
  }

  return data as User;
}
