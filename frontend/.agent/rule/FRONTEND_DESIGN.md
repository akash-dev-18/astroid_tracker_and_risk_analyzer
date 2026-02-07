# Cosmic Watch - Frontend Design Document

## 🎯 Overview
A dark-themed, space-inspired React application built with Vite, Tailwind CSS, and modern UI patterns.

---

## 🎨 Design System

### Color Palette (Space Theme)
```css
/* Tailwind Config Colors */
{
  colors: {
    space: {
      50: '#f0f4ff',   // Lightest blue
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',  // Primary brand
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',  // Deep space blue
      950: '#1e1b4b',  // Almost black
    },
    danger: {
      400: '#f87171',  // Hazardous asteroids
      600: '#dc2626',
      800: '#991b1b',
    },
    success: {
      400: '#4ade80',  // Safe asteroids
      600: '#16a34a',
    },
    warning: {
      400: '#fbbf24',  // Moderate risk
      600: '#d97706',
    },
    dark: {
      bg: '#0a0e27',      // Main background
      card: '#151a33',    // Card background
      border: '#1f2547',  // Borders
    }
  }
}
```

### Typography
```
Font Family: 'Inter' (primary), 'Space Mono' (for codes/IDs)

Headings:
- H1: text-4xl font-bold (Dashboard title)
- H2: text-3xl font-semibold (Section headers)
- H3: text-2xl font-semibold (Card titles)
- H4: text-xl font-medium (Subsections)

Body:
- Large: text-lg (Important stats)
- Base: text-base (Regular text)
- Small: text-sm (Metadata, timestamps)
- XSmall: text-xs (Labels, badges)
```

### Component Sizes
```
Buttons:
- Large: px-6 py-3 text-lg
- Medium: px-4 py-2 text-base
- Small: px-3 py-1.5 text-sm

Cards:
- Padding: p-6
- Border Radius: rounded-xl
- Shadow: shadow-lg

Inputs:
- Height: h-12
- Padding: px-4
- Border Radius: rounded-lg
```

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── space-bg.jpg              # Hero background
│
├── src/
│   ├── assets/
│   │   ├── logo.svg
│   │   └── icons/
│   │       ├── asteroid.svg
│   │       ├── alert.svg
│   │       └── watchlist.svg
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   │
│   │   ├── asteroids/
│   │   │   ├── AsteroidCard.jsx
│   │   │   ├── AsteroidList.jsx
│   │   │   ├── AsteroidFilters.jsx
│   │   │   ├── AsteroidStats.jsx
│   │   │   └── ApproachTimeline.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── Tooltip.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   └── 3d/
│   │       └── OrbitVisualization.jsx  # Bonus
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Feed.jsx
│   │   ├── AsteroidDetail.jsx
│   │   ├── Watchlist.jsx
│   │   ├── Alerts.jsx
│   │   └── Auth.jsx
│   │
│   ├── services/
│   │   ├── api.js                # Axios instance
│   │   ├── auth.service.js       # Login, register, logout
│   │   ├── asteroid.service.js   # Asteroid CRUD
│   │   └── watchlist.service.js  # Watchlist CRUD
│   │
│   ├── hooks/
│   │   ├── useAuth.js            # Auth context hook
│   │   ├── useAsteroids.js       # Fetch asteroids with filters
│   │   ├── useWatchlist.js       # Watchlist operations
│   │   └── useAlerts.js          # User alerts
│   │
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state
│   │
│   ├── utils/
│   │   ├── formatters.js         # Date, number formatting
│   │   ├── validators.js         # Form validation
│   │   └── constants.js          # App constants
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .env.local
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

---

## 🧩 Component Specifications

### 1. Layout Components

#### **Navbar.jsx**
```jsx
Position: Sticky top
Features:
- Logo (left)
- Navigation links: Home, Feed, Watchlist, Alerts
- Search bar (center) - for asteroid name search
- Auth buttons/User menu (right)
- Alert count badge (on Alerts link)
- Mobile hamburger menu

States:
- isScrolled → adds backdrop blur
- isMobileMenuOpen
```

#### **Footer.jsx**
```jsx
Content:
- Credits (NASA API, team name)
- Social links (GitHub, Twitter)
- Last data update timestamp
- API status indicator (green dot if healthy)

Style: Minimal, space-themed gradient
```

