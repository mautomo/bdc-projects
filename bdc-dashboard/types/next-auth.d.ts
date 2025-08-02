import NextAuth from "next-auth"
import { UserRole, UserStatus, AuthType } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
      status: UserStatus
      authType: AuthType
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: UserRole
    status: UserStatus
    authType: AuthType
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    status: UserStatus
    authType: AuthType
  }
}