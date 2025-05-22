// app/middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log("Middleware running for:", pathname);

    // Get cookies using NextRequest's built-in method
    const userSession = request.cookies.get('userSession')?.value;
    console.log("userSession:", userSession);

    // Protected routes
    const protectedRoutes = ['/dashboard', '/profile', '/data-center', '/user', '/'];
    
    // If user is trying to access protected route without session
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!userSession) {
            console.log("Redirecting to login");
            return NextResponse.redirect(new URL('/login', request.url));
        }
    } 
    // If user has session and is trying to access login page
    else if (pathname === '/login' && userSession) {
        console.log("Redirecting to dashboard");
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*', 
        '/profile/:path*', 
        '/data-center/:path*',
        '/user/:path*',
        '/'
    ],
};