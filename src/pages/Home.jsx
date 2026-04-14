import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUpBlur, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const APPLE = [0.22, 1, 0.36, 1];

// ── Count-up hook ─────────────────────────────────────────────────────────
function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || target === null || target === 0) { if (target === 0) setValue(0); return; }
    let start = 0;
    const totalFrames = Math.round(duration / 16);
    const increment = target / totalFrames;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      start += increment;
      if (frame >= totalFrames) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return { value, ref };
}

// ── Section divider ───────────────────────────────────────────────────────
const SectionDivider = () => (
  <div className="flex justify-center py-6" aria-hidden="true">
    <div className="h-px w-48 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
  </div>
);

// ── Count-up stat item ────────────────────────────────────────────────────
const StatCount = ({ value, label, color }) => {
  const { value: count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="p-4 bg-surface-container-high rounded-lg ghost-border">
      <p className={`font-berkeley-mono text-xl mb-1 ${color}`}>
        {value !== null ? count : '—'}
      </p>
      <p className="text-[10px] text-outline uppercase tracking-widest">{label}</p>
    </div>
  );
};

const FacilitiesStats = ({ stats }) => (
  <div className="grid grid-cols-2 gap-4">
    <StatCount value={stats.facilities} label="Facilities" color="text-primary" />
    <StatCount value={stats.courses}   label="Courses"    color="text-secondary" />
  </div>
);

// ── Spotlight card — motion.div drop-in with mouse-follow glow ────────────
const SpotlightCard = ({ children, className = '', onMouseMove: outerMove, onMouseLeave: outerLeave, ...rest }) => {
  const [spot, setSpot] = useState(null);
  const ref = useRef(null);
  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setSpot({ x: e.clientX - r.left, y: e.clientY - r.top });
        outerMove?.(e);
      }}
      onMouseLeave={(e) => {
        setSpot(null);
        outerLeave?.(e);
      }}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-0"
        style={{
          opacity: spot ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: spot
            ? `radial-gradient(350px circle at ${spot.x}px ${spot.y}px, rgba(59,130,246,0.09), transparent 70%)`
            : 'none',
        }}
      />
      {children}
    </motion.div>
  );
};

const CATEGORY_ICON = {
  hackathon: 'code', workshop: 'build', keynote: 'mic', symposium: 'groups',
  networking: 'hub', sports: 'sports_soccer', cultural: 'celebration',
  academic: 'school', 'open-house': 'home', other: 'event',
};

const CATEGORY_GRADIENT = {
  hackathon: 'from-blue-900/50 to-blue-900/20',
  workshop: 'from-purple-900/50 to-purple-900/20',
  keynote: 'from-amber-900/50 to-amber-900/20',
  sports: 'from-green-900/50 to-green-900/20',
  cultural: 'from-pink-900/50 to-pink-900/20',
  academic: 'from-indigo-900/50 to-indigo-900/20',
};

