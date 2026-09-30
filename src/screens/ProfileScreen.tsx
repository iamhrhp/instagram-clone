import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Modal, ActivityIndicator, FlatList } from 'react-native';
import Video from 'react-native-video';
import ReelItem from '../components/ReelItem';
import PhotoItem from '../components/PhotoItem';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera, ArrowLeft } from 'iconsax-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreatorProfile } from '../hooks/useCreatorProfile';
import { NormalizedVideo, NormalizedPhoto } from '../types';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const videoItem = route.params?.videoItem;
  const insets = useSafeAreaInsets();

  const {
    creator,
    photos,
    videos,
    loading,
    socialProfile,
    toggleFollow,
    loadMorePhotos,
    loadMoreVideos,
  } = useCreatorProfile(route.params?.user || { name: 'Henry Coutry', id: 1, username: 'henry' });
  
  const [activeTab, setActiveTab] = useState('Photos');
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<NormalizedVideo | null>(null);
  const [playingPhoto, setPlayingPhoto] = useState<NormalizedPhoto | null>(null);

  // Format username fallback
  const username = creator.username || `@${creator.name.toLowerCase().replace(/\s+/g, '_')}`;

  const bannerUri = creator.coverUrl || videoItem?.image || photos[0]?.thumbnail || 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=800';

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 400;
    if (isCloseToBottom) {
      if (activeTab === 'Photos') loadMorePhotos();
      if (activeTab === 'Videos') loadMoreVideos();
    }
  };

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const handleMediaPress = (item: any) => {
    if (item.type === 'video') {
      const idx = videos.findIndex(v => v.id === item.id);
      setActiveVideoIndex(idx >= 0 ? idx : 0);
      setPlayingVideo(item);
    } else if (item.type === 'photo') {
      const idx = photos.findIndex(p => p.id === item.id);
      setActiveVideoIndex(idx >= 0 ? idx : 0);
      setPlayingPhoto(item);
    }
  };

  const handleViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleMessage = () => {
    navigation.navigate('Message', { user: creator });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        bounces={false} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: bannerUri }} 
            style={styles.bannerImage} 
          />
          {/* Back button overlay */}
          <TouchableOpacity 
            style={[styles.backBtn, { top: Math.max(insets.top, 10) }]} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#FFF" variant="Linear" />
          </TouchableOpacity>
        </View>

        {/* Profile Details */}
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            activeOpacity={0.9} 
            onLongPress={() => setIsAvatarExpanded(true)}
          >
            <Image source={{ uri: `https://i.pravatar.cc/150?u=${creator.id}` }} style={styles.avatar} />
            <View style={styles.cameraBadge}>
              <Camera size={12} color="#FFF" variant="Bold" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.name}>{creator.name}</Text>
          <Text style={styles.handle}>{username}</Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{photos.length + videos.length}</Text>
              <Text style={styles.statLabel}>Post</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{(socialProfile.followersCount / 1000).toFixed(1)}K</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{socialProfile.followingCount}</Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.messageBtn} onPress={handleMessage}>
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.followBtn, socialProfile.isFollowing && styles.followingBtn]} 
              onPress={toggleFollow}
            >
              <Text style={[styles.followBtnText, socialProfile.isFollowing && styles.followingBtnText]}>
                {socialProfile.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['Photos', 'Videos', 'Saved'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.tabUnderlineFull} />

        {/* Dynamic Masonry Grid */}
        {(() => {
          const items = activeTab === 'Photos' ? photos : activeTab === 'Videos' ? videos : [];
          const chunks = [];
          for (let i = 0; i < items.length; i += 3) {
            chunks.push(items.slice(i, i + 3));
          }
          return chunks.map((chunk, index) => (
            <View key={index} style={[styles.gridContainer, index !== chunks.length - 1 && { marginBottom: 10 }]}>
               <TouchableOpacity style={styles.gridLeft} onPress={() => handleMediaPress(chunk[0])} activeOpacity={0.8}>
                  {chunk[0] && <Image source={{ uri: chunk[0].thumbnail }} style={styles.largeImage} />}
               </TouchableOpacity>
               <View style={styles.gridRight}>
                  <TouchableOpacity onPress={() => handleMediaPress(chunk[1])} activeOpacity={0.8}>
                    {chunk[1] && <Image source={{ uri: chunk[1].thumbnail }} style={styles.smallImageTop} />}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMediaPress(chunk[2])} activeOpacity={0.8}>
                    {chunk[2] && <Image source={{ uri: chunk[2].thumbnail }} style={styles.smallImageBottom} />}
                  </TouchableOpacity>
               </View>
            </View>
          ));
        })()}
        
        {loading && <ActivityIndicator style={{ margin: 20 }} color="#E79C2A" />}

        {/* Attribution */}
        <View style={{ alignItems: 'center', marginVertical: 30 }}>
          <Text style={{ color: '#666', fontSize: 12 }}>Photos provided by Pexels</Text>
        </View>
      </ScrollView>

      {/* Full Screen Avatar Modal */}
      <Modal visible={isAvatarExpanded} transparent={true} animationType="fade">
        <View style={styles.fullScreenAvatarOverlay}>
          <TouchableOpacity 
            style={styles.fullScreenAvatarDismiss} 
            onPress={() => setIsAvatarExpanded(false)} 
            activeOpacity={1}
          />
          <Image 
            source={{ uri: `https://i.pravatar.cc/600?u=${creator.id}` }} 
            style={styles.fullScreenAvatar} 
          />
        </View>
      </Modal>

      {/* Full Screen Video Modal */}
      <Modal visible={!!playingVideo} transparent={true} animationType="slide">
        <View style={styles.videoModalContainer}>
          <FlatList
            data={videos}
            initialScrollIndex={activeVideoIndex}
            getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
            renderItem={({ item, index }) => {
              const pexelsVideoShape = {
                id: Number(item.id),
                width: item.width,
                height: item.height,
                url: item.videoUrl,
                image: item.thumbnail,
                duration: item.duration,
                user: { id: item.creatorId, name: item.creatorName, url: item.creatorUrl },
                video_files: item.videoFiles || [],
                video_pictures: [],
              };
              return <ReelItem item={pexelsVideoShape as any} isActive={index === activeVideoIndex} onClose={() => setPlayingVideo(null)} />;
            }}
            keyExtractor={(item, idx) => `${item.id}-${idx}`}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            snapToInterval={height}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum={true}
            onEndReached={loadMoreVideos}
            onEndReachedThreshold={0.5}
          />
        </View>
      </Modal>

      {/* Full Screen Photo Modal */}
      <Modal visible={!!playingPhoto} transparent={true} animationType="slide">
        <View style={styles.videoModalContainer}>
          <FlatList
            data={photos}
            initialScrollIndex={activeVideoIndex}
            getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
            renderItem={({ item }) => <PhotoItem item={item} onClose={() => setPlayingPhoto(null)} />}
            keyExtractor={(item, idx) => `${item.id}-${idx}`}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            snapToInterval={height}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum={true}
            onEndReached={loadMorePhotos}
            onEndReachedThreshold={0.5}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenAvatarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenAvatarDismiss: {
    ...StyleSheet.absoluteFill as any,
  },
  fullScreenAvatar: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    borderWidth: 2,
    borderColor: '#333',
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
  },
  videoCloseBtn: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  videoCloseText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#080808', // deep black
  },
  bannerContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  backBtn: {
    position: 'absolute',
    left: 15,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -45,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#080808',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    backgroundColor: '#E79C2A', // Orange badge
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#080808',
  },
  name: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  handle: {
    color: '#999',
    fontSize: 13,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingHorizontal: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#222',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 25,
    paddingHorizontal: 20,
    gap: 15, 
  },
  messageBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  messageBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  followBtn: {
    flex: 1,
    backgroundColor: '#E79C2A',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E79C2A',
  },
  followBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderColor: '#444',
  },
  followingBtnText: {
    color: '#FFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 35,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  tab: {
    paddingBottom: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  tabText: {
    color: '#777',
    fontSize: 15,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFF',
  },
  tabUnderlineFull: {
    height: 1,
    backgroundColor: '#222',
    width: '100%',
    marginTop: -1, 
  },
  gridContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    marginBottom: 40,
  },
  gridLeft: {
    flex: 1,
  },
  gridRight: {
    flex: 1,
    gap: 10,
  },
  largeImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
  },
  smallImageTop: {
    width: '100%',
    height: 145,
    borderRadius: 15,
  },
  smallImageBottom: {
    width: '100%',
    height: 145,
    borderRadius: 15,
  },
});

export default ProfileScreen;
