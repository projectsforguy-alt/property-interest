import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Service-role client — bypasses RLS, server-only
export function getSupabaseServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

// Auth-aware server client — uses the user's session cookie
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}

// Utility: generate a unique response code for owner approaches
export function generateResponseCode(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function generateVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
