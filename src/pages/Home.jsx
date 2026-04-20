import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUpBlur, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const APPLE = [0.22, 1, 0.36, 1];

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

const SectionDivider = () => (
  <div className="flex justify-center py-6" aria-hidden="true">
    <div className="h-px w-48 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
  </div>
);

const StatCount = ({ value, label, color }) => {
  const { value: count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="p-4 bg-surface-container-high rounded-lg border border-outline-variant/20">
      <p className={`font-mono text-xl mb-1 font-bold ${color}`}>
        {value !== null ? count : '—'}
      </p>
      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{label}</p>
    </div>
  );
};

const FacilitiesStats = ({ stats }) => (
  <div className="grid grid-cols-2 gap-4">
    <StatCount value={stats.facilities} label="Facilities" color="text-primary" />
    <StatCount value={stats.courses}    label="Courses"    color="text-primary" />
  </div>
);

const StatsCard = ({ stats }) => (
  <div className="bg-surface-container-high border border-outline-variant/20 rounded-xl p-6 w-full">
    <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-5 font-medium">Campus at a glance</p>
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Courses',    val: stats.courses,    icon: 'school' },
        { label: 'Events',     val: stats.events,     icon: 'event' },
        { label: 'Facilities', val: stats.facilities, icon: 'domain' },
      ].map(({ label, val, icon }) => (
        <div key={label} className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-lg">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
          <p className="font-bold text-2xl text-white">{val !== null ? val : '—'}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{label}</p>
        </div>
      ))}
    </div>
    <div className="mt-5 flex items-center gap-2 text-xs text-on-surface-variant">
      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
      All systems operational · CBIT Kolar
    </div>
  </div>
);

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

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({ courses: null, events: null, facilities: null });
  const [attendanceStr, setAttendanceStr] = useState('95%+');

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
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
      const courses    = Array.isArray(coursesRes.data)    ? coursesRes.data    : [];
      const events     = Array.isArray(eventsRes.data)     ? eventsRes.data     : [];
      const facilities = Array.isArray(facilitiesRes.data) ? facilitiesRes.data : [];
      setFeaturedCourses(courses.slice(0, 3));
      setUpcomingEvents(events.slice(0, 4));
      setStats({ courses: courses.length, events: events.length, facilities: facilities.length });
    });
  }, []);

  return (
    <motion.main {...pageTransition} className="min-h-screen">

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-40 px-8 overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10"
        >
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: APPLE }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant/20 rounded-full text-primary text-xs font-mono uppercase tracking-widest"
            >
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              CBIT KOLAR · APRIL 2026
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.95] text-white font-satoshi flex flex-wrap gap-x-[0.3em] gap-y-1">
              {['Built', 'for', 'CBIT'].map((word, i) => (
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
                transition={{ duration: 0.6, delay: 0.4, ease: APPLE }}
                className="inline-block text-primary"
              >
                Students
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-xl text-on-surface-variant max-w-xl leading-relaxed"
            >
              Everything you need for classes and campus life — attendance, timetables, study materials, and events, all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate('/portal')}
                className="btn-ripple bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#34d399] hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 flex items-center gap-2"
                aria-label="Open Portal"
              >
                Open Portal
                <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="btn-ripple bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-bold text-lg border border-outline-variant/20 hover:bg-surface-variant hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
              >
                Browse Courses
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-5"
          >
            <StatsCard stats={stats} />
          </motion.div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* ─── Feature Bento Grid ─── */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUpBlur} className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6 font-satoshi">Your campus, in one place</h2>
            <p className="text-on-surface-variant text-lg">Track attendance, access courses, and stay connected with campus life.</p>
          </motion.div>

          <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Large card */}
            <motion.div
              {...staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: APPLE }}
              className="md:col-span-8 bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/10 flex flex-col hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-10 flex-1">
                <span className="material-symbols-outlined text-primary mb-6 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                <h3 className="text-4xl font-bold tracking-tight mb-4 text-white">Everything in One Place</h3>
                <p className="text-on-surface-variant text-lg max-w-md">Courses, events, facilities, and your academic data — all in one dashboard.</p>
              </div>
              <div className="flex-shrink-0 w-full bg-surface-container/50 flex items-end justify-center px-8 pb-8 pt-4 gap-4">
                {[
                  { label: 'Courses',    val: stats.courses,    icon: 'school' },
                  { label: 'Events',     val: stats.events,     icon: 'event' },
                  { label: 'Facilities', val: stats.facilities, icon: 'domain' },
                ].map(({ label, val, icon }) => (
                  <div key={label} className="flex-1 bg-surface-container py-4 px-2 border border-outline-variant/10 flex flex-col items-center gap-1 rounded-xl">
                    <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    <p className="font-mono text-3xl font-bold text-primary leading-none mt-1">{val !== null ? val : '—'}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tall card */}
            <motion.div
              {...staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: APPLE }}
              className="md:col-span-4 bg-surface-container-high rounded-xl p-8 border border-outline-variant/10 overflow-hidden hover:border-primary/30 transition-all duration-300"
            >
              <div className="h-full flex flex-col">
                <span className="material-symbols-outlined text-primary mb-4 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
                <h3 className="text-3xl font-bold tracking-tight mb-2 text-white">Quick Access</h3>
                <p className="text-on-surface-variant mb-8 text-lg">Get to what you need without hunting through multiple portals.</p>
                <div className="mt-auto space-y-3">
                  <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="material-symbols-outlined text-primary text-sm">event</span>
                      <span className="text-xs text-on-surface-variant">Upcoming events</span>
                    </div>
                    <p className="text-sm text-white font-semibold pl-7">{stats.events !== null ? `${stats.events} scheduled` : '—'}</p>
                  </div>
                  <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="material-symbols-outlined text-primary text-sm">school</span>
                      <span className="text-xs text-on-surface-variant">Active courses</span>
                    </div>
                    <p className="text-sm text-white font-semibold pl-7">{stats.courses !== null ? `${stats.courses} courses` : '—'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Wide short card */}
            <motion.div
              {...staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: APPLE }}
              className="md:col-span-5 bg-surface-container-high rounded-xl p-8 border border-outline-variant/10 flex items-center gap-6 hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-1/2">
                <h3 className="text-3xl font-bold tracking-tight mb-2 text-white">Campus Facilities</h3>
                <p className="text-lg text-on-surface-variant">Book rooms and check availability.</p>
              </div>
              <div className="w-1/2 h-32 bg-surface-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/30 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
              </div>
            </motion.div>

            {/* Wide tall card */}
            <motion.div
              {...staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: APPLE }}
              className="md:col-span-7 bg-surface-container-high text-white rounded-xl p-8 flex justify-between items-center overflow-hidden border border-outline-variant/10 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-bold tracking-tight mb-2 text-white">Academic Portal</h3>
                <p className="text-on-surface-variant max-w-xs text-lg">Track grades, attendance, and course materials in one place.</p>
              </div>
              <span className="material-symbols-outlined text-8xl opacity-5 absolute -right-4 -bottom-4" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              <button
                onClick={() => navigate('/portal')}
                className="btn-ripple relative z-[1] bg-primary text-on-primary px-6 py-3 rounded-lg font-bold hover:bg-[#34d399] hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
              >
                Open Portal
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Attendance Section ─── */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            {...fadeUpBlur}
            transition={{ duration: 0.7, ease: APPLE }}
            className="order-2 lg:order-1 flex items-center justify-center"
          >
            <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl p-12 flex flex-col items-center gap-4 max-w-xs w-full">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
              <span className="text-5xl font-bold text-white">{attendanceStr}</span>
              <span className="text-sm text-on-surface-variant text-center">
                {user ? 'Your average attendance' : 'Average student attendance'}
              </span>
            </div>
          </motion.div>

          <motion.div
            {...fadeUpBlur}
            transition={{ duration: 0.7, delay: 0.15, ease: APPLE }}
            className="order-1 lg:order-2 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-satoshi">Built for students who value their time</h2>
            <p className="text-on-surface-variant text-xl leading-relaxed">
              Nex Campus keeps your attendance, timetables, and course materials in one place — no more juggling three different portals before 8 AM.
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">auto_graph</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Attendance Tracking</h4>
                  <p className="text-on-surface-variant text-sm">Auto-updated attendance that reflects changes in real-time.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Study Materials</h4>
                  <p className="text-on-surface-variant text-sm">Access module PDFs and timetables without navigating scattered portals.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Featured Sections ─── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-32">

          {/* Featured Courses */}
          <div>
            <motion.div {...fadeUpBlur} className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2 font-satoshi">Featured Courses</h2>
                <p className="text-on-surface-variant">Your semester courses at CBIT Kolar.</p>
              </div>
              <button
                onClick={() => navigate('/courses')}
                className="text-primary hover:underline font-semibold flex items-center gap-1 hover:scale-[1.02] transition-transform duration-200"
              >
                Explore Catalog
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </motion.div>

            <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <div className="aspect-[16/10] skeleton-shimmer rounded-xl mb-4"></div>
                    <div className="h-5 w-2/3 skeleton-shimmer rounded-lg mb-2"></div>
                    <div className="h-3 w-1/3 skeleton-shimmer rounded-lg"></div>
                  </div>
                ))
                : featuredCourses.map((course) => (
                  <motion.div
                    key={course._id}
                    {...staggerItem}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: APPLE }}
                    className="group cursor-pointer rounded-xl transition-all duration-300"
                    onClick={() => navigate('/courses')}
                  >
                    <div className="aspect-[16/10] bg-surface-container-low rounded-xl overflow-hidden mb-4 border border-outline-variant/10 flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-on-surface-variant/20 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                      <div className="absolute top-3 left-3">
                        <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">{course.code}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-sm text-on-surface-variant">{course.instructor} · {course.credits} Credits</p>
                  </motion.div>
                ))}
            </motion.div>
          </div>

          {/* Facilities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div {...fadeUpBlur} className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white font-satoshi">Campus facilities</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Labs, library, and common spaces — all on the CBIT Kolar campus. Check availability and see what's open.
              </p>
              <FacilitiesStats stats={stats} />
              <button
                onClick={() => navigate('/facilities')}
                className="bg-surface-container-high text-white px-6 py-3 rounded-lg font-bold border border-outline-variant/20 w-full hover:bg-surface-variant hover:scale-[1.02] transition-all duration-200"
              >
                Explore Campus Map
              </button>
            </motion.div>

            <motion.div
              {...fadeUpBlur}
              transition={{ duration: 0.7, delay: 0.15, ease: APPLE }}
              className="lg:col-span-7"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="rounded-xl shadow-lg relative group overflow-hidden w-full aspect-[3/4] bg-surface-container flex flex-col items-center justify-center gap-3">
                    <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop" alt="Library" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:-translate-y-2 transition-all duration-500 ease-in-out" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10 pointer-events-none" />
                    <div className="relative z-20 flex flex-col items-center gap-2 pointer-events-none">
                      <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>local_library</span>
                      <p className="text-[10px] font-mono text-white uppercase tracking-widest font-bold drop-shadow-md">Library</p>
                    </div>
                  </div>
                  <div className="rounded-xl shadow-lg relative group overflow-hidden w-full aspect-video bg-surface-container flex flex-col items-center justify-center gap-3">
                    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop" alt="CS Lab" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:-translate-y-2 transition-all duration-500 ease-in-out" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10 pointer-events-none" />
                    <div className="relative z-20 flex flex-col items-center gap-2 pointer-events-none">
                      <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
                      <p className="text-[10px] font-mono text-white uppercase tracking-widest font-bold drop-shadow-md">CS Lab</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl shadow-lg relative group overflow-hidden w-full aspect-square bg-surface-container flex flex-col items-center justify-center gap-3">
                    <img src="https://images.unsplash.com/photo-1572204292164-b35ba943fca7?w=600&h=400&fit=crop" alt="Common Area" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:-translate-y-2 transition-all duration-500 ease-in-out" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10 pointer-events-none" />
                    <div className="relative z-20 flex flex-col items-center gap-2 pointer-events-none">
                      <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                      <p className="text-[10px] font-mono text-white uppercase tracking-widest font-bold drop-shadow-md">Common Area</p>
                    </div>
                  </div>
                  <div className="rounded-xl shadow-lg relative group overflow-hidden w-full aspect-[3/4] bg-surface-container flex flex-col items-center justify-center gap-3">
                    <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop" alt="Server Room" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:-translate-y-2 transition-all duration-500 ease-in-out" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10 pointer-events-none" />
                    <div className="relative z-20 flex flex-col items-center gap-2 pointer-events-none">
                      <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>storage</span>
                      <p className="text-[10px] font-mono text-white uppercase tracking-widest font-bold drop-shadow-md">Server Room</p>
                    </div>
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
        <motion.h2 {...fadeUpBlur} className="text-3xl font-bold tracking-tight text-white mb-12 font-satoshi">
          Upcoming Events
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide no-scrollbar mask-fade-y"
        >
          {upcomingEvents.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 rounded-xl overflow-hidden border border-outline-variant/10">
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
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: APPLE }}
                  whileHover={{ y: -4 }}
                  className="flex-shrink-0 w-80 bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/10 group cursor-pointer hover:border-primary/30 transition-all duration-300"
                  onClick={() => navigate('/events')}
                >
                  <div className="h-40 relative overflow-hidden bg-surface-container flex items-center justify-center">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:-translate-y-2" />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-white/10 text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-500 z-10 pointer-events-none" />
                    <div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-mono px-2 py-1 rounded shadow-lg z-20">{dateLabel}</div>
                    {event.status === 'past' && (
                      <div className="absolute top-4 right-4 bg-surface-container-highest/90 text-on-surface-variant text-[10px] font-mono px-2 py-1 rounded-sm uppercase tracking-widest border border-outline-variant/30 z-20">Past</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {event.location || 'CBIT Kolar'}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>
      </section>

      <SectionDivider />

      {/* ─── CTA ─── */}
      <motion.section {...fadeUpBlur} className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-surface-container-high rounded-2xl p-12 text-center border border-outline-variant/20 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold tracking-tighter text-white mb-6 font-satoshi">Ready to get started?</h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-2xl mx-auto">
              Join students and faculty already using Nex Campus to manage their academic life at CBIT Kolar.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => navigate('/signup')}
                className="btn-ripple bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:bg-[#34d399] hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/portal')}
                className="btn-ripple bg-surface-container text-white px-8 py-3 rounded-lg font-bold border border-outline-variant/20 hover:bg-surface-variant hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
              >
                View Portal
              </button>
            </div>
          </div>
        </div>
      </motion.section>

    </motion.main>
  );
};

export default Home;
