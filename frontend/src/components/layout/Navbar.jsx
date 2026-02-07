import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  Home,
  Globe,
  Eye,
  Bell,
  LogIn,
  LogOut,
  User,
  Rocket,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAlerts } from '../../hooks/useAlerts';
import { useAsteroidSearch } from '../../hooks/useAsteroids';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useAlerts(false);
  const { results, search } = useAsteroidSearch();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        search(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/feed', label: 'Feed', icon: Globe },
    ...(isAuthenticated
      ? [
          { path: '/watchlist', label: 'Watchlist', icon: Eye },
          { path: '/alerts', label: 'Alerts', icon: Bell, badge: unreadCount },
        ]
      : []),
  ];

  const handleSearchSelect = (asteroid) => {
    navigate(`/asteroid/${asteroid.id}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'glass-strong shadow-lg' : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-space-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Cosmic<span className="text-space-400">Watch</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${isActive ? 'text-white bg-space-600/30' : 'text-space-300 hover:text-white hover:bg-space-800/50'}
                `}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                    {link.badge > 9 ? '9+' : link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div ref={searchRef} className="relative hidden sm:block">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-space-400 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 280 }}
                    exit={{ opacity: 0, width: 0 }}
                    className="absolute right-0 top-0"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search asteroids..."
                      className="w-full h-10 pl-10 pr-4 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:border-space-500 focus:outline-none"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-space-400" />

                    {results.length > 0 && (
                      <div className="absolute top-12 left-0 right-0 bg-dark-card border border-dark-border rounded-lg shadow-xl max-h-64 overflow-y-auto">
                        {results.slice(0, 5).map((asteroid) => (
                          <button
                            key={asteroid.id}
                            onClick={() => handleSearchSelect(asteroid)}
                            className="w-full px-4 py-3 text-left hover:bg-dark-hover transition-colors border-b border-dark-border last:border-0"
                          >
                            <p className="text-white font-medium text-sm">{asteroid.name}</p>
                            <p className="text-space-400 text-xs">ID: {asteroid.id}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-space-800/50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-space-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden lg:block text-sm text-space-300">
                    {user?.email?.split('@')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-dark-border">
                        <p className="text-white text-sm font-medium truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-danger-400 hover:bg-danger-600/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={LogIn}
                onClick={() => navigate('/auth')}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-space-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-dark-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    ${isActive ? 'bg-space-600/30 text-white' : 'text-space-300'}
                  `}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                  {link.badge > 0 && (
                    <span className="ml-auto px-2 py-0.5 bg-danger-500 text-white text-xs rounded-full">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <Button
                  variant="primary"
                  className="w-full mt-4"
                  icon={LogIn}
                  onClick={() => {
                    navigate('/auth');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
