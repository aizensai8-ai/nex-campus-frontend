import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import api from '../lib/api';

// Cycle through these gradients for cards without images
const CARD_GRADIENTS = [
  'from-blue-900/70 to-indigo-900/40',
  'from-emerald-900/70 to-teal-900/40',
  'from-purple-900/70 to-violet-900/40',
  'from-amber-900/70 to-orange-900/40',
  'from-rose-900/70 to-pink-900/40',
  'from-cyan-900/70 to-sky-900/40',
  'from-lime-900/70 to-green-900/40',
  'from-fuchsia-900/70 to-purple-900/40',
];
const cardGradient = (idx) => CARD_GRADIENTS[idx % CARD_GRADIENTS.length];

const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-surface-container-low rounded-xl border border-outline-variant/5 p-6 animate-pulse ${className}`}>
    <div className="h-32 bg-surface-container-high rounded-lg mb-4"></div>
    <div className="h-5 w-2/3 bg-surface-container-high rounded mb-2"></div>
    <div className="h-3 w-1/3 bg-surface-container-high rounded mb-3"></div>
    <div className="h-3 w-full bg-surface-container-high rounded"></div>
  </div>
);

const CanteenMenu = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-4 pt-4 border-t border-outline-variant/10">
      <p className="text-[10px] font-berkeley-mono text-outline uppercase tracking-widest mb-3">Menu</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{item.name}</p>
              {item.description && <p className="text-xs text-on-surface-variant">{item.description}</p>}
            </div>
            <span className="text-sm font-bold text-primary flex-shrink-0">₹{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/facilities')
      .then((res) => setFacilities(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load facilities. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const featured   = facilities[0];
  const secondary  = facilities.slice(1, 3);
  const tier3      = facilities.slice(3);

  return (
    <motion.main
      {...pageTransition}
      className="max-w-[1440px] mx-auto px-6 py-12"
    >
      <motion.section {...fadeUp} className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4 font-satoshi">Campus Infrastructure.</h1>
            <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
              Access state-of-the-art learning environments, specialized labs, and collaborative spaces designed for the next generation of pioneers.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/10 flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="font-berkeley-mono text-xs uppercase tracking-widest text-primary">Live Campus Occupancy</span>
            </div>
          </div>
        </div>
      </motion.section>

      {error && (
        <div className="mb-8 p-4 rounded-md bg-error/10 border border-error/30 text-sm text-red-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <SkeletonCard className="md:col-span-8" />
          <div className="md:col-span-4 flex flex-col gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="md:col-span-3" />)}
        </div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-4 block">domain</span>
          No facilities listed yet.
        </div>
      ) : (
        <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* ── Featured card ─────────────────────────────────────────────── */}
          {featured && (
            <motion.div
              {...staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:col-span-8 group relative overflow-hidden bg-surface-container-low rounded-xl border border-outline-variant/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500"
            >
              <div className="aspect-[16/9] w-full overflow-hidden">
                {featured.image ? (
                  <img
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105 opacity-80"
                    src={featured.image}
                    alt={featured.name}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${cardGradient(0)} grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out flex items-center justify-center`}>
                    <span
                      className="material-symbols-outlined text-white/20 text-8xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {featured.icon ?? 'domain'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary/20 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-primary/30">
                    {featured.status ?? 'Open Now'}
                  </span>
                  <span className="font-berkeley-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{featured.location}</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-white mb-2 font-satoshi">{featured.name}</h2>
                <p className="text-on-surface-variant max-w-lg mb-6">{featured.description}</p>
                <div className="flex items-center gap-8">
                  {featured.hours && (
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-berkeley-mono text-outline tracking-wider">Hours</span>
                      <span className="text-sm font-semibold">{featured.hours}</span>
                    </div>
                  )}
                  {featured.capacity && (
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-berkeley-mono text-outline tracking-wider">Capacity</span>
                      <span className="text-sm font-semibold">{featured.capacity}</span>
                    </div>
                  )}
                  <button className="ml-auto flex items-center justify-center h-12 w-12 rounded-full bg-white text-background hover:scale-110 transition-transform duration-200">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Secondary cards ────────────────────────────────────────────── */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {secondary.map((card, idx) => (
              <motion.div
                key={card._id ?? card.name}
                {...staggerItem}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex-1 bg-surface-container-low rounded-xl border border-outline-variant/5 flex flex-col hover:bg-surface-container-high transition-colors duration-300 cursor-pointer group overflow-hidden"
              >
                {/* Image / gradient header */}
                <div className="w-full h-28 overflow-hidden flex-shrink-0">
                  {card.image ? (
                    <img
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105"
                      src={card.image}
                      alt={card.name}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${cardGradient(idx + 1)} grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out flex items-center justify-center`}>
                      <span
                        className="material-symbols-outlined text-white/20 text-5xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {card.icon ?? 'domain'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 bg-primary-container/20 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {card.icon ?? 'domain'}
                      </span>
                    </div>
                    <span className="bg-primary/20 text-primary border-primary/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm border">
                      {card.status ?? 'Open'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tighter text-white mb-2">{card.name}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{card.description}</p>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                    <span className="font-berkeley-mono text-xs text-outline">{card.location}</span>
                    <span className="text-xs font-semibold">{card.hours}</span>
                  </div>
                  {card.type === 'canteen' && <CanteenMenu items={card.menuItems} />}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Tier-3 cards ───────────────────────────────────────────────── */}
          {tier3.map((item, idx) => (
            <motion.div
              key={item._id ?? item.name}
              {...staggerItem}
              whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.2)' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:col-span-3 bg-surface-container-low p-5 rounded-xl border border-outline-variant/5 group cursor-pointer"
            >
              <div className="w-full h-32 rounded-lg bg-surface-container-highest mb-4 overflow-hidden">
                {item.image ? (
                  <img
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-in-out"
                    src={item.image}
                    alt={item.name}
                  />
                ) : (
                  <div className={`w-full h-full rounded-lg bg-gradient-to-br ${cardGradient(idx + 3)} grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out flex items-center justify-center`}>
                    <span
                      className="material-symbols-outlined text-white/20 text-4xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {item.icon ?? 'domain'}
                    </span>
                  </div>
                )}
              </div>
              <h4 className="text-lg font-bold text-white mb-1">{item.name}</h4>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                <span className="text-[10px] font-berkeley-mono text-outline uppercase tracking-wider">{item.status ?? 'Operational'}</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.description}</p>
              {item.type === 'canteen' && <CanteenMenu items={item.menuItems} />}
            </motion.div>
          ))}

        </motion.div>
      )}
    </motion.main>
  );
};

export default Facilities;
