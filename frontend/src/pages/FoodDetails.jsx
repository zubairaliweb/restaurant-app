import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

const FoodDetails = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/foods/${id}`);
        setFood(data.food);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(food, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOrderNow = () => {
    addToCart(food, quantity);
    navigate('/cart');
  };

  if (loading) return <Loader label="Loading dish details..." />;

  if (error || !food) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-sm text-[var(--color-ink)]/60">{error || 'Food item not found.'}</p>
        <Link to="/menu" className="btn-secondary mt-6 inline-flex">Back to menu</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <Link to="/menu" className="mb-8 inline-block text-sm text-[var(--color-ink)]/50 hover:text-[var(--color-ember)]">
        &larr; Back to menu
      </Link>
      <div className="grid gap-10 md:grid-cols-2">
        <img src={food.image} alt={food.name} className="h-96 w-full rounded-sm object-cover" />
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ember)]">
            {food.category?.name}
          </span>
          <h1 className="mt-2 font-display text-4xl font-medium text-[var(--color-charcoal)]">{food.name}</h1>
          <p className="mt-4 text-2xl font-medium text-[var(--color-ember)]">{formatPrice(food.price)}</p>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--color-ink)]/70">{food.description}</p>

          {food.isAvailable === false ? (
            <p className="mt-8 inline-block bg-[var(--color-ink)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-ink)]/60">
              Currently sold out
            </p>
          ) : (
            <>
              <div className="mt-8 flex items-center gap-4">
                <span className="label-field !mb-0">Quantity</span>
                <div className="flex items-center border border-[var(--color-ink)]/15">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-lg text-[var(--color-ink)]/70 hover:text-[var(--color-ember)]"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-lg text-[var(--color-ink)]/70 hover:text-[var(--color-ember)]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={handleAddToCart} className="btn-secondary">
                  {added ? 'Added ✓' : 'Add to Cart'}
                </button>
                <button onClick={handleOrderNow} className="btn-primary">
                  Order Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
