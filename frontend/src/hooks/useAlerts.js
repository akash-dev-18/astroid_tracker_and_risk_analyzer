import { useState, useEffect, useCallback } from 'react';
import { alertService } from '../services/alert.service';
import { useAuth } from './useAuth';

export const useAlerts = (autoRefresh = true) => {
  const { isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    if (!isAuthenticated) {
      setAlerts([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [alertsData, countData] = await Promise.all([
        alertService.getAll(),
        alertService.getUnreadCount(),
      ]);
      setAlerts(alertsData);
      setUnreadCount(countData.count || countData || 0);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      setError(err.response?.data?.detail || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    if (!autoRefresh || !isAuthenticated) return;

    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, isAuthenticated, fetchAlerts]);

  const markAsRead = async (alertId) => {
    try {
      await alertService.markAsRead(alertId);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, is_read: true } : a))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail };
    }
  };

  const markAllRead = async () => {
    try {
      await alertService.markAllRead();
      setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
      setUnreadCount(0);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail };
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      await alertService.delete(alertId);
      const alert = alerts.find((a) => a.id === alertId);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      if (alert && !alert.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail };
    }
  };

  return {
    alerts,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllRead,
    deleteAlert,
    refetch: fetchAlerts,
  };
};