---

### 2. Asteroid Components

#### **AsteroidCard.jsx**
```jsx
Props: { asteroid, onWatch, isWatched }

Layout:
┌─────────────────────────────────┐
│ 🪨 Asteroid Name      [HAZARD]  │
│ ID: 2024AB123                   │
│                                 │
│ 📏 Diameter: 0.5 - 1.2 km      │
│ 🚀 Velocity: 25,000 km/h       │
│ 📍 Miss Dist: 3.2 LD           │
│ 📅 Approach: Feb 10, 2026      │
│                                 │
│ Risk: [MODERATE]    [👁 Watch]  │
└─────────────────────────────────┘

Risk Badge Colors:
- EXTREME: bg-danger-600
- HIGH: bg-danger-500
- MODERATE: bg-warning-500
- LOW: bg-success-500

Hover Effect: scale-105, shadow-2xl
Click: Navigate to detail page
```

#### **AsteroidFilters.jsx**
```jsx
Filters:
1. Date Range Picker
   - Start Date
   - End Date
   - Quick presets: Today, This Week, This Month

2. Hazard Status
   - All
   - Hazardous Only
   - Non-Hazardous

3. Size Filter
   - All Sizes
   - Large (>1km)
   - Medium (0.1-1km)
   - Small (<0.1km)

4. Distance Filter
   - All
   - Very Close (<1 LD)
   - Close (1-5 LD)
   - Moderate (5-10 LD)
   - Far (>10 LD)

5. Sort By
   - Closest Approach
   - Largest Size
   - Highest Velocity
   - Risk Score

Layout: Collapsible panel (mobile) / Sidebar (desktop)
```

#### **AsteroidStats.jsx**
```jsx
Used on: Home page, Dashboard header

Displays:
┌───────────┬───────────┬───────────┬───────────┐
│  Total    │ Hazardous │  Watched  │  Alerts   │
│   247     │    18     │     5     │     2     │
└───────────┴───────────┴───────────┴───────────┘

Style: Grid of stat cards with icons
Animation: Count-up effect on mount
```

#### **ApproachTimeline.jsx**
```jsx
Used on: Asteroid Detail page

Visual: Horizontal timeline
┌────○────────○────────○─────────→
│   Past   Today    Future
│
└─ Shows 5 closest approaches with dates

Interactive: Hover to see details
Color-coded: Past (gray), Upcoming (blue), Today (red)
```

---

### 3. UI Components (Reusable)

#### **Button.jsx**
```jsx
Variants:
- primary: bg-space-600 hover:bg-space-700
- danger: bg-danger-600 hover:bg-danger-700
- success: bg-success-600 hover:bg-success-700
- outline: border-2 border-space-500 text-space-500
- ghost: hover:bg-space-900

Sizes: sm, md, lg
Props: { variant, size, loading, disabled, icon, children }

Loading State: Shows spinner + disables
```

#### **Badge.jsx**
```jsx
Variants:
- hazard: bg-danger-600 text-white
- safe: bg-success-600 text-white
- warning: bg-warning-600 text-black
- info: bg-space-600 text-white

Props: { variant, children, size }
Size: sm (text-xs), md (text-sm)

Examples:
<Badge variant="hazard">HAZARDOUS</Badge>
<Badge variant="safe">SAFE</Badge>
```

#### **Card.jsx**
```jsx
Base styles:
- bg-dark-card
- border border-dark-border
- rounded-xl
- p-6
- shadow-lg

Hover variant: hover:shadow-2xl transition

Props: { children, hover, onClick, className }
```

#### **Modal.jsx**
```jsx
Features:
- Backdrop with blur
- Center-positioned
- Close button (X icon)
- ESC key to close
- Click outside to close

Props: { isOpen, onClose, title, children }

Animation: Fade in + scale up
```

#### **Loader.jsx**
```jsx
Types:
1. Spinner - Default circular spinner
2. Skeleton - Content placeholder (for cards)
3. Dots - Three bouncing dots
4. Orbit - Circular orbit animation (space theme!)

Usage:
<Loader type="orbit" size="lg" text="Loading asteroids..." />
```

---

### 4. Auth Components

