import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';

// ── Commute Dashboard ──────────────────────────────────────────────────────────
export const CommuteDashboard = ({ address }) => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/transport')
      .then(res => setBuses(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-8 text-center text-outline">Loading transport metrics...</div>;

  // Simplistic matching by sub-string matching user address with areasServed
  const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const userLoc = normalize(address);
  
  let recommended = null;
  if (userLoc) {
    recommended = buses.find(bus => 
      bus.areasServed?.some(area => normalize(area).includes(userLoc) || userLoc.includes(normalize(area)))
    );
  }

  return (
    <div className="space-y-6">
      {address ? (
        <div className="bg-surface-container rounded-lg p-5 border border-outline-variant/10">
          <p className="text-[10px] uppercase font-mono tracking-widest text-outline mb-2">Registered Origin</p>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">pin_drop</span>
            <p className="text-white font-semibold text-lg">{address}</p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-lg text-sm flex items-start gap-3">
          <span className="material-symbols-outlined mt-0.5">warning</span>
          <p>Please update your home address/region in your profile to auto-match with the best transport route.</p>
        </div>
      )}

      {recommended && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full"></div>
          <h3 className="text-sm font-bold text-primary tracking-widest uppercase mb-4">Recommended Route</h3>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex flex-col items-center justify-center border border-primary/30 shrink-0">
              <span className="material-symbols-outlined text-primary mb-1">directions_bus</span>
              <span className="text-xs font-bold text-primary font-mono">{recommended.busNumber}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-white mb-1">{recommended.destination}</p>
              <p className="text-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 
                {recommended.schedule || 'Regular Timings'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-mono tracking-widest text-outline uppercase mb-4 mt-8">All Active Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buses.map(bus => (
            <div key={bus._id} className="bg-surface-container-highest p-4 rounded-xl ghost-border flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center font-bold text-white font-mono">
                    {bus.busNumber}
                  </div>
                  <p className="font-semibold text-white">{bus.destination}</p>
                </div>
                {recommended?._id === bus._id && (
                  <span className="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">Matched</span>
                )}
              </div>
              <div className="text-xs text-on-surface-variant leading-relaxed">
                <span className="text-outline">Via:</span> {bus.areasServed?.join(', ') || 'N/A'}
              </div>
            </div>
          ))}
          {buses.length === 0 && <p className="text-outline text-sm">No transport routes configured.</p>}
        </div>
      </div>
    </div>
  );
};

// ── Library Dashboard ─────────────────────────────────────────────────────────
export const LibraryDashboard = ({ semester }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Ideally query by semester, but we fetch all and filter client side for UX robustness
    api.get('/api/resources')
      .then(res => setResources(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-8 text-center text-outline">Loading resources...</div>;

  const relevant = resources.filter(r => !semester || r.semester === semester);
  const categories = ['All', ...new Set(relevant.map(r => r.type))];
  const filtered = filter === 'All' ? relevant : relevant.filter(r => r.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === cat 
                ? 'bg-white text-black' 
                : 'bg-surface-container text-outline hover:text-white hover:bg-surface-container-highest'
            }`}
          >
             {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(res => (
          <a
            key={res._id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-surface-container-highest rounded-xl p-5 border border-outline-variant/10 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`material-symbols-outlined text-[28px] ${
                res.type === 'Syllabus' ? 'text-blue-400' :
                res.type === 'Notes' ? 'text-yellow-400' :
                res.type === 'PYQ' ? 'text-green-400' : 'text-purple-400'
              }`}>
                {res.type === 'Syllabus' ? 'menu_book' : res.type === 'Notes' ? 'description' : res.type === 'PYQ' ? 'history_edu' : 'folder_open'}
              </span>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">open_in_new</span>
            </div>
            <h3 className="text-white font-semibold mb-1 truncate">{res.title}</h3>
            <p className="text-[11px] text-on-surface-variant font-mono uppercase tracking-widest">
              Sem {res.semester} · {res.branch}
            </p>
          </a>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-outline-variant/20 rounded-xl">
            <span className="material-symbols-outlined text-outline text-4xl mb-2">inbox</span>
            <p className="text-on-surface-variant">No digital resources found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Academics Dashboard (Grades) ──────────────────────────────────────────────
export const AcademicsDashboard = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/grades/mine')
      .then(res => setGrades(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-8 text-center text-outline">Loading academic profile...</div>;

  const CircularMeter = ({ percent }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const color = percent >= 80 ? '#4ade80' : percent >= 60 ? '#fbbf24' : '#f87171';
    
    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <motion.circle 
            cx="32" cy="32" r={radius} fill="none" 
            stroke={color} strokeWidth="4" strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (percent / 100) * circumference }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-white font-bold font-mono">{percent}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grades.map(g => {
          const max = (g.maxCie || 50) * 3;
          const total = g.totalMarks || 0;
          const pct = Math.round((total / max) * 100) || 0;
          const color = pct >= 80 ? 'text-green-400 bg-green-400' : pct >= 60 ? 'text-yellow-400 bg-yellow-400' : 'text-red-400 bg-red-400';

          return (
            <div key={g._id} className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] font-mono text-outline uppercase tracking-widest">{g.course?.code}</span>
                  <h3 className="text-white font-bold text-lg mb-1">{g.course?.name || 'Unknown Course'}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono tracking-tighter text-white">{total}</span>
                    <span className="text-xs text-outline inline-block">/ {max}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <CircularMeter percent={pct} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                 <div className="bg-surface-container p-2 rounded flex flex-col items-center">
                   <span className="text-[10px] text-outline uppercase font-mono mb-1">CIE 1</span>
                   <span className="text-white font-semibold">{g.cie1 ?? '-'}</span>
                 </div>
                 <div className="bg-surface-container p-2 rounded flex flex-col items-center">
                   <span className="text-[10px] text-outline uppercase font-mono mb-1">CIE 2</span>
                   <span className="text-white font-semibold">{g.cie2 ?? '-'}</span>
                 </div>
                 <div className="bg-surface-container p-2 rounded flex flex-col items-center">
                   <span className="text-[10px] text-outline uppercase font-mono mb-1">CIE 3</span>
                   <span className="text-white font-semibold">{g.cie3 ?? '-'}</span>
                 </div>
              </div>
            </div>
          );
        })}
        {grades.length === 0 && (
          <div className="col-span-full py-12 text-center text-outline">
            No grades published currently.
          </div>
        )}
      </div>
    </div>
  );
};
