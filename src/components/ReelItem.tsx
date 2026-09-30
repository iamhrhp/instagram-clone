import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Image, Share, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, MessageText, Send2, Pause, Music, More, ArrowLeft } from 'iconsax-react-native';
import { PexelsVideo } from '../types';

const { width, height } = Dimensions.get('window');

interface ReelItemProps {
  item: PexelsVideo;
  isActive: boolean;
  onClose?: () => void;
}

const formatCount = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const ReelItem: React.FC<ReelItemProps> = ({ item, isActive, onClose }) => {
  const navigation = useNavigation<any>();
  const videoRef = useRef<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Deterministic dummy counts based on video id so they don't jump around
  const [likesCount, setLikesCount] = useState((item.id % 50000) + 1000); 
  const commentsCount = (item.id % 2000) + 50;

  const [showComments, setShowComments] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const insets = useSafeAreaInsets();

  const fullText = item.user.name ? `Embark on a soul-refreshing journey where time slows down. This is a beautiful extended description that will show when you tap to expand. It can be quite long and will scroll inside its container while taking up the full width of the screen so it is easy to read. Adding a bit more text to demonstrate the fixed height and scrolling behavior effectively.` : 'A wonderful journey that continues...';

  const videoFile = item.video_files.find(file => file.quality === 'hd' && file.height > file.width) || item.video_files[0];

  const handlePress = () => setIsPaused(!isPaused);

  const navigateToProfile = () => {
    navigation.navigate('Profile', { user: item.user, videoItem: item });
  };

  const toggleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing video by ${item.user.name || 'this creator'}! ${videoFile.link}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={{ width, height, backgroundColor: 'black', overflow: 'hidden' }}>
        <Video
          ref={videoRef}
          source={{ uri: videoFile.link }}
          style={{ width, height, position: 'absolute', top: 0, left: 0 }}
          resizeMode="cover"
          repeat={true}
          paused={!isActive || isPaused}
          ignoreSilentSwitch="ignore"
          playInBackground={false}
          playWhenInactive={false}
        />
        
        {/* Header for Back Button */}
        {onClose && (
          <View style={[styles.header, { top: Math.max(insets.top, 10) }]}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <ArrowLeft size={28} color="#FFFFFF" variant="Linear" style={styles.backIconShadow} />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ width, height, position: 'absolute', top: 0, left: 0, justifyContent: 'flex-end', paddingBottom: Math.max(insets.bottom, 20), paddingHorizontal: 15 }}>
          {isPaused && (
            <View style={styles.pauseIconContainer}>
              <View style={styles.pauseIconBg}>
                 <Pause size="50" color="#FFFFFF" variant="Bold" />
              </View>
            </View>
          )}
          
          <View style={[styles.bottomSection, isDescExpanded && { paddingRight: 15, zIndex: 30 }]}>
            <View style={styles.userInfo}>
              <TouchableOpacity onPress={navigateToProfile}>
                <Image 
                  source={{ uri: `https://i.pravatar.cc/150?u=${item.user.id}` }} 
                  style={styles.avatarImage} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToProfile}>
                <Text style={styles.username}>{item.user.name || 'User'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.followButton, isFollowing && styles.followingButton]} 
                onPress={() => setIsFollowing(!isFollowing)}
              >
                <Text style={styles.followButtonText}>{isFollowing ? 'Following' : 'Follow'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setIsDescExpanded(!isDescExpanded)} activeOpacity={0.8}>
              {isDescExpanded ? (
                <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={false}>
                  <Text style={styles.description}>{fullText}</Text>
                </ScrollView>
              ) : (
                <Text style={styles.description} numberOfLines={2}>
                  {fullText}
                </Text>
              )}
            </TouchableOpacity>
            <View style={styles.musicRow}>
              <Music size="14" color="#FFFFFF" variant="Bold" />
              <Text style={styles.musicText}>Original Audio - {item.user.name || 'User'}</Text>
            </View>
          </View>
          
          <View style={[styles.rightSection, { bottom: Math.max(insets.bottom, 20) + 20 }]}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
              <View style={styles.iconWrapper}>
                <Heart size="34" color={isLiked ? "#FF3040" : "#FFFFFF"} variant={isLiked ? "Bold" : "Linear"} />
              </View>
              <Text style={styles.actionText}>{formatCount(likesCount)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowComments(true)}>
              <View style={styles.iconWrapper}>
                <MessageText size="32" color="#FFFFFF" variant="Linear" />
              </View>
              <Text style={styles.actionText}>{formatCount(commentsCount)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <View style={styles.iconWrapper}>
                <Send2 size="32" color="#FFFFFF" variant="Linear" />
              </View>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.iconWrapper}>
                <More size="24" color="#FFFFFF" variant="Linear" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Modal (BottomSheet Simulation) */}
        <Modal visible={showComments} animationType="slide" transparent={true}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1 }}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => setShowComments(false)}>
                <View style={styles.modalDismiss} />
              </TouchableWithoutFeedback>
              <View style={[styles.commentsContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <View style={styles.commentsHeader}>
                  <Text style={styles.commentsTitle}>{formatCount(commentsCount)} comments</Text>
                  <TouchableOpacity onPress={() => setShowComments(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.commentsBody}>
                  <Text style={styles.dummyComment}><Text style={styles.commentUser}>alex_travels</Text> This looks absolutely incredible! 😍</Text>
                  <Text style={styles.dummyComment}><Text style={styles.commentUser}>sarah.j</Text> Added to my bucket list.</Text>
                  <Text style={styles.dummyComment}><Text style={styles.commentUser}>photo_guru</Text> What camera did you use for this?</Text>
                </View>
                <View style={styles.commentInputContainer}>
                  <TextInput
                    style={styles.realInput}
                    placeholder={`Add a comment for ${item.user.name || 'User'}...`}
                    placeholderTextColor="#999"
                    value={commentText}
                    onChangeText={setCommentText}
                    returnKeyType="send"
                    onSubmitEditing={() => setCommentText('')}
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute', left: 15, zIndex: 20,
  },
  backButton: {
    padding: 5,
  },
  backIconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalDismiss: {
    flex: 1,
  },
  commentsContainer: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '60%',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  commentsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  commentsBody: {
    flex: 1,
  },
  dummyComment: {
    color: 'white',
    marginBottom: 15,
    fontSize: 14,
  },
  commentUser: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  commentInputContainer: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  realInput: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: 'white',
    fontSize: 14,
  },
  commentInputPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  pauseIconContainer: {
    ...StyleSheet.absoluteFill as any,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pauseIconBg: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 40,
    padding: 10,
  },
  bottomSection: {
    paddingRight: 70, // Space for right actions
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'white',
    marginRight: 10,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  followButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'white',
  },
  followingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'transparent',
  },
  followButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    color: 'white',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    lineHeight: 20,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  musicText: {
    color: 'white',
    fontSize: 13,
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  rightSection: {
    position: 'absolute',
    right: 12,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 22,
  },
  iconWrapper: {
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default ReelItem;
