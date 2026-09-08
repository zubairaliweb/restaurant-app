import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/reservation', label: 'Reservations' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-colors ${
      isActive ? 'text-[var(--color-ember)]' : 'text-[var(--color-cream)]/80 hover:text-[var(--color-cream)]'
    }`;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-charcoal)]">
      <div className="container-page flex h-18 items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold text-[var(--color-cream)]">
            Saffron <span className="text-[var(--color-ember)]">&amp;</span> Smoke
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link to="/cart" className="relative text-[var(--color-cream)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.98-4.694 2.57-7.158.075-.31-.174-.6-.494-.6H5.106M7.5 14.25L5.106 5.114M7.5 14.25L6.75 18M6.75 18H15m-8.25 0a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15 18a1.125 1.125 0 100 2.25A1.125 1.125 0 0015 18z" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-ember)] text-[10px] font-bold text-white">
                {totalCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium text-[var(--color-cream)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ember)] text-xs font-semibold uppercase text-white">
                  {user.name?.charAt(0)}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 border border-[var(--color-ink)]/10 bg-white py-2 shadow-lg">
                  <p className="truncate px-4 pb-2 text-xs text-[var(--color-ink)]/50">{user.email}</p>
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-cream)]"
                  >
                    {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-[var(--color-ember)] hover:bg-[var(--color-cream)]"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary !px-5 !py-2 text-xs">
              Sign In
            </Link>
          )}
        </div>

        <button className="text-[var(--color-cream)] md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--color-cream)]/10 bg-[var(--color-charcoal)] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)} className="text-sm font-medium text-[var(--color-cream)]/80">
              Cart {totalCount > 0 && `(${totalCount})`}
            </Link>
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-[var(--color-cream)]/80"
                >
                  {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                </Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-[var(--color-ember)]">
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="btn-primary w-full text-xs">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
