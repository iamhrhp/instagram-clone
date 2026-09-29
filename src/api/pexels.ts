import axios from 'axios';
import { PexelsResponse } from '../types';

// IMPORTANT: Replace this with your actual Pexels API Key
const PEXELS_API_KEY = '3lSmZUWT3CDsPKpQwzzdL1A7NNsvVt9FiQvlsOdNwMojQzHAbg43Od3r';

const pexelsApi = axios.create({
  baseURL: 'https://api.pexels.com/videos',
  headers: {
    Authorization: PEXELS_API_KEY,
  },
});

export const fetchPopularVideos = async (page: number = 1, perPage: number = 10) => {
  try {
    const response = await pexelsApi.get<PexelsResponse>('/popular', {
      params: {
        page,
        per_page: perPage,
        min_width: 1080, // Request vertical-ish video
        min_height: 1920
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Pexels videos:', error);
    throw error;
  }
};