const TerminalWidget = ({ stats }) => {
  const [lines, setLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const fullLines = [
    '$ nex status',
    '✓ Portal: online',
    `✓ Courses: ${stats.courses !== null ? stats.courses : '-'} active`,
    `✓ Events: ${stats.events !== null ? stats.events : '-'} scheduled`,
    `✓ Facilities: ${stats.facilities !== null ? stats.facilities : '-'} operational`,
    '✓ Students: connected'
  ];

  useEffect(() => {
    if (currentIndex >= fullLines.length) return;

    const currentLine = fullLines[currentIndex];

    // If we've finished the current line
    if (currentCharIndex > currentLine.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(c => c + 1);
        setCurrentCharIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Type the current line character by character
    const timer = setTimeout(() => {
      setLines(prev => {
        const newLines = [...prev];
        newLines[currentIndex] = currentLine.substring(0, currentCharIndex);
        return newLines;
      });
      setCurrentCharIndex(c => c + 1);
    }, 80);

    return () => clearTimeout(timer);
  }, [currentIndex, currentCharIndex, fullLines]);

  return (
    <div className="bg-[#000000] border border-outline-variant/30 rounded-xl p-6 shadow-2xl relative z-10 w-full min-h-[250px] font-mono text-sm leading-8">
      {/* Mac window dots */}
      <div className="flex gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="text-primary font-berkeley-mono">
        {lines.map((line, i) => (
          <div key={i} className="min-h-[32px]">
            {line}
            {i === currentIndex && <span className="animate-pulse">_</span>}
          </div>
        ))}
        {currentIndex >= fullLines.length && <span className="animate-pulse">_</span>}
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({ courses: null, events: null, facilities: null });
  const [attendanceStr, setAttendanceStr] = useState('95%+');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    // If logged in, fetch actual attendance. Else fetch generic stats.
    if (user) {
      api.get('/api/attendance/summary').then(res => {
         const att = Array.isArray(res.data) ? res.data : [];
         const withPct = att.filter(s => s.percent !== null);
         if (withPct.length > 0) {
            const avg = Math.round(withPct.reduce((a, s) => a + s.percent, 0) / withPct.length);
            setAttendanceStr(avg + '%');
         }
      }).catch(() => {});
    }

    Promise.all([
      api.get('/api/courses').catch(() => ({ data: [] })),
      api.get('/api/events').catch(() => ({ data: [] })),
      api.get('/api/facilities').catch(() => ({ data: [] })),
    ]).then(([coursesRes, eventsRes, facilitiesRes]) => {
      const courses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
      const events  = Array.isArray(eventsRes.data)  ? eventsRes.data  : [];
      const facilities = Array.isArray(facilitiesRes.data) ? facilitiesRes.data : [];
      setFeaturedCourses(courses.slice(0, 3));
      setUpcomingEvents(events.slice(0, 4));
      setStats({ courses: courses.length, events: events.length, facilities: facilities.length });
    });
  }, []);
  return (
    <motion.main
      {...pageTransition}
      className="min-h-screen"
    >
      {/* ─── Hero ─── */}
      <section
        ref={heroRef}
        className="relative pt-24 pb-32 px-6 overflow-hidden"
        onMouseMove={(e) => {
          const r = heroRef.current?.getBoundingClientRect();
          if (r) setCursorPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
      >
        {/* Cursor glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(200px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(59,130,246,0.05), transparent 80%)`,
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: APPLE }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low ghost-border rounded-full text-primary text-xs font-berkeley-mono uppercase tracking-widest"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              CBIT KOLAR · APRIL 14, 2026
            </motion.div>

            {/* Word-by-word heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.95] text-white font-satoshi flex flex-wrap gap-x-[0.3em] gap-y-1">
              {['Nex', 'Campus,', 'coordinated', 'like', 'a'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.2 + i * 0.05, ease: APPLE }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: APPLE }}
                className="inline-block gradient-text-animated"
              >
                living system
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-xl text-on-surface-variant max-w-xl leading-relaxed"
            >
              Smart campus platform for CBIT Kolar. Track attendance, view timetables, access study materials, and stay connected with campus life.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <button onClick={() => navigate('/portal')} className="btn-ripple bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 flex items-center gap-2" aria-label="Enter the Portal">
                Enter the Portal
                <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </button>
              <button onClick={() => navigate('/courses')} className="btn-ripple bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-bold text-lg ghost-border hover:bg-surface-variant hover:scale-[1.02] active:scale-[0.97] transition-all duration-200">
                View Documentation
              </button>
            </motion.div>
          </div>
          <div className="lg:col-span-5 relative">
             <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
               <TerminalWidget stats={stats} />
            </motion.div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 blur-[100px] -z-10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/10 blur-[100px] -z-10 rounded-full"></div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Bento Grid Feature Section ─── */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeUpBlur}
            className="mb-16 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6 font-satoshi">Everything your campus needs, in one place</h2>
            <p className="text-on-surface-variant text-lg">Engineered for high-performance universities who demand precision in every interaction.</p>
          </motion.div>
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 h-auto lg:h-[700px]"
          >
            {/* Large Bento Item */}
            <SpotlightCard
              {...staggerItem}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.25, ease: APPLE }}
              className="relative md:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden ghost-border flex flex-col hover:shadow-2xl hover:shadow-black/40 hover:border-primary/50 transition-all duration-300"
            >
              <div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(173,198,255,0.1) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                  maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
                }}
              />
              <div className="p-10 relative z-10 flex-1">
                <span className="material-symbols-outlined text-primary mb-6 text-4xl">architecture</span>
                <h3 className="text-3xl font-bold tracking-tight mb-4 text-white">Unified Infrastructure</h3>
                <p className="text-on-surface-variant text-lg max-w-md">Real-time synchronization across every department, facility, and student touchpoint.</p>
              </div>
              <div className="mt-auto flex-1 bg-gradient-to-t from-primary/5 to-transparent flex items-end justify-center px-8 pb-6 pt-2 gap-3">
                {[{ label: 'Courses', val: stats.courses, color: 'text-secondary', icon: 'school' },
                  { label: 'Events',  val: stats.events,  color: 'text-primary',   icon: 'event' },
                  { label: 'Facilities', val: stats.facilities, color: 'text-tertiary', icon: 'domain' },
                ].map(({ label, val, color, icon }) => (
                  <div key={label} className="flex-1 bg-surface-container-high rounded-xl p-4 ghost-border flex flex-col items-center gap-2">
                    <span className={`material-symbols-outlined ${color} text-2xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    <p className={`font-berkeley-mono text-2xl font-bold ${color}`}>{val !== null ? val : '—'}</p>
                    <p className="text-[10px] text-outline uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            {/* Vertical Bento Item */}
            <SpotlightCard
              {...staggerItem}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.25, ease: APPLE }}
              className="md:col-span-4 bg-surface-container-high rounded-xl p-8 ghost-border overflow-hidden hover:shadow-2xl hover:shadow-black/40 hover:border-primary/10 transition-all duration-300"
            >
              <div className="relative z-[1] h-full flex flex-col">
                <span className="material-symbols-outlined text-secondary mb-4 text-3xl">bolt</span>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Instant Operations</h3>
                <p className="text-on-surface-variant mb-8">Deploy resources with zero latency. If it happens on campus, it happens in Nex.</p>
                <div className="mt-auto space-y-4">
                  <div className="bg-surface-container-lowest p-4 rounded-lg ghost-border">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-berkeley-mono text-outline">CPU LOAD</span>
                      <span className="text-xs font-berkeley-mono text-primary">12%</span>
                    </div>
                    <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[12%]"></div>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-lg ghost-border">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-berkeley-mono text-outline">NETWORK</span>
                      <span className="text-xs font-berkeley-mono text-secondary">STABLE</span>
                    </div>
                    <div className="flex gap-1 h-4 items-end">
                      <div className="w-1 bg-secondary h-full"></div>
                      <div className="w-1 bg-secondary h-[80%]"></div>
                      <div className="w-1 bg-secondary h-[90%]"></div>
                      <div className="w-1 bg-secondary h-[100%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Horizontal Bento Item 1 */}
            <SpotlightCard
              {...staggerItem}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.25, ease: APPLE }}
              className="md:col-span-5 bg-surface-container-high rounded-xl p-8 ghost-border flex items-center gap-6 hover:shadow-2xl hover:shadow-black/40 hover:border-primary/10 transition-all duration-300"
            >
              <div className="w-1/2">
                <h3 className="text-xl font-bold tracking-tight mb-2">Smart Facilities</h3>
                <p className="text-sm text-on-surface-variant">IoT-enabled room booking and maintenance.</p>
              </div>
              <div className="w-1/2 h-32 bg-gradient-to-br from-emerald-900/60 to-teal-900/30 rounded-lg overflow-hidden flex items-center justify-center">
                <span className="material-symbols-outlined text-white/20 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
              </div>
            </SpotlightCard>

            {/* Horizontal Bento Item 2 */}
            <SpotlightCard
              {...staggerItem}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.25, ease: APPLE }}
              className="md:col-span-7 bg-primary text-on-primary rounded-xl p-8 flex justify-between items-center overflow-hidden group hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold tracking-tight mb-2">Academic Core</h3>
                <p className="text-on-primary/80 max-w-xs">Track progress, manage courses, and facilitate research in one fluid view.</p>
              </div>
              <span className="material-symbols-outlined text-8xl opacity-10 absolute -right-4 -bottom-4 rotate-12 group-hover:rotate-0 transition-transform duration-500" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              <button onClick={() => navigate('/portal')} className="btn-ripple relative z-[1] bg-on-primary text-primary px-6 py-3 rounded-lg font-bold hover:bg-white hover:scale-[1.02] active:scale-[0.97] transition-all duration-200">Launch Core</button>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Self-Driving Operations ─── */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            {...fadeUpBlur}
            transition={{ duration: 0.7, ease: APPLE }}
            className="order-2 lg:order-1"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 border-[1px] border-primary/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-12 border-[1px] border-secondary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-24 border-[1px] border-primary/10 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-panel p-8 rounded-full ghost-border flex flex-col items-center">
                  <span className="text-4xl font-berkeley-mono font-bold text-white mb-2">{attendanceStr}</span>
                  <span className="text-[10px] font-berkeley-mono text-outline tracking-[0.2em] uppercase">{user ? 'Your Attendance' : 'Avg. Attendance'}</span>
                </div>
              </div>
              <div className="absolute top-0 right-10 bg-surface-container-high ghost-border px-4 py-2 rounded-lg text-xs font-berkeley-mono text-primary shadow-xl">
                NODE_ALPHA_ACTIVE
              </div>
              <div className="absolute bottom-20 left-0 bg-surface-container-high ghost-border px-4 py-2 rounded-lg text-xs font-berkeley-mono text-secondary shadow-xl">
                SYNC_PROTOCOL_V2
              </div>
            </div>
          </motion.div>
          <motion.div
            {...fadeUpBlur}
            transition={{ duration: 0.7, delay: 0.15, ease: APPLE }}
            className="order-1 lg:order-2 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-satoshi">Built for students who value their time</h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              Nex Campus seamlessly manages the heavy lifting—from tracking dynamic attendance records to synchronizing module PDFs and daily timetables.
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary ghost-border">
                  <span className="material-symbols-outlined">auto_graph</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Instant Attendance Sync</h4>
                  <p className="text-on-surface-variant text-sm">Save time with auto-updated attendance tracking that reflects changes in real-time.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary ghost-border">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Centralized Study Materials</h4>
                  <p className="text-on-surface-variant text-sm">Access module PDFs and timetables immediately without navigating scattered portals.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Featured Grid Sections ─── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-32">

          {/* Featured Courses */}
          <div>
            <motion.div
              {...fadeUpBlur}
              className="flex justify-between items-end mb-12"
            >
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2 font-satoshi">Featured Courses</h2>
                <p className="text-on-surface-variant">The frontiers of knowledge, delivered via the OS.</p>
              </div>
              <button onClick={() => navigate('/courses')} className="text-primary hover:underline font-semibold flex items-center gap-1 hover:scale-[1.02] transition-transform duration-200">
                Explore Catalog
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </motion.div>
            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {featuredCourses.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <div className="aspect-[16/10] skeleton-shimmer rounded-xl mb-4"></div>
                    <div className="h-5 w-2/3 skeleton-shimmer rounded-lg mb-2"></div>
                    <div className="h-3 w-1/3 skeleton-shimmer rounded-lg"></div>
                  </div>
                ))
                : featuredCourses.map((course) => (
                <SpotlightCard
                  key={course._id}
                  {...staggerItem}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.25, ease: APPLE }}
                  className="group cursor-pointer hover:shadow-xl hover:shadow-black/30 rounded-xl transition-all duration-300"
                  onClick={() => navigate('/courses')}
                >
                  <div className="aspect-[16/10] bg-surface-container-low rounded-xl overflow-hidden mb-4 ghost-border flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-outline text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                    <div className="absolute top-3 left-3">
                      <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">{course.code}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-sm text-on-surface-variant">{course.instructor} · {course.credits} Credits</p>
                </SpotlightCard>
              ))}
            </motion.div>
          </div>

          {/* Facilities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              {...fadeUpBlur}
              className="lg:col-span-5 space-y-6"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white font-satoshi">Facilities engineered for the future</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Our campus is a collection of high-performance environments, from zero-latency labs to bioclimatic social hubs, all connected via the Nex network.
              </p>
              <FacilitiesStats stats={stats} />

              <button onClick={() => navigate('/facilities')} className="bg-surface-container-high text-white px-6 py-3 rounded-lg font-bold ghost-border w-full hover:bg-surface-variant hover:scale-[1.02] transition-all duration-200">Explore Campus Map</button>
            </motion.div>
            <motion.div
              {...fadeUpBlur}
              transition={{ duration: 0.7, delay: 0.15, ease: APPLE }}
              className="lg:col-span-7"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="rounded-xl ghost-border w-full aspect-[3/4] bg-gradient-to-br from-blue-900/60 to-indigo-900/30 grayscale hover:grayscale-0 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-white/20 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_library</span>
                    <p className="text-[10px] font-berkeley-mono text-white/30 uppercase tracking-widest">Library</p>
                  </div>
                  <div className="rounded-xl ghost-border w-full aspect-video bg-gradient-to-br from-emerald-900/60 to-teal-900/30 grayscale hover:grayscale-0 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-white/20 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
                    <p className="text-[10px] font-berkeley-mono text-white/30 uppercase tracking-widest">Eng Lab</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl ghost-border w-full aspect-square bg-gradient-to-br from-purple-900/60 to-violet-900/30 grayscale hover:grayscale-0 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-white/20 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                    <p className="text-[10px] font-berkeley-mono text-white/30 uppercase tracking-widest">Social Hub</p>
                  </div>
                  <div className="rounded-xl ghost-border w-full aspect-[3/4] bg-gradient-to-br from-amber-900/60 to-orange-900/30 grayscale hover:grayscale-0 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-white/20 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>storage</span>
                    <p className="text-[10px] font-berkeley-mono text-white/30 uppercase tracking-widest">Data Center</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Events Horizontal Scroller ─── */}
      <section className="px-6 py-24 pb-0 max-w-7xl mx-auto">
        <motion.h2
          {...fadeUpBlur}
          className="text-3xl font-bold tracking-tight text-white mb-12 font-satoshi"
        >
          Upcoming Events
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide no-scrollbar"
        >
          {upcomingEvents.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 rounded-xl overflow-hidden ghost-border">
                <div className="h-40 skeleton-shimmer"></div>
                <div className="p-6 space-y-3">
                  <div className="h-5 w-2/3 skeleton-shimmer rounded-lg"></div>
                  <div className="h-3 w-full skeleton-shimmer rounded-lg"></div>
                  <div className="h-3 w-1/2 skeleton-shimmer rounded-lg"></div>
                </div>
              </div>
            ))
            : upcomingEvents.map((event, i) => {
              const d = event.date ? new Date(event.date) : null;
              const dateLabel = d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : '';
              const icon = CATEGORY_ICON[event.category] || 'event';
              const gradient = CATEGORY_GRADIENT[event.category] || 'from-primary/20 to-primary/5';
              return (
            <SpotlightCard
              key={event._id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: APPLE }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="flex-shrink-0 w-80 bg-surface-container-high rounded-xl overflow-hidden ghost-border group cursor-pointer hover:shadow-2xl hover:shadow-black/30 hover:border-primary/10 transition-all duration-300"
              onClick={() => navigate('/events')}
            >
              <div className={`h-40 relative overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out`}>
                <span className="material-symbols-outlined text-white/20 text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-berkeley-mono px-2 py-1 rounded">{dateLabel}</div>
                {event.status === 'past' && (
                  <div className="absolute top-4 right-4 bg-surface-container-high/80 text-outline text-[10px] font-mono px-2 py-0.5 rounded uppercase">Past</div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-berkeley-mono text-outline">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {event.location || 'CBIT Kolar'}
                </div>
              </div>
            </SpotlightCard>
            );})}
        </motion.div>
      </section>

      <SectionDivider />

      {/* ─── CTA Section ─── */}
      <motion.section
        {...fadeUpBlur}
        className="py-24 px-6"
      >
        <div className="max-w-5xl mx-auto glass-panel rounded-2xl p-12 text-center ghost-border relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold tracking-tighter text-white mb-6 font-satoshi">Ready to upgrade your campus experience?</h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-2xl mx-auto">Join thousands of students and faculty members who are already navigating the future of education on Nex Campus.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={() => navigate('/signup')} className="btn-ripple bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:scale-[1.02] hover:brightness-110 active:scale-[0.97] transition-all duration-200">Get Started Free</button>
              <button onClick={() => navigate('/portal')} className="btn-ripple bg-surface-container-high text-white px-8 py-3 rounded-lg font-bold ghost-border hover:bg-surface-variant hover:scale-[1.02] active:scale-[0.97] transition-all duration-200">Request Demo</button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default Home;
