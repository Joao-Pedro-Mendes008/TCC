import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/../utils/supabase/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createSupabaseServerClient({ req, res });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const role = user.user_metadata?.role;

  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const pathname = req.nextUrl.pathname.toLowerCase();

  if (role === "paciente" && pathname.startsWith("/consultorio")) {
    return NextResponse.redirect(new URL("/paciente", req.url));
  }

  if (role === "consultorio" && pathname.startsWith("/paciente")) {
    return NextResponse.redirect(new URL("/consultorio", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/paciente/:path*", "/consultorio/:path*"],
};
