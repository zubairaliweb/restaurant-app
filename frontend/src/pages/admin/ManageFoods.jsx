import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { formatPrice } from '../../utils/format';

const emptyForm = { name: '', description: '', price: '', image: '', category: '', isAvailable: true, isFeatured: false };

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [foodsRes, categoriesRes] = await Promise.all([api.get('/foods'), api.get('/categories')]);
      setFoods(foodsRes.data.foods);
      setCategories(categoriesRes.data.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (food) => {
    setEditingId(food._id);
    setForm({
      name: food.name,
      description: food.description,
      price: food.price,
      image: food.image,
      category: food.category?._id || '',
      isAvailable: food.isAvailable,
      isFeatured: food.isFeatured,
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await api.put(`/foods/${editingId}`, payload);
      } else {
        await api.post('/foods', payload);
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await api.delete(`/foods/${id}`);
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Manage Food Items</h1>
        <button onClick={openCreate} className="btn-primary">+ Add Food Item</button>
      </div>

      {error && <p className="mt-4 text-sm text-[var(--color-ember)]">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 border border-[var(--color-ink)]/10 p-6 md:grid-cols-2">
          <div>
            <label className="label-field">Name</label>
            <input name="name" required value={form.name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">Price (PKR)</label>
            <input name="price" type="number" min="0" required value={form.price} onChange={handleChange} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="label-field">Description</label>
            <textarea name="description" required rows={2} value={form.description} onChange={handleChange} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="label-field">Image URL</label>
            <input name="image" required value={form.image} onChange={handleChange} className="input-field" placeholder="https://..." />
          </div>
          <div>
            <label className="label-field">Category</label>
            <select name="category" required value={form.category} onChange={handleChange} className="input-field">
              <option value="">Select category</option>
              {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} className="accent-[var(--color-ember)]" />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="accent-[var(--color-ember)]" />
              Featured
            </label>
          </div>
          <div className="flex gap-3 md:col-span-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : editingId ? 'Update Item' : 'Create Item'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto border border-[var(--color-ink)]/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-cream-dim)] text-xs uppercase tracking-wider text-[var(--color-ink)]/50">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ink)]/10">
            {foods.map((food) => (
              <tr key={food._id}>
                <td className="flex items-center gap-3 px-4 py-3">
                  <img src={food.image} alt={food.name} className="h-10 w-10 rounded object-cover" />
                  {food.name}
                </td>
                <td className="px-4 py-3">{food.category?.name}</td>
                <td className="px-4 py-3">{formatPrice(food.price)}</td>
                <td className="px-4 py-3">{food.isAvailable ? 'Available' : 'Sold out'}{food.isFeatured ? ' · Featured' : ''}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openEdit(food)} className="mr-3 font-semibold text-[var(--color-ember)]">Edit</button>
                  <button onClick={() => handleDelete(food._id)} className="font-semibold text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {foods.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-[var(--color-ink)]/40">No food items yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFoods;
