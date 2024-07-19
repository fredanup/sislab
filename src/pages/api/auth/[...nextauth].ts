import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import type { AppProviders } from 'next-auth/providers';
import CredentialsProvider from 'next-auth/providers/credentials';

import GoogleProvider from 'next-auth/providers/google';
import { prisma } from 'server/prisma';

let useMockProvider = process.env.NODE_ENV === 'test';
const {NODE_ENV, APP_ENV, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env;
if (
  (NODE_ENV !== 'production' || APP_ENV === 'test') &&
  (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET)
) {
  console.log('⚠️ Using mocked GitHub auth correct credentials were not added');
  useMockProvider = true;
}
const providers: AppProviders = [];
if (useMockProvider) {
  providers.push(
    CredentialsProvider({
      id: 'github',
      name: 'Mocked GitHub',
      async authorize(credentials) {
        if (credentials) {
          const name = credentials.name;
          return {
            id: name,
            name: name,
            email: name,
          };
        }
        return null;
      },
      credentials: {
        name: { type: 'test' },
      },
    }),
  );
} else {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Providers CLIENT_ID and SECRET must be set');
  }
  providers.push(

    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
   
    }),
  );
}
export default NextAuth({
  // Configure one or more authentication providers
  providers,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: session.user ? { ...session.user, id: user.id } : session.user,
    }),
  },
});
