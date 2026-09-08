import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/foods', label: 'Food Items' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/reservations', label: 'Reservations' },
  { to: '/admin/users', label: 'Users' },
];

const AdminLayout = () => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[var(--color-ember)] text-white'
        : 'text-[var(--color-cream)]/70 hover:bg-[var(--color-cream)]/10 hover:text-[var(--color-cream)]'
    }`;

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit bg-[var(--color-charcoal)] py-4">
        <p className="px-4 pb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-cream)]/40">
          Admin Panel
        </p>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
