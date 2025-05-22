import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if the user is logged in and trying to access protected routes
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || 
                     req.nextUrl.pathname.startsWith('/signup');
  
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
  
  // Handle root route
  if (req.nextUrl.pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/chat', req.url));
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return res;
  }
  
  // Redirect to chat if user is logged in and trying to access auth routes
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/chat', req.url));
  }
  
  // Redirect to login if user is not logged in and trying to access protected routes
  if (!session && !isAuthRoute && !req.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

// app/page.tsx
