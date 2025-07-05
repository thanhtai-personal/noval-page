import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from '@/hooks/useTranslation';
import { Api } from '@/utils/api';
import { Chapter } from '@/types/Chapter';
import { Story } from '@/types/Story';

export default function StoryDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const limit = 20;

  const { data: story, isLoading: loadingStory } = useQuery<Story>({
    queryKey: ['story-detail', slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await Api.get(`/stories/${slug}`);
      return res.data;
    },
  });

  const { data: chapters, isLoading: loadingChapters } = useQuery<{ data: Chapter[] }>({
    queryKey: ['story-chapters', slug, page, sort],
    enabled: !!slug,
    queryFn: async () => {
      const sortParam = sort === 'asc' ? 'chapterNumber' : '-chapterNumber';
      const res = await Api.get(
        `/stories/${slug}/chapters?page=${page}&limit=${limit}&sort=${sortParam}`,
      );
      return res.data;
    },
  });

  const toggleSort = () => {
    setSort((s) => (s === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  };

  if (loadingStory || !story) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  const renderChapter = ({ item }: { item: Chapter }) => (
    <ThemedText style={styles.chapterItem}>
      {item.chapterNumber}. {item.title}
    </ThemedText>
  );

  return (
    <ScrollView>
      <ThemedView style={styles.header}>
        <Image
          source={{ uri: story.cover }}
          style={styles.cover}
          contentFit="cover"
        />
        <ThemedText type="title" style={styles.title}>
          {story.title}
        </ThemedText>
        <ThemedText style={styles.author}>{story.author?.name}</ThemedText>
        <ThemedText style={styles.description}>{story.description}</ThemedText>
      </ThemedView>
      <View style={styles.chapterHeader}>
        <ThemedText type="subtitle">{t('chapter.list')}</ThemedText>
        <TouchableOpacity style={styles.sortBtn} onPress={toggleSort}>
          <ThemedText style={styles.sortBtnText}>
            {sort === 'asc' ? t('chapter.sort_desc') : t('chapter.sort_asc')}
          </ThemedText>
        </TouchableOpacity>
      </View>
      {loadingChapters ? (
        <ActivityIndicator style={{ marginTop: 8 }} />
      ) : (
        <FlatList
          data={chapters?.data || []}
          keyExtractor={(item) => item._id}
          renderItem={renderChapter}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 16,
  },
  cover: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  title: {
    marginTop: 8,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  description: {
    marginTop: 8,
  },
  chapterHeader: {
    paddingHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortBtn: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sortBtnText: {
    color: '#fff',
  },
  chapterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
});
