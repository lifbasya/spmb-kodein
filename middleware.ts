import { withAuth } from 'next-auth/middleware';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const middleware = withAuth(
  function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;

    // Check admin routes
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check student routes
    if (
      ['/dashboard', '/application', '/documents', '/status'].some((path) =>
        pathname.startsWith(path)
      )
    ) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      if (token.role !== 'STUDENT' && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const publicPaths = ['/login', '/register', '/'];
        const pathname = req.nextUrl.pathname;

        if (publicPaths.includes(pathname)) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next|public|fonts).*)'],
};
