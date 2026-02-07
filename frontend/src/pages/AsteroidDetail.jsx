import { useState, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Ruler,
  Zap,
  Navigation,
  Eye,
  EyeOff,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageLoader, Loader } from '../components/ui/Loader';
import { Alert, Toast } from '../components/ui/Alert';
import { ApproachTimeline } from '../components/asteroids/ApproachTimeline';
import { useAsteroidDetail } from '../hooks/useAsteroids';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../hooks/useAuth';
import { formatDiameter, formatDistance, formatVelocity, getRiskInfo } from '../utils/formatters';

const OrbitVisualization = lazy(() =>
  import('../components/3d/OrbitVisualization').then((m) => ({ default: m.OrbitVisualization }))
);

export const AsteroidDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { asteroid, loading, error } = useAsteroidDetail(id);
  const { isWatched, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const watched = isWatched(id);
  const riskInfo = asteroid ? getRiskInfo(asteroid.risk_score) : null;
  const closestApproach = asteroid?.close_approaches?.[0];

  const handleWatchToggle = async () => {
    if (!isAuthenticated) {
      setToast({ visible: true, message: 'Please sign in to use watchlist', type: 'warning' });
      return;
    }

    if (watched) {
      await removeFromWatchlist(id);
      setToast({ visible: true, message: 'Removed from watchlist', type: 'info' });
    } else {
      await addToWatchlist(id);
      setToast({ visible: true, message: 'Added to watchlist!', type: 'success' });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToast({ visible: true, message: 'Link copied to clipboard!', type: 'success' });
  };

  if (loading) return <PageLoader text="Loading asteroid data..." />;

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="error" title="Failed to Load Asteroid">
            {error}
          </Alert>
          <Link to="/feed" className="mt-4 inline-block">
            <Button variant="outline" icon={ArrowLeft}>
              Back to Feed
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!asteroid) return null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/feed" className="inline-flex items-center gap-2 text-space-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🪨</span>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{asteroid.name}</h1>
              </div>
              <p className="text-space-400 font-mono">ID: {asteroid.id}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {asteroid.is_hazardous && (
                <Badge variant="hazard" size="md">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  HAZARDOUS
                </Badge>
              )}
              {riskInfo && (
                <Badge variant={riskInfo.level.toLowerCase()} size="md">
                  {riskInfo.level} RISK
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant={watched ? 'outline' : 'primary'}
              icon={watched ? EyeOff : Eye}
              onClick={handleWatchToggle}
            >
              {watched ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
            <Button variant="ghost" icon={Share2} onClick={handleShare}>
              Share
            </Button>
            {asteroid.nasa_jpl_url && (
              <a href={asteroid.nasa_jpl_url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" icon={ExternalLink}>
                  NASA JPL
                </Button>
              </a>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Physical Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-space-600/20 rounded-lg flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-space-400" />
                </div>
                <div>
                  <p className="text-sm text-space-400">Estimated Diameter</p>
                  <p className="text-white font-medium">
                    {formatDiameter(asteroid.estimated_diameter_min, asteroid.estimated_diameter_max)}
                  </p>
                </div>
              </div>

              {asteroid.absolute_magnitude && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-warning-400" />
                  </div>
                  <div>
                    <p className="text-sm text-space-400">Absolute Magnitude</p>
                    <p className="text-white font-medium">{asteroid.absolute_magnitude.toFixed(2)} H</p>
                  </div>
                </div>
              )}

              {closestApproach && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success-500/20 rounded-lg flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-success-400" />
                    </div>
                    <div>
                      <p className="text-sm text-space-400">Closest Miss Distance</p>
                      <p className="text-white font-medium">{formatDistance(closestApproach.miss_distance_km)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-danger-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-danger-400" />
                    </div>
                    <div>
                      <p className="text-sm text-space-400">Relative Velocity</p>
                      <p className="text-white font-medium">{formatVelocity(closestApproach.velocity_kmh)}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orbit Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Loader type="orbit" text="Loading 3D scene..." />}>
                <OrbitVisualization asteroid={asteroid} />
              </Suspense>
              <p className="text-xs text-space-500 mt-2 text-center">
                Drag to rotate • Scroll to zoom
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Close Approach History</CardTitle>
          </CardHeader>
          <CardContent>
            <ApproachTimeline approaches={asteroid.close_approaches} />
          </CardContent>
        </Card>
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
