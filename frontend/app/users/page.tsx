'use client'
import { useEffect, useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Shield, User as UserIcon, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { api, type User } from '@/lib/api';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />;
}

const roleStyle: Record<string, string> = {
  admin:         'bg-blue-50 text-blue-700 border-blue-100',
  dwo:           'bg-blue-50 text-blue-700 border-blue-100',
  block_manager: 'bg-slate-100 text-slate-700 border-slate-200',
  operator:      'bg-orange-50 text-orange-700 border-orange-100',
  viewer:        'bg-slate-100 text-slate-500 border-slate-200',
};

const roleLabel: Record<string, string> = {
  admin: 'Admin', dwo: 'DWO', block_manager: 'Block Manager', operator: 'Operator', viewer: 'Viewer',
};

function timeAgo(dateStr: string | null) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 2)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function UsersPage() {
  const [users,    setUsers]    = useState<User[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [showAdd,  setShowAdd]  = useState(false);
  const [adding,   setAdding]   = useState(false);

  // Add User form state
  const [form, setForm] = useState({ name: '', email: '', role: 'viewer', region: '', phone: '' });
  const [formErr, setFormErr] = useState('');

  async function load(p = page) {
    setLoading(true);
    try {
      const res = await api.users.list(p, 10);
      setUsers(res.users);
      setTotal(res.total);
      setPages(res.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(page); }, [page]);

  async function handleAddUser() {
    if (!form.name || !form.email) { setFormErr('Name and email are required.'); return; }
    setAdding(true); setFormErr('');
    try {
      await api.users.create({ name: form.name, email: form.email, role: form.role as User['role'], region: form.region || null, phone: form.phone || null });
      setShowAdd(false);
      setForm({ name: '', email: '', role: 'viewer', region: '', phone: '' });
      load(1);
    } catch (e: unknown) {
      setFormErr(e instanceof Error ? e.message : 'Error adding user.');
    } finally { setAdding(false); }
  }

  const filtered = search
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div className="flex flex-col h-full pb-8">
      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add New User</h3>
            {formErr && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg mb-4">{formErr}</p>}
            <div className="space-y-3">
              {(['name', 'email', 'region', 'phone'] as const).map(field => (
                <div key={field}>
                  <label className="block text-xs font-medium text-slate-500 mb-1 capitalize">{field}{field === 'name' || field === 'email' ? ' *' : ''}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    value={form[field] as string}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    placeholder={field === 'name' ? 'Rajesh Patil' : field === 'email' ? 'r.patil@gov.in' : ''}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Role *</label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                >
                  {Object.entries(roleLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button
                disabled={adding}
                onClick={handleAddUser}
                className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <div className="relative w-72">
            <span className="absolute left-3 top-2.5 text-slate-400"><Search className="w-4 h-4" /></span>
            <input
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 shadow-sm"
              placeholder="Search users by name or role..."
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => load(page)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 shadow-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button
            onClick={() => { setShowAdd(true); setFormErr(''); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Jurisdiction</th>
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Active</th>
                <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5, 6].map(j => (
                      <td key={j} className="py-4 px-6">
                        <Skeleton className="h-5 rounded-md" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-slate-400">No users found.</td>
                </tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                        {initials(u.name)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${roleStyle[u.role] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {u.role === 'admin' || u.role === 'dwo' ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {u.region ? (
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" /> {u.region}
                      </div>
                    ) : <span className="text-sm text-slate-400">—</span>}
                  </td>
                  <td className="py-4 px-6">
                    {u.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">{timeAgo(u.last_active)}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-500 font-medium">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} users
          </p>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page >= pages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
