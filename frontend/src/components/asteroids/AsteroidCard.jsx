import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ruler, Zap, Navigation, Calendar, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate, formatDistance, formatVelocity, formatDiameter, getRiskInfo } from '../../utils/formatters';

export const AsteroidCard = ({
  asteroid,
  isWatched = false,
  onWatch,
  onUnwatch,
  showActions = true,
  index = 0,
}) => {
  const riskInfo = getRiskInfo(asteroid.risk_score);
  const closestApproach = asteroid.close_approaches?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/asteroid/${asteroid.id}`}>
        <Card
          hover
          glow={asteroid.is_hazardous}
          glowColor={asteroid.is_hazardous ? 'danger' : 'space'}
          className={`group ${asteroid.is_hazardous ? 'border-danger-600/30' : ''}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🪨</span>
                <h3 className="text-lg font-semibold text-white truncate group-hover:text-space-300 transition-colors">
                  {asteroid.name}
                </h3>
              </div>
              <p className="text-sm font-mono text-space-500">
                ID: {asteroid.id}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {asteroid.is_hazardous && (
                <Badge variant="hazard" size="sm">
                  ⚠️ HAZARDOUS
                </Badge>
              )}
              {asteroid.risk_score && (
                <Badge variant={riskInfo.level.toLowerCase()} size="sm">
                  {riskInfo.level}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Ruler className="w-4 h-4 text-space-400" />
              <span className="text-space-300">
                {formatDiameter(asteroid.estimated_diameter_min, asteroid.estimated_diameter_max)}
              </span>
            </div>
            {closestApproach && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-warning-400" />
                  <span className="text-space-300">
                    {formatVelocity(closestApproach.velocity_kmh)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="w-4 h-4 text-space-400" />
                  <span className="text-space-300">
                    {formatDistance(closestApproach.miss_distance_km)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-space-400" />
                  <span className="text-space-300">
                    {formatDate(closestApproach.approach_date)}
                  </span>
                </div>
              </>
            )}
          </div>

          {showActions && (
            <div className="pt-4 border-t border-dark-border">
              <Button
                variant={isWatched ? 'outline' : 'ghost'}
                size="sm"
                icon={isWatched ? EyeOff : Eye}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isWatched ? onUnwatch?.(asteroid.id) : onWatch?.(asteroid.id);
                }}
                className="w-full"
              >
                {isWatched ? 'Remove from Watch' : 'Add to Watchlist'}
              </Button>
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
};
