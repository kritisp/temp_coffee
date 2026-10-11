import { useEffect, useState } from 'react';
import { getAnalytics } from '../api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Loading analytics…</p>;

  return (
    <section>
      <div className="analytics-card-wrap">
        <img src="/images/coffee-cup-side.png" alt="" className="analytics-decor-cup" />

        <h2 className="analytics-title">Analytics Dashboard</h2>

        <div className="analytics-stats-row">
          <div className="stat-box">
            <div className="stat-icon icon-sage">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <div className="stat-info">
              <span>Total orders</span>
              <strong>{data.totalOrders}</strong>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon icon-peach">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div className="stat-info">
              <span>Total sales</span>
              <strong>₹{data.totalSales}</strong>
            </div>
          </div>
        </div>

        <h3 className="analytics-subtitle">Orders by drink</h3>
        {data.perDrink.length === 0 && <p className="muted">No orders yet.</p>}

        <div className="drink-progress-list">
          {data.perDrink.map((d) => (
            <div key={d.name} className="drink-progress-row">
              <div className="drink-progress-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                </svg>
              </div>
              <span className="drink-progress-name">{d.name}</span>
              <div className="drink-progress-track">
                <div
                  className="drink-progress-fill"
                  style={{ width: `${Math.max(d.percent, 8)}%` }}
                />
              </div>
              <span className="drink-progress-meta">
                {d.orders} orders · {d.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