#### **LoginForm.jsx**
```jsx
Fields:
- Email (type: email, required)
- Password (type: password, required, min: 8 chars)
- Remember Me (checkbox)

Validation: Client-side + server-side
Error Display: Below each field (text-danger-500)

Submit:
- Calls auth.service.login()
- Stores JWT in localStorage
- Redirects to dashboard
```

#### **RegisterForm.jsx**
```jsx
Fields:
- Email (with format validation)
- Password (with strength indicator)
- Confirm Password (must match)

Password Strength:
- Weak: < 8 chars (red)
- Medium: 8-12 chars, mixed case (yellow)
- Strong: 12+ chars, mixed + special (green)

Submit:
- Calls auth.service.register()
- Auto-login after success
```

#### **ProtectedRoute.jsx**
```jsx
Logic:
1. Check if user is authenticated (JWT exists + valid)
2. If yes → Render children
3. If no → Redirect to /auth?redirect=/original-path

Usage:
<ProtectedRoute>
  <Watchlist />
</ProtectedRoute>
```

---

## 📄 Page Specifications

### 1. **Home.jsx** (`/`)

**Layout:**
```
┌─────────────────────────────────────┐
│         HERO SECTION                │
│  🌌 Cosmic Watch                   │
│  Tracking Near-Earth Objects        │
│  [Get Started] [View Feed]          │
│                                     │
│  Background: Animated starfield     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      LIVE STATS                     │
│  [247 Total] [18 Hazardous] etc.    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   TODAY'S CLOSE APPROACHES          │
│   [Card] [Card] [Card]              │
│   (Show top 6, sorted by distance)  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   FEATURES SECTION                  │
│   🔍 Real-time Tracking             │
│   ⚠️  Risk Analysis                 │
│   🔔 Custom Alerts                  │
└─────────────────────────────────────┘
```

**Animations:**
- Parallax scroll on hero
- Count-up on stats
- Cards fade in on scroll

---

### 2. **Feed.jsx** (`/feed`)

**Layout:**
```
┌────────────────────────────────────────┐
│ [Filters Sidebar]  │  [Asteroid Grid]  │
│                    │                   │
│ Date Range         │  [Card] [Card]    │
│ Hazard Status      │  [Card] [Card]    │
│ Size               │  [Card] [Card]    │
│ Distance           │                   │
│ Sort By            │  [Pagination]     │
│                    │  1 2 3 ... 10     │
└────────────────────────────────────────┘
```

**Features:**
- Infinite scroll OR pagination (choose one)
- Filter updates are instant (debounced API calls)
- Loading skeleton while fetching
- Empty state: "No asteroids found for these filters"

**Responsive:**
- Desktop: Sidebar + Grid (3 columns)
- Tablet: Collapsible filters + Grid (2 columns)
- Mobile: Bottom sheet filters + List (1 column)

---

### 3. **AsteroidDetail.jsx** (`/asteroid/:id`)

**Layout:**
```
┌───────────────────────────────────────┐
│  ← Back to Feed                       │
│                                       │
│  🪨 Asteroid 2024 AB123               │
│  [HAZARDOUS]  [👁 Watch]              │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ PHYSICAL PROPERTIES             │ │
│  │ Diameter: 0.8 - 1.5 km          │ │
│  │ Absolute Magnitude: 19.3        │ │
│  │ NASA JPL Link: [→]              │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ CLOSE APPROACH DATA             │ │
│  │ [Timeline Component]            │ │
│  │                                 │ │
│  │ Approach Date | Velocity | Dist │ │
│  │ Feb 10, 2026  | 25k km/h | 3 LD │ │
│  │ Mar 5, 2027   | 23k km/h | 5 LD │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 3D ORBIT VISUALIZATION (Bonus)  │ │
│  │ [Interactive 3D Canvas]         │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ LIVE CHAT (Bonus)               │ │
│  │ [Chat messages]                 │ │
│  │ [Input to send message]         │ │
│  └─────────────────────────────────┘ │
└───────────────────────────────────────┘
```

**Interactions:**
- "Watch" button toggles watchlist
- If watched, show "Set Alert Distance" input
- Share button copies URL to clipboard

---

### 4. **Watchlist.jsx** (`/watchlist`) - Protected

