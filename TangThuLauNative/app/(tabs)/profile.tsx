import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import GoogleLogin from '@/components/GoogleLogin';
import { Button } from 'react-native';
import { useAppStore } from '@/store/StoreProvider';
import { useTranslation } from '@/hooks/useTranslation';
import { observer } from 'mobx-react-lite';
import { useReadingHistory } from '@/hooks/useReadingHistory';

export default observer(function ProfileScreen() {
  const appStore = useAppStore();
  const { t } = useTranslation();
  const { loggedIn } = useReadingHistory();

  const logout = async () => {
    try {
      await appStore.auth.logout();
    } catch (e) {
      console.warn(e);
    }
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.center}>
        {loggedIn ? (
          <Button title={t('profile.logout')} onPress={logout} />
        ) : (
          <GoogleLogin />
        )}
        <Button title={t('profile.switchLanguage')} onPress={appStore.locale.toggleLanguage} />
      </ThemedView>
    </ParallaxScrollView>
  );
})

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
