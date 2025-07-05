import React from 'react';
import { Button, Alert, View, Text } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useTranslation } from '@/hooks/useTranslation';
import { useReadingHistory } from '@/contexts/ReadingHistoryContext';
import Config from "react-native-config";

// Cấu hình Google Sign-In
GoogleSignin.configure({
  webClientId: Config.GOOGLE_CLIENT_ID_FOR_WEB,
  // @ts-ignore
  // androidClientId: Config.GOOGLE_CLIENT_ID_FOR_ANDROID,  // Client ID tạo từ Firebase
  // iosClientId: Config.GOOGLE_CLIENT_ID_FOR_IOS, // Client ID tạo từ Firebase
  // offlineAccess: false,
});

export default function GoogleLogin() {
  const { t } = useTranslation();
  const { setLoggedIn, syncWithServer } = useReadingHistory();
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();

      const res = await fetch(`${Config.API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: userInfo.idToken, data: userInfo.data }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Login failed');
      }

      const data = await res.json();
      console.log('✅ Đăng nhập thành công:', data);
      setLoggedIn(true);
      syncWithServer();
    } catch (error: any) {
      console.error('❌ Lỗi đăng nhập:', error);
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>{t('googleLogin.title')}</Text>
      <Button title={t('googleLogin.button')} onPress={signIn} />
    </View>
  );
}
