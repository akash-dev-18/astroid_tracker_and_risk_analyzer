import { useState, useEffect, useCallback } from 'react';
import { asteroidService } from '../services/asteroid.service';

export const useAsteroids = (initialFilters = {}) => {
  const [asteroids, setAsteroids] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchAsteroids = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await asteroidService.getFeed(filters);
      setAsteroids(data.asteroids || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error('Failed to fetch asteroids:', err);
      setError(err.response?.data?.detail || 'Failed to load asteroids');
      setAsteroids([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAsteroids();
  }, [fetchAsteroids]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    asteroids,
    count,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchAsteroids,
  };
};

export const useAsteroidDetail = (id) => {
  const [asteroid, setAsteroid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAsteroid = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await asteroidService.getById(id);
        setAsteroid(data);
      } catch (err) {
        console.error('Failed to fetch asteroid:', err);
        setError(err.response?.data?.detail || 'Failed to load asteroid');
      } finally {
        setLoading(false);
      }
    };

    fetchAsteroid();
  }, [id]);

  return { asteroid, loading, error };
};

export const useAsteroidSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await asteroidService.search(query);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.response?.data?.detail || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
};
