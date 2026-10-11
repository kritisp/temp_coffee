// All calls to the Express API go through here.
const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const getDrinks = () => request('/drinks');

export const placeOrder = (order) =>
  request('/orders', { method: 'POST', body: JSON.stringify(order) });

// Pass a mobile number for one customer, or nothing for all orders (kitchen).
export const getOrders = (mobile) =>
  request(`/orders${mobile ? `?mobile=${encodeURIComponent(mobile)}` : ''}`);

export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const cancelOrder = (id) => request(`/orders/${id}`, { method: 'DELETE' });

export const getAnalytics = () => request('/analytics');
