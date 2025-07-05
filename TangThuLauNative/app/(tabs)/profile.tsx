import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import GoogleLogin from '@/components/GoogleLogin';
import { Button } from 'react-native';
import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useReadingHistory } from '@/contexts/ReadingHistoryContext';
import { Api } from '@/utils/api';
import { useAppStore } from '@/store/StoreProvider';

export default function ProfileScreen() {
  const { toggleLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();
  const { loggedIn, setLoggedIn } = useReadingHistory();
  const { setLoggedIn: setLoggedInStore } = useAppStore();

  const logout = async () => {
    try {
      await Api.post('/auth/logout');
    } catch (e) {
      console.warn(e);
    } finally {
      setLoggedIn(false);
      setLoggedInStore(false);
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
        <Button title={t('profile.switchLanguage')} onPress={toggleLanguage} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

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
