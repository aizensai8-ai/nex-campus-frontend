import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, fadeUpBlur, staggerContainer, staggerItem } from '../lib/animations';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const APPLE = [0.22, 1, 0.36, 1];

const CATEGORIES = [
  { value: 'portal',     label: 'Portal / Login' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'library',    label: 'Library' },
  { value: 'facility',   label: 'Facility / Lab' },
  { value: 'academics',  label: 'Academics' },
  { value: 'technical',  label: 'Technical / Bug' },
  { value: 'other',      label: 'Other' },
];

const PRIORITIES = [
  { value: 'low',      label: 'Low',      color: 'text-outline',     bg: 'bg-surface-container' },
  { value: 'normal',   label: 'Normal',   color: 'text-primary',     bg: 'bg-primary/10' },
  { value: 'high',     label: 'High',     color: 'text-yellow-400',  bg: 'bg-yellow-400/10' },
  { value: 'critical', label: 'Critical', color: 'text-red-400',     bg: 'bg-red-400/10' },
];

const STATUS_META = {
  'open':        { label: 'Open',        color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: 'pending' },
  'in-progress': { label: 'In Progress', color: 'text-blue-400',   bg: 'bg-blue-400/10',   icon: 'autorenew' },
  'resolved':    { label: 'Resolved',    color: 'text-green-400',  bg: 'bg-green-400/10',  icon: 'check_circle' },
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const relTime = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const TicketTimeline = ({ ticket }) => {
  const status = ticket.status || 'open';
  const steps = [
    { key: 'open',        label: 'Submitted',    desc: 'Your ticket has been received.', date: ticket.createdAt },
    { key: 'in-progress', label: 'Under Review',  desc: ticket.adminReply || 'The admin team is reviewing your request.', date: status === 'in-progress' || status === 'resolved' ? ticket.updatedAt : null },
    { key: 'resolved',    label: 'Resolved',      desc: 'Your issue has been resolved.', date: status === 'resolved' ? ticket.updatedAt : null },
  ];

  const activeIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="relative pl-6 space-y-4">
      <div className="absolute left-2.5 top-2 bottom-2 w-px bg-outline-variant/15" />
      {steps.map((step, i) => {
        const done = i <= activeIndex;
        return (
          <div key={step.key} className="relative flex items-start gap-3">
            <div className={`absolute -left-6 w-2.5 h-2.5 rounded-full border-2 mt-0.5 ${done ? 'bg-primary border-primary/50' : 'bg-surface-container border-outline-variant/30'}`} />
            <div className={`flex-1 ${done ? '' : 'opacity-40'}`}>
              <p className={`text-xs font-semibold ${done ? 'text-white' : 'text-on-surface-variant'}`}>{step.label}</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">{step.desc}</p>
              {step.date && <p className="text-[10px] text-outline mt-1">{formatDate(step.date)}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TicketCard = ({ ticket, expanded, onToggle }) => {
  const statusMeta = STATUS_META[ticket.status] || STATUS_META.open;
  const priorityMeta = PRIORITIES.find(p => p.value === ticket.priority) || PRIORITIES[1];
  const catLabel = CATEGORIES.find(c => c.value === ticket.category)?.label || 'Other';

  return (
    <div className={`border rounded-xl transition-all ${expanded ? 'border-outline-variant/30 bg-surface-container-low' : 'border-outline-variant/10 bg-surface-container-low hover:border-outline-variant/20'}`}>
      {/* Header row — always visible */}
      <button onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left">
        <div className={`w-9 h-9 rounded-xl ${statusMeta.bg} flex items-center justify-center flex-shrink-0`}>
          <span className={`material-symbols-outlined text-lg ${statusMeta.color}`}
            style={{ fontVariationSettings: "'FILL' 1" }}>{statusMeta.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{ticket.message.slice(0, 60)}{ticket.message.length > 60 ? '…' : ''}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] font-mono text-outline">{catLabel}</span>
            <span className={`text-[10px] font-semibold ${priorityMeta.color}`}>{priorityMeta.label} priority</span>
            <span className="text-[10px] text-outline">{relTime(ticket.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${statusMeta.bg} ${statusMeta.color}`}>
            {statusMeta.label}
          </span>
          <span className={`material-symbols-outlined text-outline text-lg transition-transform ${expanded ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-outline-variant/10">
            <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Message */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Your Message</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{ticket.message}</p>

                {ticket.adminReply && (
                  <div className="mt-4 p-3 bg-primary/5 border border-primary/15 rounded-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1.5">Admin Reply</p>
                    <p className="text-sm text-on-surface leading-relaxed">{ticket.adminReply}</p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-outline">
                  <span>Submitted: {formatDate(ticket.createdAt)}</span>
                  {ticket.usn && <span>USN: {ticket.usn.toUpperCase()}</span>}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-3">Progress</p>
                <TicketTimeline ticket={ticket} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Support = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('submit');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    usn: user?.usn || '',
    message: '',
    category: 'other',
    priority: 'normal',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [ticketFilter, setTicketFilter] = useState('all');

  // Keep form name/email in sync with user
  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: f.name || user.name, email: f.email || user.email, usn: f.usn || user.usn || '' }));
  }, [user]);

  useEffect(() => {
    if (activeTab === 'tickets' && user) {
      setTicketsLoading(true);
      api.get('/api/support/my')
        .then(res => setTickets(Array.isArray(res.data) ? res.data : []))
        .catch(() => {})
        .finally(() => setTicketsLoading(false));
    }
  }, [activeTab, user]);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/support', { ...form, userId: user?._id });
      showToast({ message: 'Query submitted! We\'ll get back to you soon.', type: 'success' });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = ticketFilter === 'all' ? tickets : tickets.filter(t => t.status === ticketFilter);

  return (
    <motion.main {...pageTransition} className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto">

      {/* Header */}
      <motion.section {...fadeUpBlur} className="mb-10 max-w-3xl">
        <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-outline mb-3">CBIT Kolar — Help</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4 font-satoshi leading-tight">
          Support<br /><span className="text-primary">Center.</span>
        </h1>
        <p className="text-on-surface-variant text-base leading-relaxed max-w-xl">
          Submit a query or track the status of your previous requests.
        </p>
      </motion.section>

      {/* Tab toggle */}
      <div className="flex gap-1 mb-8 bg-surface-container rounded-xl p-1 w-fit">
        <button onClick={() => setActiveTab('submit')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'submit' ? 'bg-surface-container-high text-white' : 'text-on-surface-variant hover:text-white'}`}>
          Submit Query
        </button>
        <button onClick={() => setActiveTab('tickets')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'tickets' ? 'bg-surface-container-high text-white' : 'text-on-surface-variant hover:text-white'}`}>
          My Tickets
          {tickets.length > 0 && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">{tickets.length}</span>}
        </button>
      </div>

      {activeTab === 'submit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Form */}
          <motion.div {...fadeUpBlur} transition={{ delay: 0.05 }} className="lg:col-span-7">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-surface-container-low rounded-2xl p-12 text-center border border-outline-variant/10">
                <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5">
                  <span className="material-symbols-outlined text-green-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Query Submitted</h2>
                <p className="text-on-surface-variant text-sm mb-6">
                  Ticket received. The admin team reviews requests Mon–Sat within 24 hours.
                </p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => { setSubmitted(false); setForm(f => ({ ...f, message: '', phone: '', category: 'other', priority: 'normal' })); }}
                    className="text-primary hover:underline text-sm font-semibold">Submit another</button>
                  {user && (
                    <button onClick={() => setActiveTab('tickets')}
                      className="text-on-surface-variant hover:text-white text-sm transition-colors">View my tickets →</button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-surface-container-low rounded-2xl p-7 border border-outline-variant/10">
                <h2 className="text-lg font-bold text-white mb-6">Send a Message</h2>

                {error && (
                  <div className="mb-5 p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>{error}
                  </div>
                )}

                <form className="space-y-4" onSubmit={submit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-outline block mb-1.5">Full Name *</label>
                      <input name="name" value={form.name} onChange={handle} required
                        className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg py-2.5 px-4 text-on-surface text-sm placeholder:text-outline focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-outline block mb-1.5">Email *</label>
                      <input name="email" value={form.email} onChange={handle} required type="email"
                        className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg py-2.5 px-4 text-on-surface text-sm placeholder:text-outline focus:ring-1 focus:ring-primary outline-none"
                        placeholder="you@gmail.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-outline block mb-1.5">Phone</label>
                      <input name="phone" value={form.phone} onChange={handle} type="tel"
                        className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg py-2.5 px-4 text-on-surface text-sm placeholder:text-outline focus:ring-1 focus:ring-primary outline-none"
                        placeholder="+91 9876543210" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-outline block mb-1.5">USN</label>
                      <input name="usn" value={form.usn}
                        onChange={e => setForm(f => ({ ...f, usn: e.target.value.toLowerCase() }))}
                        className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg py-2.5 px-4 text-on-surface text-sm placeholder:text-outline font-mono focus:ring-1 focus:ring-primary outline-none"
                        placeholder="1ck24cs001" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-outline block mb-1.5">Category</label>
                      <select name="category" value={form.category} onChange={handle}
                        className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg py-2.5 px-4 text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary">
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-outline block mb-1.5">Priority</label>
                      <select name="priority" value={form.priority} onChange={handle}
                        className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg py-2.5 px-4 text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary">
                        {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-outline block mb-1.5">Message *</label>
                    <textarea name="message" value={form.message} onChange={handle} required rows={5}
                      className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg py-2.5 px-4 text-on-surface text-sm placeholder:text-outline focus:ring-1 focus:ring-primary outline-none resize-none"
                      placeholder="Describe your issue in detail..." />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-primary text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60">
                    {loading
                      ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting…</>
                      : <><span className="material-symbols-outlined text-sm">send</span>Submit Query</>}
                  </button>
                </form>
              </div>
            )}
          </motion.div>

          {/* Sidebar info */}
          <motion.div {...staggerContainer} className="lg:col-span-5 space-y-3">
            {[
              { icon: 'person', color: 'text-primary', bg: 'bg-primary/10', title: 'Student Support', desc: 'Portal access, attendance tracker, or course enrollment.' },
              { icon: 'admin_panel_settings', color: 'text-secondary', bg: 'bg-secondary/10', title: 'Admin & Faculty', desc: 'Admin panel, data updates, or system access questions.' },
              { icon: 'domain', color: 'text-tertiary', bg: 'bg-tertiary/10', title: 'Facility Queries', desc: 'Lab bookings, canteen, or campus services.' },
              { icon: 'bug_report', color: 'text-green-400', bg: 'bg-green-500/10', title: 'Bug Reports', desc: 'Found an issue? Report it and we\'ll fix it promptly.' },
            ].map(item => (
              <motion.div key={item.title} {...staggerItem}
                className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 flex items-start gap-3">
                <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined ${item.color} text-lg`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10">
              <p className="text-xs font-mono text-outline uppercase tracking-widest mb-2">Response Time</p>
              <p className="text-white font-semibold text-sm">Within 24 hours</p>
              <p className="text-on-surface-variant text-xs mt-1">Mon – Sat, 9:00 AM – 5:00 PM</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* My Tickets tab */}
      {activeTab === 'tickets' && (
        <motion.div {...fadeUpBlur}>
          {!user ? (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-4xl text-outline/30 block mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <p className="text-on-surface-variant font-medium">Sign in to see your tickets.</p>
              <a href="/login" className="mt-3 inline-block text-primary text-sm hover:underline">Sign in →</a>
            </div>
          ) : (
            <>
              {/* Filter pills */}
              <div className="flex gap-2 mb-6">
                {['all', 'open', 'in-progress', 'resolved'].map(s => {
                  const meta = s === 'all' ? null : STATUS_META[s];
                  return (
                    <button key={s} onClick={() => setTicketFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${ticketFilter === s
                        ? `${meta?.bg || 'bg-primary/15'} ${meta?.color || 'text-primary'} ${meta ? 'border-transparent' : 'border-primary/25'}`
                        : 'bg-surface-container text-on-surface-variant hover:text-white border-outline-variant/10'}`}>
                      {s === 'all' ? 'All' : STATUS_META[s].label}
                    </button>
                  );
                })}
              </div>

              {ticketsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl skeleton-shimmer" />)}
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="py-16 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline/30 block mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>inbox</span>
                  <p className="text-on-surface-variant font-medium">
                    {tickets.length === 0 ? 'You haven\'t submitted any tickets yet.' : 'No tickets with this status.'}
                  </p>
                  {tickets.length === 0 && (
                    <button onClick={() => setActiveTab('submit')}
                      className="mt-3 text-primary text-sm hover:underline">Submit your first query →</button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTickets.map(ticket => (
                    <TicketCard key={ticket._id} ticket={ticket}
                      expanded={expandedId === ticket._id}
                      onToggle={() => setExpandedId(v => v === ticket._id ? null : ticket._id)} />
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </motion.main>
  );
};

export default Support;
