import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfileData {
  name: string;
  username: string;
  location: string;
  activities: string;
  bio: string;
  website: string;
  direction: string;
  posts: string;
  followers: string;
  following: string;
}

const DEFAULT_PROFILE: UserProfileData = {
  name: 'Henry Coutry',
  username: 'henry',
  location: '',
  activities: '',
  bio: '',
  website: '',
  direction: '',
  posts: '0',
  followers: '0',
  following: '0',
};

const PROFILE_STORAGE_KEY = '@user_profile_data';

export const useProfileData = () => {
  const [profileData, setProfileData] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (storedData) {
          setProfileData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Failed to load profile data', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const saveProfileData = async (newData: UserProfileData) => {
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newData));
      setProfileData(newData);
    } catch (error) {
      console.error('Failed to save profile data', error);
      throw error;
    }
  };

  return {
    profileData,
    saveProfileData,
    loading,
  };
};
