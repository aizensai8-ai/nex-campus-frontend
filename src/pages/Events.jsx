import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpBlur, staggerContainer, staggerItem, pageTransition } from '../lib/animations';

const APPLE = [0.22, 1, 0.36, 1];

const SpotlightCard = ({ children, className = '', ...rest }) => {
  const [spot, setSpot] = useState(null);
  const ref = useRef(null);
  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setSpot({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setSpot(null)}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-0"
        style={{
          opacity: spot ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: spot
            ? `radial-gradient(300px circle at ${spot.x}px ${spot.y}px, rgba(59,130,246,0.08), transparent 70%)`
            : 'none',
        }}
      />
      {children}
    </motion.div>
  );
};
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SkeletonRow = () => (
  <div className="grid grid-cols-1 md:grid-cols-12 items-center bg-surface-container-low py-8 rounded-xl px-4 overflow-hidden">
    <div className="md:col-span-2 flex flex-col md:items-center mb-4 md:mb-0 gap-2">
      <div className="h-3 w-12 skeleton-shimmer rounded-lg"></div>
      <div className="h-5 w-16 skeleton-shimmer rounded-lg"></div>
    </div>
    <div className="md:col-span-6 space-y-2">
      <div className="h-5 w-2/3 skeleton-shimmer rounded-lg"></div>
      <div className="h-3 w-1/2 skeleton-shimmer rounded-lg"></div>
    </div>
    <div className="md:col-span-2">
      <div className="h-3 w-20 skeleton-shimmer rounded-lg"></div>
    </div>
    <div className="md:col-span-2 flex md:justify-end">
      <div className="h-8 w-24 skeleton-shimmer rounded-lg"></div>
    </div>
  </div>
);

