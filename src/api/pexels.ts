import axios from 'axios';
import { PexelsResponse, PexelsPhotoResponse, PexelsPhoto, PexelsVideo, NormalizedPhoto, NormalizedVideo } from '../types';

const PEXELS_API_KEY = '3lSmZUWT3CDsPKpQwzzdL1A7NNsvVt9FiQvlsOdNwMojQzHAbg43Od3r';

const pexelsApi = axios.create({
  baseURL: 'https://api.pexels.com',
  headers: {
    Authorization: PEXELS_API_KEY,
  },
});

export const searchPhotos = async ({ query, orientation, page = 1, perPage = 15 }: { query: string; orientation?: string; page?: number; perPage?: number }): Promise<NormalizedPhoto[]> => {
  const params: any = { query, page, per_page: perPage };
  if (orientation) params.orientation = orientation;
  
  const response = await pexelsApi.get<PexelsPhotoResponse>('/v1/search', { params });
  return response.data.photos.map(normalizePhoto);
};

export const searchVideos = async ({ query, orientation, page = 1, perPage = 15 }: { query: string; orientation?: string; page?: number; perPage?: number }): Promise<NormalizedVideo[]> => {
  const params: any = { query, page, per_page: perPage };
  if (orientation) params.orientation = orientation;
  
  const response = await pexelsApi.get<PexelsResponse>('/videos/search', { params });
  return response.data.videos.map(normalizeVideo);
};

export const getPopularVideos = async ({ page = 1, perPage = 15 }: { page?: number; perPage?: number }) => {
  const response = await pexelsApi.get<PexelsResponse>('/videos/popular', {
    params: { page, per_page: perPage, min_width: 1080, min_height: 1920 },
  });
  return response.data.videos; // Retaining for backwards compatibility with ReelItem for now
};

export const getCuratedPhotos = async ({ page = 1, perPage = 15 }: { page?: number; perPage?: number }): Promise<NormalizedPhoto[]> => {
  const response = await pexelsApi.get<PexelsPhotoResponse>('/v1/curated', {
    params: { page, per_page: perPage },
  });
  return response.data.photos.map(normalizePhoto);
};

export const getPhoto = async (id: number): Promise<NormalizedPhoto> => {
  const response = await pexelsApi.get<PexelsPhoto>(`/v1/photos/${id}`);
  return normalizePhoto(response.data);
};

export const getVideo = async (id: number): Promise<NormalizedVideo> => {
  const response = await pexelsApi.get<PexelsVideo>(`/videos/videos/${id}`);
  return normalizeVideo(response.data);
};

const normalizePhoto = (photo: PexelsPhoto): NormalizedPhoto => ({
  id: photo.id.toString(),
  type: 'photo',
  width: photo.width,
  height: photo.height,
  aspectRatio: photo.width / photo.height,
  thumbnail: photo.src.medium,
  mediumUrl: photo.src.large,
  largeUrl: photo.src.large2x,
  originalUrl: photo.src.original,
  photographerId: photo.photographer_id,
  photographerName: photo.photographer,
  photographerUrl: photo.photographer_url,
});

const normalizeVideo = (video: PexelsVideo): NormalizedVideo => {
  // Try to find an HD vertical video, fallback to best available
  let bestFile = video.video_files.find(f => f.quality === 'hd' && f.height > f.width);
  if (!bestFile) bestFile = video.video_files.find(f => f.quality === 'hd');
  if (!bestFile) bestFile = video.video_files[0];

  return {
    id: video.id.toString(),
    type: 'video',
    width: video.width,
    height: video.height,
    duration: video.duration,
    thumbnail: video.image,
    videoUrl: bestFile?.link || '',
    videoFiles: video.video_files,
    creatorId: video.user.id,
    creatorName: video.user.name,
    creatorUrl: video.user.url,
  };
};
