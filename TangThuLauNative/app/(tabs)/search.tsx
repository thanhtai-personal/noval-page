import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from '@/hooks/useTranslation';
import { Api } from '@/utils/api';
import StoryItem from '@/components/StoryItem';
import { Story } from '@/types/Story';

interface Category { _id: string; name: string }
interface Author { _id: string; name: string }

export default function SearchScreen() {
  const { t } = useTranslation();

  const [keyword, setKeyword] = useState('');
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await Api.get('/categories');
      return res.data || [];
    },
  });
  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const res = await Api.get('/authors');
      return res.data.data || [];
    },
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [authorModal, setAuthorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Story[]>([]);

  const search = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (selectedCategory) params.append('categories', selectedCategory.name);
      if (selectedAuthor) params.append('author', selectedAuthor._id);
      const res = await Api.get(`/stories?${params.toString()}`);
      setResults(res.data.data || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const renderStory = ({ item }: { item: Story }) => (
    <StoryItem story={item} style={{ marginBottom: 12, width: '100%' }} />
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.form}>
        <TextInput
          placeholder={t('search.search_placeholder')}
          value={keyword}
          onChangeText={setKeyword}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.select}
          onPress={() => setCategoryModal(true)}>
          <ThemedText>
            {selectedCategory ? selectedCategory.name : t('search.category')}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.select}
          onPress={() => setAuthorModal(true)}>
          <ThemedText>
            {selectedAuthor ? selectedAuthor.name : t('search.author')}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={search}>
          <ThemedText style={styles.buttonText}>{t('search.search')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      {loading ? (
        <ActivityIndicator />
      ) : results.length === 0 ? (
        <ThemedText>{t('search.no_result')}</ThemedText>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={renderStory}
        />
      )}
      <Modal visible={categoryModal} transparent animationType="slide">
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedCategory(item);
                    setCategoryModal(false);
                  }}>
                  <ThemedText>{item.name}</ThemedText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 8 }]}
              onPress={() => setCategoryModal(false)}>
              <ThemedText style={styles.buttonText}>{t('search.cancel')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
      <Modal visible={authorModal} transparent animationType="slide">
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <FlatList
              data={authors}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedAuthor(item);
                    setAuthorModal(false);
                  }}>
                  <ThemedText>{item.name}</ThemedText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 8 }]}
              onPress={() => setAuthorModal(false)}>
              <ThemedText style={styles.buttonText}>{t('search.cancel')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
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
  form: {
    gap: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  select: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalItem: {
    paddingVertical: 8,
  },
});

