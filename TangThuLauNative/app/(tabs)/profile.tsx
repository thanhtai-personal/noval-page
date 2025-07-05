import { Image } from 'expo-image';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppStore } from '@/store/StoreProvider';
import { useTranslation } from '@/hooks/useTranslation';
import { observer } from 'mobx-react-lite';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { Api, setTokenBearer } from '@/utils/api';
import { envConfig } from '@/constants/env';

export default observer(function ProfileScreen() {
  const appStore = useAppStore();
  const { t } = useTranslation();
  const { loggedIn, syncWithServer } = useReadingHistory();

  useEffect(() => {
    if (!appStore.auth.profile) {
      appStore.auth.fetchProfile();
    }
  }, []);

  GoogleSignin.configure({
    webClientId: envConfig.GOOGLE_CLIENT_ID_FOR_WEB,
    iosClientId: envConfig.GOOGLE_CLIENT_ID_FOR_IOS,
    offlineAccess: false,
  });

  const logout = async () => {
    try {
      await appStore.auth.logout();
    } catch (e) {
      console.warn(e);
    }
  };

  const login = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      const res = await Api.post('/auth/google', {
        token: userInfo.data?.idToken,
      });

      const { access_token, user } = res.data || {};

      if (access_token) {
        setTokenBearer(access_token);
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
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={
            appStore.auth.profile?.photo
              ? { uri: appStore.auth.profile.photo }
              : require('@/assets/images/partial-react-logo.png')
          }
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.profileInfo}>
        {appStore.auth.profile?.photo && (
          <Image source={{ uri: appStore.auth.profile.photo }} style={styles.avatar} />
        )}
        <ThemedText type="title">
          {appStore.auth.profile?.name || appStore.auth.profile?.email || 'Guest'}
        </ThemedText>
        {appStore.auth.profile?.email && (
          <ThemedText>{appStore.auth.profile.email}</ThemedText>
        )}
        {appStore.auth.profile && (
          <>
            <ThemedText>
              {t('profile.role')}: {appStore.auth.profile.role?.name || appStore.auth.profile.role}
            </ThemedText>
            <ThemedText>
              {t('profile.level')}: {appStore.auth.profile.level}
            </ThemedText>
            <ThemedText>
              {t('profile.coin')}: {appStore.auth.profile.coin}
            </ThemedText>
          </>
        )}
      </ThemedView>
      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <Button
            title={t('profile.switchLanguage')}
            onPress={appStore.locale.toggleLanguage}
          />
        </View>
        <View style={[styles.menuItem, styles.loginItem]}>
          {loggedIn ? (
            <Button title={t('profile.logout')} onPress={logout} color="red" />
          ) : (
            <Button title={t('googleLogin.button')} onPress={login} color="green" />
          )}
        </View>
      </View>
    </ParallaxScrollView>
  );
})

const styles = StyleSheet.create({
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  menu: {
    gap: 12,
  },
  menuItem: {},
  loginItem: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    backgroundColor: '#ccc',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
