import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, AlertTriangle, Bell, Shield, Zap, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Starfield } from '../components/3d/Starfield';
import { AsteroidStats } from '../components/asteroids/AsteroidStats';
import { AsteroidList } from '../components/asteroids/AsteroidList';
import { useAsteroids } from '../hooks/useAsteroids';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAlerts } from '../hooks/useAlerts';
import { useAuth } from '../hooks/useAuth';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-space-600/50 transition-colors group"
  >
    <div className="w-12 h-12 bg-gradient-to-br from-space-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-space-400">{description}</p>
  </motion.div>
);

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const { asteroids, loading, count } = useAsteroids({ limit: 6 });
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { unreadCount } = useAlerts(false);
  const [hazardousCount, setHazardousCount] = useState(0);

  useEffect(() => {
    setHazardousCount(asteroids.filter((a) => a.is_hazardous).length);
  }, [asteroids]);

  const stats = {
    total: count,
    hazardous: hazardousCount,
    watched: watchlist.length,
    alerts: unreadCount,
  };

  const features = [
    {
      icon: Globe,
      title: 'Real-Time Tracking',
      description: 'Monitor Near-Earth Objects in real-time with data from NASA NeoWs API.',
    },
    {
      icon: AlertTriangle,
      title: 'Risk Analysis',
      description: 'Advanced risk scoring system categorizes asteroids by potential hazard level.',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Get notified when watched asteroids approach within your custom threshold.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your watchlist and preferences are securely stored with encrypted authentication.',
    },
  ];

  return (
    <div className="relative">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <Starfield className="z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-space-600/20 border border-space-600/30 rounded-full mb-6">
              <Rocket className="w-4 h-4 text-space-400" />
              <span className="text-space-300 text-sm">Powered by NASA NeoWs API</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Cosmic Watch</span>
            </h1>

            <p className="text-xl md:text-2xl text-space-300 mb-8 max-w-2xl mx-auto">
              Track Near-Earth Objects in real-time. Monitor asteroids, analyze risks, and stay informed about cosmic events.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/feed">
                <Button size="lg" icon={Zap}>
                  Explore Asteroids
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/auth">
                  <Button variant="outline" size="lg" icon={ArrowRight} iconPosition="right">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-space-600 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 bg-space-400 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 -mt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AsteroidStats stats={stats} />
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Recent Close Approaches
            </h2>
            <p className="text-space-400 max-w-2xl mx-auto">
              Asteroids that have recently passed or will soon pass near Earth
            </p>
          </motion.div>

          <AsteroidList
            asteroids={asteroids}
            loading={loading}
            watchedIds={watchlist.map((w) => w.asteroid_id)}
            onWatch={addToWatchlist}
            onUnwatch={removeFromWatchlist}
          />

          <div className="text-center mt-8">
            <Link to="/feed">
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                View All Asteroids
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-dark-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Cosmic Watch?
            </h2>
            <p className="text-space-400 max-w-2xl mx-auto">
              Everything you need to monitor and understand Near-Earth Objects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
