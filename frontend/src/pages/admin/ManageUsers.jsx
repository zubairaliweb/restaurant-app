import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this user account?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-[var(--color-charcoal)]">Registered Users</h1>
      {error && <p className="mt-4 text-sm text-[var(--color-ember)]">{error}</p>}

      <div className="mt-6 overflow-x-auto border border-[var(--color-ink)]/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-cream-dim)] text-xs uppercase tracking-wider text-[var(--color-ink)]/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ink)]/10">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]/50">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {u.role !== 'admin' && (
                    <button onClick={() => handleDelete(u._id)} className="font-semibold text-red-600">Remove</button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-[var(--color-ink)]/40">No users yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
