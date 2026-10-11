import { useEffect, useState } from 'react';
import DrinkCard from '../components/DrinkCard';
import { getDrinks } from '../api';

export default function Menu() {
  const [drinks, setDrinks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getDrinks()
      .then(setDrinks)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      {error && <p className="error">{error}</p>}
      {!error && drinks.length === 0 && <p className="muted">Loading menu…</p>}

      <div className="menu-grid">
        {drinks.map((drink) => (
          <DrinkCard key={drink._id} drink={drink} />
        ))}
      </div>
    </section>
  );
}
