import { FlatList, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from '@/hooks/useTranslation';
import { useReadingHistory } from '@/contexts/ReadingHistoryContext';
import { useEffect } from 'react';
import { Image } from 'expo-image';

export default function BookshelfScreen() {
  const { t } = useTranslation();
  const { history, syncWithServer, loggedIn } = useReadingHistory();

  useEffect(() => {
    syncWithServer();
  }, [loggedIn]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Image source={require('@/assets/images/react-logo.png')} style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('search.title')}</ThemedText>
      </ThemedView>
      {history.length === 0 ? (
        <ThemedText>{t('search.no_history') || 'No reading history'}</ThemedText>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.storySlug}
          renderItem={({ item }) => (
            <ThemedView style={styles.item}>
              <Image source={{ uri: item.cover }} style={styles.cover} contentFit="cover" />
              <ThemedView style={{ flex: 1 }}>
                <ThemedText style={styles.title}>{item.storyTitle}</ThemedText>
                <ThemedText style={styles.chapter}>{`Chapter ${item.chapter}`}</ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        />
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 120,
    width: 200,
    bottom: -20,
    left: -20,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cover: {
    width: 60,
    height: 80,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
  },
  chapter: {
    fontSize: 12,
    color: '#666',
  },
});
