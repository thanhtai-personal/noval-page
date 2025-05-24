'use client';

import { appStore } from '@/store/AppStore.store';
import { ApiInstant } from '@/utils/api';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      // This will trigger server to set the token in cookies
      await ApiInstant.post(`/auth/google`, {
        idToken: credentialResponse.credential,
      });

      appStore.fetchProfile();

      router.push('/');
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <div className="p-8 rounded shadow">
          <h1 className="text-xl mb-4">Đăng nhập bằng Google</h1>
          <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.error('Login Error')} />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}
