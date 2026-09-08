import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/reservations');
        setReservations(data.reservations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      setReservations((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Manage Reservations</h1>
      {error && <p className="mt-4 text-sm text-[var(--color-ember)]">{error}</p>}

      <div className="mt-6 overflow-x-auto border border-[var(--color-ink)]/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-cream-dim)] text-xs uppercase tracking-wider text-[var(--color-ink)]/50">
            <tr>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">Guests</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ink)]/10">
            {reservations.map((res) => (
              <tr key={res._id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-charcoal)]">{res.customerName}</p>
                  <p className="text-xs text-[var(--color-ink)]/50">{res.phone}</p>
                </td>
                <td className="px-4 py-3">{res.reservationDate} at {res.reservationTime}</td>
                <td className="px-4 py-3">{res.numberOfGuests}</td>
                <td className="px-4 py-3">{res.status}</td>
                <td className="px-4 py-3">
                  {res.status !== 'Approved' && (
                    <button onClick={() => updateStatus(res._id, 'Approved')} className="mr-3 font-semibold text-[var(--color-basil)]">Approve</button>
                  )}
                  {res.status !== 'Cancelled' && (
                    <button onClick={() => updateStatus(res._id, 'Cancelled')} className="font-semibold text-red-600">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-[var(--color-ink)]/40">No reservations yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageReservations;
