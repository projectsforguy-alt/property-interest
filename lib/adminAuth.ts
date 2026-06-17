const SESSION_COOKIE = 'quietly_admin_session';
const SESSION_VALUE = 'authenticated';

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('Missing ADMIN_SESSION_SECRET environment variable.');
  }
  return secret;
}

/** Generates the value to store in the admin session cookie. */
export async function createAdminSessionToken(): Promise<string> {
  const secret = getSecret();
  const signature = await hmac(secret, SESSION_VALUE);
  return `${SESSION_VALUE}.${signature}`;
}

/** Verifies a session cookie value against the expected HMAC signature. */
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [value, signature] = token.split('.');
  if (value !== SESSION_VALUE || !signature) return false;

  try {
    const secret = getSecret();
    const expected = await hmac(secret, SESSION_VALUE);
    return expected === signature;
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
