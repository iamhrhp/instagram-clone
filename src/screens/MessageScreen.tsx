import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, FlatList, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Send, Call, Video, Camera, Microphone2, Gallery, AddCircle, Sticker } from 'iconsax-react-native';

const MessageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const user = route.params?.user || { name: 'User', id: 1 };
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: `Lorem ipsum dolor`, isMe: true },
    { id: '2', text: 'Lorem', isMe: true },
    { id: '3', text: 'Lorem ipsum', isMe: false },
    { id: '4', text: 'Lorem ipsum dolor sit amet', isMe: false },
    { id: '5', text: 'Lorem ipsum dolor sit amet', isMe: false },
    { id: '6', text: 'Lorem ipsum', isMe: true },
    { id: '7', text: 'Lorem ipsum dolor', isMe: true },
    { id: '8', text: 'Lorem ipsum dolor sit amet', isMe: true },
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
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerTitleContainer} onPress={() => navigation.goBack()}>
          <Image source={{ uri: `https://i.pravatar.cc/150?u=${user.id}` }} style={styles.headerAvatar} />
          <View>
            <Text style={styles.headerName}>{user.name}</Text>
            <Text style={styles.headerBusinessChat}>Business chat</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}><Call size={24} color="#000" variant="Outline" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Video size={24} color="#000" variant="Outline" /></TouchableOpacity>
        </View>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chatArea}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item, index }) => {
            const isLastOfGroup = index === messages.length - 1 || messages[index + 1].isMe !== item.isMe;
            return (
              <View style={[styles.messageRow, item.isMe ? styles.myMessageRow : styles.theirMessageRow]}>
                {!item.isMe && isLastOfGroup ? (
                  <Image source={{ uri: `https://i.pravatar.cc/150?u=${user.id}` }} style={styles.messageAvatar} />
                ) : (
                  !item.isMe && <View style={styles.messageAvatarPlaceholder} />
                )}
                <View style={[
                  styles.messageBubble, 
                  item.isMe ? styles.myMessage : styles.theirMessage,
                  item.isMe && isLastOfGroup ? { borderBottomRightRadius: 4 } : null,
                  !item.isMe && isLastOfGroup ? { borderBottomLeftRadius: 4 } : null,
                ]}>
                  <Text style={[styles.messageText, item.isMe ? styles.myMessageText : styles.theirMessageText]}>{item.text}</Text>
                </View>
              </View>
            );
          }}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.cameraBtn}>
            <Camera size={20} color="#FFF" variant="Bold" />
          </TouchableOpacity>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Message..."
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSend}
            />
          </View>
          {message.trim().length > 0 ? (
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.iconBtn}><Microphone2 size={24} color="#000" /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}><Gallery size={24} color="#000" /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}><Sticker size={24} color="#000" /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}><AddCircle size={24} color="#000" /></TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCAEDC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerBusinessChat: {
    color: '#3797F0',
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
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  messageAvatarPlaceholder: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessage: {
    backgroundColor: '#9F519F',
  },
  theirMessage: {
    backgroundColor: '#FFFFFF',
  },
  myMessageText: {
    color: '#FFF',
    fontSize: 15,
  },
  theirMessageText: {
    color: '#000',
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  cameraBtn: {
    backgroundColor: '#9F519F',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInputWrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  textInput: {
    flex: 1,
    color: '#000',
    fontSize: 15,
  },
  inputActions: {
    flexDirection: 'row',
    marginLeft: 10,
    gap: 10,
  },
  sendBtn: {
    marginLeft: 15,
  },
  sendText: {
    color: '#9F519F',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MessageScreen;
