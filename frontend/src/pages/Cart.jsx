import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deliveryFee = items.length > 0 ? 150 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center gap-4 py-28 text-center">
        <h1 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Your cart is empty</h1>
        <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
          Looks like you haven't added anything yet. Browse the menu to find something you'll love.
        </p>
        <Link to="/menu" className="btn-primary mt-2">Browse the menu</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-4xl font-medium text-[var(--color-charcoal)]">Your Cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="divide-y divide-[var(--color-ink)]/10 lg:col-span-2">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 py-5">
              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-sm object-cover" />
              <div className="flex-1">
                <h3 className="font-display text-lg font-medium text-[var(--color-charcoal)]">{item.name}</h3>
                <p className="mt-1 text-sm text-[var(--color-ink)]/50">{formatPrice(item.price)} each</p>
              </div>
              <div className="flex items-center border border-[var(--color-ink)]/15">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="px-3 py-1.5 text-[var(--color-ink)]/70 hover:text-[var(--color-ember)]"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-3 py-1.5 text-[var(--color-ink)]/70 hover:text-[var(--color-ember)]"
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-medium text-[var(--color-charcoal)]">
                {formatPrice(item.price * item.quantity)}
              </p>
              <button
                onClick={() => removeFromCart(item._id)}
                aria-label={`Remove ${item.name}`}
                className="text-[var(--color-ink)]/40 hover:text-[var(--color-ember)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit border border-[var(--color-ink)]/10 p-6">
          <h2 className="font-display text-xl font-medium text-[var(--color-charcoal)]">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-[var(--color-ink)]/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-ink)]/70">
              <span>Delivery Fee</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-ink)]/10 pt-3 text-base font-semibold text-[var(--color-charcoal)]">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </button>
          <Link to="/menu" className="mt-4 block text-center text-sm text-[var(--color-ink)]/50 hover:text-[var(--color-ember)]">
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
