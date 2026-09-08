import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { formatPrice } from '../utils/format';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    deliveryAddress: user?.address || '',
    orderNotes: '',
    paymentMethod: 'Cash on Delivery',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  const deliveryFee = items.length > 0 ? 150 : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/orders', {
        items: items.map((item) => ({
          food: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        ...form,
      });
      setPlaced(true);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !placed) {
    navigate('/menu');
    return null;
  }

  if (placed) {
    return (
      <div className="container-page flex flex-col items-center justify-center gap-4 py-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-basil)]/10 text-[var(--color-basil)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">
          Your Order Has Been Successfully Placed!
        </h1>
        <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
          We're preparing your food now. You can track its status any time from your dashboard.
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-2">
          View my orders
        </button>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-4xl font-medium text-[var(--color-charcoal)]">Checkout</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2">
          {error && (
            <div className="border border-[var(--color-ember)]/30 bg-[var(--color-ember)]/5 px-4 py-3 text-sm text-[var(--color-ember)]">
              {error}
            </div>
          )}

          <div>
            <label className="label-field" htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" required value={form.phone} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="deliveryAddress">Delivery Address</label>
            <textarea id="deliveryAddress" name="deliveryAddress" required rows={3} value={form.deliveryAddress} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="orderNotes">Order Notes (optional)</label>
            <textarea id="orderNotes" name="orderNotes" rows={2} value={form.orderNotes} onChange={handleChange} className="input-field" placeholder="E.g. less spicy, ring the bell twice..." />
          </div>

          <div>
            <span className="label-field">Payment Method</span>
            <div className="mt-2 space-y-2">
              {['Cash on Delivery', 'Online Payment'].map((method) => (
                <label key={method} className="flex items-center gap-3 border border-[var(--color-ink)]/10 px-4 py-3 text-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={handleChange}
                    className="accent-[var(--color-ember)]"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Placing order...' : `Place Order — ${formatPrice(total)}`}
          </button>
        </form>

        <div className="h-fit border border-[var(--color-ink)]/10 p-6">
          <h2 className="font-display text-xl font-medium text-[var(--color-charcoal)]">Order Items</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm text-[var(--color-ink)]/70">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-[var(--color-ink)]/10 pt-4 text-sm">
            <div className="flex justify-between text-[var(--color-ink)]/70"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-[var(--color-ink)]/70"><span>Delivery Fee</span><span>{formatPrice(deliveryFee)}</span></div>
            <div className="flex justify-between text-base font-semibold text-[var(--color-charcoal)]"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
