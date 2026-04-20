import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem, fadeUpBlur } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { CommuteDashboard, LibraryDashboard, AcademicsDashboard } from '../components/PortalModules';

// ── Utility helpers ───────────────────────────────────────────────────────────

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parseStartMins = (timeStr) => {
  const m = String(timeStr || '').match(/(\d{1,2}):(\d{2})/);
  return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : null;
};

const parseEndMins = (timeStr) => {
  const matches = [...String(timeStr || '').matchAll(/(\d{1,2}):(\d{2})/g)];
  if (matches.length >= 2) return parseInt(matches[1][1]) * 60 + parseInt(matches[1][2]);
  const start = parseStartMins(timeStr);
  return start != null ? start + 50 : null;
};

const minsToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const semLabel = (n) => n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : n ? `${n}th` : null;

const deptFromSection = (section) => {
  if (!section) return null;
  const s = section.toUpperCase();
  if (s.includes('AIML')) return 'AIML';
  if (s.includes('ISE')) return 'ISE';
  if (s.includes('ECE')) return 'ECE';
  if (s.includes('EEE')) return 'EEE';
  if (s.includes('MECH')) return 'Mechanical';
  if (s.includes('CIVIL')) return 'Civil';
  return 'CSE';
};

const getNextAndLastClass = (timetableData) => {
  if (!timetableData?.days) return { next: null, last: null };
  const dayKey = DAY_NAMES[new Date().getDay()];
  if (dayKey === 'Sun') return { next: null, last: null };
  const slots = (timetableData.days[dayKey] || []).filter(s => s.sub && s.type !== 'break' && !s.span);
  if (!slots.length) return { next: null, last: null };
  const teachers = timetableData.teachers || {};
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
  const next = slots.find(s => (parseStartMins(s.time) ?? 0) > nowMins) || null;
  const last = slots[slots.length - 1] || null;
  return {
    next: next ? { ...next, teacher: teachers[next.sub] || null, room: timetableData.meta?.room || null } : null,
    last: last ? { ...last, teacher: teachers[last.sub] || null } : null,
  };
};

const matchTransport = (buses, address) => {
  if (!buses?.length || !address) return null;
  const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const loc = norm(address);
  return buses.find(b => b.areasServed?.some(a => norm(a).includes(loc) || loc.includes(norm(a)))) || null;
};

// ── SpotlightCard ─────────────────────────────────────────────────────────────
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
            ? `radial-gradient(300px circle at ${spot.x}px ${spot.y}px, rgba(59,130,246,0.06), transparent 70%)`
            : 'none',
        }}
      />
      {children}
    </motion.div>
  );
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const todayDayIndex = new Date().getDay() === 0 ? -1 : new Date().getDay() - 1;

const SUB_COLORS = {
  ADA: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  'ADA/LATEX': 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  'LATEX/ADA': 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25',
  DBMS: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  'DBMS/MC': 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  MC: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  'MC/DBMS': 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  MATHS: 'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  LATEX: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25',
  BIO: 'bg-lime-500/15 text-lime-300 border border-lime-500/25',
  UHV: 'bg-pink-500/15 text-pink-300 border border-pink-500/25',
  CC: 'bg-sky-500/15 text-sky-300 border border-sky-500/25',
  'CC/ML': 'bg-sky-500/15 text-sky-300 border border-sky-500/25',
  ML: 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/25',
  'ML/DEVOPS': 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/25',
  BC: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',
  IWM: 'bg-teal-500/15 text-teal-300 border border-teal-500/25',
  IKS: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25',
  DEVOPS: 'bg-rose-500/15 text-rose-300 border border-rose-500/25',
  'DEVOPS/CC': 'bg-rose-500/15 text-rose-300 border border-rose-500/25',
  PROJECT: 'bg-green-500/15 text-green-300 border border-green-500/25',
  PROCTOR: 'bg-slate-500/15 text-slate-300 border border-slate-500/25',
  'SPORTS/CUL': 'bg-red-500/15 text-red-300 border border-red-500/25',
  TECHNICAL: 'bg-teal-500/15 text-teal-300 border border-teal-500/25',
  LIBRARY: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25',
  TUTORIAL: 'bg-purple-500/15 text-purple-300 border border-purple-500/25',
  NSS: 'bg-slate-500/15 text-slate-300 border border-slate-500/25',
};
const subColor = (sub) => sub ? (SUB_COLORS[sub] || 'bg-surface-container-high text-on-surface-variant') : '';

