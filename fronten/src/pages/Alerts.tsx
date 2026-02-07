import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bell,
  Loader2,
  Check,
  CheckCheck,
  Trash2,
  LogIn,
  BellOff,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Alerts() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => api.alerts.get({ limit: 50 }),
    enabled: isAuthenticated,
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["unread-count"],
    queryFn: () => api.alerts.unreadCount(),
    enabled: isAuthenticated,
  });

  const markReadMutation = useMutation({
    mutationFn: (alertId: number) => api.alerts.markRead(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.alerts.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      toast({ title: "All alerts marked as read" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (alertId: number) => api.alerts.delete(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      toast({ title: "Alert deleted" });
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
            Log in to view your alert notifications.
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
            {unreadCount && unreadCount.count > 0 && (
              <Badge variant="hazardous">{unreadCount.count} unread</Badge>
            )}
          </div>

          {alerts && alerts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && alerts && alerts.length === 0 && (
          <div className="glass-panel rounded-xl p-12 text-center">
            <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No alerts
            </h3>
            <p className="text-muted-foreground">
              You'll be notified when tracked asteroids have close approaches.
            </p>
          </div>
        )}

        {alerts && alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass-panel rounded-lg p-5 flex items-start gap-4 transition-colors ${
                  !alert.is_read
                    ? "border-primary/30 bg-primary/5"
                    : ""
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alert.alert_type === "close_approach"
                      ? "bg-warning/10"
                      : "bg-destructive/10"
                  }`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alert.alert_type === "close_approach"
                        ? "text-warning"
                        : "text-destructive"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {alert.asteroid_name && (
                      <Link
                        to={`/asteroid/${alert.asteroid_id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {alert.asteroid_name}
                      </Link>
                    )}
                    {!alert.is_read && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.created_at).toLocaleString()}
                    {alert.approach_date &&
                      ` • Approach: ${new Date(alert.approach_date).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!alert.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markReadMutation.mutate(alert.id)}
                      disabled={markReadMutation.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(alert.id)}
                    disabled={deleteMutation.isPending}
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
