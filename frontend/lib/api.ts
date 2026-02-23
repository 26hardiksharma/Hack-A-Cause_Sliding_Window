/**
 * AquaGov API Client
 * All calls to the FastAPI backend (http://localhost:8000/api)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let message = `API error ${res.status}: ${path}`;
    try {
      const body = await res.json();
      if (body?.detail) message = body.detail;
    } catch {/* ignore parse error */}
    throw new Error(message);
  }
  return res.json();
}

// ── Types ─────────────────────────────────────────────────────────────────────
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'official' | 'user';
  region: string | null;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  user_id?: number;
}

export interface District {
  id: number;
  name: string;
  lat: number;
  lng: number;
  vwsi: number;
  risk_level: RiskLevel;
  villages_under_stress: number;
  last_updated: string;
  active_tankers?: number;
}

export interface DistrictHistory {
  district_id: number;
  history: { date: string; vwsi: number }[];
}

export interface Prediction {
  district_id: number;
  district_name: string | null;
  drought_prob: number;
  risk_level: RiskLevel;
  predicted_at: string;
  horizon_days: number;
}

export interface Tanker {
  id: number;
  vehicle_number: string;
  driver_name: string;
  current_lat: number | null;
  current_lng: number | null;
  status: 'active' | 'loading' | 'maintenance' | 'idle';
  capacity_liters: number;
  current_load_liters: number;
  route_id: string | null;
  eta_minutes: number | null;
  district_id: number | null;
}

export interface FeedItem {
  type: string;
  title: string;
  detail: string;
  time: string;
}

export interface SMSCampaign {
  id: string;
  message: string;
  target_group: string;
  recipients: number;
  sent: number;
  failed: number;
  delivery_rate: number;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  region: string | null;
  phone: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  last_active: string | null;
}

// ── Districts ─────────────────────────────────────────────────────────────────
export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    /**
     * Admin / official login → POST /auth/login
     * Returns a bearer token + user object.
     */
    login: (payload: { email: string; password: string }) =>
      fetcher<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    /**
     * End-user login → POST /auth/user-login
     */
    userLogin: (payload: { email: string; password: string }) =>
      fetcher<LoginResponse>('/auth/user-login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    /**
     * Admin / official registration → POST /auth/register
     */
    register: (payload: {
      full_name: string;
      designation: string;
      department_id: string;
      district: string;
      email: string;
    }) =>
      fetcher<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    /**
     * End-user registration → POST /auth/user-register
     */
    userRegister: (payload: {
      full_name: string;
      official_id: string;
      district: string;
      password: string;
    }) =>
      fetcher<RegisterResponse>('/auth/user-register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  districts: {
    list:    ()        => fetcher<{ districts: District[]; total: number }>('/districts'),
    get:     (id: number) => fetcher<District>(`/districts/${id}`),
    history: (id: number, days = 7) => fetcher<DistrictHistory>(`/districts/${id}/history?days=${days}`),
  },

  // ── Predictions ─────────────────────────────────────────────────────────────
  predictions: {
    latest: (limit = 10) => fetcher<Prediction[]>(`/predict/latest?limit=${limit}`),
    single: (payload: {
      district_id: number; rainfall: number; temperature: number;
      humidity: number; rain_7d: number; rain_30d: number;
    }) => fetcher<Prediction>('/predict', { method: 'POST', body: JSON.stringify(payload) }),
  },

  // ── SMS ──────────────────────────────────────────────────────────────────────
  sms: {
    campaigns: (limit = 20) => fetcher<{ campaigns: SMSCampaign[]; total: number }>(`/sms/campaigns?limit=${limit}`),
    send: (payload: { district_ids: number[]; target_group: string; message: string }) =>
      fetcher<{ queued: number; sent: number; failed: number; campaign_id: string; message: string }>(
        '/sms/send', { method: 'POST', body: JSON.stringify(payload) }
      ),
  },

  // ── Tankers ──────────────────────────────────────────────────────────────────
  tankers: {
    list:   ()          => fetcher<Tanker[]>('/tankers'),
    get:    (id: number) => fetcher<Tanker>(`/tankers/${id}`),
    feed:   ()          => fetcher<{ feed: FeedItem[]; timestamp: string }>('/tankers/feed'),
    update: (id: number, payload: Partial<Tanker>) =>
      fetcher<Tanker>(`/tankers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    optimize: (payload: { district_ids: number[]; available_tanker_ids: number[] }) =>
      fetcher<{ routes: object[]; total_tankers: number; estimated_coverage: number }>(
        '/tankers/optimize', { method: 'POST', body: JSON.stringify(payload) }
      ),
  },

  // ── Users ────────────────────────────────────────────────────────────────────
  users: {
    list:   (page = 1, limit = 20) => fetcher<{ users: User[]; total: number; page: number; pages: number }>(`/users?page=${page}&limit=${limit}`),
    create: (payload: Omit<User, 'id' | 'created_at' | 'last_active' | 'status'>) =>
      fetcher<User>('/users', { method: 'POST', body: JSON.stringify(payload) }),
  },

  // ── Health ───────────────────────────────────────────────────────────────────
  health: () => fetcher<{ status: string; model_version: string; timestamp: string }>('/health'),
};

// ── Risk helpers ──────────────────────────────────────────────────────────────
export const riskColor: Record<RiskLevel, string> = {
  LOW:      'text-emerald-600',
  MEDIUM:   'text-yellow-600',
  HIGH:     'text-orange-500',
  CRITICAL: 'text-red-600',
};
export const riskBg: Record<RiskLevel, string> = {
  LOW:      'bg-emerald-50',
  MEDIUM:   'bg-yellow-50',
  HIGH:     'bg-orange-50',
  CRITICAL: 'bg-red-50',
};
export const riskBar: Record<RiskLevel, string> = {
  LOW:      'bg-emerald-500',
  MEDIUM:   'bg-yellow-500',
  HIGH:     'bg-orange-500',
  CRITICAL: 'bg-red-500',
};
export const riskVwsiPercent = (vwsi: number) => Math.min(100, Math.round(vwsi * 100));
