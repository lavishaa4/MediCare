// lib/api.js — Frontend API client

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('medicare_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth
export const api = {
  auth: {
    register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request('/api/auth/me'),
  },
  medications: {
    list: () => request('/api/medications'),
    create: (body) => request('/api/medications', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/api/medications/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/api/medications/${id}`, { method: 'DELETE' }),
    markTaken: (id) => request(`/api/medications/${id}`, { method: 'PUT', body: JSON.stringify({ markTaken: true }) }),
  },
  appointments: {
    list: () => request('/api/appointments'),
    create: (body) => request('/api/appointments', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/api/appointments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    cancel: (id) => request(`/api/appointments/${id}`, { method: 'DELETE' }),
  },
  notifications: {
    list: () => request('/api/notifications'),
    markAllRead: () => request('/api/notifications', { method: 'PATCH' }),
  },
};
