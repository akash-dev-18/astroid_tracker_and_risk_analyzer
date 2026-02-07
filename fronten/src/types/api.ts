export interface UserCreate {
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  email: string;
  id: number;
  is_active: boolean;
  created_at: string;
}

export interface CloseApproachResponse {
  approach_date: string;
  approach_date_full: string | null;
  velocity_kmh: number | null;
  miss_distance_km: number | null;
  miss_distance_lunar: number | null;
  orbiting_body: string;
  id: number;
  asteroid_id: string;
}

export interface AsteroidResponse {
  id: string;
  name: string;
  absolute_magnitude: number | null;
  is_hazardous: boolean;
  estimated_diameter_min: number | null;
  estimated_diameter_max: number | null;
  nasa_jpl_url: string | null;
  last_updated: string | null;
  close_approaches: CloseApproachResponse[];
  risk_score: string | null;
}

export interface AsteroidFeedResponse {
  count: number;
  asteroids: AsteroidResponse[];
}

export interface AsteroidFeedParams {
  start_date?: string;
  end_date?: string;
  is_hazardous?: boolean;
  min_diameter?: number;
  max_diameter?: number;
  sort_by?: string;
  limit?: number;
  offset?: number;
}

export interface WatchlistCreate {
  asteroid_id: string;
  alert_distance_km?: number;
}

export interface WatchlistUpdate {
  alert_distance_km?: number | null;
}

export interface WatchlistResponse {
  id: number;
  user_id: number;
  asteroid_id: string;
  alert_distance_km: number;
  created_at: string;
  asteroid_name: string | null;
}

export interface AlertResponse {
  id: number;
  user_id: number;
  asteroid_id: string;
  message: string;
  alert_type: string;
  is_read: boolean;
  approach_date: string | null;
  created_at: string;
  asteroid_name: string | null;
}

export interface AlertParams {
  unread_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
