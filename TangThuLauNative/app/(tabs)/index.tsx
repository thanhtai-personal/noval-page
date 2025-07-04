import { Image } from 'expo-image';
import { StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import StoryItem from '@/components/StoryItem';
import { API_BASE_URL } from '@/constants/Api';
import { Story } from '@/types/Story';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [topVote, setTopVote] = useState<Story[]>([]);
  const [topView, setTopView] = useState<Story[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [voteRes, viewRes] = await Promise.all([
          fetch(`${API_BASE_URL}/stories?sort=votes&limit=5`).then((r) => r.json()),
          fetch(`${API_BASE_URL}/stories?sort=views&limit=5`).then((r) => r.json()),
        ]);
        setTopVote(voteRes.data || []);
        setTopView(viewRes.data || []);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />
      }>
      <ThemedView>
        <ThemedText type="subtitle">{t('home.top_recommend_title')}</ThemedText>
        <FlatList
          data={topVote}
          horizontal
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <StoryItem story={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </ThemedView>
      <ThemedView style={{ marginTop: 16 }}>
        <ThemedText type="subtitle">{t('home.most_viewed')}</ThemedText>
        {topView.map((story) => (
          <StoryItem key={story._id} story={story} style={{ marginBottom: 12, width: '100%' }} />
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
