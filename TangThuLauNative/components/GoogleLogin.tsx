import React from 'react';
import { Button, Alert, View, Text } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useTranslation } from '@/hooks/useTranslation';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { Api, setTokenBearer } from '@/utils/api';
import { useAppStore } from '@/store/StoreProvider';
import { envConfig } from "@/constants/env";
import { observer } from "mobx-react-lite"

// Cấu hình Google Sign-In
GoogleSignin.configure({
  webClientId: envConfig.GOOGLE_CLIENT_ID_FOR_WEB,
  // @ts-ignore
  // androidClientId: envConfig.GOOGLE_CLIENT_ID_FOR_ANDROID,
  iosClientId: envConfig.GOOGLE_CLIENT_ID_FOR_IOS,
  offlineAccess: false,
});

export default observer(function GoogleLogin() {
  const { t } = useTranslation();
  const { syncWithServer } = useReadingHistory();
  const appStore = useAppStore();
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      const res = await Api.post('/auth/google', {
        token: userInfo.data?.idToken,
      });

      const { access_token, user } = res.data || {};

      if (access_token) {
        setTokenBearer(access_token)
      }

      if (user) {
        appStore.auth.profile = user;
      } else {
        await appStore.auth.fetchProfile();
      }
      syncWithServer();
    } catch (error: any) {
      console.error(`❌ ${t('errors.login_failed')}:`, error);
      Alert.alert(t('errors.error'), error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>{t('googleLogin.title')}</Text>
      <Button title={t('googleLogin.button')} onPress={signIn} />
    </View>
  );
})
