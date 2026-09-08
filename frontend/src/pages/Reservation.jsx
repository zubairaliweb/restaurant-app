import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Reservation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: 2,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/reservation' } } });
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('/reservations', form);
      setConfirmed(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="container-page flex flex-col items-center justify-center gap-4 py-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-basil)]/10 text-[var(--color-basil)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Table Reserved!</h1>
        <p className="max-w-sm text-sm text-[var(--color-ink)]/60">
          We've sent your reservation request for {form.numberOfGuests} guest(s) on {form.reservationDate} at{' '}
          {form.reservationTime}. We'll confirm shortly.
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-2">View my reservations</button>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="font-display text-4xl font-medium text-[var(--color-charcoal)]">Book a Table</h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink)]/60">
            Whether it's a quiet dinner for two or a celebration for twelve, we'll have the table ready.
            Reservations are confirmed by our team shortly after you submit.
          </p>
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700"
            alt="Restaurant dining area"
            className="mt-8 hidden h-64 w-full rounded-sm object-cover md:block"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 border border-[var(--color-ink)]/10 p-8">
          {error && (
            <div className="border border-[var(--color-ember)]/30 bg-[var(--color-ember)]/5 px-4 py-3 text-sm text-[var(--color-ember)]">
              {error}
            </div>
          )}
          <div>
            <label className="label-field" htmlFor="customerName">Full Name</label>
            <input id="customerName" name="customerName" required value={form.customerName} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" required value={form.phone} onChange={handleChange} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field" htmlFor="reservationDate">Date</label>
              <input id="reservationDate" name="reservationDate" type="date" required value={form.reservationDate} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label-field" htmlFor="reservationTime">Time</label>
              <input id="reservationTime" name="reservationTime" type="time" required value={form.reservationTime} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field" htmlFor="numberOfGuests">Number of Guests</label>
            <input id="numberOfGuests" name="numberOfGuests" type="number" min={1} max={30} required value={form.numberOfGuests} onChange={handleChange} className="input-field" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Booking...' : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
