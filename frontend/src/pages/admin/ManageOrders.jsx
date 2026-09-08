import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { formatPrice } from '../../utils/format';

const statuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Manage Orders</h1>
      {error && <p className="mt-4 text-sm text-[var(--color-ember)]">{error}</p>}

      <div className="mt-6 space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="border border-[var(--color-ink)]/10">
            <button
              onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--color-charcoal)]">
                  #{order._id.slice(-6).toUpperCase()} — {order.user?.name || 'Guest'}
                </p>
                <p className="text-xs text-[var(--color-ink)]/50">{order.user?.email} · {order.user?.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[var(--color-charcoal)]">{formatPrice(order.totalPrice)}</span>
                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="rounded-sm border border-[var(--color-ink)]/20 px-2 py-1 text-xs"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </button>
            {expanded === order._id && (
              <div className="border-t border-[var(--color-ink)]/10 px-5 py-4 text-sm">
                <p className="text-[var(--color-ink)]/70"><strong>Delivery:</strong> {order.deliveryAddress}</p>
                <p className="text-[var(--color-ink)]/70"><strong>Payment:</strong> {order.paymentMethod}</p>
                {order.orderNotes && <p className="text-[var(--color-ink)]/70"><strong>Notes:</strong> {order.orderNotes}</p>}
                <div className="mt-3 space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[var(--color-ink)]/70">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-sm text-[var(--color-ink)]/40">No orders yet.</p>}
      </div>
    </div>
  );
};

export default ManageOrders;
