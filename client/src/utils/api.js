const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    const message =
      data.errors?.join(', ') || data.error || 'Something went wrong';
    throw new Error(message);
  }

  return data;
}

export const api = {
  getExpenses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/expenses${query ? `?${query}` : ''}`);
  },

  getSummary: () => request('/expenses/summary'),

  createExpense: (body) =>
    request('/expenses', { method: 'POST', body: JSON.stringify(body) }),

  updateExpense: (id, body) =>
    request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  deleteExpense: (id) =>
    request(`/expenses/${id}`, { method: 'DELETE' }),
};
