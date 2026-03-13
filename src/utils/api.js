function getCsrfToken() {
  const match = document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

async function request(path, options = {}) {
  const { method = 'GET', body } = options;
  const headers = { 'Content-Type': 'application/json' };

  if (!['GET', 'HEAD'].includes(method)) {
    headers['X-CSRF-Token'] = getCsrfToken();
  }

  const res = await fetch(path, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    return { ok: false, status: 401, data: null };
  }

  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

// Auth
export const authApi = {
  register: (email, password) =>
    request('/api/auth/register', { method: 'POST', body: { email, password } }),
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),
  logout: () =>
    request('/api/auth/logout', { method: 'POST' }),
  me: () =>
    request('/api/auth/me'),
};

// Setup
export const setupApi = {
  get: () => request('/api/setup'),
  save: (lmpDate, cycleLength) =>
    request('/api/setup', { method: 'PUT', body: { lmpDate, cycleLength } }),
};

// Progress
export const progressApi = {
  getAll: () => request('/api/progress'),
  addReps: (dateKey, reps) =>
    request('/api/progress', { method: 'POST', body: { dateKey, reps } }),
  setReps: (dateKey, logged) =>
    request('/api/progress', { method: 'PUT', body: { dateKey, logged } }),
  sync: (history) =>
    request('/api/progress/sync', { method: 'PUT', body: { history } }),
};
