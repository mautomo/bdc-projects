import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthType, UserRole, UserStatus } from "@prisma/client"
import { createAuditLog } from "@/lib/audit"

// Allowed domains for Google SSO
const ALLOWED_DOMAINS = ["vandoko.ai", "strolid.com"]

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prisma.user.findUnique({
          where: { 
            email: credentials.email.toLowerCase(),
          },
        })

        if (!user || user.authType !== AuthType.PASSWORD) {
          throw new Error("Invalid credentials")
        }

        if (user.status !== UserStatus.ACTIVE) {
          throw new Error("Account is not active")
        }

        if (!user.password) {
          throw new Error("Password not set for this account")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google SSO
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase()
        
        if (!email) {
          return false
        }

        // Check if domain is allowed
        const domain = email.split("@")[1]
        if (!ALLOWED_DOMAINS.includes(domain)) {
          return false
        }

        // Find or create user
        let dbUser = await prisma.user.findUnique({
          where: { email },
        })

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
              authType: AuthType.GOOGLE_SSO,
              role: UserRole.USER,
              status: UserStatus.ACTIVE,
            },
          })
        } else {
          // Update user info
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              name: user.name,
              image: user.image,
              lastLoginAt: new Date(),
            },
          })
        }

        // Create audit log
        await createAuditLog({
          userId: dbUser.id,
          action: "LOGIN",
          resource: "AUTH",
          details: { provider: "google", domain },
        })

        return dbUser.status === UserStatus.ACTIVE
      }

      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role
          session.user.status = dbUser.status
          session.user.authType = dbUser.authType
          
          // Check if user is still active
          if (dbUser.status !== UserStatus.ACTIVE) {
            throw new Error("Account is not active")
          }
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.authType = user.authType
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signOut({ token }) {
      if (token.sub) {
        await createAuditLog({
          userId: token.sub,
          action: "LOGOUT",
          resource: "AUTH",
        })
      }
    },
  },
}