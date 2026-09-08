import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-[var(--color-charcoal)] text-[var(--color-cream)]">
    <div className="container-page grid gap-10 py-16 md:grid-cols-4">
      <div>
        <h3 className="font-display text-xl font-semibold">
          Saffron <span className="text-[var(--color-ember)]">&amp;</span> Smoke
        </h3>
        <p className="mt-4 max-w-xs text-sm text-[var(--color-cream)]/60">
          Wood-fired flavor and slow-cooked tradition, plated for the modern table. Order online or reserve
          yours tonight.
        </p>
        <div className="mt-5 flex gap-4">
          {['Facebook', 'Instagram', 'Twitter'].map((label) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-cream)]/20 text-xs text-[var(--color-cream)]/70 hover:border-[var(--color-ember)] hover:text-[var(--color-ember)]"
            >
              {label.charAt(0)}
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-cream)]/50">
          Explore
        </h4>
        <ul className="space-y-3 text-sm text-[var(--color-cream)]/70">
          <li><Link to="/" className="hover:text-[var(--color-ember)]">Home</Link></li>
          <li><Link to="/menu" className="hover:text-[var(--color-ember)]">Full Menu</Link></li>
          <li><Link to="/reservation" className="hover:text-[var(--color-ember)]">Book a Table</Link></li>
          <li><Link to="/cart" className="hover:text-[var(--color-ember)]">Your Cart</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-cream)]/50">
          Opening Hours
        </h4>
        <ul className="space-y-3 text-sm text-[var(--color-cream)]/70">
          <li className="flex justify-between gap-6"><span>Mon – Thu</span><span>12:00 – 23:00</span></li>
          <li className="flex justify-between gap-6"><span>Fri – Sat</span><span>12:00 – 00:30</span></li>
          <li className="flex justify-between gap-6"><span>Sunday</span><span>13:00 – 22:00</span></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-cream)]/50">
          Visit Us
        </h4>
        <ul className="space-y-3 text-sm text-[var(--color-cream)]/70">
          <li>12 Gulberg Boulevard, Lahore</li>
          <li>+92 300 1234567</li>
          <li>hello@saffronandsmoke.com</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-[var(--color-cream)]/10 py-6">
      <p className="container-page text-center text-xs text-[var(--color-cream)]/40">
        © {new Date().getFullYear()} Saffron &amp; Smoke. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
