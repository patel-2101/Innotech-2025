import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes configuration
  const protectedRoutes = {
    '/citizen': ['CITIZEN'],
    '/officer': ['OFFICER'],
    '/worker': ['WORKER'],
    '/admin': ['ADMIN'],
  };

  // Check if the current path is protected
  const matchedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('authToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirect to appropriate login page
      const role = protectedRoutes[matchedRoute as keyof typeof protectedRoutes][0];
      return NextResponse.redirect(new URL(`/login/${role.toLowerCase()}`, request.url));
    }

    // Verify token
    const payload = await verifyToken(token);
    
    if (!payload) {
      // Token is invalid, redirect to login
      const role = protectedRoutes[matchedRoute as keyof typeof protectedRoutes][0];
      return NextResponse.redirect(new URL(`/login/${role.toLowerCase()}`, request.url));
    }

    // Check if user has the required role
    const allowedRoles = protectedRoutes[matchedRoute as keyof typeof protectedRoutes];
    if (!allowedRoles.includes(payload.role)) {
      // User doesn't have permission, redirect to their dashboard
      return NextResponse.redirect(new URL(`/${payload.role.toLowerCase()}`, request.url));
    }

    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/citizen/:path*',
    '/officer/:path*',
    '/worker/:path*',
    '/admin/:path*',
  ],
};
