import React from 'react';
import { Button, Alert, View, Text } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useTranslation } from '@/hooks/useTranslation';

// Cấu hình Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.GOOGLE_CLIENT_ID_FOR_WEB,
  androidClientId: process.env.GOOGLE_CLIENT_ID_FOR_ANDROID,  // Client ID tạo từ Firebase
  iosClientId: process.env.GOOGLE_CLIENT_ID_FOR_IOS, // Client ID tạo từ Firebase
  offlineAccess: false,
} as any);

export default function GoogleLogin() {
  const { t } = useTranslation();
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      console.log('✅ Đăng nhập thành công:', userInfo);
      Alert.alert('Xin chào!', userInfo.user.name);
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