// ── Register Modal ────────────────────────────────────────────────────────────
function RegisterModal({ event, user, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!user) return;
    setError('');
    setLoading(true);
    try {
      await api.post(`/api/events/${event._id}/register`);
      onSuccess(event._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative bg-surface-container-low rounded-2xl p-6 w-full max-w-md shadow-2xl ring-1 ring-outline-variant/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Register for Event</h3>
          <button onClick={onClose} className="text-outline hover:text-white transition-colors p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="bg-surface-container-highest rounded-xl p-4 mb-5">
          <p className="text-xs font-mono text-outline uppercase tracking-widest mb-1">Event</p>
          <p className="text-white font-semibold">{event.title}</p>
          {event.date && (
            <p className="text-on-surface-variant text-sm mt-1">
              {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
              {event.time && ` · ${event.time}`}
            </p>
          )}
          {event.location && (
            <p className="text-on-surface-variant text-xs mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {event.location}
            </p>
          )}
        </div>

        {user ? (
          <>
            <div className="space-y-3 mb-5">
              <div>
                <p className="text-xs font-mono text-outline uppercase tracking-widest mb-1">Registering as</p>
                <p className="text-white font-semibold text-sm">{user.name}</p>
                <p className="text-on-surface-variant text-xs">{user.email}</p>
              </div>
              {user.usn && (
                <div>
                  <p className="text-xs font-mono text-outline uppercase tracking-widest mb-1">USN</p>
                  <p className="text-white font-mono text-sm bg-surface-container-highest px-3 py-1.5 rounded-lg inline-block">{user.usn}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/30 text-red-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg hover:bg-primary-fixed-dim transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Registering…</>
              ) : (
                <><span className="material-symbols-outlined text-sm">how_to_reg</span>Confirm Registration</>
              )}
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <span className="material-symbols-outlined text-4xl text-outline mb-3 block">lock</span>
            <p className="text-on-surface-variant text-sm mb-4">You must be logged in to register for events.</p>
            <a href="/login" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold hover:bg-primary-fixed-dim transition-all text-sm inline-block">
              Log In
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const Events = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [registerModal, setRegisterModal] = useState(null);
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    api.get('/api/events')
      .then((res) => setEvents(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load events. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const featured = events[0];
  const rest = events.slice(1);

  const isRegistered = (id) => registeredIds.has(id);

  const handleSuccess = (eventId) => {
    setRegisteredIds((prev) => new Set([...prev, eventId]));
    setSuccessId(eventId);
    setRegisterModal(null);
    setTimeout(() => setSuccessId(null), 3000);
    showToast({ message: 'Registered successfully! See you there.', type: 'success' });
  };

  const canRegister = (event) => event.status !== 'past' && event.status !== 'cancelled';

  return (
    <motion.main
      {...pageTransition}
      className="pt-24 pb-20 max-w-[1440px] mx-auto px-6"
    >
      <motion.section {...fadeUpBlur} className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4 font-satoshi">Campus Events</h1>
            <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
              Precision-scheduled symposia, hackathons, and cultural exchanges. The intelligence of our campus, live and in person.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-sm border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Live Feed Active
          </div>
        </div>
      </motion.section>

      {error && (
        <div className="mb-8 p-4 rounded-md bg-error/10 border border-error/30 text-sm text-red-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid grid-cols-1 md:grid-cols-12 gap-px bg-outline-variant/15 border border-outline-variant/15 rounded-xl overflow-hidden"
      >
        {/* Timeline Sidebar */}
        <div className="hidden md:block md:col-span-1 bg-surface-container-lowest py-8 text-center border-r border-outline-variant/15">
          <div className="sticky top-28 space-y-12">
            {events.slice(0, 3).map((ev, i) => {
              const d = ev.date ? new Date(ev.date) : null;
              return (
                <div key={i} className={`flex flex-col items-center ${i > 0 ? 'opacity-40' : ''}`}>
                  <span className="font-mono text-xs text-outline mb-2">
                    {d ? d.toLocaleString('en', { month: 'short' }).toUpperCase() : '—'}
                  </span>
                  <span className="text-2xl font-bold text-white">{d ? d.getDate() : '—'}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-11 bg-surface-container-low p-8 md:p-12">
          {/* Featured Event */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <div className="rounded-xl skeleton-shimmer aspect-[4/3]"></div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="h-3 w-24 skeleton-shimmer rounded-lg"></div>
                <div className="h-8 w-3/4 skeleton-shimmer rounded-lg"></div>
                <div className="h-4 w-full skeleton-shimmer rounded-lg"></div>
                <div className="h-4 w-2/3 skeleton-shimmer rounded-lg"></div>
              </div>
            </div>
          ) : featured ? (
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
            >
              <div className="relative group cursor-pointer overflow-hidden rounded-xl aspect-[4/3] lg:aspect-auto bg-surface-container-high flex items-center justify-center">
                {featured.image ? (
                  <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-in-out" src={featured.image} alt={featured.title} />
                ) : (
                  <span className="material-symbols-outlined text-outline/30 text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>event</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-2 py-1 bg-primary text-on-primary text-[10px] font-mono font-bold uppercase tracking-tighter rounded-sm mb-3">Featured Event</span>
                  <h2 className="text-3xl font-bold tracking-tighter text-white">{featured.title}</h2>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-xs text-primary uppercase tracking-widest">
                    {featured.date ? new Date(featured.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                  </span>
                  <h3 className="text-4xl font-bold tracking-tighter text-white font-satoshi">{featured.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{featured.description}</p>
                </div>
                <div className="flex items-center gap-6 font-mono text-xs text-outline">
                  {featured.location && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {featured.location}
                    </div>
                  )}
                  {featured.time && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {featured.time}
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  {isRegistered(featured._id) ? (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-400 font-bold rounded-lg text-sm">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Registered
                    </div>
                  ) : canRegister(featured) ? (
                    <button
                      onClick={() => setRegisterModal(featured)}
                      className="px-8 py-3 bg-primary text-on-primary font-bold tracking-tighter hover:bg-white hover:text-background hover:scale-[1.02] transition-all duration-200"
                    >
                      Register Seat
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-outline uppercase tracking-widest px-4 py-2 bg-surface-container-high border border-outline-variant/20 rounded-sm inline-block">
                      {featured.status === 'past' ? 'Event Ended' : 'Cancelled'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Event List */}
          <motion.div {...staggerContainer} className="space-y-px bg-outline-variant/15">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            ) : rest.map((event) => {
              const d = event.date ? new Date(event.date) : null;
              const registered = isRegistered(event._id);
              return (
                <motion.div
                  key={event._id ?? event.title}
                  {...staggerItem}
                  className="group grid grid-cols-1 md:grid-cols-12 items-center bg-surface-container-low py-8 md:px-0 hover:bg-surface-container-high cursor-pointer transition-colors duration-200"
                >
                  <div className="md:col-span-2 flex flex-col md:items-center mb-4 md:mb-0">
                    <span className="font-mono text-xs text-outline uppercase">
                      {d ? d.toLocaleDateString('en-US', { month: 'short' }) : ''}
                    </span>
                    <span className="text-xl font-bold text-white">{d ? d.getDate() : ''}</span>
                  </div>
                  <div className="md:col-span-6 space-y-1">
                    <h4 className="text-xl font-semibold tracking-tight text-on-surface group-hover:text-primary transition-colors">{event.title}</h4>
                    <p className="text-sm text-on-surface-variant font-mono">{event.category}</p>
                  </div>
                  <div className="md:col-span-2 text-sm text-outline flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">sensors</span>
                    {event.location}
                  </div>
                  <div className="md:col-span-2 flex md:justify-end mt-4 md:mt-0">
                    {registered ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-green-400 uppercase tracking-widest px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-sm">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Registered
                      </span>
                    ) : event.status === 'waitlist' ? (
                      <span className="text-[10px] font-mono text-secondary uppercase tracking-widest px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-sm">Waitlist Only</span>
                    ) : canRegister(event) ? (
                      <button
                        onClick={() => setRegisterModal(event)}
                        className="text-xs font-mono font-bold uppercase tracking-widest border border-outline-variant/30 px-4 py-2 hover:border-primary hover:text-primary transition-all duration-200"
                      >
                        Register Seat
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-outline uppercase tracking-widest px-3 py-1 bg-surface-container-high border border-outline-variant/10 rounded-sm">
                        {event.status === 'past' ? 'Ended' : event.status}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Secondary Bento Grid */}
      <motion.section {...staggerContainer} className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "calendar_month", title: "Sync Calendar", desc: "Integrate Nex Campus events directly into your personal workflow via iCal or Google Calendar.", link: "Get Sync Link →" },
          { icon: "campaign", title: "Host an Event", desc: "Propose your own technical seminar or workshop. Review current guidelines for venue booking.", link: "Submit Proposal →" },
          { icon: "history", title: "Past Recordings", desc: "Missed a session? Access the full archive of recorded keynotes and seminar papers.", link: "Archive Access →" },
        ].map((card) => (
          <SpotlightCard
            key={card.title}
            {...staggerItem}
            whileHover={{ y: -6, scale: 1.01, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}
            transition={{ duration: 0.3, ease: APPLE }}
            className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 hover:border-primary/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: '32px' }}>{card.icon}</span>
            <h5 className="text-lg font-bold text-white mb-2">{card.title}</h5>
            <p className="text-sm text-on-surface-variant mb-6">{card.desc}</p>
            <a className="text-xs font-mono text-primary uppercase tracking-widest hover:underline" href="#">{card.link}</a>
          </SpotlightCard>
        ))}
      </motion.section>

      {/* Register Modal */}
      <AnimatePresence>
        {registerModal && (
          <RegisterModal
            event={registerModal}
            user={user}
            onClose={() => setRegisterModal(null)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default Events;
