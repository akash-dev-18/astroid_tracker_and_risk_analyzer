import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Telescope,
  Loader2,
  Trash2,
  ExternalLink,
  Rocket,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Watchlist() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => api.watchlist.get(),
    enabled: isAuthenticated,
  });

  const removeMutation = useMutation({
    mutationFn: (asteroidId: string) => api.watchlist.remove(asteroidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({ title: "Removed from watchlist" });
    },
    onError: (err) => {
      toast({
        title: "Failed to remove",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-12 max-w-md mx-auto"
        >
          <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Sign in required
          </h2>
          <p className="text-muted-foreground mb-6">
            Log in to track and manage your asteroid watchlist.
          </p>
          <Link to="/login">
            <Button variant="cosmic">Sign In</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Telescope className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">My Watchlist</h1>
          {watchlist && (
            <Badge variant="cosmic">{watchlist.length} objects</Badge>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && watchlist && watchlist.length === 0 && (
          <div className="glass-panel rounded-xl p-12 text-center">
            <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No asteroids tracked
            </h3>
            <p className="text-muted-foreground mb-6">
              Browse the dashboard and add asteroids to your watchlist.
            </p>
            <Link to="/">
              <Button variant="cosmic">Browse Asteroids</Button>
            </Link>
          </div>
        )}

        {watchlist && watchlist.length > 0 && (
          <div className="space-y-3">
            {watchlist.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-lg p-5 flex items-center justify-between hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Telescope className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {item.asteroid_name || item.asteroid_id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Alert at {item.alert_distance_km.toLocaleString()} km •
                      Added {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/asteroid/${item.asteroid_id}`}>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMutation.mutate(item.asteroid_id)}
                    disabled={removeMutation.isPending}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
