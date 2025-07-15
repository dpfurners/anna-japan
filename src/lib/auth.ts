import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Get credentials from environment variables
const ANNA_USERNAME = process.env.AUTH_ANNA_USERNAME || 'anna'
const ANNA_PASSWORD = process.env.AUTH_ANNA_PASSWORD || 'iloveyou'
const DANIEL_USERNAME = process.env.AUTH_DANIEL_USERNAME || 'daniel'
const DANIEL_PASSWORD = process.env.AUTH_DANIEL_PASSWORD || 'secretpassword'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Check if it's Anna (viewer)
        if (
          credentials.username === ANNA_USERNAME &&
          credentials.password === ANNA_PASSWORD
        ) {
          return {
            id: '1',
            name: 'Anna',
            email: 'anna@example.com',
            role: 'viewer'
          }
        }
        
        // Check if it's Daniel (author)
        if (
          credentials.username === DANIEL_USERNAME &&
          credentials.password === DANIEL_PASSWORD
        ) {
          return {
            id: '2',
            name: 'Daniel',
            email: 'daniel@example.com',
            role: 'author'
          }
        }
        
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-for-development',
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    }
  }
}
