import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md border border-[var(--color-ink)]/10 p-8">
        <h1 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Create your account</h1>
        <p className="mt-2 text-sm text-[var(--color-ink)]/60">Join to order online and reserve tables in seconds.</p>

        {error && (
          <div className="mt-5 border border-[var(--color-ember)]/30 bg-[var(--color-ember)]/5 px-4 py-3 text-sm text-[var(--color-ember)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="label-field" htmlFor="name">Full Name</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Ali Raza" />
          </div>
          <div>
            <label className="label-field" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label-field" htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" required value={form.phone} onChange={handleChange} className="input-field" placeholder="03001234567" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="label-field" htmlFor="confirmPassword">Confirm</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} value={form.confirmPassword} onChange={handleChange} className="input-field" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-ink)]/60">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--color-ember)]">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
