import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  ExternalLink,
  Telescope,
  Calendar,
  Gauge,
  Ruler,
  Globe,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge, RiskScoreBadge } from "@/components/asteroids/RiskBadge";
import { AsteroidOrbitScene } from "@/components/three/AsteroidOrbitScene";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AsteroidDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);

  const { data: asteroid, isLoading, error } = useQuery({
    queryKey: ["asteroid", id],
    queryFn: () => api.asteroids.getById(id!),
    enabled: !!id,
  });

  const addToWatchlist = useMutation({
    mutationFn: () => api.watchlist.add({ asteroid_id: id! }),
    onSuccess: () => {
      setAddedToWatchlist(true);
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({ title: "Added to watchlist!", description: `Now tracking ${asteroid?.name}` });
    },
    onError: (err) => {
      toast({
        title: "Failed to add",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  const formatNumber = (n: number | null | undefined) =>
    n != null ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "N/A";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !asteroid) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive text-lg">Failed to load asteroid data.</p>
        <Link to="/">
          <Button variant="cosmic" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="glass-panel rounded-xl p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {asteroid.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="cosmic" className="font-mono">
                  ID: {asteroid.id}
                </Badge>
                <RiskBadge
                  isHazardous={asteroid.is_hazardous}
                  riskScore={asteroid.risk_score}
                />
                <RiskScoreBadge score={asteroid.risk_score} />
              </div>
            </div>

            <div className="flex gap-2">
              {isAuthenticated && (
                <Button
                  variant={addedToWatchlist ? "outline" : "cosmic"}
                  onClick={() => addToWatchlist.mutate()}
                  disabled={addToWatchlist.isPending || addedToWatchlist}
                  className="gap-2"
                >
                  {addedToWatchlist ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {addedToWatchlist ? "Watching" : "Add to Watchlist"}
                </Button>
              )}
              {asteroid.nasa_jpl_url && (
                <a href={asteroid.nasa_jpl_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    NASA JPL
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Properties grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Absolute Magnitude</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {formatNumber(asteroid.absolute_magnitude)} H
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Est. Diameter (km)</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {formatNumber(asteroid.estimated_diameter_min)} —{" "}
                {formatNumber(asteroid.estimated_diameter_max)}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-xl font-bold text-foreground">
                {asteroid.is_hazardous ? (
                  <span className="text-destructive">⚠ Hazardous</span>
                ) : (
                  <span className="text-safe">✓ Safe</span>
                )}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Close Approaches</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {asteroid.close_approaches.length}
              </p>
            </div>
          </div>
        </div>

        {/* Close Approaches Table */}
        {asteroid.close_approaches.length > 0 && (
          <div className="glass-panel rounded-xl p-6 lg:p-8">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Telescope className="h-5 w-5 text-primary" />
              Close Approaches
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 text-muted-foreground font-medium">
                      <Calendar className="h-3.5 w-3.5 inline mr-1" />
                      Date
                    </th>
                    <th className="pb-3 text-muted-foreground font-medium">
                      <Gauge className="h-3.5 w-3.5 inline mr-1" />
                      Velocity (km/h)
                    </th>
                    <th className="pb-3 text-muted-foreground font-medium">
                      <Ruler className="h-3.5 w-3.5 inline mr-1" />
                      Miss Distance (km)
                    </th>
                    <th className="pb-3 text-muted-foreground font-medium">
                      Lunar Distance
                    </th>
                    <th className="pb-3 text-muted-foreground font-medium">
                      <Globe className="h-3.5 w-3.5 inline mr-1" />
                      Orbiting
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {asteroid.close_approaches.map((approach) => (
                    <tr
                      key={approach.id}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-3 font-mono text-foreground">
                        {approach.approach_date}
                      </td>
                      <td className="py-3 font-mono text-foreground">
                        {formatNumber(approach.velocity_kmh)}
                      </td>
                      <td className="py-3 font-mono text-foreground">
                        {formatNumber(approach.miss_distance_km)}
                      </td>
                      <td className="py-3 font-mono text-foreground">
                        {approach.miss_distance_lunar
                          ? `${approach.miss_distance_lunar.toFixed(2)} LD`
                          : "N/A"}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {approach.orbiting_body}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3D Orbital Visualization */}
        <div className="glass-panel rounded-xl p-6 lg:p-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            3D Orbital Visualization
          </h2>
          <div className="h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
            <AsteroidOrbitScene asteroid={asteroid} />
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Interactive 3D view showing asteroid orbit relative to Earth. Use mouse to rotate and zoom.
          </p>
        </div>

        {/* Live Chat */}
        <div>
          <ChatPanel asteroidId={asteroid.id} asteroidName={asteroid.name} />
        </div>
      </motion.div>
    </div>
  );
}
