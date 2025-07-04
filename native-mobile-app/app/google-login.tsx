import React, { useEffect } from 'react';
import { Alert, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginScreen() {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      Alert.alert('Google Login', idToken ? 'Token received' : 'No token');
      router.replace('(tabs)');
    }
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