**Layout:**
```
┌───────────────────────────────────────┐
│  My Watchlist (5 asteroids)           │
│  [Remove All] [Export as PDF]         │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🪨 Asteroid Name                │ │
│  │ Alert at: < 2 LD  [Edit] [🗑]  │ │
│  │ Next Approach: Feb 10 (3 days)  │ │
│  │ Status: [MODERATE RISK]         │ │
│  └─────────────────────────────────┘ │
│                                       │
│  [+ Add More Asteroids]               │
│                                       │
│  Empty State:                         │
│  "No asteroids in watchlist yet.      │
│   Browse the feed to add some!"       │
└───────────────────────────────────────┘
```

**Features:**
- Edit alert threshold (inline or modal)
- Remove from watchlist (with confirmation)
- Countdown to next approach
- Click card → Navigate to detail

---

### 5. **Alerts.jsx** (`/alerts`) - Protected

**Layout:**
```
┌───────────────────────────────────────┐
│  Notifications (3 unread)             │
│  [Mark All Read] [Clear All]          │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🔴 CLOSE APPROACH ALERT         │ │
│  │ Asteroid 2024 XY approaching    │ │
│  │ Distance: 1.2 LD                │ │
│  │ Date: Tomorrow at 3:00 PM       │ │
│  │ 2 hours ago    [View] [Dismiss] │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ ⚠️  NEW HAZARDOUS OBJECT        │ │
│  │ Added to your watchlist         │ │
│  │ 1 day ago      [View] [Dismiss] │ │
│  └─────────────────────────────────┘ │
│                                       │
│  [Load More]                          │
└───────────────────────────────────────┘
```

**Features:**
- Unread alerts highlighted
- Click "View" → Navigate to asteroid detail
- Auto-refresh every 30 seconds
- Badge count on navbar

---

### 6. **Auth.jsx** (`/auth`)

**Layout (Tabbed Interface):**
```
┌───────────────────────────────────────┐
│         🌌 Cosmic Watch               │
│                                       │
│  [Login] [Register]  ← Tabs          │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ Email                           │ │
│  │ [________________]              │ │
│  │                                 │ │
│  │ Password                        │ │
│  │ [________________]              │ │
│  │                                 │ │
│  │ [ ] Remember me                 │ │
│  │                                 │ │
│  │ [Login Button]                  │ │
│  │                                 │ │
│  │ Forgot password?                │ │
│  └─────────────────────────────────┘ │
│                                       │
│  Or continue as guest →               │
└───────────────────────────────────────┘
```

**Guest Mode:**
- Can view feed (read-only)
- Cannot watch asteroids or set alerts
- Banner: "Sign up to unlock watchlist!"

---

## 🔧 Services (API Layer)

### **api.js** (Axios Instance)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - Add JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### **auth.service.js**
```javascript
import api from './api';

export const authService = {
  async register(email, password) {
    const { data } = await api.post('/auth/register', { email, password });
    localStorage.setItem('token', data.access_token);
    return data;
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.access_token);
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  },

  async getProfile() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};
```

### **asteroid.service.js**
```javascript
import api from './api';

export const asteroidService = {
  async getFeed(params = {}) {
    const { data } = await api.get('/asteroids/feed', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/asteroids/${id}`);
    return data;
  },

  async search(query) {
    const { data } = await api.get('/asteroids/search', { params: { q: query } });
    return data;
  },
};
```

### **watchlist.service.js**
```javascript
import api from './api';

export const watchlistService = {
  async getAll() {
    const { data } = await api.get('/watchlist');
    return data;
  },

  async add(asteroidId, alertDistanceKm) {
    const { data } = await api.post('/watchlist', {
      asteroid_id: asteroidId,
      alert_distance_km: alertDistanceKm,
    });
    return data;
  },

  async remove(asteroidId) {
    await api.delete(`/watchlist/${asteroidId}`);
  },
};
```

---

## 🎣 Custom Hooks

### **useAuth.js**
```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### **useAsteroids.js**
```javascript
import { useState, useEffect } from 'react';
import { asteroidService } from '../services/asteroid.service';

export const useAsteroids = (filters = {}) => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        setLoading(true);
        const data = await asteroidService.getFeed(filters);
        setAsteroids(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAsteroids();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change

  return { asteroids, loading, error };
};
```

---

## 🎨 Animations & Transitions

