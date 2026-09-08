import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden border border-[var(--color-ink)]/10 bg-white">
      <Link to={`/menu/${food._id}`} className="block overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/menu/${food._id}`}>
            <h3 className="font-display text-lg font-medium leading-snug text-[var(--color-charcoal)] hover:text-[var(--color-ember)]">
              {food.name}
            </h3>
          </Link>
          <span className="whitespace-nowrap font-display text-lg font-medium text-[var(--color-ember)]">
            {formatPrice(food.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-[var(--color-ink)]/60">{food.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/40">
            {food.category?.name}
          </span>
          <button
            onClick={() => addToCart(food, 1)}
            disabled={food.isAvailable === false}
            className="rounded-sm bg-[var(--color-charcoal)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-cream)] transition-colors hover:bg-[var(--color-ember)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {food.isAvailable === false ? 'Sold out' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
