import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem, fadeUpBlur } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { CommuteDashboard, LibraryDashboard, AcademicsDashboard } from '../components/PortalModules';

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
            ? `radial-gradient(350px circle at ${spot.x}px ${spot.y}px, rgba(59,130,246,0.08), transparent 70%)`
            : 'none',
        }}
      />
      {children}
    </motion.div>
  );
};

// Removed static timetable definitions here as they are now loaded from the backend

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// JS getDay(): 0=Sun,1=Mon,...,6=Sat → index 0=Mon
const todayDayIndex = new Date().getDay() === 0 ? -1 : new Date().getDay() - 1;

// Subject color map (keyed by first token of subject string)
const SUB_COLORS = {
  // 4th Sem (4C / 4B)
  ADA:        'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  'ADA/LATEX':'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  'LATEX/ADA':'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25',
  DBMS:       'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  'DBMS/MC':  'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  MC:         'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  'MC/DBMS':  'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  MATHS:      'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  LATEX:      'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25',
  BIO:        'bg-lime-500/15 text-lime-300 border border-lime-500/25',
  UHV:        'bg-pink-500/15 text-pink-300 border border-pink-500/25',
  // 6th Sem (6B)
  CC:         'bg-sky-500/15 text-sky-300 border border-sky-500/25',
  'CC/ML':    'bg-sky-500/15 text-sky-300 border border-sky-500/25',
  ML:         'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/25',
  'ML/DEVOPS':'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/25',
  BC:         'bg-orange-500/15 text-orange-300 border border-orange-500/25',
  IWM:        'bg-teal-500/15 text-teal-300 border border-teal-500/25',
  IKS:        'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25',
  DEVOPS:     'bg-rose-500/15 text-rose-300 border border-rose-500/25',
  'DEVOPS/CC':'bg-rose-500/15 text-rose-300 border border-rose-500/25',
  PROJECT:    'bg-green-500/15 text-green-300 border border-green-500/25',
  // Shared / misc
  PROCTOR:    'bg-slate-500/15 text-slate-300 border border-slate-500/25',
  'SPORTS/CUL':'bg-red-500/15 text-red-300 border border-red-500/25',
  TECHNICAL:  'bg-teal-500/15 text-teal-300 border border-teal-500/25',
  Jargon:     'bg-teal-500/15 text-teal-300 border border-teal-500/25',
  LIBRARY:    'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25',
  TUTORIAL:   'bg-purple-500/15 text-purple-300 border border-purple-500/25',
  NSS:        'bg-slate-500/15 text-slate-300 border border-slate-500/25',
};

const subColor = (sub) => {
  if (!sub) return '';
  return SUB_COLORS[sub] || 'bg-surface-container-high text-on-surface-variant';
};

// ── Attendance Ring ───────────────────────────────────────────────────────────
const Ring = ({ percent, size = 56, strokeW = 5 }) => {
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const p = percent == null ? 0 : Math.min(100, Math.max(0, percent));
  const offset = circ - (p / 100) * circ;
  const color = percent == null ? '#4b5563'
    : p >= 85 ? '#4ade80'
    : p >= 75 ? '#fbbf24'
    : '#f87171';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeW} />
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

