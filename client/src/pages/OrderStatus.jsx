import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { getOrders, cancelOrder } from '../api';

export default function OrderStatus() {
  const [mobileInput, setMobileInput] = useState('');
  const [mobile, setMobile] = useState('5555555555');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // Load the orders, then refresh every 5 seconds while a mobile number is set.
  useEffect(() => {
    if (!mobile) return;
    let active = true;

    const load = () =>
      getOrders(mobile)
        .then((data) => {
          if (active) {
            setOrders(data);
            setError('');
          }
        })
        .catch((err) => {
          if (active) setError(err.message);
        });

    load();
    const timer = setInterval(load, 5000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [mobile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMobile(mobileInput.trim());
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await cancelOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="orders-page">
      <img src="/images/coffee-cup-side.png" alt="" className="orders-side-cup" />

      <h2>My Orders</h2>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="tel"
          placeholder="Enter mobile number"
          value={mobileInput || mobile}
          onChange={(e) => {
            setMobileInput(e.target.value);
            setMobile(e.target.value);
          }}
          required
        />
        <button type="submit" className="btn">
          Show orders
        </button>
      </form>

      {mobile && <p className="muted">Status refreshes every 5 seconds.</p>}
      {error && <p className="error">{error}</p>}
      {mobile && orders.length === 0 && !error && (
        <p className="muted">No orders found for this number.</p>
      )}

      <div className="order-items-list">
        {orders.map((o) => (
          <div key={o._id} className="order-card-item">
            <div className="order-card-header">
              <strong>
                {o.drinkName} {o.size} × {o.quantity}
              </strong>
              <StatusBadge status={o.status} />
            </div>
            <p className="order-card-details">
              Total ₹{o.totalAmount} · Deliver to {o.deliveryAddress}
            </p>
            <p className="order-card-id">Order ID: {o._id}</p>

            {o.status === 'Received' && (
              <button className="btn-cancel" onClick={() => handleCancel(o._id)}>
                Cancel order
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
