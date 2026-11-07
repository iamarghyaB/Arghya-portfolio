import 'server-only';

import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const cookieName = 'portfolio_owner';
const sessionSeconds = 8 * 60 * 60;
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/dashboard',
};

function password() {
  const value = process.env.PORTFOLIO_ADMIN_PASSWORD;
  return value && value.length >= 16 ? value : undefined;
}

export function adminConfigured() {
  return Boolean(password());
}

function signature(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest();
}

export async function isAdmin() {
  const secret = password();
  if (!secret) return false;
  const token = (await cookies()).get(cookieName)?.value;
  const match = token?.match(/^(\d{10,13}\.[0-9a-f]{32})\.([0-9a-f]{64})$/);
  if (!match) return false;
  const expiration = Number(match[1].split('.')[0]);
  return expiration > Date.now() && timingSafeEqual(Buffer.from(match[2], 'hex'), signature(match[1], secret));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/dashboard/');
}

export async function startSession(candidate: string) {
  const secret = password();
  if (!secret || candidate.length > 1024) return false;
  const hash = (value: string) => createHash('sha256').update(value).digest();
  if (!timingSafeEqual(hash(candidate), hash(secret))) return false;

  const value = `${Date.now() + sessionSeconds * 1000}.${randomBytes(16).toString('hex')}`;
  const token = `${value}.${signature(value, secret).toString('hex')}`;
  (await cookies()).set(cookieName, token, { ...cookieOptions, maxAge: sessionSeconds });
  return true;
}

export async function endSession() {
  (await cookies()).set(cookieName, '', { ...cookieOptions, maxAge: 0 });
}