// ── Ring ──────────────────────────────────────────────────────────────────────
const Ring = ({ percent, size = 56, strokeW = 5 }) => {
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const p = percent == null ? 0 : Math.min(100, Math.max(0, percent));
  const offset = circ - (p / 100) * circ;
  const color = percent == null ? '#4b5563' : p >= 85 ? '#4ade80' : p >= 75 ? '#fbbf24' : '#f87171';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeW}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
      />
    </svg>
  );
};

// ── SectionTimetable ──────────────────────────────────────────────────────────
const SectionTimetable = ({ timetable }) => {
  const meta = timetable?.meta || {};
  const teachers = timetable?.teachers || {};
  const daysData = timetable?.days || {};
  const maxSlots = Math.max(0, ...DAYS.map((d) => (daysData[d] || []).length));
  return (
    <div>
      {meta.classTeacher && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 px-3 py-2.5 bg-surface-container-highest/30 rounded-lg border border-outline-variant/10 text-xs">
          <span className="flex items-center gap-1.5 font-mono text-outline uppercase tracking-wider">
            <span className="material-symbols-outlined text-[13px]">meeting_room</span>
            {meta.room}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-primary">person</span>
            <span className="text-on-surface-variant">CT:</span>
            <span className="text-white font-semibold">{meta.classTeacher}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[13px] text-primary/60">manage_accounts</span>
            <span className="text-on-surface-variant">Proctor:</span>
            <span className="text-white font-semibold">{meta.proctor}</span>
          </span>
        </div>
      )}
      <div className="overflow-x-auto pb-4 mask-fade-y hide-scrollbar">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-24 py-2 pr-3 text-left font-mono text-[10px] uppercase tracking-widest text-outline">Time</th>
              {DAYS.map((day, idx) => (
                <th key={day} className={`py-2 px-2 text-center font-mono text-[10px] uppercase tracking-widest rounded-t-lg ${idx === todayDayIndex ? 'bg-primary/10 text-primary' : 'text-outline'}`}>
                  {idx === todayDayIndex ? (
                    <span className="flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                      {day}
                    </span>
                  ) : day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxSlots }).map((_, rowIdx) => {
              const rawCells = DAYS.map((day) => { const arr = daysData[day] || []; return rowIdx < arr.length ? arr[rowIdx] : undefined; });
              const timeLabel = rawCells.find((c) => c && c.time && c.time !== 'span')?.time ?? '';
              return (
                <tr key={rowIdx}>
                  <td className="py-1.5 pr-3 font-mono text-[10px] text-outline whitespace-nowrap align-middle">{timeLabel}</td>
                  {rawCells.map((cell, colIdx) => {
                    if (cell === null || (cell && cell.time === 'span')) return null;
                    if (cell === undefined) return <td key={colIdx} className={`py-1 px-1.5 ${colIdx === todayDayIndex ? 'bg-primary/5' : ''}`} />;
                    if (cell.type === 'break') return (
                      <td key={colIdx} className={`py-1 px-1.5 ${colIdx === todayDayIndex ? 'bg-primary/5' : ''}`}>
                        <div className="text-center text-[10px] font-mono text-outline/50 uppercase tracking-wider py-0.5">{cell.sub}</div>
                      </td>
                    );
                    if (cell.type === 'lunch') return (
                      <td key={colIdx} className={`py-1 px-1.5 ${colIdx === todayDayIndex ? 'bg-primary/5' : ''}`}>
                        <div className="text-center rounded-md bg-orange-500/10 text-orange-300 text-[10px] font-mono uppercase tracking-wider py-1 border border-orange-500/20">LUNCH</div>
                      </td>
                    );
                    if (!cell.sub) return (
                      <td key={colIdx} className={`py-1 px-1.5 ${colIdx === todayDayIndex ? 'bg-primary/5' : ''}`}>
                        <div className="rounded-md h-8 bg-transparent" />
                      </td>
                    );
                    const teacher = teachers[cell.sub];
                    return (
                      <td key={colIdx} rowSpan={cell.span ? 2 : undefined} className={`py-1 px-1.5 align-middle ${colIdx === todayDayIndex ? 'bg-primary/5' : ''}`}>
                        <div className="relative group/tip">
                          <div className={`rounded-md px-2 py-1.5 ${subColor(cell.sub)} ${cell.span ? 'py-4' : ''}`}>
                            <p className="font-bold text-[11px] leading-tight">{cell.sub}</p>
                            {cell.note && <p className="text-[9px] opacity-70 leading-tight mt-0.5">{cell.note}</p>}
                          </div>
                          {teacher && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-background/95 border border-outline-variant/30 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity duration-150 z-30 shadow-2xl">
                              <span className="material-symbols-outlined text-[10px] text-outline align-middle mr-1">person</span>
                              {teacher}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── AttendanceTracker (full tab) ──────────────────────────────────────────────
const AttendanceTracker = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);

  const fetchSummary = useCallback(() => {
    setLoading(true);
    api.get('/api/attendance/summary')
      .then((res) => setSummary(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const toggleAbsent = async (courseId, isAbsent) => {
    setMarking(courseId);
    try {
      if (isAbsent) await api.post('/api/attendance/mark-present', { courseId });
      else await api.post('/api/attendance/mark-absent', { courseId });
      fetchSummary();
    } catch { /* silent */ } finally { setMarking(null); }
  };

  if (loading) return <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-24 rounded-xl skeleton-shimmer" />)}</div>;
  if (!summary.length) return (
    <div className="text-center py-12 text-on-surface-variant">
      <span className="material-symbols-outlined text-4xl text-outline mb-3 block">fact_check</span>
      <p>No courses found for your section.</p>
    </div>
  );

  const withClasses = summary.filter(s => s.percent !== null);
  const overallPct = withClasses.length > 0
    ? Math.round(withClasses.reduce((acc, s) => acc + s.percent, 0) / withClasses.length)
    : null;
  const criticalCourses = summary.filter(s => s.percent !== null && s.percent < 75);
  const warnCourses = summary.filter(s => s.percent !== null && s.percent >= 75 && s.percent < 80);

  return (
    <div>
      <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 mb-6 flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <Ring percent={overallPct} size={80} strokeW={7} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${overallPct == null ? 'text-outline' : overallPct >= 85 ? 'text-green-400' : overallPct >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
              {overallPct != null ? `${overallPct}%` : '—'}
            </span>
          </div>
        </div>
        <div>
          <p className="text-white font-bold text-lg">Overall Attendance</p>
          <p className="text-on-surface-variant text-sm">
            {withClasses.length > 0 ? `Across ${withClasses.length} course${withClasses.length > 1 ? 's' : ''} with recorded classes` : 'Classes not yet marked by admin'}
          </p>
        </div>
      </div>

      {criticalCourses.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <span className="material-symbols-outlined text-red-400 flex-shrink-0 mt-0.5">error</span>
          <div>
            <p className="text-red-400 font-bold text-sm">BELOW VTU MINIMUM</p>
            <p className="text-red-400/80 text-xs mt-0.5">{criticalCourses.map(s => s.course.code).join(', ')} — below 75%. You may be barred from appearing in exams.</p>
          </div>
        </motion.div>
      )}

      {warnCourses.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-start gap-3">
          <span className="material-symbols-outlined text-yellow-400 flex-shrink-0 mt-0.5">warning</span>
          <div>
            <p className="text-yellow-400 font-semibold text-sm">Attendance Warning</p>
            <p className="text-yellow-400/80 text-xs mt-0.5">{warnCourses.map(s => s.course.code).join(', ')} — below 80%. VTU minimum is 75%.</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {summary.map((item) => {
          const { course, absentCount, attendedClasses, percent, canSkip, todayAbsent } = item;
          const total = course.totalClasses;
          const isMarking = marking === course._id;
          const pctColor = percent == null ? 'text-outline' : percent >= 85 ? 'text-green-400' : percent >= 75 ? 'text-yellow-400' : 'text-red-400';
          return (
            <motion.div key={course._id} layout className={`bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 flex items-center gap-4 ${percent !== null && percent < 75 ? 'border-red-500/20 bg-red-500/5' : ''}`}>
              <div className="relative flex-shrink-0">
                <Ring percent={percent} size={56} strokeW={5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-bold ${pctColor}`}>{percent != null ? `${percent}%` : '—'}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono text-[10px] text-outline uppercase">{course.code}</span>
                  <p className="text-white font-semibold text-sm truncate">{course.name}</p>
                </div>
                {total > 0 ? (
                  <>
                    <p className="text-on-surface-variant text-xs mt-0.5">Attended: <span className="text-white font-semibold">{attendedClasses} / {total}</span></p>
                    {canSkip != null && canSkip > 0 && <p className="text-green-400 text-xs mt-0.5">Can skip {canSkip} more class{canSkip !== 1 ? 'es' : ''}</p>}
                    {canSkip != null && canSkip <= 0 && percent !== null && percent < 75 && <p className="text-red-400 text-xs font-semibold mt-0.5">Do not miss any more classes</p>}
                    {canSkip != null && canSkip <= 0 && percent !== null && percent >= 75 && <p className="text-yellow-400 text-xs mt-0.5">At limit — no more absences allowed</p>}
                  </>
                ) : <p className="text-outline text-xs mt-0.5">No classes recorded yet</p>}
              </div>
              {total > 0 && (
                <button
                  onClick={() => toggleAbsent(course._id, todayAbsent)}
                  disabled={isMarking}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${todayAbsent ? 'bg-surface-container-high text-primary border border-primary/30 hover:bg-primary/10' : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/20 hover:text-red-400 hover:border-red-400/30'} disabled:opacity-50`}
                >
                  {isMarking ? <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : <span className="material-symbols-outlined text-[14px]">{todayAbsent ? 'undo' : 'person_off'}</span>}
                  {todayAbsent ? 'Undo' : 'I Missed This'}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ── Dashboard: Next Class Card ────────────────────────────────────────────────
const NextClassCard = ({ next, loading, section, onTabChange }) => {
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
  const startMins = parseStartMins(next?.time);
  const minsAway = startMins != null ? Math.max(0, startMins - nowMins) : null;
  const countdownText = minsAway === 0 ? 'Starting now'
    : minsAway != null && minsAway < 60 ? `in ${minsAway} min`
    : minsAway != null ? `in ${Math.floor(minsAway / 60)}h ${minsAway % 60}m`
    : null;

  return (
    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-outline">Next Class</p>
        <button onClick={() => onTabChange('timetable')} className="text-[10px] text-primary hover:text-primary/70 flex items-center gap-1 transition-colors">
          Full schedule <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-2"><div className="h-6 skeleton-shimmer rounded" /><div className="h-4 skeleton-shimmer rounded w-3/4" /></div>
      ) : !section ? (
        <div className="text-center py-4">
          <p className="text-on-surface-variant text-sm">Set your section in your profile to see your schedule.</p>
          <Link to="/profile" className="text-primary text-xs mt-2 inline-block hover:underline">Edit Profile →</Link>
        </div>
      ) : !next ? (
        <div className="flex items-center gap-3 py-2">
          <span className="material-symbols-outlined text-outline text-2xl">event_available</span>
          <div>
            <p className="text-white font-semibold text-sm">No more classes today</p>
            <p className="text-on-surface-variant text-xs">{new Date().getDay() === 0 ? "It's Sunday — enjoy the break!" : "Check the timetable for tomorrow."}</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className={`inline-block px-2.5 py-1 rounded-md text-sm font-bold mb-2 ${subColor(next.sub)}`}>{next.sub}</span>
              <p className="text-white font-semibold">{next.time}</p>
              {next.teacher && <p className="text-on-surface-variant text-xs mt-0.5">{next.teacher}</p>}
              {next.room && <p className="text-outline text-xs font-mono mt-0.5">Room {next.room}</p>}
            </div>
            {countdownText && (
              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${minsAway === 0 ? 'text-green-400' : minsAway < 15 ? 'text-red-400' : minsAway < 30 ? 'text-yellow-400' : 'text-primary'}`}>{countdownText}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Dashboard: Attendance Summary Card ───────────────────────────────────────
const AttendanceSummaryCard = ({ summary, loading, onTabChange }) => {
  const withPct = summary.filter(s => s.percent != null);
  const overall = withPct.length
    ? Math.round(withPct.reduce((s, d) => s + d.percent, 0) / withPct.length)
    : null;

  const pctColor = (p) => p >= 85 ? 'text-green-400' : p >= 75 ? 'text-yellow-400' : 'text-red-400';
  const barColor = (p) => p >= 85 ? 'bg-green-400' : p >= 75 ? 'bg-yellow-400' : 'bg-red-400';

  const requiredClasses = (item) => {
    const total = item.course.totalClasses;
    if (!total) return null;
    return Math.max(0, Math.ceil((0.75 * total - item.attendedClasses) / 0.25));
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-outline">Attendance</p>
        <button onClick={() => onTabChange('attendance')} className="text-[10px] text-primary hover:text-primary/70 flex items-center gap-1 transition-colors">
          Details <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-2"><div className="h-5 skeleton-shimmer rounded w-1/2" /><div className="h-3 skeleton-shimmer rounded" /><div className="h-3 skeleton-shimmer rounded" /></div>
      ) : !summary.length ? (
        <div className="py-2 text-center">
          <p className="text-on-surface-variant text-sm">Attendance not recorded yet.</p>
        </div>
      ) : (
        <div>
          {/* Overall */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <Ring percent={overall} size={48} strokeW={4} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-[10px] font-bold ${overall != null ? pctColor(overall) : 'text-outline'}`}>{overall != null ? `${overall}%` : '—'}</span>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Overall: {overall != null ? `${overall}%` : '—'}</p>
              <p className="text-on-surface-variant text-xs">VTU minimum: 75% per subject</p>
            </div>
          </div>

          {/* Per-subject bars */}
          <div className="space-y-2.5">
            {summary.slice(0, 5).map(item => {
              const p = item.percent;
              const req = requiredClasses(item);
              return (
                <div key={item.course._id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-on-surface-variant font-mono">{item.course.code}</span>
                    <span className={`text-xs font-semibold ${p != null ? pctColor(p) : 'text-outline'}`}>{p != null ? `${p}%` : '—'}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${barColor(p ?? 0)}`} style={{ width: `${p ?? 0}%` }} />
                  </div>
                  {p != null && p < 75 && req > 0 && (
                    <p className="text-xs text-red-400/80 mt-0.5">Need {req} more class{req !== 1 ? 'es' : ''} to reach 75%</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Dashboard: Transport Card ─────────────────────────────────────────────────
const TransportCard = ({ transport, lastClass, address, onTabChange }) => {
  const matched = matchTransport(transport, address);
  const lastEndMins = parseEndMins(lastClass?.time);
  const departureText = lastEndMins ? `~${minsToTime(lastEndMins + 15)} (15 min after last class)` : null;

  return (
    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-outline">Transport</p>
        <button onClick={() => onTabChange('commute')} className="text-[10px] text-primary hover:text-primary/70 flex items-center gap-1 transition-colors">
          All routes <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
        </button>
      </div>

      {!transport.length ? (
        <p className="text-on-surface-variant text-sm">No transport routes configured.</p>
      ) : matched ? (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-lg">directions_bus</span>
            <span className="text-[9px] font-bold font-mono text-primary">{matched.busNumber}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold">{matched.destination}</p>
            <p className="text-on-surface-variant text-xs mt-0.5">{matched.schedule || 'Standard college hours'}</p>
            {departureText && <p className="text-primary/70 text-xs mt-1 font-mono">Departure: {departureText}</p>}
          </div>
        </div>
      ) : (
        <div>
          {!address ? (
            <p className="text-on-surface-variant text-sm mb-2">
              Add your home area in{' '}
              <Link to="/profile" className="text-primary hover:underline">Edit Profile</Link>
              {' '}to auto-match your bus route.
            </p>
          ) : (
            <p className="text-on-surface-variant text-sm mb-3">No route matched for "{address}". Available routes:</p>
          )}
          <div className="space-y-1.5">
            {transport.slice(0, 3).map(b => (
              <div key={b._id} className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="font-mono text-primary/70 w-12">Bus {b.busNumber}</span>
                <span className="text-white">{b.destination}</span>
                <span className="text-outline truncate">· {b.areasServed?.slice(0, 2).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Dashboard: Quick Actions ──────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Attendance', icon: 'fact_check',      tab: 'attendance' },
  { label: 'Timetable',  icon: 'calendar_month',  tab: 'timetable' },
  { label: 'Grades',     icon: 'military_tech',   tab: 'academics' },
  { label: 'Events',     icon: 'event',           href: '/events' },
  { label: 'Library',    icon: 'library_books',   tab: 'library' },
  { label: 'Support',    icon: 'support_agent',   href: '/support' },
];

// ── Dashboard Home ────────────────────────────────────────────────────────────
const DashboardHome = ({ user, timetableData, loadingTimetable, announcements, events, transport, attSummary, attLoading, placementDrives, onTabChange, navigate }) => {
  const { next: nextClass, last: lastClass } = getNextAndLastClass(timetableData);
  const firstName = user.name?.split(' ')[0] || 'there';
  const sem = semLabel(user.semester);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-6">

      {/* 1. Greeting */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white font-satoshi tracking-tight">
            {getGreeting()}, <span className="text-primary">{firstName}</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {today}
            {user.section && <> · Section {user.section}{sem ? ` · ${sem} Sem ${deptFromSection(user.section)}` : ''}</>}
          </p>
        </div>
        <Link to="/profile" className="flex items-center gap-2 text-xs text-outline hover:text-white border border-outline-variant/20 hover:border-outline-variant/40 px-3 py-1.5 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-[14px]">manage_accounts</span>
          Edit Profile
        </Link>
      </div>

      {/* 2+3. Next class + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NextClassCard next={nextClass} loading={loadingTimetable} section={user.section} onTabChange={onTabChange} />
        <AttendanceSummaryCard summary={attSummary} loading={attLoading} onTabChange={onTabChange} />
      </div>

      {/* 4. Upcoming */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-outline mb-3">Upcoming</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Announcements */}
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">campaign</span>
                <span className="text-xs font-semibold text-white">Announcements</span>
              </div>
              <Link to="/events" className="text-[10px] text-outline hover:text-primary transition-colors">See all</Link>
            </div>
            {announcements.length === 0 ? (
              <p className="text-outline text-xs">No announcements right now.</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 3).map(ann => (
                  <div key={ann._id} className="border-l-2 border-primary/30 pl-3">
                    <p className="text-white text-xs font-medium leading-snug">{ann.title}</p>
                    <p className="text-outline text-[10px] font-mono mt-0.5">
                      {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                      {ann.priority === 'critical' ? ' · 🚨 Critical' : ann.priority === 'high' ? ' · ⚡ High' : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Events */}
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">event</span>
                <span className="text-xs font-semibold text-white">Events</span>
              </div>
              <Link to="/events" className="text-[10px] text-outline hover:text-primary transition-colors">See all</Link>
            </div>
            {events.length === 0 ? (
              <p className="text-outline text-xs">No events scheduled this week.</p>
            ) : (
              <div className="space-y-3">
                {events.slice(0, 3).map(evt => (
                  <div key={evt._id} className="border-l-2 border-primary/20 pl-3">
                    <p className="text-white text-xs font-medium leading-snug">{evt.title}</p>
                    <p className="text-outline text-[10px] font-mono mt-0.5">
                      {evt.date ? new Date(evt.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : ''}
                      {evt.location ? ` · ${evt.location}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Placements */}
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">work</span>
                <span className="text-xs font-semibold text-white">Placements</span>
              </div>
              <Link to="/placements" className="text-[10px] text-outline hover:text-primary transition-colors">See all</Link>
            </div>
            {placementDrives.length === 0 ? (
              <div className="flex-1 flex flex-col items-start justify-center gap-1">
                <p className="text-outline text-xs">No active drives right now.</p>
                <Link to="/placements" className="text-primary text-[10px] hover:underline">Browse placement resources →</Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {placementDrives.slice(0, 3).map(d => {
                  const days = Math.ceil((new Date(d.date) - Date.now()) / 86400000);
                  const open = days >= 0;
                  return (
                    <div key={d._id} className="flex items-center gap-2 w-full">
                      <div className="w-6 h-6 rounded bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[12px] text-primary">business</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{d.title}</p>
                        <p className="text-outline text-[10px]">{open ? `${days}d left` : 'Closed'}</p>
                      </div>
                      {open && <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 5. Quick Actions */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-outline mb-3">Quick Access</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.label}
              onClick={() => action.tab ? onTabChange(action.tab) : navigate(action.href)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container transition-colors group"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[22px]">{action.icon}</span>
              <span className="text-[10px] text-on-surface-variant group-hover:text-white transition-colors font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Transport */}
      <TransportCard transport={transport} lastClass={lastClass} address={user.address} onTabChange={onTabChange} />

    </div>
  );
};

// ── Portal Page ───────────────────────────────────────────────────────────────
const Portal = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'dashboard';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    window.history.replaceState(null, '', `?tab=${key}`);
  };

  const [timetableData, setTimetableData] = useState(null);
  const [loadingTimetable, setLoadingTimetable] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [transport, setTransport] = useState([]);
  const [attSummary, setAttSummary] = useState([]);
  const [attLoading, setAttLoading] = useState(true);
  const [placementDrives, setPlacementDrives] = useState([]);

  // Timetable
  useEffect(() => {
    if (user?.section) {
      setLoadingTimetable(true);
      api.get(`/api/timetables/${user.section}`)
        .then(res => setTimetableData(res.data))
        .catch(() => setTimetableData(null))
        .finally(() => setLoadingTimetable(false));
    } else {
      setLoadingTimetable(false);
    }
  }, [user?.section]);

  // Dashboard data (all together when user is available)
  useEffect(() => {
    if (!user) return;

    api.get('/api/announcements?limit=3')
      .then(res => setAnnouncements(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});

    const from = new Date().toISOString();
    api.get(`/api/events?from=${from}&sort=date&limit=3`)
      .then(res => setEvents(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});

    api.get('/api/transport')
      .then(res => setTransport(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});

    setAttLoading(true);
    api.get('/api/attendance/summary')
      .then(res => setAttSummary(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setAttLoading(false));

    api.get('/api/events?limit=50')
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : [];
        setPlacementDrives(all.filter(e =>
          e.organizer === 'Placement Cell' ||
          e.category === 'networking' ||
          /placement|recruit|campus drive|hiring/i.test(e.title)
        ));
      })
      .catch(() => {});
  }, [user]);

  const TABS = [
    { key: 'dashboard',  label: 'Dashboard',  icon: 'dashboard' },
    { key: 'timetable',  label: 'Timetable',  icon: 'calendar_month' },
    { key: 'attendance', label: 'Attendance', icon: 'fact_check' },
    { key: 'academics',  label: 'Grades',     icon: 'military_tech' },
    { key: 'library',    label: 'Library',    icon: 'library_books' },
    { key: 'commute',    label: 'Commute',    icon: 'directions_bus' },
  ];

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">

      {/* ── Page header ── */}
      <motion.section {...fadeUpBlur} className="max-w-[1440px] mx-auto px-6 mb-8">
        {authLoading ? (
          <div className="h-16 skeleton-shimmer rounded-xl" />
        ) : user ? (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Your campus dashboard</h2>
              <p className="text-xs text-outline mt-0.5">Built for CBIT Kolar students</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-outline font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {user.usn || user.email}
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white font-satoshi mb-2">Your campus dashboard</h1>
              <p className="text-on-surface-variant">Attendance, timetable, grades, transport — everything in one place. Built for CBIT Kolar students.</p>
            </div>
            <Link to="/login" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold tracking-tight hover:opacity-90 transition-opacity whitespace-nowrap shrink-0">
              Sign In
            </Link>
          </div>
        )}
      </motion.section>

      {/* ── Tabs ── */}
      {user && (
        <section className="max-w-[1440px] mx-auto px-6">
          {/* Tab bar */}
          <div className="flex items-center gap-1 mb-6 bg-surface-container-low rounded-xl p-1 w-fit border border-outline-variant/10 overflow-x-auto hide-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                    : 'text-on-surface-variant hover:text-white hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeTab === tab.key ? "'FILL' 1" : "'FILL' 0" }}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <DashboardHome
                  user={user}
                  timetableData={timetableData}
                  loadingTimetable={loadingTimetable}
                  announcements={announcements}
                  events={events}
                  transport={transport}
                  attSummary={attSummary}
                  attLoading={attLoading}
                  placementDrives={placementDrives}
                  onTabChange={handleTabChange}
                  navigate={navigate}
                />
              </motion.div>
            )}

            {activeTab === 'timetable' && (
              <motion.div key="timetable" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="bg-surface-container-low/80 backdrop-blur-xl rounded-2xl p-8 border border-outline-variant/10 relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white font-satoshi mb-1">Weekly Timetable</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">
                        Section {user.section ?? '—'} · {semLabel(parseInt(user.section?.[0])) ?? '—'} Semester {deptFromSection(user.section)} · CBIT Kolar
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-outline uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Today: {DAYS[todayDayIndex] ?? 'Sun'}
                    </div>
                  </div>
                  {loadingTimetable ? (
                    <div className="py-12 flex justify-center">
                      <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    </div>
                  ) : timetableData ? (
                    <SectionTimetable timetable={timetableData} />
                  ) : (
                    <div className="py-12 text-center">
                      <span className="material-symbols-outlined text-4xl text-outline mb-3 block">calendar_today</span>
                      <p className="text-white font-semibold mb-1">Timetable for your section will appear here.</p>
                      <p className="text-on-surface-variant text-sm">Contact your class teacher for the current schedule.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'attendance' && (
              <motion.div key="attendance" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="bg-surface-container-low/80 backdrop-blur-xl rounded-2xl p-8 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white font-satoshi mb-1">Attendance Tracker</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">VTU minimum requirement: 75% per subject</p>
                    </div>
                    <span className="font-mono text-[10px] text-outline uppercase tracking-widest bg-surface-container-high px-3 py-1.5 rounded-lg">
                      Section {user.section ?? '—'}
                    </span>
                  </div>
                  <AttendanceTracker />
                </div>
              </motion.div>
            )}

            {activeTab === 'academics' && (
              <motion.div key="academics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white font-satoshi">Internal Marks</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">CIE scores across all subjects</p>
                    </div>
                  </div>
                  <AcademicsDashboard />
                </div>
              </motion.div>
            )}

            {activeTab === 'library' && (
              <motion.div key="library" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white font-satoshi">Digital Library</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">Resources for Sem {user.semester ?? '—'} · {deptFromSection(user.section)}</p>
                    </div>
                  </div>
                  <LibraryDashboard semester={user.semester} />
                </div>
              </motion.div>
            )}

            {activeTab === 'commute' && (
              <motion.div key="commute" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white font-satoshi">Transport & Commute</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">Bus routes and schedules</p>
                    </div>
                  </div>
                  <CommuteDashboard address={user.address} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </section>
      )}

    </motion.main>
  );
};

export default Portal;
