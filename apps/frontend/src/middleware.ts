import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"




export function middleware(req: NextRequest){
    const {pathname} = req.nextUrl
    const token = getToken({req, secret: process.env.NEXTAUTH_SECRET})

    const publicsPaths = [
    "/login",
    "/register",
    "/forgot-password"
]

    if(publicsPaths.some((path) => pathname.startsWith(path))){
        return NextResponse.next()
    }

    if(!token){
        return NextResponse.redirect(new URL('/login', req.url))
    }
    return
}

export default createMiddleware(routing)
    export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)', '/(pt-BR|en)/:path*'],
}
