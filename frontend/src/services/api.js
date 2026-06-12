import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

console.log("The API_URL", API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s timeout since analyzing profile calls external GitHub API which can take time
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for centralized error toaster message handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      errorMessage = 'Backend API is offline or unreachable. Please try again later.';
    } else {
      errorMessage = error.message;
    }

    console.error('[API Error]:', error);
    // Don't show toast for 404 cache checks, handle them gracefully in controllers
    return Promise.reject(new Error(errorMessage));
  }
);

export const analyzeProfile = async (username, refresh = false) => {
  const response = await api.post(`/profiles/analyze?refresh=${refresh}`, { username });
  return response.data;
};

export const getProfiles = async (params = {}) => {
  const response = await api.get('/profiles', { params });
  return response.data;
};

export const getProfile = async (username) => {
  const response = await api.get(`/profiles/${username}`);
  return response.data;
};

export const reanalyzeProfile = async (username) => {
  const response = await api.put(`/profiles/${username}/reanalyze`);
  return response.data;
};

export const deleteProfile = async (username) => {
  const response = await api.delete(`/profiles/${username}`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const getTopDevelopers = async () => {
  const response = await api.get('/top-developers');
  return response.data;
};

export default api;
