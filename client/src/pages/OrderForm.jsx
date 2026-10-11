import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDrinks, placeOrder } from '../api';
import StatusBadge from '../components/StatusBadge';

const START = { customerName: '', mobile: '', size: 'Medium', quantity: 1, deliveryAddress: '' };

export default function OrderForm() {
  const { drinkId } = useParams();
  const [drink, setDrink] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState(START);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDrinks()
      .then((list) => {
        const found = list.find((d) => d._id === drinkId || d.name.toLowerCase() === drinkId.toLowerCase());
        if (found) setDrink(found);
        else setNotFound(true);
      })
      .catch((err) => setError(err.message));
  }, [drinkId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const saved = await placeOrder({ ...form, drinkId: drink._id, quantity: Number(form.quantity) });
      setOrder(saved);
    } catch (err) {
      setError(err.message);
    }
  };

  if (notFound) return <p className="muted">Drink not found.</p>;
  if (!drink) return <p className="muted">{error || 'Loading…'}</p>;

  // Confirmation view matching Image 4 (top)
  if (order) {
    return (
      <div className="order-page-wrapper">
        <div className="confirm-card">
          <div className="confirm-icon-wrap">
            <img src="/images/order-success-icon.png" alt="Order placed" />
          </div>
          <div className="confirm-details">
            <h2>Order placed!</h2>
            <p>Order ID: <span className="confirm-id">{order._id}</span></p>
            <p>Status: <StatusBadge status={order.status} /></p>
            <p className="confirm-note">
              Keep this ID. You can follow your order under My Orders using your mobile number.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const total = drink.price * (Number(form.quantity) || 0);

  return (
    <div className="order-page-wrapper">
      <div className="order-card-container">
        <h2 className="order-form-title">Order {drink.name}</h2>

        <form onSubmit={handleSubmit} className="order-fields-grid">
          {/* Customer Name */}
          <div className="form-row">
            <div className="field-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="field-content">
              <label htmlFor="customerName">Customer Name</label>
              <input
                id="customerName"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Bhagyashri Valecha"
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="form-row">
            <div className="field-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <div className="field-content">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                placeholder="9999999999"
                required
              />
            </div>
          </div>

          {/* Drink Selection */}
          <div className="form-row">
            <div className="field-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              </svg>
            </div>
            <div className="field-content">
              <label htmlFor="drinkSelect">Drink</label>
              <input
                id="drinkSelect"
                value={`${drink.name} (₹${drink.price})`}
                readOnly
              />
            </div>
          </div>

          {/* Size */}
          <div className="form-row">
            <div className="field-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="field-content">
              <label htmlFor="size">Size</label>
              <select id="size" name="size" value={form.size} onChange={handleChange}>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div className="form-row">
            <div className="field-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <div className="field-content">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="form-row">
            <div className="field-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="field-content">
              <label htmlFor="deliveryAddress">Delivery Address</label>
              <input
                id="deliveryAddress"
                name="deliveryAddress"
                value={form.deliveryAddress}
                onChange={handleChange}
                placeholder="d19/8"
                required
              />
            </div>
          </div>

          {/* Total Amount */}
          <div className="total-amount-row">
            <strong>Total Amount: ₹{total}</strong>
          </div>

          {error && <p className="error" style={{ marginLeft: 38 }}>{error}</p>}

          <div className="order-btn-wrap">
            <button type="submit" className="btn btn-full">
              Place Order
            </button>
          </div>
        </form>
      </div>

      <img src="/images/coffee-cup-side.png" alt="" className="order-side-cup" />
    </div>
  );
}
