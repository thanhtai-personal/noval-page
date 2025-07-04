import React, { useEffect } from 'react';
import { Alert, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { API_BASE_URL } from '@/constants/Api';

WebBrowser.maybeCompleteAuthSession();
const fixedRedirectUri = 'https://auth.expo.io/@vouucac/tangthulau'

export default function GoogleLoginScreen() {
  const router = useRouter();
  // const redirectUri = AuthSession.makeRedirectUri();
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    responseType: 'code',
    usePKCE: false,
    redirectUri: fixedRedirectUri,
  });

  useEffect(() => {
    const handleLogin = async () => {
      if (response?.type === 'success' && response.params?.code) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code: response.params.code }),
          });

          if (!res.ok) throw new Error('Login failed');

          Alert.alert('Login successful');
          router.replace('/home');
        } catch (err: any) {
          Alert.alert('Login failed', err.message);
        }
      }
    };

    handleLogin();
  }, [response]);

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
      title="Đăng nhập với Google"
      disabled={!request}
      onPress={() => promptAsync()}
      />
    </ThemedView>
  );
}
