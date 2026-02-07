import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AsteroidList } from '../components/asteroids/AsteroidList';
import { AsteroidFilters } from '../components/asteroids/AsteroidFilters';
import { Button } from '../components/ui/Button';
import { useAsteroids } from '../hooks/useAsteroids';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../hooks/useAuth';
import { Toast } from '../components/ui/Alert';

export const Feed = () => {
  const { isAuthenticated } = useAuth();
  const { asteroids, count, loading, error, filters, updateFilters, resetFilters } = useAsteroids({
    limit: 12,
    offset: 0,
  });
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(count / itemsPerPage);

  const handleWatch = async (asteroidId) => {
    if (!isAuthenticated) {
      setToast({ visible: true, message: 'Please sign in to add asteroids to your watchlist', type: 'warning' });
      return;
    }
    const result = await addToWatchlist(asteroidId);
    if (result.success) {
      setToast({ visible: true, message: 'Added to watchlist!', type: 'success' });
    } else {
      setToast({ visible: true, message: result.error || 'Failed to add', type: 'error' });
    }
  };

  const handleUnwatch = async (asteroidId) => {
    const result = await removeFromWatchlist(asteroidId);
    if (result.success) {
      setToast({ visible: true, message: 'Removed from watchlist', type: 'info' });
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateFilters({ offset: newPage * itemsPerPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Asteroid Feed
          </h1>
          <p className="text-space-400">
            {count} asteroids found • Browse and track Near-Earth Objects
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24">
              <AsteroidFilters
                filters={filters}
                onFilterChange={updateFilters}
                onReset={resetFilters}
              />
            </div>
          </aside>

          <main className="flex-1">
            <AsteroidList
              asteroids={asteroids}
              loading={loading}
              error={error}
              watchedIds={watchlist.map((w) => w.asteroid_id)}
              onWatch={handleWatch}
              onUnwatch={handleUnwatch}
              columns={3}
            />

            {totalPages > 1 && !loading && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (currentPage < 3) {
                      pageNum = i;
                    } else if (currentPage > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-space-600 text-white'
                            : 'text-space-400 hover:text-white hover:bg-space-800'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={ChevronRight}
                  iconPosition="right"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};
