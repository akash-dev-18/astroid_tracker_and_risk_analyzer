import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, ArrowRight, Gauge, Ruler, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "./RiskBadge";
import type { AsteroidResponse } from "@/types/api";

interface AsteroidCardProps {
  asteroid: AsteroidResponse;
  index?: number;
}

export function AsteroidCard({ asteroid, index = 0 }: AsteroidCardProps) {
  const latestApproach = asteroid.close_approaches?.[0];

  const formatDistance = (km: number | null) => {
    if (!km) return "N/A";
    if (km > 1_000_000) return `${(km / 1_000_000).toFixed(2)}M km`;
    return `${km.toLocaleString()} km`;
  };

  const formatVelocity = (kmh: number | null) => {
    if (!kmh) return "N/A";
    return `${Math.round(kmh).toLocaleString()} km/h`;
  };

  const formatDiameter = (min: number | null, max: number | null) => {
    if (!min && !max) return "N/A";
    if (min && max) return `${min.toFixed(2)} - ${max.toFixed(2)} km`;
    return `${(min || max)?.toFixed(2)} km`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`glass-panel rounded-lg p-5 hover:border-primary/30 transition-all duration-300 group ${
        asteroid.is_hazardous ? "hover:box-glow-hazard" : "hover:box-glow"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground truncate max-w-[180px]">
            {asteroid.name}
          </h3>
        </div>
        <RiskBadge
          isHazardous={asteroid.is_hazardous}
          riskScore={asteroid.risk_score}
        />
      </div>

      <div className="space-y-2 text-sm mb-4">
        {latestApproach && (
          <>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Approach: {latestApproach.approach_date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Gauge className="h-3.5 w-3.5" />
              <span>{formatVelocity(latestApproach.velocity_kmh)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Ruler className="h-3.5 w-3.5" />
              <span>Miss: {formatDistance(latestApproach.miss_distance_km)}</span>
            </div>
          </>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Ruler className="h-3.5 w-3.5" />
          <span>
            Ø{" "}
            {formatDiameter(
              asteroid.estimated_diameter_min,
              asteroid.estimated_diameter_max
            )}
          </span>
        </div>
      </div>

      <Link to={`/asteroid/${asteroid.id}`}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2 group-hover:text-primary transition-colors"
        >
          View Details
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </motion.div>
  );
}
