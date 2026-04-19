import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpBlur, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';

const APPLE = [0.22, 1, 0.36, 1];

const CATEGORIES = ['all', 'electronics', 'clothing', 'books', 'accessories', 'documents', 'keys', 'bags', 'other'];

const CAT_ICON = {
  electronics: 'smartphone', clothing: 'checkroom', books: 'menu_book',
  accessories: 'watch', documents: 'description', keys: 'key',
  bags: 'backpack', other: 'category',
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const relTime = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(d);
};

const BLANK_FORM = {
  type: 'lost', title: '', category: 'other',
  location: '', description: '', contact: '', imageUrl: '',
};

const ItemModal = ({ item, onClose, onResolve, canResolve }) => {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-surface-container-low rounded-2xl w-full max-w-lg border border-outline-variant/10 shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0, transition: { duration: 0.25, ease: APPLE } }}
        exit={{ scale: 0.95, opacity: 0, y: 10, transition: { duration: 0.18 } }}
        onClick={e => e.stopPropagation()}>

        {item.imageUrl && (
          <div className="h-40 overflow-hidden bg-surface-container">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-80" />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded ${item.type === 'lost' ? 'bg-red-400/10 text-red-400' : 'bg-green-400/10 text-green-400'}`}>
                  {item.type}
                </span>
                {item.status === 'resolved' && (
                  <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-surface-container text-outline">Resolved</span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white">{item.title}</h2>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="space-y-3 mb-5">
            {item.description && (
              <p className="text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {item.location && (
                <div className="p-3 bg-surface-container rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Location</p>
                  <p className="text-xs text-on-surface">{item.location}</p>
                </div>
              )}
              <div className="p-3 bg-surface-container rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Date</p>
                <p className="text-xs text-on-surface">{formatDate(item.date || item.createdAt)}</p>
              </div>
            </div>
            {item.contact && (
              <div className="flex items-center gap-2 p-3 bg-surface-container rounded-xl">
                <span className="material-symbols-outlined text-outline text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>contact_phone</span>
                <p className="text-sm text-on-surface">{item.contact}</p>
              </div>
            )}
            <p className="text-xs text-outline">Posted by {item.postedBy || 'Anonymous'} · {relTime(item.createdAt)}</p>
          </div>

          {canResolve && item.status === 'active' && (
            <button onClick={() => { onResolve(item._id); onClose(); }}
              className="w-full py-2.5 rounded-xl bg-green-400/15 text-green-400 text-sm font-bold hover:bg-green-400/25 transition-colors">
              Mark as Resolved
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ItemCard = ({ item, onClick }) => {
  const icon = CAT_ICON[item.category] || 'category';
  const isLost = item.type === 'lost';

  return (
    <motion.div {...staggerItem}
      whileHover={{ y: -3 }} transition={{ duration: 0.2, ease: APPLE }}
      onClick={() => onClick(item)}
      className={`bg-surface-container-low border rounded-xl overflow-hidden cursor-pointer transition-all group ${item.status === 'resolved' ? 'opacity-50 border-outline-variant/5' : 'border-outline-variant/10 hover:border-outline-variant/30'}`}>

      {item.imageUrl ? (
        <div className="h-32 overflow-hidden bg-surface-container">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80" />
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center bg-surface-container">
          <span className="material-symbols-outlined text-4xl text-outline/20" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded flex-shrink-0 ${isLost ? 'bg-red-400/10 text-red-400' : 'bg-green-400/10 text-green-400'}`}>
            {item.type}
          </span>
          {item.status === 'resolved' && (
            <span className="text-[10px] font-mono text-outline">Resolved</span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-white group-hover:text-white/90 leading-snug mb-1">{item.title}</h3>
        {item.location && (
          <p className="text-[11px] text-outline flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-xs">location_on</span>{item.location}
          </p>
        )}
        <p className="text-[10px] text-outline/60">{relTime(item.createdAt)}</p>
      </div>
    </motion.div>
  );
};

const LostFound = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK_FORM, postedBy: user?.name || '' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    api.get(`/api/lostfound?${params}`)
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, [statusFilter]);

  const filtered = useMemo(() => {
    let list = items;
    if (typeFilter !== 'all') list = list.filter(i => i.type === typeFilter);
    if (catFilter !== 'all') list = list.filter(i => i.category === catFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => i.title?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q) || i.location?.toLowerCase().includes(q));
    }
    return list;
  }, [items, typeFilter, catFilter, search]);

  const lostCount = items.filter(i => i.type === 'lost' && i.status === 'active').length;
  const foundCount = items.filter(i => i.type === 'found' && i.status === 'active').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, userId: user?._id };
      const res = await api.post('/api/lostfound', payload);
      setItems(prev => [res.data, ...prev]);
      showToast({ message: 'Posted successfully!', type: 'success' });
      setShowForm(false);
      setForm({ ...BLANK_FORM, postedBy: user?.name || '' });
    } catch {
      showToast({ message: 'Failed to post. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.patch(`/api/lostfound/${id}/resolve`);
      setItems(prev => prev.map(i => i._id === id ? { ...i, status: 'resolved' } : i));
      showToast({ message: 'Marked as resolved.', type: 'success' });
    } catch {
      showToast({ message: 'Failed to update.', type: 'error' });
    }
  };

  const canResolve = (item) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return item.userId && item.userId === user._id;
  };

  return (
    <>
      <motion.main {...pageTransition} className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto">

        {/* Header */}
        <motion.section {...fadeUpBlur} className="mb-10">
          <div className="max-w-3xl mb-6">
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-outline mb-3">CBIT Kolar — Community</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4 font-satoshi leading-tight">
              Lost something?<br />
              <span className="text-primary">Find it here.</span>
            </h1>
            <p className="text-on-surface-variant text-base max-w-xl leading-relaxed">
              Post lost or found items. Help your fellow students recover what they've lost.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-400/10 border border-red-400/15 rounded-xl">
              <span className="text-lg font-bold text-red-400">{lostCount}</span>
              <span className="text-xs text-on-surface-variant">Active Lost</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/15 rounded-xl">
              <span className="text-lg font-bold text-green-400">{foundCount}</span>
              <span className="text-xs text-on-surface-variant">Found Items</span>
            </div>
          </div>

          {/* MOBILE controls: Post Item + search on top, chips in scrollable row below */}
          <div className="md:hidden space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                <input className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl pl-11 pr-3 py-2.5 text-on-surface text-sm placeholder:text-outline focus:ring-2 focus:ring-primary/40 outline-none"
                  placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button onClick={() => setShowForm(v => !v)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-primary text-black text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
                Post
              </button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[['all', 'All'], ['lost', 'Lost'], ['found', 'Found']].map(([v, l]) => (
                <button key={`t-${v}`} onClick={() => setTypeFilter(v)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${typeFilter === v
                    ? v === 'lost' ? 'bg-red-400/15 text-red-400 border border-red-400/25'
                      : v === 'found' ? 'bg-green-400/15 text-green-400 border border-green-400/25'
                        : 'bg-primary/15 text-primary border border-primary/25'
                    : 'bg-surface-container text-on-surface-variant border border-outline-variant/10'}`}>
                  {l}
                </button>
              ))}
              <div className="w-px bg-outline-variant/20 flex-shrink-0 self-stretch mx-0.5" />
              {[['active', 'Active'], ['resolved', 'Resolved'], ['all', 'All']].map(([v, l]) => (
                <button key={`s-${v}`} onClick={() => setStatusFilter(v)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${statusFilter === v ? 'bg-surface-container-high text-white border border-outline-variant/30' : 'bg-surface-container text-on-surface-variant border border-outline-variant/10'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* DESKTOP controls: existing single-row layout */}
          <div className="hidden md:flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              <input className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl pl-11 pr-3 py-2.5 text-on-surface text-sm placeholder:text-outline focus:ring-2 focus:ring-primary/40 outline-none"
                placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1.5">
              {[['all', 'All'], ['lost', 'Lost'], ['found', 'Found']].map(([v, l]) => (
                <button key={v} onClick={() => setTypeFilter(v)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${typeFilter === v
                    ? v === 'lost' ? 'bg-red-400/15 text-red-400 border border-red-400/25'
                      : v === 'found' ? 'bg-green-400/15 text-green-400 border border-green-400/25'
                        : 'bg-primary/15 text-primary border border-primary/25'
                    : 'bg-surface-container text-on-surface-variant hover:text-white border border-outline-variant/10'}`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {[['active', 'Active'], ['resolved', 'Resolved'], ['all', 'All']].map(([v, l]) => (
                <button key={v} onClick={() => setStatusFilter(v)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${statusFilter === v ? 'bg-surface-container-high text-white border border-outline-variant/30' : 'bg-surface-container text-on-surface-variant hover:text-white border border-outline-variant/10'}`}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={() => setShowForm(v => !v)}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-primary text-black text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
              Post Item
            </button>
          </div>

          {/* Category pills — scrollable on mobile, wrapping on desktop */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 mt-3 md:mt-4 md:flex-wrap" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${catFilter === c ? 'bg-primary/15 text-primary border border-primary/25' : 'bg-surface-container text-on-surface-variant hover:text-white border border-outline-variant/10'}`}>
                {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Post form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8">
              <form onSubmit={handleSubmit} className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6">
                <h2 className="text-base font-bold text-white mb-5">Post a Lost / Found Item</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Type toggle */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-2">Type *</label>
                    <div className="flex gap-2">
                      {['lost', 'found'].map(t => (
                        <button type="button" key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${form.type === t
                            ? t === 'lost' ? 'bg-red-400/15 text-red-400 border border-red-400/25' : 'bg-green-400/15 text-green-400 border border-green-400/25'
                            : 'bg-surface-container text-on-surface-variant border border-outline-variant/10'}`}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-2">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary">
                      {CATEGORIES.filter(c => c !== 'all').map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-1.5">Item Name *</label>
                    <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary"
                      placeholder="e.g. Blue HP Laptop Charger" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-1.5">Where Found / Last Seen</label>
                      <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                        className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Library, Ground Floor" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-1.5">Contact (Phone / Email)</label>
                      <input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                        className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary"
                        placeholder="9876543210 or you@gmail.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-1.5">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={3} className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary resize-none"
                      placeholder="Describe color, brand, distinguishing features..." />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-1.5">Image URL (optional)</label>
                    <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                      className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary"
                      placeholder="https://i.imgur.com/..." />
                  </div>
                  {!user && (
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-1.5">Your Name</label>
                      <input value={form.postedBy} onChange={e => setForm(f => ({ ...f, postedBy: e.target.value }))}
                        className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Anonymous" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-5">
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-2.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60">
                    {submitting ? 'Posting…' : 'Post Item'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 bg-surface-container text-on-surface-variant text-sm font-semibold rounded-xl hover:text-white transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-52 rounded-xl skeleton-shimmer" />)}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-4xl text-outline/30 block mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_off</span>
            <p className="text-on-surface-variant font-medium">Couldn't load items.</p>
            <p className="text-xs text-outline mt-1 mb-5">Check your connection and try again.</p>
            <button onClick={fetchItems}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container border border-outline-variant/20 rounded-xl text-sm text-on-surface-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">refresh</span>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-4xl text-outline/30 block mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>
              {typeFilter === 'lost' ? 'search_off' : 'inventory_2'}
            </span>
            <p className="text-on-surface-variant font-medium">
              {items.length === 0 ? 'No items posted yet.' : 'No items match your filters.'}
            </p>
            <button onClick={() => setShowForm(true)}
              className="mt-4 text-primary text-sm hover:underline">
              Be the first to post →
            </button>
          </div>
        ) : (
          <motion.div {...staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(item => (
              <ItemCard key={item._id} item={item} onClick={setSelectedItem} />
            ))}
          </motion.div>
        )}
      </motion.main>

      <AnimatePresence>
        {selectedItem && (
          <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)}
            onResolve={handleResolve} canResolve={canResolve(selectedItem)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default LostFound;
