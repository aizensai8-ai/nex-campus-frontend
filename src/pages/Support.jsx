import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeUp, staggerContainer, staggerItem } from '../lib/animations';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Support = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    usn: user?.usn || '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/support', form);
      showToast({ message: 'Message sent! We\'ll get back to you soon.', type: 'success' });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main {...pageTransition} className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto">

      {/* Header */}
      <motion.section {...fadeUp} className="mb-16 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4 font-satoshi">
          Support Center
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Need help with your account, portal access, or campus services? Send us a message and we'll get back to you.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Contact Form */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-low rounded-2xl p-12 text-center ghost-border"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Query Submitted!</h2>
              <p className="text-on-surface-variant mb-6">
                Your support request has been received. The admin team will review it and respond shortly.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: user?.name || '', email: user?.email || '', phone: '', usn: user?.usn || '', message: '' }); }}
                className="text-primary hover:underline text-sm font-semibold"
              >
                Submit another query
              </button>
            </motion.div>
          ) : (
            <div className="bg-surface-container-low rounded-2xl p-8 ghost-border">
              <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>

              {error && (
                <div className="mb-5 p-4 rounded-xl bg-error/10 border border-error/30 text-red-400 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={submit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-widest text-outline">Full Name *</label>
                    <input
                      name="name" value={form.name} onChange={handle} required
                      className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-widest text-outline">Gmail Address *</label>
                    <input
                      name="email" value={form.email} onChange={handle} required type="email"
                      className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="you@gmail.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-widest text-outline">Phone Number</label>
                    <input
                      name="phone" value={form.phone} onChange={handle} type="tel"
                      className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-widest text-outline">USN</label>
                    <input
                      name="usn" value={form.usn}
                      onChange={(e) => setForm((f) => ({ ...f, usn: e.target.value.toLowerCase() }))}
                      className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline font-mono focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="1ck24cs001"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-outline">Query / Message *</label>
                  <textarea
                    name="message" value={form.message} onChange={handle} required
                    rows={5}
                    className="w-full bg-surface-container-highest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Describe your issue or query in detail..."
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-all active:scale-[0.99] disabled:opacity-60"
                >
                  {loading ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting…</>
                  ) : (
                    <><span className="material-symbols-outlined text-sm">send</span>Submit Query</>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>

        {/* Side Info */}
        <motion.div
          {...staggerContainer}
          className="lg:col-span-5 space-y-4"
        >
          {[
            {
              icon: 'person',
              color: 'text-primary',
              bg: 'bg-primary/10',
              title: 'Student Support',
              desc: 'Issues with portal access, attendance tracker, or course enrollment.',
            },
            {
              icon: 'admin_panel_settings',
              color: 'text-secondary',
              bg: 'bg-secondary/10',
              title: 'Admin & Faculty',
              desc: 'Questions about admin panel, data updates, or system access.',
            },
            {
              icon: 'domain',
              color: 'text-tertiary',
              bg: 'bg-tertiary/10',
              title: 'Facility Queries',
              desc: 'Issues with bookings, lab access, or canteen service.',
            },
            {
              icon: 'bug_report',
              color: 'text-green-400',
              bg: 'bg-green-500/10',
              title: 'Bug Reports',
              desc: 'Found an issue? Report it here and we\'ll fix it promptly.',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              {...staggerItem}
              className="bg-surface-container-low rounded-xl p-5 ghost-border flex items-start gap-4"
            >
              <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <span className={`material-symbols-outlined ${item.color} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{item.title}</p>
                <p className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}

          <div className="bg-surface-container-low rounded-xl p-5 ghost-border">
            <p className="text-xs font-mono text-outline uppercase tracking-widest mb-3">Response Time</p>
            <p className="text-white font-semibold">Typically within 24 hours</p>
            <p className="text-on-surface-variant text-xs mt-1">Mon – Sat, 9:00 AM – 5:00 PM</p>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default Support;
