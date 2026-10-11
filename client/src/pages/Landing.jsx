import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <section>
      <div className="banner">
        <img src="/images/banner.png" alt="Fresh coffee, delivered." />
      </div>

      <h1 className="landing-title">JavaShipped</h1>
      <p className="landing-intro">
        JavaShipped brings freshly brewed coffee to your door. Pick a drink, tell us where to
        deliver it, and follow your order from our kitchen until it arrives.
      </p>

      <div className="features">
        <div className="feature-card">
          <div className="feature-card-header">
            <div className="icon-circle icon-sage">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <h3>Our Drinks</h3>
          </div>
          <p>Espresso, cappuccino, latte, cold coffee and more, made to order.</p>
          <Link to="/menu" className="feature-link">See the menu →</Link>
        </div>

        <div className="feature-card">
          <div className="feature-card-header">
            <div className="icon-circle icon-peach">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h3>Track Your Order</h3>
          </div>
          <p>Watch your order move from Received to Being Prepared to Delivered.</p>
          <Link to="/status" className="feature-link">Check my orders →</Link>
        </div>

        <div className="feature-card">
          <div className="feature-card-header">
            <div className="icon-circle icon-sage">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h3>Live Analytics</h3>
          </div>
          <p>See how many orders we have and which drinks are the favourites.</p>
          <Link to="/analytics" className="feature-link">View analytics →</Link>
        </div>
      </div>
    </section>
  );
}
