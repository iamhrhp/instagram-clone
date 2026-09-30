import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Modal, ActivityIndicator, FlatList } from 'react-native';
import Video from 'react-native-video';
import ReelItem from '../components/ReelItem';
import PhotoItem from '../components/PhotoItem';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera, ArrowLeft, Add, HambergerMenu, Grid3, VideoPlay, Profile2User, UserAdd } from 'iconsax-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreatorProfile } from '../hooks/useCreatorProfile';
import { useProfileData } from '../hooks/useProfileData';
import { NormalizedVideo, NormalizedPhoto } from '../types';

const { width, height } = Dimensions.get('window');

const DEFAULT_USER = { name: 'Henry Coutry', id: 1, username: 'henry' };

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const videoItem = route.params?.videoItem;
  const insets = useSafeAreaInsets();
  
  const userParam = route.params?.user || DEFAULT_USER;

  const {
    creator,
    photos,
    videos,
    loading,
    socialProfile,
    toggleFollow,
    loadMorePhotos,
    loadMoreVideos,
  } = useCreatorProfile(userParam);
  
  const [activeTab, setActiveTab] = useState('Photos');
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<NormalizedVideo | null>(null);
  const [playingPhoto, setPlayingPhoto] = useState<NormalizedPhoto | null>(null);

  const { profileData } = useProfileData();

  // Format username fallback
  const displayUsername = profileData.username || `@${(profileData.name || 'User').toLowerCase().replace(/\s+/g, '_')}`;

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
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerUsername}>{displayUsername} ∨</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.atIcon}>@</Text>
          <Add size={28} color="#000" style={styles.headerIcon} />
          <HambergerMenu size={28} color="#000" style={styles.headerIcon} />
        </View>
      </View>

      <ScrollView 
        bounces={true} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {/* Profile Stats Row */}
        <View style={styles.profileStatsRow}>
          <TouchableOpacity 
            style={styles.avatarSection} 
            activeOpacity={0.9} 
            onLongPress={() => setIsAvatarExpanded(true)}
          >
            <View style={styles.shareNoteBadge}>
              <Text style={styles.shareNoteText}>Share</Text>
              <Text style={styles.shareNoteText}>note</Text>
            </View>
            <Image source={{ uri: `https://i.pravatar.cc/150?u=${creator.id}` }} style={styles.avatar} />
            <View style={styles.addStoryBadge}>
              <Add size={12} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.statsSection}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{photos.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {creator.id === 1 ? profileData.following : socialProfile.followingCount}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {creator.id === 1 ? profileData.followers : socialProfile.followersCount}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
          {!!profileData.name && <Text style={[styles.bioText, { fontWeight: 'bold' }]}>{profileData.name}</Text>}
          {!!profileData.location && <Text style={styles.bioText}>{profileData.location}</Text>}
          {!!profileData.activities && <Text style={styles.bioLink}>{profileData.activities}</Text>}
          {!!profileData.bio && <Text style={styles.bioText}>{profileData.bio}</Text>}
          {!!profileData.website && (
            <TouchableOpacity>
              <Text style={styles.bioLinkUrl}>🔗 {profileData.website}</Text>
            </TouchableOpacity>
          )}
          {!!profileData.direction && <Text style={styles.bioText}>{profileData.direction}</Text>}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.actionBtnText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Share profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtn}>
            <UserAdd size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Tabs Row */}
        <View style={styles.tabsRow}>
          <TouchableOpacity 
            style={activeTab === 'Photos' ? styles.tabActive : styles.tabInactive}
            onPress={() => setActiveTab('Photos')}
          >
            <Grid3 size={28} color={activeTab === 'Photos' ? "#000" : "#888"} variant={activeTab === 'Photos' ? "Bold" : "Outline"} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={activeTab === 'Videos' ? styles.tabActive : styles.tabInactive}
            onPress={() => setActiveTab('Videos')}
          >
            <VideoPlay size={28} color={activeTab === 'Videos' ? "#000" : "#888"} variant={activeTab === 'Videos' ? "Bold" : "Outline"} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={activeTab === 'Tagged' ? styles.tabActive : styles.tabInactive}
            onPress={() => setActiveTab('Tagged')}
          >
            <Profile2User size={28} color={activeTab === 'Tagged' ? "#000" : "#888"} variant={activeTab === 'Tagged' ? "Bold" : "Outline"} />
          </TouchableOpacity>
        </View>

        {/* Standard 3-Column Grid */}
        <View style={styles.gridWrapper}>
          {activeTab === 'Photos' && photos.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.gridItem, 
                { width: (width - 2) / 3, height: (width - 2) / 3 },
                index % 3 !== 2 && { marginRight: 1 },
                index >= 3 && { marginTop: 1 }
              ]}
              onPress={() => handleMediaPress(item)}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.gridImage} />
            </TouchableOpacity>
          ))}
          {activeTab === 'Videos' && videos.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.gridItem, 
                { width: (width - 2) / 3, height: ((width - 2) / 3) * 1.5 }, // Reels are usually taller
                index % 3 !== 2 && { marginRight: 1 },
                index >= 3 && { marginTop: 1 }
              ]}
              onPress={() => handleMediaPress(item)}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.gridImage} />
              <View style={styles.videoIconOverlay}>
                <VideoPlay size={20} color="#FFF" variant="Bold" />
              </View>
            </TouchableOpacity>
          ))}
          {activeTab === 'Tagged' && (
            <View style={{ flex: 1, alignItems: 'center', paddingTop: 50, paddingBottom: 100 }}>
              <Text style={{ color: '#888', fontSize: 16 }}>No tagged photos</Text>
            </View>
          )}
        </View>
        
        {loading && <ActivityIndicator style={{ margin: 20 }} color="#000" />}

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
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerUsername: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 20,
  },
  atIcon: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
  },
  profileStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  avatarSection: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#EAEAEA',
  },
  shareNoteBadge: {
    position: 'absolute',
    top: -15,
    left: -5,
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
    alignItems: 'center',
  },
  shareNoteText: {
    fontSize: 10,
    color: '#333',
    fontWeight: '500',
  },
  addStoryBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statsSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 13,
    color: '#000',
    marginTop: 2,
  },
  bioSection: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  bioText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  bioLink: {
    fontSize: 14,
    color: '#1877F2',
    lineHeight: 20,
  },
  bioLinkUrl: {
    fontSize: 14,
    color: '#00376b',
    lineHeight: 20,
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 15,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  actionIconBtn: {
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
  },
  tabActive: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabInactive: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    backgroundColor: '#EAEAEA',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  videoIconOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default ProfileScreen;
