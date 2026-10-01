import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator, Platform, PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Add, Heart, MessageText, Send2, More, Bookmark, Verify, Refresh2 } from 'iconsax-react-native';
import { pexelsApi } from '../api/pexels';
import { NormalizedPhoto } from '../types';
import CommentsModal from '../components/CommentsModal'; // We'll assume we can reuse or just implement a simple one, wait, no let's just use state for now
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DUMMY_NAMES = ['alex_travels', 'sarah.j', 'photo_guru', 'mike_captures', 'emma_wanderlust', 'josh_daily'];

const dummyStories = [
  { id: '1', name: 'Your story', image: 'https://i.pravatar.cc/150?u=1', isMine: true },
  { id: '2', name: DUMMY_NAMES[0], image: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: DUMMY_NAMES[1], image: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: DUMMY_NAMES[2], image: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: DUMMY_NAMES[3], image: 'https://i.pravatar.cc/150?u=5' },
];

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [feed, setFeed] = useState<NormalizedPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // Intercept horizontal swipe before FlatList claims the touch
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50 || gestureState.dx > 50) {
          // Navigating to Create Screen on swipe
          navigation.navigate('Create');
        }
      },
    })
  ).current;

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await pexelsApi.get('/v1/curated', { params: { per_page: 15 } });
        const photos = response.data.photos.map((p: any) => ({
          id: p.id.toString(),
          type: 'photo',
          width: p.width,
          height: p.height,
          aspectRatio: p.width / p.height,
          thumbnail: p.src.medium,
          mediumUrl: p.src.large,
          largeUrl: p.src.large2x,
          originalUrl: p.src.original,
          photographerId: p.photographer_id,
          photographerName: p.photographer,
          photographerUrl: p.photographer_url,
        }));
        setFeed(photos);
      } catch (err) {
        console.error('Error fetching feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const renderStory = ({ item }: { item: any }) => (
    <View style={styles.storyContainer}>
      <View style={[styles.storyRing, item.isMine && styles.myStoryRing]}>
        <Image source={{ uri: item.image }} style={styles.storyImage} />
        {item.isMine && (
          <View style={styles.addStoryBadge}>
            <Add size={12} color="#FFF" />
          </View>
        )}
      </View>
      <Text style={styles.storyName} numberOfLines={1}>{item.name}</Text>
    </View>
  );

const FeedPostItem = ({ item }: { item: NormalizedPhoto }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  
  const [likes, setLikes] = useState(Math.floor(Math.random() * 1000) + 100);
  const [comments, setComments] = useState(Math.floor(Math.random() * 300) + 10);
  const [reposts, setReposts] = useState(Math.floor(Math.random() * 200) + 5);
  const [shares, setShares] = useState(Math.floor(Math.random() * 500) + 50);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setReposts(prev => isReposted ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    setShares(prev => prev + 1);
  };

  return (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <View style={styles.postAvatarRing}>
            <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.photographerId}` }} style={styles.postAvatar} />
          </View>
          <Text style={styles.postUsername}>{(item.photographerName || 'User').toLowerCase().replace(' ', '_')}</Text>
          <Verify size={16} color="#3498db" variant="Bold" style={{ marginLeft: 4 }} />
        </View>
        <TouchableOpacity>
          <More size={24} color="#000" style={{ transform: [{ rotate: '90deg' }] }} />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image source={{ uri: item.mediumUrl }} style={[styles.postImage, { height: width * (item.height / item.width > 1.2 ? 1.2 : item.height / item.width) }]} />

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Heart size={26} color={isLiked ? "#FF3B30" : "#000"} variant={isLiked ? "Bold" : "Linear"} />
            <Text style={[styles.actionMetric, isLiked && { color: '#FF3B30' }]}>{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <MessageText size={26} color="#000" />
            <Text style={styles.actionMetric}>{comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleRepost}>
            <Refresh2 size={26} color={isReposted ? "#34C759" : "#000"} />
            <Text style={[styles.actionMetric, isReposted && { color: '#34C759' }]}>{reposts}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Send2 size={26} color="#000" />
            <Text style={styles.actionMetric}>{shares}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSave}>
          <Bookmark size={26} color={isSaved ? "#000" : "#000"} variant={isSaved ? "Bold" : "Linear"} />
        </TouchableOpacity>
      </View>

      {/* Post Likes & Caption */}
      <View style={styles.postFooter}>
        <Text style={styles.captionText}>
          <Text style={styles.captionUsername}>{(item.photographerName || 'User').toLowerCase().replace(' ', '_')} </Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Beautiful capture!
        </Text>
        <Text style={styles.timeText}>5 days ago</Text>
      </View>
    </View>
  );
};

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 10) }]} {...panResponder.panHandlers}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>ReelsTalk</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Create')}>
            <Add size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Heart size={28} color="#000" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={feed}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <FeedPostItem item={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View style={styles.storiesSection}>
            <FlatList
              horizontal
              data={dummyStories}
              keyExtractor={item => item.id}
              renderItem={renderStory}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesList}
            />
          </View>
        )}
        ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 20 }} color="#E79C2A" /> : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 10, paddingTop: 5 },
  logoText: { 
    color: '#000', 
    fontSize: 28, 
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIconBtn: { marginLeft: 20, position: 'relative' },
  notificationDot: { position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF3B30', borderWidth: 2, borderColor: '#FFF' },
  storiesSection: { borderBottomWidth: 0.5, borderBottomColor: '#EEE', paddingBottom: 10 },
  storiesList: { paddingHorizontal: 10, paddingVertical: 10 },
  storyContainer: { alignItems: 'center', marginHorizontal: 8, width: 75 },
  storyRing: { width: 74, height: 74, borderRadius: 37, borderWidth: 2, borderColor: '#F58529', justifyContent: 'center', alignItems: 'center' },
  myStoryRing: { borderColor: 'transparent' },
  storyImage: { width: 66, height: 66, borderRadius: 33, borderWidth: 2, borderColor: '#FFF' },
  addStoryBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#000', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  storyName: { color: '#000', fontSize: 12, marginTop: 5 },
  postContainer: { marginBottom: 20 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  postHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  postAvatarRing: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#F58529', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  postAvatar: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#FFF' },
  postUsername: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  postImage: { width: '100%', backgroundColor: '#F0F0F0' },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12, alignItems: 'center' },
  postActionsLeft: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  actionMetric: { color: '#000', fontSize: 14, marginLeft: 4, fontWeight: '500' },
  postFooter: { paddingHorizontal: 12 },
  captionText: { color: '#000', fontSize: 14, lineHeight: 18 },
  captionUsername: { fontWeight: 'bold' },
  timeText: { color: '#999', fontSize: 12, marginTop: 6, marginBottom: 10 },
});

export default HomeScreen;
