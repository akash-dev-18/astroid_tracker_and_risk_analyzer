import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Trash2, Edit3, Rocket, ArrowRight, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { PageLoader } from '../components/ui/Loader';
import { Toast } from '../components/ui/Alert';
import { useWatchlist } from '../hooks/useWatchlist';
import { formatDate, formatDistance, formatRelativeTime } from '../utils/formatters';

export const Watchlist = () => {
  const { watchlist, loading, removeFromWatchlist, updateWatchlistEntry, refetch } = useWatchlist();
  const [editItem, setEditItem] = useState(null);
  const [newDistance, setNewDistance] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const handleRemove = async (asteroidId) => {
    const result = await removeFromWatchlist(asteroidId);
    if (result.success) {
      setToast({ visible: true, message: 'Removed from watchlist', type: 'success' });
    } else {
      setToast({ visible: true, message: result.error || 'Failed to remove', type: 'error' });
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewDistance((item.alert_distance_km / 1000000).toString());
  };

  const handleSaveEdit = async () => {
    if (!editItem || !newDistance) return;
    
    const distanceKm = parseFloat(newDistance) * 1000000;
    const result = await updateWatchlistEntry(editItem.asteroid_id, distanceKm);
    
    if (result.success) {
      setToast({ visible: true, message: 'Alert threshold updated!', type: 'success' });
      setEditItem(null);
    } else {
      setToast({ visible: true, message: result.error || 'Failed to update', type: 'error' });
    }
  };

  if (loading) return <PageLoader text="Loading your watchlist..." />;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-8 h-8 text-space-400" />
            <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          </div>
          <p className="text-space-400">
            {watchlist.length} asteroid{watchlist.length !== 1 ? 's' : ''} being monitored
          </p>
        </motion.div>

        {watchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-space-600/20 rounded-full flex items-center justify-center">
              <Rocket className="w-10 h-10 text-space-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No Asteroids Yet</h2>
            <p className="text-space-400 mb-6 max-w-md mx-auto">
              Start tracking asteroids by adding them to your watchlist. 
              You'll receive alerts when they approach within your threshold.
            </p>
            <Link to="/feed">
              <Button icon={ArrowRight} iconPosition="right">
                Browse Asteroids
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {watchlist.map((item, index) => (
              <motion.div
                key={item.asteroid_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:border-space-600/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link to={`/asteroid/${item.asteroid_id}`} className="flex-1 min-w-0 group">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🪨</span>
                        <h3 className="text-lg font-semibold text-white group-hover:text-space-300 transition-colors truncate">
                          {item.asteroid_name || item.asteroid_id}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="text-space-400">
                          Added {formatRelativeTime(item.created_at)}
                        </span>
                        <span className="text-space-500">•</span>
                        <span className="text-space-300">
                          Alert at: <span className="text-warning-400">{formatDistance(item.alert_distance_km)}</span>
                        </span>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit3}
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleRemove(item.asteroid_id)}
                        className="text-danger-400 hover:bg-danger-600/10"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {watchlist.length > 0 && (
          <div className="mt-8 text-center">
            <Link to="/feed">
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                Add More Asteroids
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit Alert Threshold"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-space-800/50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-warning-400 shrink-0" />
            <p className="text-sm text-space-300">
              You'll receive an alert when this asteroid approaches within this distance of Earth.
            </p>
          </div>
          
          <Input
            label="Alert Distance (Million km)"
            type="number"
            step="0.1"
            min="0.1"
            value={newDistance}
            onChange={(e) => setNewDistance(e.target.value)}
            placeholder="1.0"
          />

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setEditItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};
