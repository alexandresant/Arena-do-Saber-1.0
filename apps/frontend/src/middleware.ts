//apps/frontend/src/middleware.ts

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rotas públicas que não requerem autenticação
const publicsPaths = [
    "/login",
    "/register",
    "/forgot-password"
];

// Instancia o middleware de internacionalização
const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Remove a locale do pathname para verificar se a rota é pública
    const isPublicPath = publicsPaths.some((path) => pathname.replace(/\/(pt-BR|en)/, '').startsWith(path));

    // --- 1. Lógica de Autenticação ---
    // A autenticação deve vir antes de tudo, exceto para as rotas públicas.
    if (!isPublicPath) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            // Redireciona para a página de login se não houver token
            // A locale será adicionada automaticamente pelo intlMiddleware na próxima chamada.
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    // --- 2. Lógica de Internacionalização ---
    // Após a verificação da autenticação, a requisição é passada para o next-intl.
    // Isso garante que a rota seja processada corretamente para o idioma.
    return intlMiddleware(req);
}

export const config = {
    // Este matcher garante que o middleware seja executado para todas as rotas, exceto API, arquivos estáticos, etc.
    matcher: ['/((?!api|_next|.*\\..*).*)', '/(pt-BR|en)/:path*'],
};