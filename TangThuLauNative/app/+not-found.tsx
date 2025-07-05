import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from '@/hooks/useTranslation';
import { observer } from 'mobx-react-lite';

export default observer(function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">{t('notFound.message')}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{t('notFound.link')}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
