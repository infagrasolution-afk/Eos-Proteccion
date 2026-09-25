let API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// En Render, la variable host puede venir sin protocolo https://
if (API_BASE && !API_BASE.startsWith('http://') && !API_BASE.startsWith('https://')) {
  API_BASE = `https://${API_BASE}`;
}

export function getAuthToken() {
  return localStorage.getItem('eos_token');
}

export function setAuthToken(token, user) {
  if (token) {
    localStorage.setItem('eos_token', token);
    localStorage.setItem('eos_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('eos_token');
    localStorage.removeItem('eos_user');
  }
}

export function getCurrentUser() {
  const u = localStorage.getItem('eos_user');
  return u ? JSON.parse(u) : null;
}

export async function fetchJson(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Error en la petición' }));
      throw new Error(err.detail || `Error HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Autenticación & Usuarios
  login: (email, password) =>
    fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => fetchJson('/api/auth/me'),
  getUsers: () => fetchJson('/api/users'),
  createUser: (data) =>
    fetchJson('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteUser: (id) =>
    fetchJson(`/api/users/${id}`, {
      method: 'DELETE',
    }),

  // Notificaciones
  getNotifications: () => fetchJson('/api/notifications'),
  markNotificationRead: (id) =>
    fetchJson(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    }),
  markAllNotificationsRead: () =>
    fetchJson('/api/notifications/read-all', {
      method: 'POST',
    }),

  // Perfil del agente
  getProfile: () => fetchJson('/api/profile'),

  // Productos de seguros
  getProducts: () => fetchJson('/api/products'),

  // Estadísticas del dashboard
  getStats: () => fetchJson('/api/stats'),

  // Clientes
  getClients: (search = '', status = 'Todos') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'Todos') params.append('status', status);
    return fetchJson(`/api/clients?${params.toString()}`);
  },
  createClient: (data) =>
    fetchJson('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateClient: (id, data) =>
    fetchJson(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteClient: (id) =>
    fetchJson(`/api/clients/${id}`, {
      method: 'DELETE',
    }),

  // Pólizas
  getPolicies: ({ carrier = 'Todos', status = 'Todos', expiringSoon = false } = {}) => {
    const params = new URLSearchParams();
    if (carrier && carrier !== 'Todos') params.append('carrier', carrier);
    if (status && status !== 'Todos') params.append('status', status);
    if (expiringSoon) params.append('expiring_soon', 'true');
    return fetchJson(`/api/policies?${params.toString()}`);
  },
  createPolicy: (data) =>
    fetchJson('/api/policies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deletePolicy: (id) =>
    fetchJson(`/api/policies/${id}`, {
      method: 'DELETE',
    }),

  // Cotizador y Leads
  submitQuote: (data) =>
    fetchJson('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getQuotes: (status = 'Todos') => {
    const params = new URLSearchParams();
    if (status && status !== 'Todos') params.append('status', status);
    return fetchJson(`/api/quotes?${params.toString()}`);
  },
  updateQuoteStatus: (id, status, notes = '') =>
    fetchJson(`/api/quotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),
  convertLeadToClient: (leadId) =>
    fetchJson(`/api/quotes/${leadId}/convert-to-client`, {
      method: 'POST',
    }),

  // Siniestros
  getClaims: () => fetchJson('/api/claims'),
  submitClaim: (data) =>
    fetchJson('/api/claims', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateClaimStatus: (id, status, estimated_payout) =>
    fetchJson(`/api/claims/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, estimated_payout }),
    }),

  // Portal de autoservicio de clientes
  lookupClientPortal: (query) =>
    fetchJson(`/api/portal/lookup?query=${encodeURIComponent(query)}`),
};
