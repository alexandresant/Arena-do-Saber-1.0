import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${STRAPI_URL}/api/auth/local`, {
            identifier: credentials?.email,
            password: credentials?.password,
          })

          const user = res.data
          const jwt = res.data.jwt

          if (!user || !jwt) return null

          const resUser = await axios.get(`${STRAPI_URL}/api/users/me?populate=role`, {
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          })
          
          const role = resUser.data.role?.name

          return {
            id: user.user.id,
            name: user.user.username,
            email: user.user.email,
            jwt,
            role
          }
        } catch (error) {
          console.error("Login error", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.jwt = (user as any).jwt
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = (token as any).role
        ;(session as any).jwt = token.jwt
      }
      return session
    },
  },
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
