import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpBlur, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const APPLE = [0.22, 1, 0.36, 1];

// Static prep resources
const PREP_RESOURCES = [
  { category: 'Aptitude', title: 'IndiaBIX', desc: 'Quantitative, logical, and verbal practice', url: 'https://www.indiabix.com', icon: 'calculate' },
  { category: 'Aptitude', title: 'PrepInsta', desc: 'Company-specific aptitude tests', url: 'https://prepinsta.com', icon: 'quiz' },
  { category: 'Coding', title: 'LeetCode', desc: 'DSA problems sorted by company and difficulty', url: 'https://leetcode.com', icon: 'code' },
  { category: 'Coding', title: 'HackerRank', desc: 'Coding contests and interview prep kits', url: 'https://hackerrank.com', icon: 'terminal' },
  { category: 'Interview', title: 'GeeksForGeeks', desc: 'Interview questions, system design, CS fundamentals', url: 'https://geeksforgeeks.org', icon: 'school' },
  { category: 'Interview', title: 'Glassdoor', desc: 'Real interview experiences from hired students', url: 'https://glassdoor.com', icon: 'chat' },
  { category: 'Resume', title: 'Resumake', desc: 'Clean LaTeX-based resume builder', url: 'https://resumake.io', icon: 'description' },
  { category: 'Resume', title: 'LinkedIn', desc: 'Professional profile and recruiter connections', url: 'https://linkedin.com', icon: 'person' },
];

const PREP_CATEGORIES = ['All', 'Aptitude', 'Coding', 'Interview', 'Resume'];

// Parse package and eligibility from event description
const parseDescription = (desc) => {
  if (!desc) return { packageLPA: null, eligibility: null, raw: '' };
  const lines = desc.split('\n').map(l => l.trim());
  const pkgLine = lines.find(l => /^package:/i.test(l));
  const eligLine = lines.find(l => /^eligibility:/i.test(l));
  return {
    packageLPA: pkgLine ? pkgLine.replace(/^package:\s*/i, '') : null,
    eligibility: eligLine ? eligLine.replace(/^eligibility:\s*/i, '') : null,
    raw: desc,
  };
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const daysUntil = (d) => {
  if (!d) return null;
  const diff = new Date(d) - Date.now();
  const days = Math.ceil(diff / 86400000);
  return days;
};

// Eligibility check: parse eligibility string vs user inputs
const checkEligibility = (eligStr, cgpa, backlogs) => {
  if (!eligStr) return { eligible: true, reasons: [] };
  const reasons = [];
  const lower = eligStr.toLowerCase();

  // CGPA check: look for patterns like "6.0 cgpa", "60%", "aggregate ≥ 60"
  const cgpaMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:cgpa|gpa)/);
  const pctMatch = lower.match(/(\d+(?:\.\d+)?)\s*%/);

  if (cgpaMatch) {
    const req = parseFloat(cgpaMatch[1]);
    if (cgpa < req) reasons.push(`CGPA ≥ ${req} required (you have ${cgpa})`);
  } else if (pctMatch) {
    const req = parseFloat(pctMatch[1]) / 10;
    if (cgpa < req) reasons.push(`CGPA ≥ ${req.toFixed(1)} (~${pctMatch[1]}%) required (you have ${cgpa})`);
  }

  // Backlog check
  if (/no backlog|zero backlog|0 backlog/i.test(lower)) {
    if (backlogs > 0) reasons.push(`No active backlogs allowed (you have ${backlogs})`);
  } else {
    const backlogMatch = lower.match(/(?:max|maximum|upto|up to|atmost|at most)\s*(\d+)\s*backlog/i);
    if (backlogMatch) {
      const max = parseInt(backlogMatch[1]);
      if (backlogs > max) reasons.push(`Max ${max} backlog(s) allowed (you have ${backlogs})`);
    }
  }

  return { eligible: reasons.length === 0, reasons };
};

