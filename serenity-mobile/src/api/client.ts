import { storage } from '../utils/storage';

export const API_URL = 'https://serenity-production-bafc.up.railway.app';

async function getHeaders(includeAuth = true): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = await storage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  async get<T>(path: string, auth = true): Promise<T> {
    const headers = await getHeaders(auth);
    const response = await fetch(`${API_URL}${path}`, { headers });
    return handleResponse<T>(response);
  },

  async post<T>(path: string, body: unknown, auth = true): Promise<T> {
    const headers = await getHeaders(auth);
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  async patch<T>(path: string, body: unknown, auth = true): Promise<T> {
    const headers = await getHeaders(auth);
    const response = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  async delete<T>(path: string, auth = true): Promise<T> {
    const headers = await getHeaders(auth);
    const response = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers,
    });
    return handleResponse<T>(response);
  },
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: { id: string; email: string; name: string; role: string; avatar?: string }; token: string }>(
      '/api/auth/login',
      { email, password },
      false
    ),

  register: (data: {
    email: string;
    password: string;
    name: string;
    role: string;
    businessName?: string;
    businessEmail?: string;
    businessPhone?: string;
    location?: {
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  }) => api.post<{ user: { id: string; email: string; name: string; role: string }; token: string }>(
    '/api/auth/register',
    data,
    false
  ),

  getGoogleAuthStatus: () =>
    api.get<{ googleAuthAvailable: boolean }>('/api/auth/google/status', false),

  me: () =>
    api.get<{ id: string; email: string; name: string; role: string; avatar?: string }>('/api/auth/me'),
};

export const dashboardApi = {
  getStats: () =>
    api.get<{ stats: { totalRevenue: string; totalAppointments: number; activeClients: number; todayAppointments: number; growth: number }; recentAppointments: unknown[] }>(
      '/api/dashboard/stats'
    ),

  getRevenue: (period: string) =>
    api.get<{ name: string; revenue: number }[]>(`/api/dashboard/revenue?period=${period}`),

  getStaff: () =>
    api.get<{ name: string; role: string; value: number }[]>('/api/dashboard/staff'),

  getTodayAppointments: () =>
    api.get<{ _id: string; clientName: string; service: string; time: string; status: string; specialist: string; price?: string; email?: string; phone?: string }[]>(
      '/api/dashboard/appointments/today'
    ),

  updateAppointment: (id: string, status: string) =>
    api.patch(`/api/dashboard/appointments/${id}`, { status }),

  deleteAppointment: (id: string) =>
    api.delete(`/api/dashboard/appointments/${id}`),
};
