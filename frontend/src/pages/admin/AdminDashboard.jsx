import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { formatPrice } from '../../utils/format';

const statCards = (stats) => [
  { label: 'Total Orders', value: stats.totalOrders },
  { label: 'Total Revenue', value: formatPrice(stats.totalRevenue) },
  { label: 'Total Customers', value: stats.totalCustomers },
  { label: 'Total Food Items', value: stats.totalFoodItems },
  { label: 'Pending Orders', value: stats.pendingOrders },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-sm text-[var(--color-ember)]">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Dashboard Overview</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {statCards(stats).map((card) => (
          <div key={card.label} className="border border-[var(--color-ink)]/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">{card.label}</p>
            <p className="mt-2 font-display text-2xl font-medium text-[var(--color-charcoal)]">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl font-medium text-[var(--color-charcoal)]">Recent Orders</h2>
      <div className="mt-4 overflow-x-auto border border-[var(--color-ink)]/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-cream-dim)] text-xs uppercase tracking-wider text-[var(--color-ink)]/50">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ink)]/10">
            {stats.recentOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-3">{order.user?.name || 'Guest'}</td>
                <td className="px-4 py-3">{formatPrice(order.totalPrice)}</td>
                <td className="px-4 py-3">{order.status}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]/50">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {stats.recentOrders.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-[var(--color-ink)]/40">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
