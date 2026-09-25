let API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// En Render, la variable host puede venir sin protocolo https://
if (API_BASE && !API_BASE.startsWith('http://') && !API_BASE.startsWith('https://')) {
  API_BASE = `https://${API_BASE}`;
}

export async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
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
