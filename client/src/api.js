// API client with seamless standalone fallback for deployed previews (Vercel/Netlify/GitHub Pages)
const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const DEFAULT_DRINKS = [
  { _id: '6aca00000000000000000001', name: 'Espresso', description: 'Strong, short shot of pure coffee', price: 120, image: '/images/espresso.png', stock: 30 },
  { _id: '6aca00000000000000000002', name: 'Americano', description: 'Espresso topped with hot water', price: 150, image: '/images/americano.png', stock: 25 },
  { _id: '6aca00000000000000000003', name: 'Cappuccino', description: 'Equal parts espresso, milk and foam', price: 180, image: '/images/cappuccino.png', stock: 25 },
  { _id: '6aca00000000000000000004', name: 'Latte', description: 'Smooth espresso with lots of steamed milk', price: 190, image: '/images/latte.png', stock: 40 },
  { _id: '6aca00000000000000000005', name: 'Mocha', description: 'Espresso with chocolate and milk', price: 200, image: '/images/mocha.png', stock: 0 },
  { _id: '6aca00000000000000000006', name: 'Cold Coffee', description: 'Chilled blended coffee with milk and ice', price: 210, image: '/images/cold-coffee.png', stock: 20 },
];

function getLocalData(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

// In-memory/localStorage mock if deployed without standalone backend
const mockStore = {
  getDrinks() {
    return getLocalData('coffee_drinks', DEFAULT_DRINKS);
  },
  getOrders(mobile) {
    const all = getLocalData('coffee_orders', [
      {
        _id: '6aca586d54cca9557dfd406a',
        customerName: 'Bhagyashri Valecha',
        mobile: '9999999999',
        drinkName: 'Espresso',
        size: 'Medium',
        quantity: 2,
        totalAmount: 240,
        deliveryAddress: 'd19/8',
        status: 'Received',
        createdAt: new Date().toISOString(),
      },
      {
        _id: '6aca79c354cca9557dfd40c2',
        customerName: 'Demo Customer',
        mobile: '5555555555',
        drinkName: 'Americano',
        size: 'Medium',
        quantity: 1,
        totalAmount: 150,
        deliveryAddress: 'lh-1',
        status: 'Received',
        createdAt: new Date().toISOString(),
      }
    ]);
    if (!mobile) return all;
    return all.filter((o) => o.mobile === mobile);
  },
  placeOrder(orderData) {
    const drinks = this.getDrinks();
    const drink = drinks.find((d) => d._id === orderData.drinkId || d.name === orderData.drinkId);
    if (!drink) throw new Error('Drink not found');
    if (drink.stock < orderData.quantity) throw new Error('Out of stock');

    drink.stock -= orderData.quantity;
    setLocalData('coffee_drinks', drinks);

    const orders = this.getOrders();
    const newOrder = {
      _id: '6aca' + Math.random().toString(16).slice(2, 10) + '54cca',
      ...orderData,
      drinkName: drink.name,
      unitPrice: drink.price,
      totalAmount: drink.price * orderData.quantity,
      status: 'Received',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    setLocalData('coffee_orders', orders);
    return newOrder;
  },
  updateOrderStatus(id, status) {
    const orders = this.getOrders();
    const order = orders.find((o) => o._id === id);
    if (order) {
      order.status = status;
      setLocalData('coffee_orders', orders);
    }
    return order;
  },
  cancelOrder(id) {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o._id === id);
    if (idx !== -1) {
      orders.splice(idx, 1);
      setLocalData('coffee_orders', orders);
    }
    return { message: 'Order cancelled' };
  },
  getAnalytics() {
    const orders = this.getOrders();
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const drinkMap = {};
    orders.forEach((o) => {
      drinkMap[o.drinkName] = (drinkMap[o.drinkName] || 0) + 1;
    });
    const perDrink = Object.entries(drinkMap).map(([name, count]) => ({
      name,
      orders: count,
      percent: totalOrders ? Math.round((count / totalOrders) * 1000) / 10 : 0,
      sales: count * 150,
    }));
    return { totalOrders, totalSales, perDrink };
  }
};

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Server error');
    }
    return await res.json();
  } catch (err) {
    // If backend is unreachable (e.g. static deployed frontend), fallback to browser mock storage
    if (path === '/drinks') return mockStore.getDrinks();
    if (path.startsWith('/orders') && options.method === 'POST') {
      return mockStore.placeOrder(JSON.parse(options.body));
    }
    if (path.startsWith('/orders') && options.method === 'PATCH') {
      const id = path.split('/')[2];
      const { status } = JSON.parse(options.body);
      return mockStore.updateOrderStatus(id, status);
    }
    if (path.startsWith('/orders') && options.method === 'DELETE') {
      const id = path.split('/')[2];
      return mockStore.cancelOrder(id);
    }
    if (path.startsWith('/orders')) {
      const url = new URL('http://dummy' + path);
      return mockStore.getOrders(url.searchParams.get('mobile'));
    }
    if (path === '/analytics') return mockStore.getAnalytics();
    throw err;
  }
}

export const getDrinks = () => request('/drinks');

export const placeOrder = (order) =>
  request('/orders', { method: 'POST', body: JSON.stringify(order) });

export const getOrders = (mobile) =>
  request(`/orders${mobile ? `?mobile=${encodeURIComponent(mobile)}` : ''}`);

export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const cancelOrder = (id) => request(`/orders/${id}`, { method: 'DELETE' });

export const getAnalytics = () => request('/analytics');
