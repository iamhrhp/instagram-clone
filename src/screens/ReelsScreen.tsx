import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera } from 'iconsax-react-native';
import { getPopularVideos } from '../api/pexels';
import { PexelsVideo } from '../types';
import ReelItem from '../components/ReelItem';

const { height } = Dimensions.get('window');

const ReelsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
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
      
      {/* Top Header Overlay */}
      <View style={[styles.headerOverlay, { paddingTop: Math.max(insets.top, 15) }]}>
        <View style={styles.headerSpacer} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitleActive}>Reels</Text>
          <Text style={styles.headerTitleInactive}>Friends</Text>
          <View style={styles.friendsCircles}>
            <View style={[styles.friendCircle, { backgroundColor: '#FF6B6B' }]} />
            <View style={[styles.friendCircle, { backgroundColor: '#4ECDC4', marginLeft: -8 }]} />
            <View style={[styles.friendCircle, { backgroundColor: '#C7F464', marginLeft: -8 }]} />
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Camera size={28} color="#FFFFFF" variant="Linear" style={styles.cameraIcon} />
          </TouchableOpacity>
        </View>
      </View>
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
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 10,
  },
  headerSpacer: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cameraIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  headerTitleActive: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerTitleInactive: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  friendsCircles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  friendCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default ReelsScreen;
