import { AsteroidCard } from './AsteroidCard';
import { CardSkeleton } from '../ui/Loader';
import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const AsteroidList = ({
  asteroids,
  loading,
  error,
  watchedIds = [],
  onWatch,
  onUnwatch,
  columns = 3,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-danger-600/20 rounded-full flex items-center justify-center">
          <Rocket className="w-8 h-8 text-danger-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Failed to Load</h3>
        <p className="text-space-400 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!asteroids || asteroids.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-space-600/20 rounded-full flex items-center justify-center">
          <Rocket className="w-8 h-8 text-space-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Asteroids Found</h3>
        <p className="text-space-400 mb-4">
          Try adjusting your filters or check back later.
        </p>
        <Link to="/feed">
          <Button variant="primary">Browse All Asteroids</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {asteroids.map((asteroid, index) => (
        <AsteroidCard
          key={asteroid.id}
          asteroid={asteroid}
          isWatched={watchedIds.includes(asteroid.id)}
          onWatch={onWatch}
          onUnwatch={onUnwatch}
          index={index}
        />
      ))}
    </div>
  );
};
