import React from 'react';
import { Button, Alert, View, Text } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useTranslation } from '@/hooks/useTranslation';
import { useReadingHistory } from '@/contexts/ReadingHistoryContext';
import { Api } from '@/utils/api';
import { useAppStore } from '@/store/StoreProvider';
import { envConfig } from "@/constants/env";

console.log("envConfig", envConfig)
// Cấu hình Google Sign-In
GoogleSignin.configure({
  webClientId: envConfig.GOOGLE_CLIENT_ID_FOR_WEB,
  // @ts-ignore
  // androidClientId: envConfig.GOOGLE_CLIENT_ID_FOR_ANDROID,
  iosClientId: envConfig.GOOGLE_CLIENT_ID_FOR_IOS,
  offlineAccess: false,
});

export default function GoogleLogin() {
  const { t } = useTranslation();
  const { setLoggedIn, syncWithServer } = useReadingHistory();
  const { setLoggedIn: setLoggedInStore } = useAppStore();
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();

      const { data } = await Api.post('/auth/google', {
        code: userInfo.idToken,
        data: userInfo.data,
      });
      console.log('✅ Đăng nhập thành công:', data);
      setLoggedIn(true);
      setLoggedInStore(true);
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
