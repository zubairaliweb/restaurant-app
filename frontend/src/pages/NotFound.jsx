import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container-page flex flex-col items-center justify-center gap-4 py-32 text-center">
    <p className="font-display text-6xl font-medium text-[var(--color-ember)]">404</p>
    <h1 className="font-display text-2xl font-medium text-[var(--color-charcoal)]">Page not found</h1>
    <p className="text-sm text-[var(--color-ink)]/60">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary mt-2">Back to home</Link>
  </div>
);

export default NotFound;
