import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, FlatList, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Send, Call, Video, Camera } from 'iconsax-react-native';

const MessageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const user = route.params?.user || { name: 'User', id: 1 };
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: `Hey ${user.name}! Loved your recent reel.`, isMe: true },
    { id: '2', text: 'Thank you so much! Really appreciate it 😊', isMe: false }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: message, isMe: true }]);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Image source={{ uri: `https://i.pravatar.cc/150?u=${user.id}` }} style={styles.headerAvatar} />
          <View>
            <Text style={styles.headerName}>{user.name}</Text>
            <Text style={styles.headerUsername}>@{user.name.toLowerCase().replace(/\s+/g, '_')}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}><Call size={24} color="#FFF" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Video size={24} color="#FFF" /></TouchableOpacity>
        </View>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chatArea}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.isMe ? styles.myMessage : styles.theirMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.cameraBtn}>
            <Camera size={24} color="#FFF" variant="Bold" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Message..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
          />
          {message.trim().length > 0 && (
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  iconBtn: {
    padding: 5,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerUsername: {
    color: '#888',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  chatArea: {
    flex: 1,
  },
  messagesList: {
    padding: 15,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3797F0',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#262626',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#FFF',
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  cameraBtn: {
    backgroundColor: '#3797F0',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#262626',
    color: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendBtn: {
    marginLeft: 15,
  },
  sendText: {
    color: '#3797F0',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MessageScreen;
