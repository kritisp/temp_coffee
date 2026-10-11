import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { getOrders, updateOrderStatus } from '../api';

const NEXT = {
  'Received': { status: 'Being Prepared', label: 'Start preparing' },
  'Being Prepared': { status: 'Delivered', label: 'Mark delivered' },
};

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const load = () =>
    getOrders()
      .then((data) => {
        setOrders(data);
        setError('');
      })
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const advance = async (order) => {
    const next = NEXT[order.status];
    if (!next) return;
    try {
      await updateOrderStatus(order._id, next.status);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="kitchen-page">
      <h2>Kitchen (Admin)</h2>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 && !error && <p className="muted">No orders yet.</p>}

      {orders.length > 0 && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Drink</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="order-id-cell" title={o._id}>{o._id}</td>
                  <td>{o.customerName}</td>
                  <td>{o.mobile}</td>
                  <td>{o.drinkName}</td>
                  <td>{o.size}</td>
                  <td>{o.quantity}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>{o.deliveryAddress}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    {NEXT[o.status] ? (
                      <button className="btn btn-action" onClick={() => advance(o)}>
                        {NEXT[o.status].label}
                      </button>
                    ) : (
                      <button className="btn-done" disabled>
                        Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
