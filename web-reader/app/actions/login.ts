'use server';

import { ApiInstant, setToken } from '@/utils/api';
import { cookies } from 'next/headers';;

export async function loginWithGoogle(idToken: string) {
  const res = await ApiInstant.post(`/auth/google`, {
    idToken,
  });
  const token = res.data.access_token;

  setToken(token);
  (await cookies()).set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });

  return true;
}
