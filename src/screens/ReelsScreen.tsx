import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, ActivityIndicator, Text } from 'react-native';
import { getPopularVideos } from '../api/pexels';
import { PexelsVideo } from '../types';
import ReelItem from '../components/ReelItem';

const { height } = Dimensions.get('window');

const ReelsScreen: React.FC = () => {
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = async (pageNumber: number) => {
    try {
      const data = await getPopularVideos({ page: pageNumber, perPage: 10 });
      setVideos(prev => [...prev, ...data]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load videos. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos(page);
  }, [page]);

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (loading && page === 1) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error && videos.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={({ item, index }) => (
          <ReelItem item={item} isActive={index === activeVideoIndex} />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        onEndReached={() => setPage(prev => prev + 1)}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ReelsScreen;
