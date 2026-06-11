import React, { createContext, useState, useContext, useCallback } from 'react';
import * as apiService from '../services/api';
import toast from 'react-hot-toast';

const ProfileContext = createContext(undefined);

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [topDevelopers, setTopDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // separate loading for delete/reanalyze
  const [error, setError] = useState(null);

  const fetchProfiles = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getProfiles(params);
      if (result.success) {
        setProfiles(result.data.profiles);
        setPagination(result.data.pagination);
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error loading profiles: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getProfile(username);
      if (result.success) {
        setSelectedProfile(result.data);
        return result.data;
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error loading profile: ${err.message}`);
      setSelectedProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const analyze = async (username, refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.analyzeProfile(username, refresh);
      if (result.success) {
        setSelectedProfile(result.data);
        toast.success(result.message || 'Profile analyzed successfully');
        return result.data;
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Error analyzing profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reanalyze = async (username) => {
    setActionLoading(true);
    try {
      const result = await apiService.reanalyzeProfile(username);
      if (result.success) {
        setSelectedProfile(result.data);
        toast.success(result.message || 'Profile updated successfully');
        return result.data;
      }
    } catch (err) {
      toast.error(err.message || 'Error reanalyzing profile');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeProfile = async (username) => {
    setActionLoading(true);
    try {
      const result = await apiService.deleteProfile(username);
      if (result.success) {
        toast.success(result.message || 'Profile deleted successfully');
        if (selectedProfile && selectedProfile.username.toLowerCase() === username.toLowerCase()) {
          setSelectedProfile(null);
        }
        // Refresh profiles list
        fetchProfiles();
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting profile');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getAnalytics();
      setAnalytics(result);
    } catch (err) {
      setError(err.message);
      toast.error(`Error fetching analytics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopDevelopers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getTopDevelopers();
      if (result.success) {
        setTopDevelopers(result.data);
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error loading top developers: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        pagination,
        selectedProfile,
        analytics,
        topDevelopers,
        loading,
        actionLoading,
        error,
        fetchProfiles,
        fetchProfile,
        analyze,
        reanalyze,
        removeProfile,
        fetchAnalytics,
        fetchTopDevelopers,
        setSelectedProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfiles must be used within a ProfileProvider');
  }
  return context;
};
