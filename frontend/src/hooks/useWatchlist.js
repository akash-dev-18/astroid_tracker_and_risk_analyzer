import { useState, useEffect, useCallback } from 'react';
import { watchlistService } from '../services/watchlist.service';
import { useAuth } from './useAuth';

export const useWatchlist = () => {
  const { isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await watchlistService.getAll();
      setWatchlist(data);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
      setError(err.response?.data?.detail || 'Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addToWatchlist = async (asteroidId, alertDistanceKm = 1000000) => {
    try {
      const data = await watchlistService.add(asteroidId, alertDistanceKm);
      setWatchlist((prev) => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to add to watchlist';
      return { success: false, error: message };
    }
  };

  const removeFromWatchlist = async (asteroidId) => {
    try {
      await watchlistService.remove(asteroidId);
      setWatchlist((prev) => prev.filter((w) => w.asteroid_id !== asteroidId));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to remove from watchlist';
      return { success: false, error: message };
    }
  };

  const updateWatchlistEntry = async (asteroidId, alertDistanceKm) => {
    try {
      const data = await watchlistService.update(asteroidId, alertDistanceKm);
      setWatchlist((prev) =>
        prev.map((w) => (w.asteroid_id === asteroidId ? data : w))
      );
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to update watchlist';
      return { success: false, error: message };
    }
  };

  const isWatched = useCallback(
    (asteroidId) => watchlist.some((w) => w.asteroid_id === asteroidId),
    [watchlist]
  );

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistEntry,
    isWatched,
    refetch: fetchWatchlist,
  };
};
