// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

// Defina as suas opções de autenticação
export const authOptions: NextAuthOptions = {
  providers: [
    // Exemplo com o GitHub Provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // Adicione outros provedores aqui, se necessário
  ],
};

// Crie o handler com base nas opções
const handler = NextAuth(authOptions);

// Exporte os métodos GET e POST
export { handler as GET, handler as POST };