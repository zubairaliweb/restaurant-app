import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';

const whyChooseUs = [
  {
    title: 'Slow-cooked tradition',
    body: 'Every recipe is rooted in generations-old technique — nothing rushed, nothing shortcut.',
  },
  {
    title: 'Sourced each morning',
    body: 'We buy from local markets daily, so what lands on your plate was fresh hours ago, not days.',
  },
  {
    title: 'On your table, fast',
    body: 'Order online and track your delivery in real time from kitchen to doorstep.',
  },
];

const testimonials = [
  { name: 'Ayesha K.', quote: 'The Chicken Malai Boti tastes exactly like a family wedding feast. We order weekly.' },
  { name: 'Bilal M.', quote: 'Booked a table for eight on a Friday night — seated in minutes, food came out perfectly timed.' },
  { name: 'Sana R.', quote: 'Delivery tracking actually works, and the biryani arrived hot. Rare combination.' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/foods', { params: { featured: true } });
        setFeatured(data.foods.slice(0, 6));
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-charcoal)] text-[var(--color-cream)]">
        <div className="container-page grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <h1 className="font-display text-5xl font-medium leading-[1.05] sm:text-6xl">
              Fire, spice, and
              <br />
              <span className="italic text-[var(--color-saffron)]">patience</span> on every plate.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--color-cream)]/70">
              Saffron &amp; Smoke brings together char-grilled BBQ, hand-tossed pizza, and Pakistani
              classics — cooked to order, delivered hot, or served at a table we've saved for you.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/menu" className="btn-primary">View Menu</Link>
              <Link to="/reservation" className="btn-ghost-light">Book a Table</Link>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=700"
              alt="Char-grilled mixed platter"
              className="col-span-2 h-56 w-full rounded-sm object-cover sm:h-64"
            />
            <img
              src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500"
              alt="Daal Makhani served with naan"
              className="h-40 w-full rounded-sm object-cover sm:h-48"
            />
            <img
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500"
              alt="Wood-fired Margherita pizza"
              className="h-40 w-full rounded-sm object-cover sm:h-48"
            />
          </div>
        </div>
      </section>

      {/* Popular dishes */}
      <section className="container-page py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Popular right now</h2>
            <p className="mt-2 max-w-md text-sm text-[var(--color-ink)]/60">
              The dishes our regulars reorder without opening the rest of the menu.
            </p>
          </div>
          <Link to="/menu" className="text-sm font-semibold text-[var(--color-ember)] hover:underline">
            See full menu
          </Link>
        </div>

        {loading ? (
          <Loader label="Bringing up today's favorites..." />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-ink)]/50">
            No featured dishes yet — run the seed script or mark items as featured from the admin panel.
          </p>
        )}
      </section>

      {/* About */}
      <section className="bg-[var(--color-cream-dim)]">
        <div className="container-page grid gap-12 py-20 md:grid-cols-2 md:items-center">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=700"
            alt="Chef preparing food in an open kitchen"
            className="h-80 w-full rounded-sm object-cover"
          />
          <div>
            <h2 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Our kitchen, open to you</h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink)]/70">
              Founded in 2012 above a corner tandoor, Saffron &amp; Smoke grew from a six-table diner into a
              neighborhood favorite for BBQ nights, weekend biryani runs, and birthday reservations. We still
              grind our own spice blends every morning and finish every grill order over real charcoal.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[var(--color-ink)]/10 pt-6">
              <div>
                <p className="font-display text-3xl font-medium text-[var(--color-ember)]">12+</p>
                <p className="mt-1 text-xs text-[var(--color-ink)]/50">Years serving Lahore</p>
              </div>
              <div>
                <p className="font-display text-3xl font-medium text-[var(--color-ember)]">40+</p>
                <p className="mt-1 text-xs text-[var(--color-ink)]/50">Signature dishes</p>
              </div>
              <div>
                <p className="font-display text-3xl font-medium text-[var(--color-ember)]">25k+</p>
                <p className="mt-1 text-xs text-[var(--color-ink)]/50">Orders delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-page py-20">
        <h2 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Why guests keep coming back</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {whyChooseUs.map((item) => (
            <div key={item.title} className="border-t-2 border-[var(--color-ember)] pt-5">
              <h3 className="font-display text-lg font-medium text-[var(--color-charcoal)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]/60">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[var(--color-charcoal)] text-[var(--color-cream)]">
        <div className="container-page py-20">
          <h2 className="font-display text-3xl font-medium">What our guests say</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="border border-[var(--color-cream)]/10 p-6">
                <p className="text-sm leading-relaxed text-[var(--color-cream)]/80">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-saffron)]">
                  {t.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Location & hours */}
      <section className="container-page grid gap-10 py-20 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Find us</h2>
          <p className="mt-3 text-sm text-[var(--color-ink)]/70">12 Gulberg Boulevard, Lahore, Pakistan</p>
          <div className="mt-6 h-64 w-full overflow-hidden rounded-sm border border-[var(--color-ink)]/10">
            <iframe
              title="Restaurant location map"
              src="https://www.google.com/maps?q=Gulberg%20Lahore&output=embed"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Opening hours</h2>
          <ul className="mt-6 divide-y divide-[var(--color-ink)]/10 text-sm">
            <li className="flex justify-between py-3"><span>Monday – Thursday</span><span className="font-medium">12:00 – 23:00</span></li>
            <li className="flex justify-between py-3"><span>Friday – Saturday</span><span className="font-medium">12:00 – 00:30</span></li>
            <li className="flex justify-between py-3"><span>Sunday</span><span className="font-medium">13:00 – 22:00</span></li>
          </ul>
          <Link to="/reservation" className="btn-primary mt-8">Reserve a table</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
