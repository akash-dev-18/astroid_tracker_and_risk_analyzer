import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Loader2,
  Rocket,
  AlertTriangle,
  Compass,
  Gauge,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AsteroidCard } from "@/components/asteroids/AsteroidCard";
import { FilterPanel } from "@/components/asteroids/FilterPanel";
import { OrbitScene } from "@/components/three/OrbitScene";
import { api } from "@/lib/api";
import type { AsteroidFeedParams } from "@/types/api";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showHazardousOnly, setShowHazardousOnly] = useState(false);
  const [feedParams, setFeedParams] = useState<AsteroidFeedParams>({
    limit: 20,
    offset: 0,
    sort_by: "approach_date",
  });

  useEffect(() => {
    setFeedParams((prev) => ({
      ...prev,
      is_hazardous: showHazardousOnly || undefined,
      offset: 0,
    }));
  }, [showHazardousOnly]);

  const {
    data: feedData,
    isLoading: feedLoading,
    error: feedError,
    refetch,
  } = useQuery({
    queryKey: ["asteroid-feed", feedParams],
    queryFn: () => api.asteroids.feed(feedParams),
    retry: 1,
  });

  const {
    data: searchResults,
    isLoading: searchLoading,
  } = useQuery({
    queryKey: ["asteroid-search", searchQuery],
    queryFn: () => api.asteroids.search(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const {
    data: hazardousData,
  } = useQuery({
    queryKey: ["hazardous-asteroids"],
    queryFn: () => api.asteroids.hazardous(10),
    retry: 1,
  });

  const displayAsteroids = searchQuery.length >= 2
    ? searchResults
    : feedData?.asteroids;

  const totalCount = feedData?.count ?? 0;
  const hazardousCount = hazardousData?.length ?? 0;

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="cosmic" className="mb-4">
                <Rocket className="h-3 w-3 mr-1" />
                Live NEO Tracking
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                Monitor{" "}
                <span className="text-primary text-glow">Near-Earth</span>
                <br />
                Objects in Real-Time
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-lg">
                Track asteroids, analyze risk scores, and receive alerts for
                close approaches. Powered by NASA NeoWs data.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-panel rounded-lg p-4 text-center">
                  <Compass className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-foreground font-mono">
                    {totalCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Tracked</p>
                </div>
                <div className="glass-panel rounded-lg p-4 text-center">
                  <AlertTriangle className="h-5 w-5 text-hazard mx-auto mb-1" />
                  <p className="text-2xl font-bold text-foreground font-mono">
                    {hazardousCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Hazardous</p>
                </div>
                <div className="glass-panel rounded-lg p-4 text-center">
                  <Gauge className="h-5 w-5 text-warning mx-auto mb-1" />
                  <p className="text-2xl font-bold text-foreground font-mono">
                    24/7
                  </p>
                  <p className="text-xs text-muted-foreground">Monitoring</p>
                </div>
              </div>
            </motion.div>

            {/* 3D Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[350px] lg:h-[450px] rounded-xl overflow-hidden"
            >
              <OrbitScene />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container mx-auto px-4 mb-8">
        <div className="glass-panel rounded-xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search asteroids by name (min 2 chars)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input/50"
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant={showHazardousOnly ? "danger" : "outline"}
                size="sm"
                onClick={() => setShowHazardousOnly(!showHazardousOnly)}
                className="gap-1.5"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Hazardous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
          
          <FilterPanel
            currentFilters={feedParams}
            onFilterChange={(newFilters) => setFeedParams({ ...feedParams, ...newFilters })}
          />
        </div>
      </section>

      {/* Asteroid Feed */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {searchQuery.length >= 2 ? "Search Results" : "Asteroid Feed"}
          </h2>
          {searchQuery.length >= 2 && searchResults && (
            <Badge variant="cosmic">{searchResults.length} found</Badge>
          )}
        </div>

        {(feedLoading || searchLoading) && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {feedError && !feedLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel rounded-xl p-8 text-center"
          >
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Unable to fetch data
            </h3>
            <p className="text-muted-foreground mb-4">
              Make sure your API server is running and the{" "}
              <code className="text-primary font-mono text-sm">
                VITE_API_BASE_URL
              </code>{" "}
              environment variable is set correctly.
            </p>
            <Button variant="cosmic" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </motion.div>
        )}

        {!feedLoading && !feedError && displayAsteroids && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayAsteroids.map((asteroid, i) => (
                <AsteroidCard key={asteroid.id} asteroid={asteroid} index={i} />
              ))}
            </div>

            {displayAsteroids.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Rocket className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No asteroids found. Try adjusting your filters.</p>
              </div>
            )}

            {/* Pagination */}
            {!searchQuery && feedData && feedData.count > feedParams.limit! && (
              <div className="flex justify-center gap-3 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={feedParams.offset === 0}
                  onClick={() =>
                    setFeedParams((p) => ({
                      ...p,
                      offset: Math.max(0, (p.offset || 0) - (p.limit || 20)),
                    }))
                  }
                >
                  Previous
                </Button>
                <Badge variant="secondary" className="px-4">
                  Page{" "}
                  {Math.floor((feedParams.offset || 0) / (feedParams.limit || 20)) + 1}{" "}
                  of {Math.ceil(feedData.count / (feedParams.limit || 20))}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    (feedParams.offset || 0) + (feedParams.limit || 20) >=
                    feedData.count
                  }
                  onClick={() =>
                    setFeedParams((p) => ({
                      ...p,
                      offset: (p.offset || 0) + (p.limit || 20),
                    }))
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
