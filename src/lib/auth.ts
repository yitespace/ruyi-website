import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ruyi2026';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 小时

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken) return null;

  // 简单验证 session
  try {
    const decrypted = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const { token, expiresAt } = JSON.parse(decrypted);

    if (Date.now() > expiresAt) {
      return null;
    }

    return { token, expiresAt };
  } catch {
    return null;
  }
}

export async function login(password: string): Promise<boolean> {
  if (password !== ADMIN_PASSWORD) {
    return false;
  }

  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = Date.now() + SESSION_DURATION;

  const sessionData = { token, expiresAt };
  const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

  const cookieStore = await cookies();
  cookieStore.set('admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });

  return true;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}
