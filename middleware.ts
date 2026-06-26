import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/adminAuth';

const ADMIN_PUBLIC = new Set(['/admin/login', '/api/admin/login']);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let res = NextResponse.next();

  // Admin auth — custom cookie-based session
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!ADMIN_PUBLIC.has(pathname)) {
      const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      const valid = await verifyAdminSessionToken(token);
      if (!valid) {
        if (pathname.startsWith('/api/admin')) {
          return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }
    return res;
  }

  // Supabase session refresh for account routes
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Profile completion gate: if a logged-in user hits /account/add-interest
  // without a buying_position set, redirect them to complete their profile first.
  if (pathname === '/account/add-interest' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('buying_position, timeline')
      .eq('id', user.id)
      .single();

    const isComplete = profile?.buying_position && profile?.timeline;
    if (!isComplete) {
      return NextResponse.redirect(new URL('/account/complete-profile', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/account/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
