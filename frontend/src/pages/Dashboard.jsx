import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';
import { formatPrice } from '../utils/format';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Preparing: 'bg-indigo-100 text-indigo-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Approved: 'bg-green-100 text-green-700',
};

const tabs = ['Profile', 'Orders', 'Reservations'];

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [profileMessage, setProfileMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ordersRes, reservationsRes] = await Promise.all([
          api.get('/orders/my'),
          api.get('/reservations/my'),
        ]);
        setOrders(ordersRes.data.orders);
        setReservations(reservationsRes.data.reservations);
      } catch {
        // silently ignore; UI shows empty states
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProfileChange = (e) => setProfileForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMessage('');
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      updateUser(data.user);
      setProfileMessage('Profile updated successfully.');
    } catch (err) {
      setProfileMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-4xl font-medium text-[var(--color-charcoal)]">
        Hi, {user?.name?.split(' ')[0]}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink)]/60">Manage your profile, orders, and reservations here.</p>

      <div className="mt-8 flex gap-2 border-b border-[var(--color-ink)]/10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'border-[var(--color-ember)] text-[var(--color-ember)]'
                : 'border-transparent text-[var(--color-ink)]/50 hover:text-[var(--color-ink)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'Profile' && (
          <form onSubmit={handleProfileSave} className="max-w-md space-y-5">
            {profileMessage && <p className="text-sm text-[var(--color-basil)]">{profileMessage}</p>}
            <div>
              <label className="label-field" htmlFor="name">Full Name</label>
              <input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} className="input-field" />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input value={user?.email} disabled className="input-field opacity-60" />
            </div>
            <div>
              <label className="label-field" htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" value={profileForm.phone} onChange={handleProfileChange} className="input-field" />
            </div>
            <div>
              <label className="label-field" htmlFor="address">Address</label>
              <textarea id="address" name="address" rows={3} value={profileForm.address} onChange={handleProfileChange} className="input-field" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {activeTab === 'Orders' && (
          loading ? <Loader /> : orders.length === 0 ? (
            <p className="text-sm text-[var(--color-ink)]/50">You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-[var(--color-ink)]/10 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[var(--color-ink)]/50">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-[var(--color-ink)]/40">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-[var(--color-ink)]/70">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between border-t border-[var(--color-ink)]/10 pt-3 text-sm font-semibold text-[var(--color-charcoal)]">
                    <span>Total</span>
                    <span>{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'Reservations' && (
          loading ? <Loader /> : reservations.length === 0 ? (
            <p className="text-sm text-[var(--color-ink)]/50">You haven't made any table reservations yet.</p>
          ) : (
            <div className="space-y-4">
              {reservations.map((res) => (
                <div key={res._id} className="flex flex-wrap items-center justify-between gap-3 border border-[var(--color-ink)]/10 p-5">
                  <div>
                    <p className="font-display text-lg font-medium text-[var(--color-charcoal)]">
                      {res.numberOfGuests} guest{res.numberOfGuests > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-[var(--color-ink)]/60">{res.reservationDate} at {res.reservationTime}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[res.status] || 'bg-gray-100 text-gray-700'}`}>
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