// ── Section Timetable Component ───────────────────────────────────────────────
const SectionTimetable = ({ timetable }) => {
  const meta = timetable?.meta || {};
  const teachers = timetable?.teachers || {};
  const daysData = timetable?.days || {};
  const maxSlots = Math.max(0, ...DAYS.map((d) => (daysData[d] || []).length));

  return (
    <div>
      {/* ── Class info strip ── */}
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
            <span className="material-symbols-outlined text-[13px] text-secondary">manage_accounts</span>
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
                <th
                  key={day}
                  className={`py-2 px-2 text-center font-mono text-[10px] uppercase tracking-widest rounded-t-lg ${
                    idx === todayDayIndex ? 'bg-primary/10 text-primary' : 'text-outline'
                  }`}
                >
                  {idx === todayDayIndex ? (
                    <span className="flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block"></span>
                      {day}
                    </span>
                  ) : day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxSlots }).map((_, rowIdx) => {
              const rawCells = DAYS.map((day) => {
                const arr = daysData[day] || [];
                return rowIdx < arr.length ? arr[rowIdx] : undefined;
              });
              // Time label: use first valid cell's time at this row (skip nulls from span placeholders)
              const timeLabel = rawCells.find((c) => c && c.time && c.time !== 'span')?.time ?? '';
              return (
                <tr key={rowIdx}>
                  <td className="py-1.5 pr-3 font-mono text-[10px] text-outline whitespace-nowrap align-middle">
                    {timeLabel}
                  </td>
                  {rawCells.map((cell, colIdx) => {
                    // null/span = span placeholder from previous row → skip (rowSpan covers it)
                    if (cell === null || (cell && cell.time === 'span')) return null;

                    // undefined = no entry at all → empty cell
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

// ── Attendance Tracker Component ──────────────────────────────────────────────
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
      if (isAbsent) {
        await api.post('/api/attendance/mark-present', { courseId });
      } else {
        await api.post('/api/attendance/mark-absent', { courseId });
      }
      fetchSummary();
    } catch { /* silent */ } finally {
      setMarking(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl skeleton-shimmer" />
        ))}
      </div>
    );
  }

  if (summary.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl text-outline mb-3 block">fact_check</span>
        <p>No courses found for your section.</p>
      </div>
    );
  }

  // Filter out courses with no classes yet for overall % calc
  const withClasses = summary.filter((s) => s.percent !== null);
  const overallPct = withClasses.length > 0
    ? Math.round(withClasses.reduce((acc, s) => acc + s.percent, 0) / withClasses.length)
    : null;

  const criticalCourses = summary.filter((s) => s.percent !== null && s.percent < 75);
  const warnCourses = summary.filter((s) => s.percent !== null && s.percent >= 75 && s.percent < 80);

  return (
    <div>
      {/* Overall summary card */}
      <div className="bg-surface-container-low rounded-xl p-6 ghost-border mb-6 flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <Ring percent={overallPct} size={80} strokeW={7} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${
              overallPct == null ? 'text-outline'
              : overallPct >= 85 ? 'text-green-400'
              : overallPct >= 75 ? 'text-yellow-400'
              : 'text-red-400'
            }`}>
              {overallPct != null ? `${overallPct}%` : '—'}
            </span>
          </div>
        </div>
        <div>
          <p className="text-white font-bold text-lg">Overall Attendance</p>
          <p className="text-on-surface-variant text-sm">
            {withClasses.length > 0
              ? `Across ${withClasses.length} course${withClasses.length > 1 ? 's' : ''} with recorded classes`
              : 'Classes not yet marked by admin'}
          </p>
        </div>
      </div>

      {/* VTU critical banner (< 75%) */}
      {criticalCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3"
        >
          <span className="material-symbols-outlined text-red-400 flex-shrink-0 mt-0.5">error</span>
          <div>
            <p className="text-red-400 font-bold text-sm">BELOW VTU MINIMUM!</p>
            <p className="text-red-400/80 text-xs mt-0.5">
              {criticalCourses.map((s) => s.course.code).join(', ')} — below 75%. You may be barred from appearing in exams.
            </p>
          </div>
        </motion.div>
      )}

      {/* VTU warning banner (75%–80%) */}
      {warnCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-start gap-3"
        >
          <span className="material-symbols-outlined text-yellow-400 flex-shrink-0 mt-0.5">warning</span>
          <div>
            <p className="text-yellow-400 font-semibold text-sm">VTU Attendance Warning</p>
            <p className="text-yellow-400/80 text-xs mt-0.5">
              {warnCourses.map((s) => s.course.code).join(', ')} — below 80%. VTU minimum is 75%; do not miss more classes.
            </p>
          </div>
        </motion.div>
      )}

      {/* Per-course cards */}
      <div className="space-y-3">
        {summary.map((item) => {
          const { course, absentCount, attendedClasses, percent, canSkip, todayAbsent } = item;
          const total = course.totalClasses;
          const isMarking = marking === course._id;
          const pctColor = percent == null ? 'text-outline'
            : percent >= 85 ? 'text-green-400'
            : percent >= 75 ? 'text-yellow-400'
            : 'text-red-400';

          return (
            <motion.div
              key={course._id}
              layout
              className={`bg-surface-container-low rounded-xl p-5 ghost-border flex items-center gap-4 ${
                percent !== null && percent < 75 ? 'border-red-500/20 bg-red-500/5' : ''
              }`}
            >
              {/* Ring */}
              <div className="relative flex-shrink-0">
                <Ring percent={percent} size={56} strokeW={5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-bold ${pctColor}`}>
                    {percent != null ? `${percent}%` : '—'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono text-[10px] text-outline uppercase">{course.code}</span>
                  <p className="text-white font-semibold text-sm truncate">{course.name}</p>
                </div>
                {total > 0 ? (
                  <>
                    <p className="text-on-surface-variant text-xs mt-0.5">
                      Attended: <span className="text-white font-semibold">{attendedClasses} / {total}</span>
                    </p>
                    {canSkip != null && canSkip > 0 && (
                      <p className="text-green-400 text-xs mt-0.5">Can skip {canSkip} more class{canSkip !== 1 ? 'es' : ''}</p>
                    )}
                    {canSkip != null && canSkip <= 0 && percent !== null && percent < 75 && (
                      <p className="text-red-400 text-xs font-semibold mt-0.5">DANGER: Below 75% — do not miss any more classes!</p>
                    )}
                    {canSkip != null && canSkip <= 0 && percent !== null && percent >= 75 && (
                      <p className="text-yellow-400 text-xs mt-0.5">At limit — no more absences allowed</p>
                    )}
                  </>
                ) : (
                  <p className="text-outline text-xs mt-0.5">No classes recorded yet</p>
                )}
              </div>

              {/* Mark absent button */}
              {total > 0 && (
                <button
                  onClick={() => toggleAbsent(course._id, todayAbsent)}
                  disabled={isMarking}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    todayAbsent
                      ? 'bg-surface-container-high text-primary border border-primary/30 hover:bg-primary/10'
                      : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/20 hover:text-red-400 hover:border-red-400/30'
                  } disabled:opacity-50`}
                >
                  {isMarking ? (
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <span className="material-symbols-outlined text-[14px]">{todayAbsent ? 'undo' : 'person_off'}</span>
                  )}
                  {todayAbsent ? 'Undo (Marked absent today)' : 'I Missed This Class'}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ── Portal Page ───────────────────────────────────────────────────────────────
const Portal = () => {
  const { user, loading: authLoading } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [annLoading, setAnnLoading] = useState(true);
  
  // Read tab from query initially
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'timetable';
  });

  // Sync state if URL changes externally
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [window.location.search]);

  // Update URL securely without rigorous reload when changing tabs
  const handleTabChange = (key) => {
    setActiveTab(key);
    window.history.replaceState(null, '', `?tab=${key}`);
  };
  
  const [timetableData, setTimetableData] = useState(null);
  const [loadingTimetable, setLoadingTimetable] = useState(true);

  useEffect(() => {
    api.get('/api/announcements')
      .then((res) => setAnnouncements(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setAnnLoading(false));
  }, []);

  useEffect(() => {
    if (user?.section) {
      setLoadingTimetable(true);
      api.get(`/api/timetables/${user.section}`)
        .then((res) => setTimetableData(res.data))
        .catch(() => setTimetableData(null))
        .finally(() => setLoadingTimetable(false));
    } else {
      setLoadingTimetable(false);
    }
  }, [user?.section]);

  const TABS = [
    { key: 'timetable', label: 'Timetable',  icon: 'calendar_month' },
    { key: 'attendance', label: 'Attendance', icon: 'fact_check' },
    { key: 'academics', label: 'Academics', icon: 'military_tech' },
    { key: 'library', label: 'Library', icon: 'library_books' },
    { key: 'commute', label: 'Commute', icon: 'directions_bus' },
  ];

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">
      {/* ── Hero ── */}
      <motion.section {...fadeUpBlur} className="max-w-[1440px] mx-auto px-6 mb-16">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low min-h-[400px] flex flex-col justify-center items-center text-center p-8">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
          </div>

          {authLoading ? (
            <div className="space-y-4 w-full max-w-md">
              <div className="h-8 skeleton-shimmer rounded-lg w-3/4 mx-auto"></div>
              <div className="h-4 skeleton-shimmer rounded-lg w-1/2 mx-auto"></div>
            </div>
          ) : user ? (
            <>
              <div className="relative z-10 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-4xl">person</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-2 font-satoshi">
                  Welcome back, <span className="text-primary">{user.name?.split(' ')[0]}</span>.
                </h1>
                <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
                  {user.email}
                  {user.usn && <span className="ml-3 font-mono text-sm text-outline">· {user.usn}</span>}
                </p>
              </div>
              <div className="relative z-10 flex flex-wrap gap-4 justify-center">
                <div className="glass-panel ghost-border px-6 py-3 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                  <span className="text-sm text-white font-medium">Verified Student</span>
                </div>
                <div className="glass-panel ghost-border px-6 py-3 rounded-lg flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-sm">school</span>
                  <span className="text-sm text-white font-medium">
                    Section {user.section ?? '—'} · {(() => { const n = parseInt(user.section?.[0]); return n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : n ? `${n}th` : '—'; })()} Sem CSE
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 max-w-4xl leading-tight font-satoshi relative z-10">
                A calm place for Nex Campus students to check what matters next.
              </h1>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl font-satoshi mb-10 relative z-10">
                Streamline your academic life with our precision-engineered portal. Access grades, schedules, and campus resources in one unified view.
              </p>
              <div className="glass-panel ghost-border p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 max-w-md w-full relative z-10">
                <div className="text-left flex-1">
                  <p className="text-white font-semibold">Log in to open your student profile.</p>
                  <p className="text-on-surface-variant text-sm">Secure access for verified USN holders.</p>
                </div>
                <Link to="/login" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold tracking-tight hover:opacity-90 hover:scale-[1.02] transition-all duration-200 whitespace-nowrap">
                  Sign In Now
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.section>

      {/* ── Timetable + Attendance (logged in only) ── */}
      {user && (
        <section className="max-w-[1440px] mx-auto px-6 mb-16">
          {/* Tab bar */}
          <div className="flex items-center gap-1 mb-6 bg-surface-container-low rounded-xl p-1 w-fit border border-outline-variant/10">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'text-on-surface-variant hover:text-white hover:bg-surface-container'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: activeTab === tab.key ? "'FILL' 1" : "'FILL' 0" }}
                >{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'timetable' && (
              <motion.div
                key="timetable"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-surface-container-low/80 backdrop-blur-xl rounded-2xl p-8 ghost-border relative overflow-hidden">
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white font-satoshi mb-1">Weekly Timetable</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">
                        Section {user.section ?? '—'} · {(() => { const n = parseInt(user.section?.[0]); return n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : n ? `${n}th` : '—'; })()} Semester CSE · CBIT Kolar
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-outline uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
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
                      <p className="text-white font-semibold mb-1">Timetable for your section will be available soon.</p>
                      <p className="text-on-surface-variant text-sm">Contact your class teacher for the latest schedule.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'attendance' && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-surface-container-low/80 backdrop-blur-xl rounded-2xl p-8 ghost-border relative overflow-hidden">
                  <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between mb-8">
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
              <motion.div
                key="academics"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              >
                <div className="bg-surface-container-low rounded-xl p-6 ghost-border">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white font-satoshi">Internal Marks</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">CIE Tracking & Academic Performance</p>
                    </div>
                  </div>
                  <AcademicsDashboard />
                </div>
              </motion.div>
            )}

            {activeTab === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              >
                <div className="bg-surface-container-low rounded-xl p-6 ghost-border">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white font-satoshi">Digital Library</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">Resources mapped to Sem {user.semester ?? '—'} · CSE</p>
                    </div>
                  </div>
                  <LibraryDashboard semester={user.semester} />
                </div>
              </motion.div>
            )}

            {activeTab === 'commute' && (
              <motion.div
                key="commute"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              >
                <div className="bg-surface-container-low rounded-xl p-6 ghost-border">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white font-satoshi">Live Transport Hub</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">Intelligent Route Matching System</p>
                    </div>
                  </div>
                  <CommuteDashboard address={user.address} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* ── Announcements (logged in) ── */}
      {user && !annLoading && announcements.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight font-satoshi">Announcements</h2>
            <span className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live
            </span>
          </div>
          <motion.div {...staggerContainer} className="space-y-3">
            {announcements.slice(0, 4).map((ann) => (
              <motion.div
                key={ann._id ?? ann.title}
                {...staggerItem}
                className="bg-surface-container-low rounded-xl p-5 ghost-border flex items-start gap-4"
              >
                <span className="material-symbols-outlined text-primary mt-0.5">campaign</span>
                <div>
                  <p className="text-white font-semibold">{ann.title}</p>
                  <p className="text-on-surface-variant text-sm mt-1">{ann.content ?? ann.body ?? ann.message}</p>
                  {ann.createdAt && (
                    <p className="text-outline text-xs font-mono mt-2">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── Bento Grid ── */}
      <section className="max-w-[1440px] mx-auto px-6 mb-16">
        <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <SpotlightCard
            {...staggerItem}
            whileHover={{ y: -6, scale: 1.01, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}
            transition={{ duration: 0.3, ease: APPLE }}
            className="md:col-span-8 bg-surface-container-low ghost-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-container hover:border-primary/20 transition-colors duration-300"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <span className="font-berkeley-mono text-xs text-primary uppercase tracking-widest">Security Layer</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">USN Verification</h3>
              <p className="text-on-surface-variant max-w-md">Instantly authenticate your campus identity using your unique Student Number for secure portal access.</p>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <span className="text-4xl font-bold text-primary opacity-20 group-hover:opacity-100 transition-opacity duration-300">01</span>
              <span className="material-symbols-outlined text-white">arrow_forward</span>
            </div>
          </SpotlightCard>

          <SpotlightCard
            {...staggerItem}
            whileHover={{ y: -6, scale: 1.01, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}
            transition={{ duration: 0.3, ease: APPLE }}
            className="md:col-span-4 bg-surface-container-low ghost-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-container hover:border-primary/20 transition-colors duration-300"
          >
            <div>
              <span className="material-symbols-outlined text-secondary mb-6">calendar_month</span>
              <h3 className="text-2xl font-bold text-white mb-2">Course schedule</h3>
              <p className="text-on-surface-variant">Your daily academic rhythm, synced in real-time with campus changes.</p>
            </div>
            <div className="mt-8">
              <div className="flex flex-col gap-2">
                <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-2/3"></div>
                </div>
                <span className="font-berkeley-mono text-[10px] text-on-surface-variant uppercase">4th Semester CSE · Section {user?.section ?? '—'}</span>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard
            {...staggerItem}
            whileHover={{ y: -6, scale: 1.01, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}
            transition={{ duration: 0.3, ease: APPLE }}
            className="md:col-span-4 bg-surface-container-low ghost-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-container hover:border-primary/20 transition-colors duration-300"
          >
            <div>
              <span className="material-symbols-outlined text-tertiary mb-6">campaign</span>
              <h3 className="text-2xl font-bold text-white mb-2">Event feed</h3>
              <p className="text-on-surface-variant">Stay connected with live campus happenings, workshops, and guest lectures.</p>
            </div>
            <div className="mt-8 flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface-container-low"></div>
              <div className="w-8 h-8 rounded-full bg-tertiary border-2 border-surface-container-low"></div>
              <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface-container-low flex items-center justify-center text-[10px]">+12</div>
            </div>
          </SpotlightCard>

          <SpotlightCard
            {...staggerItem}
            whileHover={{ y: -6, scale: 1.01, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}
            transition={{ duration: 0.3, ease: APPLE }}
            className="md:col-span-8 bg-surface-container-low ghost-border rounded-xl p-8 flex items-center gap-8 group cursor-pointer hover:bg-surface-container hover:border-primary/20 transition-colors duration-300 overflow-hidden"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">support_agent</span>
                <span className="font-berkeley-mono text-xs text-primary uppercase tracking-widest">24/7 Concierge</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Campus support</h3>
              <p className="text-on-surface-variant">Direct line to academic advisors and technical support teams for immediate assistance.</p>
            </div>
            <div className="hidden lg:flex w-48 h-48 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/10 items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-secondary/20 transition-all duration-500">
              <span className="material-symbols-outlined text-primary/40 group-hover:text-primary/70 transition-colors duration-500" style={{ fontSize: '72px', fontVariationSettings: "'FILL' 1" }}>support_agent</span>
            </div>
          </SpotlightCard>
        </motion.div>
      </section>

      {/* ── Content Sections ── */}
      <motion.section {...fadeUpBlur} className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight font-satoshi">Quick Courses</h2>
              <span className="font-berkeley-mono text-xs text-on-surface-variant uppercase">Active Enrollment</span>
            </div>
            <motion.div {...staggerContainer} className="space-y-4">
              {[
                { icon: 'code', iconBg: 'bg-primary-container/20', iconColor: 'text-primary', title: 'Advanced Systems Design', sub: 'Unit 04: Distributed Ledger Technology', progress: '84%', progressColor: 'text-primary' },
                { icon: 'architecture', iconBg: 'bg-secondary-container/20', iconColor: 'text-secondary', title: 'Urban Ecology & Planning', sub: 'Unit 12: Vertical Farming Architecture', progress: '42%', progressColor: 'text-secondary' },
                { icon: 'psychology', iconBg: 'bg-tertiary-container/20', iconColor: 'text-tertiary', title: 'Cognitive Neurobiology', sub: 'Unit 09: Neural Plasticity Models', progress: '100%', progressColor: 'text-tertiary' },
              ].map((course) => (
                <motion.div
                  key={course.title}
                  {...staggerItem}
                  whileHover={{ y: -2, x: 4 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 ghost-border hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <div className={`w-12 h-12 ${course.iconBg} rounded-lg flex items-center justify-center ${course.iconColor}`}>
                    <span className="material-symbols-outlined">{course.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{course.title}</h4>
                    <p className="text-on-surface-variant text-sm">{course.sub}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-berkeley-mono text-xs ${course.progressColor}`}>{course.progress}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight font-satoshi">Campus Services</h2>
              <span className="font-berkeley-mono text-xs text-on-surface-variant uppercase">Global Directory</span>
            </div>
            <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: 'local_library', title: 'Central Library', desc: 'Reserve study pods or digital archives.' },
                { icon: 'fitness_center', title: 'Sports Complex', desc: 'Book courts or check gym capacity.' },
                { icon: 'restaurant', title: 'Campus Canteen', desc: 'Live menu and table availability.' },
                { icon: 'store', title: 'Stationery Shop', desc: 'Record books, lab manuals, and supplies.' },
              ].map((service) => (
                <SpotlightCard
                  key={service.title}
                  {...staggerItem}
                  whileHover={{ y: -6, scale: 1.01, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                  transition={{ duration: 0.3, ease: APPLE }}
                  className="bg-surface-container-low p-6 rounded-xl ghost-border hover:bg-surface-container-high hover:border-primary/20 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-surface-variant mb-4">{service.icon}</span>
                  <h4 className="text-white font-semibold mb-1">{service.title}</h4>
                  <p className="text-on-surface-variant text-xs">{service.desc}</p>
                </SpotlightCard>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default Portal;
