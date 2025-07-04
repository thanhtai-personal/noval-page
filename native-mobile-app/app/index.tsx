import React, { useEffect } from 'react';
import { Alert, Button } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { API_BASE_URL } from '@/constants/Api';

export default function GoogleLoginScreen() {
  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  const handleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      if (!userInfo.idToken) throw new Error('No idToken returned');
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken: userInfo.idToken }),
      });
      if (!res.ok) throw new Error('Login failed');
      Alert.alert('Login successful');
      router.replace('/home');
    } catch (err: any) {
      if (err.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Login failed', err.message);
      }
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Đăng nhập với Google" onPress={handleLogin} />
    </ThemedView>
  );
}
