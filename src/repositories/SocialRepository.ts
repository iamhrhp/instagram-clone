import AsyncStorage from '@react-native-async-storage/async-storage';

const FOLLOWS_KEY = '@follows_';
const SAVED_MEDIA_KEY = '@saved_media';

export interface SavedMedia {
  mediaId: string;
  type: 'photo' | 'video';
  savedAt: number;
}

export const followUser = async (userId: number): Promise<void> => {
  await AsyncStorage.setItem(`${FOLLOWS_KEY}${userId}`, 'true');
};

export const unfollowUser = async (userId: number): Promise<void> => {
  await AsyncStorage.removeItem(`${FOLLOWS_KEY}${userId}`);
};

export const isFollowing = async (userId: number): Promise<boolean> => {
  const value = await AsyncStorage.getItem(`${FOLLOWS_KEY}${userId}`);
  return value === 'true';
};

export const getFollowersCount = async (userId: number): Promise<number> => {
  // Deterministic local mock
  const isCurrentlyFollowing = await isFollowing(userId);
  const base = ((userId % 90) + 10) * 1000 + (userId % 900);
  return isCurrentlyFollowing ? base + 1 : base;
};

export const getFollowingCount = async (userId: number): Promise<number> => {
  return (userId % 500) + 100;
};

export const saveMedia = async (mediaId: string, type: 'photo' | 'video'): Promise<void> => {
  const saved = await getSavedMedia();
  if (!saved.some(m => m.mediaId === mediaId)) {
    saved.push({ mediaId, type, savedAt: Date.now() });
    await AsyncStorage.setItem(SAVED_MEDIA_KEY, JSON.stringify(saved));
  }
};

export const unsaveMedia = async (mediaId: string): Promise<void> => {
  const saved = await getSavedMedia();
  const filtered = saved.filter(m => m.mediaId !== mediaId);
  await AsyncStorage.setItem(SAVED_MEDIA_KEY, JSON.stringify(filtered));
};

export const isSaved = async (mediaId: string): Promise<boolean> => {
  const saved = await getSavedMedia();
  return saved.some(m => m.mediaId === mediaId);
};

export const getSavedMedia = async (): Promise<SavedMedia[]> => {
  const data = await AsyncStorage.getItem(SAVED_MEDIA_KEY);
  return data ? JSON.parse(data) : [];
};
