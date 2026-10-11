import { Link } from 'react-router-dom';

// One drink on the menu matching Image 2
export default function DrinkCard({ drink }) {
  // Use .png if available, fallback to provided image path
  const imageSrc = drink.image.endsWith('.svg')
    ? drink.image.replace('.svg', '.png')
    : drink.image;

  return (
    <div className="drink-card">
      <img className="drink-image" src={imageSrc} alt={drink.name} />
      <h3>{drink.name}</h3>
      <p className="drink-desc">{drink.description}</p>
      <p className="drink-price">₹{drink.price}</p>

      {drink.stock === 0 ? (
        <span className="tag-out">Out of stock</span>
      ) : (
        <Link className="btn btn-full" to={`/order/${drink._id}`}>
          Order Now
        </Link>
      )}
    </div>
  );
}