const EligibilityChecker = ({ company }) => {
  const { user } = useAuth();
  const [cgpa, setCgpa] = useState('');
  const [backlogs, setBacklogs] = useState('0');
  const [result, setResult] = useState(null);
  const { eligibility } = parseDescription(company?.description);

  const check = () => {
    const cgpaNum = parseFloat(cgpa);
    const backlogNum = parseInt(backlogs) || 0;
    if (!cgpa || isNaN(cgpaNum)) return;
    setResult(checkEligibility(eligibility || '', cgpaNum, backlogNum));
  };

  return (
    <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/10">
      <p className="text-xs font-bold uppercase tracking-widest text-outline mb-3">Am I Eligible?</p>
      {eligibility && (
        <p className="text-xs text-on-surface-variant mb-3 p-2 bg-surface-container-low rounded-lg">
          <span className="text-outline mr-1">Criteria:</span>{eligibility}
        </p>
      )}
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <label className="text-[10px] text-outline block mb-1">Your CGPA</label>
          <input type="number" min="0" max="10" step="0.01"
            className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/50 outline-none"
            placeholder="e.g. 7.5" value={cgpa} onChange={e => { setCgpa(e.target.value); setResult(null); }} />
        </div>
        <div className="w-28">
          <label className="text-[10px] text-outline block mb-1">Active Backlogs</label>
          <input type="number" min="0" max="20"
            className="w-full bg-surface-container-high border border-outline-variant/10 rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary/50 outline-none"
            value={backlogs} onChange={e => { setBacklogs(e.target.value); setResult(null); }} />
        </div>
      </div>
      <button onClick={check}
        className="w-full py-2 rounded-lg bg-primary/15 text-primary text-xs font-bold hover:bg-primary/25 transition-colors">
        Check Eligibility
      </button>
      {result && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${result.eligible ? 'bg-green-400/10 border border-green-400/20' : 'bg-red-400/10 border border-red-400/20'}`}>
          <span className={`material-symbols-outlined text-lg flex-shrink-0 ${result.eligible ? 'text-green-400' : 'text-red-400'}`}
            style={{ fontVariationSettings: "'FILL' 1" }}>
            {result.eligible ? 'check_circle' : 'cancel'}
          </span>
          <div>
            <p className={`text-xs font-bold ${result.eligible ? 'text-green-400' : 'text-red-400'}`}>
              {result.eligible ? 'You appear eligible.' : 'Not eligible currently.'}
            </p>
            {result.reasons.map((r, i) => (
              <p key={i} className="text-xs text-on-surface-variant mt-0.5">{r}</p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const CompanyModal = ({ drive, registered, onRegister, onClose }) => {
  const [showChecker, setShowChecker] = useState(false);
  const { packageLPA, eligibility, raw } = parseDescription(drive.description);
  const days = daysUntil(drive.date);
  const isExpired = days !== null && days < 0;
  const isSoon = days !== null && days >= 0 && days <= 3;
  const seats = drive.capacity ? drive.capacity - (drive.attendees?.length || 0) : null;

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-surface-container-low rounded-2xl w-full max-w-lg max-h-[88vh] overflow-y-auto border border-outline-variant/10 shadow-2xl"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0, transition: { duration: 0.25, ease: APPLE } }}
        exit={{ scale: 0.95, opacity: 0, y: 10, transition: { duration: 0.18 } }}
        onClick={e => e.stopPropagation()}>

        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">Placement Drive</span>
              <h2 className="text-xl font-bold text-white mt-1">{drive.title}</h2>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs mt-3">
            {packageLPA && (
              <span className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-lg font-semibold">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                {packageLPA}
              </span>
            )}
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold ${isExpired ? 'text-red-400 bg-red-400/10' : isSoon ? 'text-yellow-400 bg-yellow-400/10' : 'text-on-surface-variant bg-surface-container'}`}>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
              {isExpired ? 'Deadline passed' : days === null ? 'Date TBA' : days === 0 ? 'Deadline today' : `${days} days left`}
            </span>
            {drive.location && (
              <span className="flex items-center gap-1.5 text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-lg">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {drive.location}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-5">
          {eligibility && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Eligibility</p>
              <p className="text-sm text-on-surface-variant">{eligibility}</p>
            </div>
          )}

          {seats !== null && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Registration</p>
                <span className="text-xs text-on-surface-variant">{drive.attendees?.length || 0} / {drive.capacity}</span>
              </div>
              <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((drive.attendees?.length || 0) / drive.capacity) * 100)}%` }} />
              </div>
              {seats <= 5 && seats > 0 && <p className="text-xs text-yellow-400 mt-1">{seats} seats remaining</p>}
              {seats === 0 && <p className="text-xs text-red-400 mt-1">No seats remaining</p>}
            </div>
          )}

          <button onClick={() => setShowChecker(v => !v)}
            className="flex items-center gap-2 text-xs text-primary font-semibold hover:underline">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
            {showChecker ? 'Hide' : 'Check if I\'m eligible'}
          </button>

          {showChecker && <EligibilityChecker company={drive} />}

          {!isExpired && (
            <button onClick={() => { onRegister(drive._id); onClose(); }}
              disabled={registered}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${registered ? 'bg-green-400/15 text-green-400 cursor-default' : seats === 0 ? 'bg-surface-container text-on-surface-variant cursor-not-allowed' : 'bg-primary text-black hover:bg-primary/90'}`}>
              {registered ? 'Registered' : seats === 0 ? 'Registrations Closed' : 'Register Now'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const DriveCard = ({ drive, registered, onRegister, onClick }) => {
  const { packageLPA, eligibility } = parseDescription(drive.description);
  const days = daysUntil(drive.date);
  const isExpired = days !== null && days < 0;

  return (
    <motion.div {...staggerItem}
      whileHover={{ y: -3 }} transition={{ duration: 0.2, ease: APPLE }}
      onClick={() => onClick(drive)}
      className={`bg-surface-container-low border rounded-xl p-5 cursor-pointer transition-all duration-250 group ${registered ? 'border-green-400/25' : 'border-outline-variant/10 hover:border-outline-variant/30'}`}>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider mb-1">Placement Drive</p>
          <h3 className="text-base font-bold text-white group-hover:text-white/90 leading-snug">{drive.title}</h3>
        </div>
        {registered ? (
          <span className="flex-shrink-0 flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-lg font-semibold">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Registered
          </span>
        ) : isExpired ? (
          <span className="flex-shrink-0 text-xs text-outline bg-surface-container px-2.5 py-1 rounded-lg">Closed</span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-on-surface-variant mb-4">
        {packageLPA && (
          <span className="flex items-center gap-1 text-green-400 font-semibold">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            {packageLPA}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-outline">calendar_today</span>
          {formatDate(drive.date)}
        </span>
        {drive.location && (
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-outline">location_on</span>
            {drive.location}
          </span>
        )}
      </div>

      {eligibility && (
        <p className="text-[11px] text-outline line-clamp-1 mb-3">
          <span className="text-on-surface-variant mr-1">Eligibility:</span>{eligibility}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
        {drive.capacity ? (
          <div className="flex items-center gap-2">
            <div className="w-20 h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, ((drive.attendees?.length || 0) / drive.capacity) * 100)}%` }} />
            </div>
            <span className="text-[10px] text-outline">{drive.attendees?.length || 0}/{drive.capacity}</span>
          </div>
        ) : <span />}

        {!isExpired && (
          <span className={`text-xs font-semibold ${days !== null && days <= 3 ? 'text-yellow-400' : 'text-primary'}`}>
            {days === null ? 'Date TBA' : days === 0 ? 'Closes today' : days === 1 ? '1 day left' : `${days} days left`}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Closing Soon', value: 'soon' },
  { label: 'Closed', value: 'closed' },
];

const Placements = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [prepCat, setPrepCat] = useState('All');
  const [registeredIds, setRegisteredIds] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.get('/api/events?limit=100')
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : [];
        const placement = all.filter(e =>
          e.organizer === 'Placement Cell' ||
          e.category === 'networking' ||
          /placement|recruit|campus drive|hiring/i.test(e.title)
        );
        setDrives(placement);

        // Track which ones the user has registered for
        if (user) {
          const regSet = new Set(
            placement.filter(e => e.attendees?.includes?.(user._id) ||
              (Array.isArray(e.attendees) && e.attendees.some(a => (a._id || a) === user._id))
            ).map(e => e._id)
          );
          setRegisteredIds(regSet);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user, retryKey]);

  const handleRegister = async (driveId) => {
    if (!user) return;
    try {
      await api.post(`/api/events/${driveId}/register`);
      setRegisteredIds(prev => new Set([...prev, driveId]));
    } catch (err) {
      // Already registered or error — optimistically update anyway
      setRegisteredIds(prev => new Set([...prev, driveId]));
    }
  };

  const filtered = useMemo(() => {
    let list = drives;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => d.title?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q));
    }
    if (filter === 'open') list = list.filter(d => daysUntil(d.date) >= 0);
    if (filter === 'soon') list = list.filter(d => { const day = daysUntil(d.date); return day >= 0 && day <= 5; });
    if (filter === 'closed') list = list.filter(d => daysUntil(d.date) < 0);
    return list;
  }, [drives, search, filter]);

  const prepFiltered = useMemo(() =>
    prepCat === 'All' ? PREP_RESOURCES : PREP_RESOURCES.filter(r => r.category === prepCat),
    [prepCat]);

  const openCount = drives.filter(d => daysUntil(d.date) >= 0).length;

  return (
    <>
      <motion.main {...pageTransition} className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto">

        {/* Header */}
        <motion.section {...fadeUpBlur} className="mb-10">
          <div className="max-w-3xl mb-6">
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-outline mb-3">CBIT Kolar — Placements</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4 font-satoshi leading-tight">
              Your next<br />
              <span className="text-primary">opportunity.</span>
            </h1>
            <p className="text-on-surface-variant text-base max-w-xl leading-relaxed">
              Active campus drives, eligibility checker, and preparation resources.
              Register directly from this page.
            </p>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { label: 'Total Drives', value: drives.length },
                { label: 'Open Now', value: openCount },
                { label: 'Registered', value: registeredIds.size },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/10 rounded-xl">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-xs text-on-surface-variant">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15 mb-6 max-w-lg">
              <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <p className="text-sm text-on-surface-variant">
                <a href="/login" className="text-primary hover:underline font-semibold">Sign in</a> to register for placement drives and track your applications.
              </p>
            </div>
          )}
        </motion.section>

        {/* Drives section */}
        <div className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              <input
                className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl pl-11 pr-3 py-2.5 text-on-surface text-sm placeholder:text-outline focus:ring-2 focus:ring-primary/40 outline-none"
                placeholder="Search company or role..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Status filters */}
            <div className="flex gap-1.5">
              {FILTERS.map(f => (
                <button key={f.value} onClick={() => setFilter(f.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${filter === f.value ? 'bg-primary/15 text-primary border border-primary/25' : 'bg-surface-container text-on-surface-variant hover:text-white border border-outline-variant/10'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-xl skeleton-shimmer" />)}
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-4xl text-outline/30 block mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_off</span>
              <p className="text-on-surface-variant font-medium">Couldn't load placement drives.</p>
              <p className="text-xs text-outline mt-1 mb-5">Check your connection and try again.</p>
              <button onClick={() => setRetryKey(k => k + 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container border border-outline-variant/20 rounded-xl text-sm text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">refresh</span>
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-4xl text-outline/30 block mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>work_off</span>
              <p className="text-on-surface-variant font-medium">
                {drives.length === 0 ? 'No placement drives posted yet.' : 'No drives match your filters.'}
              </p>
              {drives.length === 0 && (
                <p className="text-xs text-outline mt-1">Placement Cell posts drives from the Admin panel.</p>
              )}
            </div>
          ) : (
            <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(drive => (
                <DriveCard key={drive._id} drive={drive}
                  registered={registeredIds.has(drive._id)}
                  onRegister={handleRegister}
                  onClick={setSelectedDrive} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Placement Timeline */}
        {drives.length > 0 && (
          <motion.section {...fadeUpBlur} className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Drive Timeline</h2>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-outline-variant/15" />
              <div className="space-y-4 pl-8">
                {[...drives]
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map(d => {
                    const days = daysUntil(d.date);
                    const past = days < 0;
                    return (
                      <div key={d._id} className="relative flex items-center gap-4">
                        <div className={`absolute -left-8 w-2.5 h-2.5 rounded-full border-2 ${past ? 'bg-surface-container border-outline-variant/30' : 'bg-primary border-primary/50'}`} />
                        <div className={`flex-1 p-3 rounded-xl border ${past ? 'border-outline-variant/10 opacity-50' : 'border-outline-variant/20 bg-surface-container-low'}`}>
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-semibold ${past ? 'text-on-surface-variant' : 'text-white'}`}>{d.title}</p>
                            <span className="text-xs text-outline flex-shrink-0">{formatDate(d.date)}</span>
                          </div>
                          {parseDescription(d.description).packageLPA && (
                            <p className="text-xs text-green-400 mt-0.5">{parseDescription(d.description).packageLPA}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </motion.section>
        )}

        {/* Interview Experiences */}
        <motion.section {...fadeUpBlur} className="mb-16">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-white tracking-tight">Interview Experiences</h2>
            <p className="text-on-surface-variant text-sm mt-1">First-hand accounts from students who've been through campus placements.</p>
          </div>
          <div className="py-12 text-center border-2 border-dashed border-outline-variant/15 rounded-2xl">
            <span className="material-symbols-outlined text-outline text-4xl mb-3 block">forum</span>
            <p className="text-on-surface-variant text-sm">Interview experiences will appear here once students begin submitting them.</p>
          </div>
        </motion.section>

        {/* Prep Resources */}
        <motion.section {...fadeUpBlur}>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Preparation Resources</h2>
          <p className="text-on-surface-variant text-sm mb-6">Curated links for aptitude, coding, interviews, and resumes.</p>

          <div className="flex gap-2 mb-6 flex-wrap">
            {PREP_CATEGORIES.map(c => (
              <button key={c} onClick={() => setPrepCat(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${prepCat === c ? 'bg-primary/15 text-primary border border-primary/25' : 'bg-surface-container text-on-surface-variant hover:text-white border border-outline-variant/10'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {prepFiltered.map(r => (
              <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer"
                className="p-4 bg-surface-container-low border border-outline-variant/10 hover:border-primary/25 rounded-xl transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{r.title}</p>
                    <span className="text-[10px] font-mono text-outline bg-surface-container px-1.5 py-0.5 rounded">{r.category}</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant">{r.desc}</p>
              </a>
            ))}
          </div>
        </motion.section>
      </motion.main>

      <AnimatePresence>
        {selectedDrive && (
          <CompanyModal
            drive={selectedDrive}
            registered={registeredIds.has(selectedDrive._id)}
            onRegister={handleRegister}
            onClose={() => setSelectedDrive(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Placements;
