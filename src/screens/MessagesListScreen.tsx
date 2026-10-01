import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Edit, SearchNormal1, Camera, MoreCircle } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfileData } from '../hooks/useProfileData';

const MessagesListScreen = () => {
  const navigation = useNavigation<any>();
  const { profileData } = useProfileData();
  const displayUsername = profileData.username || 'username';

  const MOCK_NOTES = [
    { id: '1', name: 'Your note', text: "What's on your playlist?", isMe: true },
    { id: '2', name: 'username', text: 'Lorem ipsum dolor sit amet, consectetur', isMe: false },
  ];

  const MOCK_CHATS = [
    { id: '1', name: 'username', message: '2 new messages', time: '2h', unread: true },
    { id: '2', name: 'username', message: 'Sent 17h ago', time: '3h', unread: false },
    { id: '3', name: 'username', message: 'Sent 17h ago', time: '', unread: false },
    { id: '4', name: 'username', message: 'Sent a reel by lorem ipsum', time: '', unread: false, isReply: true },
    { id: '5', name: 'username', message: 'lorem ipsum sent a reel...', time: '1d', unread: true },
    { id: '6', name: 'username', message: 'Sent yesterday', time: '', unread: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{displayUsername} ∨</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerRight}>
          <Edit size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchNormal1 size={18} color="#888" />
          <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#888" />
        </View>
      </View>

      <View style={styles.notesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MOCK_NOTES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <View style={styles.noteBubble}>
                <Text style={styles.noteText} numberOfLines={3}>{item.text}</Text>
              </View>
              <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.id + 100}` }} style={styles.noteAvatar} />
              <Text style={styles.noteName}>{item.name}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.messagesHeader}>
        <Text style={styles.messagesTitle}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MessageRequests')}>
          <Text style={styles.requestsText}>Requests</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => navigation.navigate('Message', { user: { id: parseInt(item.id), name: item.name } })}
          >
            <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.id}` }} style={styles.chatAvatar} />
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.name}</Text>
              <View style={styles.chatMessageRow}>
                <Text style={[styles.chatMessage, item.unread && styles.chatMessageUnread]} numberOfLines={1}>
                  {item.message}
                </Text>
                {item.time ? <Text style={styles.chatTime}> • {item.time}</Text> : null}
                {item.isReply && <Text style={styles.chatReply}> • Reply?</Text>}
              </View>
            </View>
            <View style={styles.chatRight}>
              {item.unread && <View style={styles.unreadDot} />}
              <Camera size={24} color="#888" variant="Outline" style={styles.cameraIcon} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerLeft: {
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 36,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#000',
  },
  notesContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  noteItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  noteBubble: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 8,
    marginBottom: -10,
    zIndex: 1,
    minHeight: 40,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  noteText: {
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
  },
  noteAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
  },
  noteName: {
    marginTop: 5,
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  messagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  messagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  requestsText: {
    fontSize: 14,
    color: '#3797F0',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  chatMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 13,
    color: '#888',
    flexShrink: 1,
  },
  chatMessageUnread: {
    color: '#000',
    fontWeight: '600',
  },
  chatTime: {
    fontSize: 13,
    color: '#888',
  },
  chatReply: {
    fontSize: 13,
    color: '#3797F0',
    fontWeight: '500',
  },
  chatRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3797F0',
    marginRight: 15,
  },
  cameraIcon: {
    marginLeft: 5,
  },
});

export default MessagesListScreen;
