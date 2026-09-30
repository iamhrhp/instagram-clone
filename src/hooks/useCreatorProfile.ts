import { useState, useEffect, useCallback } from 'react';
import { Creator, NormalizedPhoto, NormalizedVideo, SocialProfile } from '../types';
import { getCreatorPhotos, getCreatorVideos } from '../repositories/CreatorMediaRepository';
import { getFollowersCount, getFollowingCount, isFollowing, followUser, unfollowUser } from '../repositories/SocialRepository';

export const useCreatorProfile = (creator: Creator) => {
  const [photos, setPhotos] = useState<NormalizedPhoto[]>([]);
  const [videos, setVideos] = useState<NormalizedVideo[]>([]);
  
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  
  const [photoPage, setPhotoPage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);
  
  const [hasMorePhotos, setHasMorePhotos] = useState(true);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  
  const [error, setError] = useState<string | null>(null);
  
  const [socialProfile, setSocialProfile] = useState<SocialProfile>({
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
    savedPhotos: [],
    savedVideos: [],
  });

  const loadSocialData = useCallback(async () => {
    try {
      const isF = await isFollowing(creator.id);
      const followers = await getFollowersCount(creator.id);
      const following = await getFollowingCount(creator.id);
      
      setSocialProfile(prev => ({
        ...prev,
        isFollowing: isF,
        followersCount: followers,
        followingCount: following,
      }));
    } catch (err) {
      console.error(err);
    }
  }, [creator.id]);

  const toggleFollow = useCallback(async () => {
    try {
      if (socialProfile.isFollowing) {
        await unfollowUser(creator.id);
      } else {
        await followUser(creator.id);
      }
      await loadSocialData();
    } catch (err) {
      console.error(err);
    }
  }, [creator.id, socialProfile.isFollowing, loadSocialData]);

  const loadPhotos = useCallback(async (page: number, refresh = false) => {
    if (!hasMorePhotos && !refresh) return;
    if (loadingPhotos) return;
    
    setLoadingPhotos(true);
    try {
      const newPhotos = await getCreatorPhotos(creator, page);
      if (newPhotos.length === 0) setHasMorePhotos(false);
      
      setPhotos(prev => {
        if (refresh) return newPhotos;
        // Filter out duplicates
        const existingIds = new Set(prev.map(p => p.id));
        const filtered = newPhotos.filter(p => !existingIds.has(p.id));
        return [...prev, ...filtered];
      });
      setPhotoPage(page);
    } catch (err: any) {
      setError(err.message || 'Error loading photos');
    } finally {
      setLoadingPhotos(false);
    }
  }, [creator, hasMorePhotos, loadingPhotos]);

  const loadVideos = useCallback(async (page: number, refresh = false) => {
    if (!hasMoreVideos && !refresh) return;
    if (loadingVideos) return;
    
    setLoadingVideos(true);
    try {
      const newVideos = await getCreatorVideos(creator, page);
      if (newVideos.length === 0) setHasMoreVideos(false);
      
      setVideos(prev => {
        if (refresh) return newVideos;
        const existingIds = new Set(prev.map(v => v.id));
        const filtered = newVideos.filter(v => !existingIds.has(v.id));
        return [...prev, ...filtered];
      });
      setVideoPage(page);
    } catch (err: any) {
      setError(err.message || 'Error loading videos');
    } finally {
      setLoadingVideos(false);
    }
  }, [creator, hasMoreVideos, loadingVideos]);

  const loadMorePhotos = () => loadPhotos(photoPage + 1);
  const loadMoreVideos = () => loadVideos(videoPage + 1);

  const refresh = useCallback(() => {
    setHasMorePhotos(true);
    setHasMoreVideos(true);
    loadPhotos(1, true);
    loadVideos(1, true);
    loadSocialData();
  }, [loadPhotos, loadVideos, loadSocialData]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    creator,
    photos,
    videos,
    loadingPhotos,
    loadingVideos,
    loading: loadingPhotos || loadingVideos,
    error,
    socialProfile,
    toggleFollow,
    loadMorePhotos,
    loadMoreVideos,
    refresh
  };
};
