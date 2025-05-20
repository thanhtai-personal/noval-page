'use server';

import { ApiInstant, setToken } from '@/utils/api';

export async function loginWithGoogle(idToken: string) {
  const res = await ApiInstant.post(`/auth/google`, {
    idToken,
  });
  const token = res.data.access_token;
  setToken(token);

  return true;
}
