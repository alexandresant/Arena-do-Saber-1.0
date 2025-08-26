import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      role?: string | null // Adiciona o campo role à interface User
      character: string
    }
    jwt: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    jwt: string
    role?: string
    admin_verified?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    jwt: string
  }
}
