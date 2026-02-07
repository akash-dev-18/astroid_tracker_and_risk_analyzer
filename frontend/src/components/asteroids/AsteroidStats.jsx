import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, AlertTriangle, Eye, Bell } from 'lucide-react';
import { Card } from '../ui/Card';

const StatCard = ({ icon: Icon, label, value, color, delay }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colors = {
    primary: 'from-space-500 to-purple-600',
    danger: 'from-danger-500 to-orange-500',
    success: 'from-success-500 to-emerald-500',
    warning: 'from-warning-500 to-amber-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="relative overflow-hidden group">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{displayValue.toLocaleString()}</p>
            <p className="text-sm text-space-400">{label}</p>
          </div>
        </div>
        <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-br ${colors[color]} opacity-10 blur-2xl`} />
      </Card>
    </motion.div>
  );
};

export const AsteroidStats = ({ stats }) => {
  const statItems = [
    { icon: Rocket, label: 'Total Asteroids', value: stats?.total || 0, color: 'primary' },
    { icon: AlertTriangle, label: 'Hazardous', value: stats?.hazardous || 0, color: 'danger' },
    { icon: Eye, label: 'Watched', value: stats?.watched || 0, color: 'success' },
    { icon: Bell, label: 'Alerts', value: stats?.alerts || 0, color: 'warning' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
};
