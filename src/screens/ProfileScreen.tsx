import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera, ArrowLeft } from 'iconsax-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = route.params?.user || { name: 'Henry Coutry', id: 1 };
  const insets = useSafeAreaInsets();
  
  const [activeTab, setActiveTab] = useState('Photos');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);

  // Format username fallback
  const username = `@${user.name.toLowerCase().replace(/\s+/g, '_')}`;

  const handleMessage = () => {
    navigation.navigate('Message', { user });
  };

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=800' }} 
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
            <Image source={{ uri: `https://i.pravatar.cc/150?u=${user.id}` }} style={styles.avatar} />
            <View style={styles.cameraBadge}>
              <Camera size={12} color="#FFF" variant="Bold" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.handle}>{username}</Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>240</Text>
              <Text style={styles.statLabel}>Post</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>47.36K</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>32K</Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.messageBtn} onPress={handleMessage}>
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.followBtn, isFollowing && styles.followingBtn]} 
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? 'Following' : 'Follow'}
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

        {/* Masonry Grid */}
        <View style={styles.gridContainer}>
           <View style={styles.gridLeft}>
              <Image source={{ uri: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400' }} style={styles.largeImage} />
           </View>
           <View style={styles.gridRight}>
              <Image source={{ uri: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400' }} style={styles.smallImageTop} />
              <Image source={{ uri: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=400' }} style={styles.smallImageBottom} />
           </View>
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
            source={{ uri: `https://i.pravatar.cc/600?u=${user.id}` }} 
            style={styles.fullScreenAvatar} 
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
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenAvatar: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    borderWidth: 2,
    borderColor: '#333',
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
