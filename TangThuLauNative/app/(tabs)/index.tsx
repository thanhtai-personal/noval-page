import { Image } from 'expo-image';
import { StyleSheet, ActivityIndicator, FlatList, TextInput } from 'react-native';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import StoryItem from '@/components/StoryItem';
import { Api } from '@/utils/api';
import { Story } from '@/types/Story';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data: topVote = [], isLoading: loadingVote } = useQuery({
    queryKey: ['topVote'],
    queryFn: async () => {
      const res = await Api.get('/stories', { params: { sort: 'votes', limit: 5 } });
      return res.data.data || [];
    },
  });
  const { data: topView = [], isLoading: loadingView } = useQuery({
    queryKey: ['topView'],
    queryFn: async () => {
      const res = await Api.get('/stories', { params: { sort: 'views', limit: 5 } });
      return res.data.data || [];
    },
  });
  const loading = loadingVote || loadingView;

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
      <TextInput
        placeholder={t('home.search_placeholder')}
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        onSubmitEditing={() => {
          const q = search.trim();
          router.push(`/search${q ? `?q=${encodeURIComponent(q)}` : ''}`);
        }}
        style={styles.searchInput}
      />
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
});
