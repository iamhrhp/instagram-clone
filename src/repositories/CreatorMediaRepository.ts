import { Creator, NormalizedPhoto, NormalizedVideo } from '../types';
import { searchPhotos, searchVideos } from '../api/pexels';

export const getCreatorPhotos = async (creator: Creator, page: number = 1): Promise<NormalizedPhoto[]> => {
  // Pexels doesn't have a creator endpoint, so we fallback to searching by name
  return searchPhotos({ query: creator.name || 'person', orientation: 'portrait', page, perPage: 15 });
};

export const getCreatorVideos = async (creator: Creator, page: number = 1): Promise<NormalizedVideo[]> => {
  // Fallback to searching videos by name
  return searchVideos({ query: creator.name || 'person', orientation: 'portrait', page, perPage: 15 });
};
