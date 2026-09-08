import { useEffect, useState } from 'react';
import api from '../api/axios';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.categories);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadFoods = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'all') params.category = activeCategory;
        if (search.trim()) params.search = search.trim();
        const { data } = await api.get('/foods', { params });
        setFoods(data.foods);
      } catch {
        setFoods([]);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(loadFoods, 300);
    return () => clearTimeout(timeout);
  }, [activeCategory, search]);

  return (
    <div className="container-page py-14">
      <div className="mb-10 max-w-xl">
        <h1 className="font-display text-4xl font-medium text-[var(--color-charcoal)]">Our Menu</h1>
        <p className="mt-3 text-sm text-[var(--color-ink)]/60">
          From wood-fired pizza to slow-cooked Pakistani classics — browse by category or search for
          something specific.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
              activeCategory === 'all'
                ? 'border-[var(--color-ember)] bg-[var(--color-ember)] text-white'
                : 'border-[var(--color-ink)]/15 text-[var(--color-ink)]/70 hover:border-[var(--color-ember)]'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                activeCategory === cat._id
                  ? 'border-[var(--color-ember)] bg-[var(--color-ember)] text-white'
                  : 'border-[var(--color-ink)]/15 text-[var(--color-ink)]/70 hover:border-[var(--color-ember)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="input-field"
          />
        </div>
      </div>

      {loading ? (
        <Loader label="Loading the menu..." />
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-[var(--color-ink)]/20 py-20 text-center">
          <p className="text-sm text-[var(--color-ink)]/50">No dishes match your search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
