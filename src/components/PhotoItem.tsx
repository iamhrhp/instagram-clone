import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Image, Share, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, MessageText, Send2, More, ArrowLeft } from 'iconsax-react-native';
import { NormalizedPhoto } from '../types';

const { width, height } = Dimensions.get('window');

interface PhotoItemProps {
  item: NormalizedPhoto;
  onClose?: () => void;
}

const formatCount = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const PhotoItem: React.FC<PhotoItemProps> = ({ item, onClose }) => {
  const navigation = useNavigation<any>();
  const [isLiked, setIsLiked] = useState(item.id ? (Number(item.id) % 2 === 0) : false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const [likesCount, setLikesCount] = useState((Number(item.id) % 50000) + 1000); 
  const commentsCount = (Number(item.id) % 2000) + 50;
  const [showComments, setShowComments] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  
  const fullText = `Beautiful shot captured effortlessly! Check out more on my profile. This is an extended text so that you can see how it scrolls when expanded. It has a fixed max height and takes the full width of the screen so that it is easy to read. Adding more text to make sure it scrolls properly.`;

  const toggleLike = () => {
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out this amazing photo! ${item.originalUrl || item.mediumUrl}` });
    } catch (error) {}
  };

  return (
    <View style={{ width, height, backgroundColor: 'black', overflow: 'hidden' }}>
      {/* Header */}
      <View style={[styles.header, { top: Math.max(insets.top, 10) }]}>
        <View style={styles.userInfo}>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <ArrowLeft size={24} color="#FFFFFF" variant="Linear" />
            </TouchableOpacity>
          )}
          <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.photographerId || 1}` }} style={styles.avatarImage} />
          <Text style={styles.username}>{item.photographerName || 'User'}</Text>
          <TouchableOpacity style={[styles.followButton, isFollowing && styles.followingButton]} onPress={() => setIsFollowing(!isFollowing)}>
            <Text style={styles.followButtonText}>{isFollowing ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <More size="24" color="#FFFFFF" variant="Linear" />
        </TouchableOpacity>
      </View>

      {/* Image Centered */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.originalUrl || item.largeUrl || item.mediumUrl }} 
          style={styles.mainImage} 
          resizeMode="contain" 
        />
      </View>

      {/* Bottom Actions */}
      <View style={[styles.bottomSection, { bottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.actionRow}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
              <Heart size="28" color={isLiked ? "#FF3040" : "#FFFFFF"} variant={isLiked ? "Bold" : "Linear"} />
              <Text style={styles.actionText}>{formatCount(likesCount)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowComments(true)}>
              <MessageText size="28" color="#FFFFFF" variant="Linear" />
              <Text style={styles.actionText}>{formatCount(commentsCount)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Send2 size="28" color="#FFFFFF" variant="Linear" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.descriptionContainer, isDescExpanded && { zIndex: 30 }]} onPress={() => setIsDescExpanded(!isDescExpanded)} activeOpacity={0.8}>
          {isDescExpanded ? (
            <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.description}>
                <Text style={styles.descUsername}>{item.photographerName || 'User'} </Text>
                {fullText}
              </Text>
            </ScrollView>
          ) : (
            <Text style={styles.description} numberOfLines={2}>
              <Text style={styles.descUsername}>{item.photographerName || 'User'} </Text>
              {fullText}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Comments Modal */}
      <Modal visible={showComments} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
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
                <Text style={styles.dummyComment}><Text style={styles.commentUser}>alex_travels</Text> Beautiful! 😍</Text>
              </View>
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.realInput}
                  placeholder="Add a comment..."
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
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute', left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 15, zIndex: 10,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 15 },
  avatarImage: { width: 32, height: 32, borderRadius: 16, marginRight: 10, borderWidth: 1, borderColor: '#fff' },
  username: { color: 'white', fontWeight: 'bold', fontSize: 14, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  followButton: { marginLeft: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'white' },
  followingButton: { backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'transparent' },
  followButtonText: { color: 'white', fontSize: 12, fontWeight: '600' },
  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '100%', height: '100%' },
  bottomSection: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 15, zIndex: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  leftActions: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  actionText: { color: 'white', fontSize: 14, fontWeight: '600', marginLeft: 6, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  descriptionContainer: { paddingBottom: 10 },
  description: { color: 'white', fontSize: 14, lineHeight: 20, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  descUsername: { fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalDismiss: { flex: 1 },
  commentsContainer: { backgroundColor: '#1E1E1E', borderTopLeftRadius: 16, borderTopRightRadius: 16, height: '60%', paddingHorizontal: 15, paddingTop: 15 },
  commentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  commentsTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  closeButton: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  commentsBody: { flex: 1 },
  dummyComment: { color: 'white', marginBottom: 15, fontSize: 14 },
  commentUser: { fontWeight: 'bold', marginRight: 8 },
  commentInputContainer: { paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#333' },
  realInput: { backgroundColor: '#333', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 12, color: 'white', fontSize: 14 },
});

export default PhotoItem;
