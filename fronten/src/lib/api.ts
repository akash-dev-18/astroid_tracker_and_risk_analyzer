import type {
  Token,
  UserCreate,
  UserLogin,
  UserResponse,
  AsteroidFeedResponse,
  AsteroidFeedParams,
  AsteroidResponse,
  WatchlistCreate,
  WatchlistUpdate,
  WatchlistResponse,
  AlertResponse,
  AlertParams,
} from "@/types/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function getToken(): string | null {
  return localStorage.getItem("cosmic_watch_token");
}

export function setToken(token: string) {
  localStorage.setItem("cosmic_watch_token", token);
}

export function clearToken() {
  localStorage.removeItem("cosmic_watch_token");
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Network error" }));
    const message =
      typeof error.detail === "string"
        ? error.detail
        : Array.isArray(error.detail)
        ? error.detail.map((e: { msg: string }) => e.msg).join(", ")
        : `HTTP ${res.status}`;
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

function buildQuery(params: object): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  auth: {
    register: (data: UserCreate) =>
      request<Token>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data: UserLogin) =>
      request<Token>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => request<UserResponse>("/api/v1/auth/me"),
  },

  asteroids: {
    feed: (params?: AsteroidFeedParams) =>
      request<AsteroidFeedResponse>(
        `/api/v1/asteroids/feed${buildQuery(params || {})}`
      ),
    search: (q: string) =>
      request<AsteroidResponse[]>(
        `/api/v1/asteroids/search${buildQuery({ q })}`
      ),
    hazardous: (limit = 50) =>
      request<AsteroidResponse[]>(
        `/api/v1/asteroids/hazardous${buildQuery({ limit })}`
      ),
    getById: (id: string) =>
      request<AsteroidResponse>(`/api/v1/asteroids/${id}`),
    sync: (start_date?: string, end_date?: string) =>
      request<unknown>(
        `/api/v1/asteroids/sync${buildQuery({ start_date, end_date })}`,
        { method: "POST" }
      ),
  },

  watchlist: {
    get: () => request<WatchlistResponse[]>("/api/v1/watchlist"),
    add: (data: WatchlistCreate) =>
      request<WatchlistResponse>("/api/v1/watchlist", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (asteroidId: string, data: WatchlistUpdate) =>
      request<WatchlistResponse>(`/api/v1/watchlist/${asteroidId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    remove: (asteroidId: string) =>
      request<void>(`/api/v1/watchlist/${asteroidId}`, { method: "DELETE" }),
    count: () =>
      request<{ count: number }>("/api/v1/watchlist/count"),
  },

  alerts: {
    get: (params?: AlertParams) =>
      request<AlertResponse[]>(
        `/api/v1/alerts${buildQuery(params || {})}`
      ),
    unreadCount: () =>
      request<{ count: number }>("/api/v1/alerts/unread/count"),
    markRead: (alertId: number) =>
      request<AlertResponse>(`/api/v1/alerts/${alertId}/read`, {
        method: "PUT",
      }),
    markAllRead: () =>
      request<unknown>("/api/v1/alerts/read-all", { method: "PUT" }),
    delete: (alertId: number) =>
      request<void>(`/api/v1/alerts/${alertId}`, { method: "DELETE" }),
  },
};