### Page Transitions
```javascript
// Using framer-motion
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Wrap pages
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### Card Hover Effects
```css
/* In Tailwind */
className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
```

### Loading States
```jsx
// Skeleton for cards
<div className="animate-pulse">
  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
</div>
```

---

## 📱 Responsive Breakpoints

```javascript
// tailwind.config.js
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

### Component Responsive Behavior

| Component | Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px) |
|-----------|----------------|---------------------|-------------------|
| Navbar | Hamburger menu | Full menu | Full menu |
| Feed Grid | 1 column | 2 columns | 3 columns |
| Filters | Bottom sheet | Collapsible sidebar | Fixed sidebar |
| Asteroid Card | Full width | 48% width | 32% width |
| Hero Text | text-3xl | text-4xl | text-5xl |

---

## 🌟 Space Theme Effects (CSS)

### Starfield Background
```css
/* Animated starfield */
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.star {
  animation: twinkle 2s infinite;
}
```

### Glowing Effect (Hazardous asteroids)
```css
.hazard-glow {
  box-shadow: 0 0 20px rgba(248, 113, 113, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(248, 113, 113, 0.5); }
  50% { box-shadow: 0 0 40px rgba(248, 113, 113, 0.8); }
}
```

### Orbit Animation (Loader)
```css
.orbit-loader {
  position: relative;
  width: 50px;
  height: 50px;
}

.orbit-loader::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: #6366f1;
  border-radius: 50%;
  animation: orbit 1s linear infinite;
}

@keyframes orbit {
  0% { transform: rotate(0deg) translateX(20px); }
  100% { transform: rotate(360deg) translateX(20px); }
}
```

---

## 🧪 Testing Checklist

### Unit Tests (Vitest)
- [ ] Form validation (login, register)
- [ ] Date formatting utils
- [ ] Risk score calculation
- [ ] Auth token validation

### Integration Tests
- [ ] Login flow (success + error)
- [ ] Add/remove from watchlist
- [ ] Filter asteroids
- [ ] Pagination

### E2E Tests (Playwright)
- [ ] Complete user journey: Register → Browse → Watch → Alert
- [ ] Responsive design on mobile/desktop
- [ ] Protected routes redirect

---

## 🚀 Performance Optimization

### Code Splitting
```javascript
// Lazy load heavy components
const OrbitVisualization = lazy(() => import('./components/3d/OrbitVisualization'));

// Wrap in Suspense
<Suspense fallback={<Loader type="orbit" />}>
  <OrbitVisualization />
</Suspense>
```

### Image Optimization
- Use WebP format for images
- Lazy load images below fold
- Responsive images with srcSet

### Bundle Size
- Remove unused Tailwind classes (PurgeCSS)
- Tree-shake lodash (import only needed functions)
- Analyze bundle with `vite-bundle-visualizer`

---

## 📦 Package.json (Key Dependencies)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.300.0",
    "recharts": "^2.10.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "three": "^0.160.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.0"
  }
}
```

---

## ✅ Development Checklist

### Phase 1: Setup (2 hours)
- [ ] Create Vite React app
- [ ] Setup Tailwind CSS
- [ ] Configure React Router
- [ ] Create folder structure
- [ ] Setup environment variables

### Phase 2: Core Components (6 hours)
- [ ] Build UI components (Button, Card, Badge, etc.)
- [ ] Create Layout (Navbar, Footer)
- [ ] Auth forms (Login, Register)
- [ ] Asteroid card component
- [ ] Filters component

### Phase 3: Pages (8 hours)
- [ ] Home page with hero
- [ ] Feed page with filters
- [ ] Asteroid detail page
- [ ] Watchlist page
- [ ] Alerts page

### Phase 4: Integration (4 hours)
- [ ] Connect all API services
- [ ] Implement auth context
- [ ] Protected routes
- [ ] Error handling
- [ ] Loading states

### Phase 5: Polish (4 hours)
- [ ] Responsive design testing
- [ ] Animations and transitions
- [ ] Dark theme consistency
- [ ] Accessibility (ARIA labels)
- [ ] Performance optimization

### Phase 6: Bonus (If time)
- [ ] 3D orbit visualization
- [ ] WebSocket chat
- [ ] Advanced filters
- [ ] Export watchlist as PDF

---

This is your **complete frontend blueprint**! 🚀 Ready to code?
