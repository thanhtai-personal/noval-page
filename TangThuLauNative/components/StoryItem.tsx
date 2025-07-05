import { Image } from 'expo-image';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Story } from '@/types/Story';

export default function StoryItem({ story, style }: { story: Story; style?: ViewStyle }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(`/story/${story.slug}` as Href)}
      style={[styles.container, style]}
    >
      <Image source={{ uri: story.cover }} style={styles.cover} contentFit="cover" />
      <Text style={styles.title} numberOfLines={1}>{story.title}</Text>
      <Text style={styles.author} numberOfLines={1}>{story.author?.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 12,
  },
  cover: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
});
