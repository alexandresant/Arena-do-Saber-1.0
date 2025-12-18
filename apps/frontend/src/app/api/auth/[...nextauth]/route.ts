// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
export const authOptions: NextAuthOptions = {
  providers: [
    // Exemplo com o GitHub Provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // Provedor de credenciais (Strapi)
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
          console.log(res.data)

          const user = res.data
          const jwt = res.data.jwt

          if (!user) {
            return (
              null
            )
          }

          const resUser = await axios.get(`${STRAPI_URL}/api/users/me?populate=role`, {
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          })
          console.log("Dados completos do usuário:", resUser.data)
          const role = resUser.data.role?.name


          return {
            id: user.user.id,
            name: user.user.username,
            email: user.user.email,
            jwt, // incluir o JWT na resposta do usuário
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
    strategy: "jwt", // usar JWT em vez de salvar em banco
  },
  callbacks: {
    async jwt({ token, user, }) {
      if (user) {
        token.id = user.id
        token.jwt = (user as any).jwt
        token.role = user.role // 🔹 salva a role no token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = (token as any).role // 🔹 salva a role na session
          ; (session as any).jwt = token.jwt
      }
      return session
    },
  },

cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax', // Importante para cross-site entre Vercel e Render
        path: '/',
        secure: true // Vercel sempre usa HTTPS
      },
    },
  },
}

// Crie o handler com base nas opções
const handler = NextAuth(authOptions)

// Exporte os métodos GET e POST
export { handler as GET, handler as POST }
