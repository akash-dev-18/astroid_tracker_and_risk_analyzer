export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  ASTEROIDS: {
    FEED: '/asteroids/feed',
    SEARCH: '/asteroids/search',
    HAZARDOUS: '/asteroids/hazardous',
    SYNC: '/asteroids/sync',
    DETAIL: (id) => `/asteroids/${id}`,
  },
  WATCHLIST: {
    BASE: '/watchlist',
    DETAIL: (id) => `/watchlist/${id}`,
    COUNT: '/watchlist/count',
  },
  ALERTS: {
    BASE: '/alerts',
    UNREAD_COUNT: '/alerts/unread/count',
    READ: (id) => `/alerts/${id}/read`,
    READ_ALL: '/alerts/read-all',
    DELETE: (id) => `/alerts/${id}`,
  },
};

export const RISK_LEVELS = {
  EXTREME: { label: 'EXTREME', color: 'danger', score: 70 },
  HIGH: { label: 'HIGH', color: 'danger', score: 50 },
  MODERATE: { label: 'MODERATE', color: 'warning', score: 30 },
  LOW: { label: 'LOW', color: 'success', score: 0 },
};

export const SORT_OPTIONS = [
  { value: 'approach_date', label: 'Closest Approach' },
  { value: 'diameter', label: 'Largest Size' },
  { value: 'velocity', label: 'Highest Velocity' },
  { value: 'distance', label: 'Closest Distance' },
];

export const SIZE_FILTERS = [
  { value: '', label: 'All Sizes' },
  { value: 'large', label: 'Large (>1km)', min: 1 },
  { value: 'medium', label: 'Medium (0.1-1km)', min: 0.1, max: 1 },
  { value: 'small', label: 'Small (<0.1km)', max: 0.1 },
];

export const DISTANCE_FILTERS = [
  { value: '', label: 'All Distances' },
  { value: 'very_close', label: 'Very Close (<1 LD)', maxLd: 1 },
  { value: 'close', label: 'Close (1-5 LD)', minLd: 1, maxLd: 5 },
  { value: 'moderate', label: 'Moderate (5-10 LD)', minLd: 5, maxLd: 10 },
  { value: 'far', label: 'Far (>10 LD)', minLd: 10 },
];

export const NAV_LINKS = [
  { path: '/', label: 'Home', icon: 'Home' },
  { path: '/feed', label: 'Feed', icon: 'Globe' },
  { path: '/watchlist', label: 'Watchlist', icon: 'Eye', protected: true },
  { path: '/alerts', label: 'Alerts', icon: 'Bell', protected: true },
];
