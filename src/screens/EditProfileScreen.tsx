import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Check } from 'iconsax-react-native';
import { useProfileData, UserProfileData } from '../hooks/useProfileData';

const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { profileData, saveProfileData } = useProfileData();

  const [formData, setFormData] = useState<UserProfileData>(profileData);

  // Sync state when data loads initially
  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  const handleSave = async () => {
    await saveProfileData(formData);
    // Let ProfileScreen reload if we just go back, it will re-mount or we can use event listeners, 
    // but the simplest way is to pass the param back or just let the hook fetch again.
    // The hook in ProfileScreen will fetch on mount. To force update, we can pass a timestamp.
    navigation.navigate('Main', {
      screen: 'ProfileTab',
      params: { timestamp: Date.now() },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <ArrowLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
            <Check size={28} color="#3498db" variant="Bold" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={text => setFormData({ ...formData, name: text })}
              placeholder="Name"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={text => setFormData({ ...formData, username: text })}
              placeholder="Username"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={formData.bio}
              onChangeText={text => setFormData({ ...formData, bio: text })}
              placeholder="Bio"
              placeholderTextColor="#999"
              multiline
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              value={formData.website}
              onChangeText={text => setFormData({ ...formData, website: text })}
              placeholder="Website"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={text => setFormData({ ...formData, location: text })}
              placeholder="Location"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Activities</Text>
            <TextInput
              style={styles.input}
              value={formData.activities}
              onChangeText={text => setFormData({ ...formData, activities: text })}
              placeholder="Activities"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Direction</Text>
            <TextInput
              style={styles.input}
              value={formData.direction}
              onChangeText={text => setFormData({ ...formData, direction: text })}
              placeholder="Direction"
              placeholderTextColor="#999"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
  },
});

export default EditProfileScreen;
