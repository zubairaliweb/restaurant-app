import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md border border-[var(--color-ink)]/10 p-8">
        <h1 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Welcome back</h1>
        <p className="mt-2 text-sm text-[var(--color-ink)]/60">Sign in to order, track deliveries, and manage reservations.</p>

        {error && (
          <div className="mt-5 border border-[var(--color-ember)]/30 bg-[var(--color-ember)]/5 px-4 py-3 text-sm text-[var(--color-ember)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="label-field" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label-field" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-ink)]/60">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[var(--color-ember)]">Create one</Link>
        </p>
        <p className="mt-3 text-center text-xs text-[var(--color-ink)]/40">
          Admin demo login: admin@restaurant.com / Admin@123 (after running the seed script)
        </p>
      </div>
    </div>
  );
};

export default Login;
