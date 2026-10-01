import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';
import { ArrowLeft, Setting4, Verify } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';

const MessageRequestsScreen = () => {
  const navigation = useNavigation<any>();

  const MOCK_REQUESTS = [
    { id: '1', name: 'Georgi Ganatra', message: 'come to my birthday party', time: '16m', verified: true, unread: true },
    { id: '2', name: 'Maria Torres', message: 'Replied to your story: 🔥', time: '21m', verified: true, unread: true },
    { id: '3', name: 'Sobhan Rahimi', message: 'Sent a photo', time: '22m', verified: true, unread: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message request</Text>
        <TouchableOpacity style={styles.headerRight}>
          <Text style={styles.editBtn}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Sort & Filter */}
      <View style={styles.filterSection}>
        <View style={styles.filterTextCol}>
          <Text style={styles.filterTitle}>Sort & filter</Text>
          <Text style={styles.filterSubtitle}>Verified accounts, Businesses, Creators</Text>
        </View>
        <TouchableOpacity>
          <Setting4 size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.chipsRow}>
        <TouchableOpacity style={[styles.chip, styles.chipActive]}>
          <View style={[styles.chipDot, { backgroundColor: '#3797F0' }]} />
          <Text style={[styles.chipText, styles.chipTextActive]}>All <Text style={{fontWeight: 'normal'}}>20+</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip}>
          <View style={[styles.chipDot, { backgroundColor: '#3797F0' }]} />
          <Text style={styles.chipText}>Story replies <Text style={{fontWeight: 'normal', color: '#888'}}>20+</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip}>
          <View style={[styles.chipDot, { backgroundColor: '#3797F0' }]} />
          <Text style={styles.chipText}>Hidden <Text style={{fontWeight: 'normal', color: '#888'}}>16</Text></Text>
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <FlatList
        data={MOCK_REQUESTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.requestItem}>
            <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.id + 50}` }} style={styles.avatar} />
            <View style={styles.requestInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.name}</Text>
                {item.verified && <Verify size={14} color="#3797F0" variant="Bold" style={styles.verifyIcon} />}
              </View>
              <View style={styles.messageRow}>
                <Text style={[styles.message, item.unread && styles.messageUnread]} numberOfLines={1}>
                  {item.message}
                </Text>
                <Text style={styles.time}> • {item.time}</Text>
              </View>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
      />

      {/* Footer Text */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Open a chat for more info on who's messaging you. They won't know you've seen it until you accept.
        </Text>
      </View>
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
    paddingVertical: 12,
  },
  headerLeft: {
    width: 40,
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
  editBtn: {
    color: '#3797F0',
    fontSize: 16,
    fontWeight: '500',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
  },
  filterTextCol: {
    flex: 1,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  filterSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 20,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipActive: {
    backgroundColor: '#EBF4FF',
    borderColor: '#EBF4FF',
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  chipTextActive: {
    color: '#3797F0',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E0E0E0',
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  verifyIcon: {
    marginLeft: 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    fontSize: 13,
    color: '#888',
    flexShrink: 1,
  },
  messageUnread: {
    color: '#000',
    fontWeight: '600',
  },
  time: {
    fontSize: 13,
    color: '#888',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3797F0',
    marginLeft: 10,
  },
  footer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default MessageRequestsScreen;
