import { Routes, Route, NavLink } from 'react-router-dom';
import Landing from './pages/Landing';
import Menu from './pages/Menu';
import OrderForm from './pages/OrderForm';
import OrderStatus from './pages/OrderStatus';
import Kitchen from './pages/Kitchen';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="brand">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L4 11.5V20h8.5l7.74-7.76z" fill="#5a7346" />
            <path d="M4 20l9-9" stroke="#fbf9f5" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          JavaShipped
        </NavLink>
        <div className="links">
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/status">My Orders</NavLink>
          <NavLink to="/kitchen">Kitchen</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order/:drinkId" element={<OrderForm />} />
          <Route path="/status" element={<OrderStatus />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </>
  );
}
