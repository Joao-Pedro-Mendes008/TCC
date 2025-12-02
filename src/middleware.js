import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname.toLowerCase();

 const publicRoutes = ["/", "/login", "/signup", "/recover", "/auth"];
  
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return res;
  }

  if (error || !user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const role = user.user_metadata?.role;

  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (role === "paciente" && pathname.startsWith("/consultorio")) {
    return NextResponse.redirect(new URL("/paciente", req.url));
  }

  if (role === "consultorio" && pathname.startsWith("/paciente")) {
    return NextResponse.redirect(new URL("/consultorio", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};