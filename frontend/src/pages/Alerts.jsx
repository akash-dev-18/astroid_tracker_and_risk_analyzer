import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/Loader';
import { Toast } from '../components/ui/Alert';
import { useAlerts } from '../hooks/useAlerts';
import { formatRelativeTime, formatDate } from '../utils/formatters';

const alertTypeStyles = {
  close_approach: { icon: AlertTriangle, color: 'danger', label: 'Close Approach' },
  new_hazardous: { icon: AlertTriangle, color: 'warning', label: 'Hazardous' },
  watchlist: { icon: Info, color: 'info', label: 'Watchlist' },
  default: { icon: Bell, color: 'info', label: 'Alert' },
};

export const Alerts = () => {
  const { alerts, loading, markAsRead, markAllRead, deleteAlert } = useAlerts();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const unreadAlerts = alerts.filter((a) => !a.is_read);

  const handleMarkRead = async (alertId) => {
    await markAsRead(alertId);
  };

  const handleMarkAllRead = async () => {
    const result = await markAllRead();
    if (result.success) {
      setToast({ visible: true, message: 'All alerts marked as read', type: 'success' });
    }
  };

  const handleDelete = async (alertId) => {
    const result = await deleteAlert(alertId);
    if (result.success) {
      setToast({ visible: true, message: 'Alert deleted', type: 'info' });
    }
  };

  const getAlertStyle = (alertType) => {
    const type = alertType?.toLowerCase().replace(/\s+/g, '_') || 'default';
    return alertTypeStyles[type] || alertTypeStyles.default;
  };

  if (loading) return <PageLoader text="Loading alerts..." />;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-space-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                <p className="text-space-400">
                  {unreadAlerts.length} unread alert{unreadAlerts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {unreadAlerts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={CheckCheck}
                onClick={handleMarkAllRead}
              >
                Mark All Read
              </Button>
            )}
          </div>
        </motion.div>

        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-space-600/20 rounded-full flex items-center justify-center">
              <Bell className="w-10 h-10 text-space-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No Alerts Yet</h2>
            <p className="text-space-400 mb-6 max-w-md mx-auto">
              Add asteroids to your watchlist to receive alerts when they approach Earth.
            </p>
            <Link to="/feed">
              <Button>Browse Asteroids</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => {
              const style = getAlertStyle(alert.alert_type);
              const Icon = style.icon;

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className={`relative ${!alert.is_read ? 'border-space-500/50 bg-space-900/30' : ''}`}>
                    {!alert.is_read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-space-400 rounded-full" />
                    )}

                    <div className="flex gap-4 pl-4">
                      <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${
                        style.color === 'danger' ? 'bg-danger-600/20' :
                        style.color === 'warning' ? 'bg-warning-500/20' :
                        'bg-space-600/20'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          style.color === 'danger' ? 'text-danger-400' :
                          style.color === 'warning' ? 'text-warning-400' :
                          'text-space-400'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Badge variant={style.color} size="sm">{style.label}</Badge>
                          <span className="text-xs text-space-500 shrink-0">
                            {formatRelativeTime(alert.created_at)}
                          </span>
                        </div>
                        
                        <p className="text-white mb-1">{alert.message}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-space-400">
                          {alert.asteroid_name && (
                            <span>🪨 {alert.asteroid_name}</span>
                          )}
                          {alert.approach_date && (
                            <span>📅 {formatDate(alert.approach_date)}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <Link to={`/asteroid/${alert.asteroid_id}`}>
                            <Button variant="ghost" size="sm" icon={ExternalLink}>
                              View
                            </Button>
                          </Link>
                          {!alert.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Check}
                              onClick={() => handleMarkRead(alert.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDelete(alert.id)}
                            className="text-danger-400 hover:bg-danger-600/10"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
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
