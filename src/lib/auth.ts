import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { queryOne } from '@/lib/db';

const COOKIE_NAME = 'stu_session';
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 jam

export type SessionUser = { id: number; email: string; name: string; role: string };

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'AUTH_SECRET belum diatur atau terlalu pendek (minimal 32 karakter). Jalankan: openssl rand -base64 48',
    );
  }
  return new TextEncoder().encode(secret);
}

export async function verifyCredentials(email: string, password: string): Promise<SessionUser | null> {
  const user = await queryOne<{
    id: number;
    email: string;
    name: string;
    role: string;
    password_hash: string;
  }>('SELECT id, email, name, role, password_hash FROM users WHERE email = $1 LIMIT 1', [
    email.trim().toLowerCase(),
  ]);

  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;

  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.id !== 'number' || typeof payload.email !== 'string') return null;

    return {
      id: payload.id,
      email: payload.email,
      name: String(payload.name ?? 'Administrator'),
      role: String(payload.role ?? 'admin'),
    };
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}
