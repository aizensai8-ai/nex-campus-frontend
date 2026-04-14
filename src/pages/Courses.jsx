import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { fadeUpBlur, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

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
            ? `radial-gradient(350px circle at ${spot.x}px ${spot.y}px, rgba(59,130,246,0.09), transparent 70%)`
            : 'none',
        }}
      />
      {children}
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="outline outline-1 outline-outline-variant/10 bg-surface-container-low p-6 flex flex-col justify-between rounded-xl overflow-hidden">
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="h-3 w-16 skeleton-shimmer rounded-lg"></div>
      </div>
      <div className="h-5 w-3/4 skeleton-shimmer rounded-lg mb-2"></div>
      <div className="h-4 w-full skeleton-shimmer rounded-lg mb-1"></div>
      <div className="h-4 w-2/3 skeleton-shimmer rounded-lg mb-6"></div>
    </div>
    <div className="space-y-4 pt-6 border-t border-outline-variant/10">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full skeleton-shimmer"></div>
        <div className="h-3 w-24 skeleton-shimmer rounded-lg"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-28 skeleton-shimmer rounded-lg"></div>
        <div className="h-3 w-16 skeleton-shimmer rounded-lg"></div>
      </div>
    </div>
  </div>
);

const CourseModal = ({ course, onClose }) => {
  const hasModules = Array.isArray(course.modules) && course.modules.length > 0;

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-surface-container-low rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-outline-variant/10 shadow-2xl"
        initial={{ scale: 0.95, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0, transition: { duration: 0.3, ease: APPLE } }}
        exit={{ scale: 0.95, opacity: 0, y: 16, transition: { duration: 0.2 } }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 pr-4">
              <span className="font-mono text-xs text-primary font-semibold tracking-wider">{course.code}</span>
              <h2 className="text-2xl font-bold text-white mt-1 leading-snug">{course.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{course.description}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-outline">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">person</span>
              {course.instructor}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">school</span>
              {course.credits} {course.credits === 1 ? 'credit' : 'credits'}
            </span>
            {course.section && (
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">groups</span>
                Section {course.section}
              </span>
            )}
          </div>
          {course.schedule && (
            <p className="mt-3 text-xs text-on-surface-variant bg-surface-container rounded-lg px-3 py-2 font-mono leading-relaxed">
              {course.schedule}
            </p>
          )}
        </div>

        {/* Modules / Study Materials */}
        <div className="p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-4">Study Materials</p>

          {hasModules ? (
            <div className="space-y-3">
              {course.modules.map((mod) => (
                <div
                  key={mod.number}
                  className="flex items-center justify-between gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 flex-shrink-0 bg-primary/10 text-primary text-xs font-bold rounded-lg flex items-center justify-center font-mono">
                      M{mod.number}
                    </span>
                    <span className="text-sm text-on-surface font-medium truncate">{mod.title}</span>
                  </div>
                  <a
                    href={mod.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs text-primary font-semibold px-3 py-1.5 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    PDF
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-on-surface-variant">
              <span
                className="material-symbols-outlined text-4xl mb-3 block opacity-30"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                menu_book
              </span>
              <p className="text-sm font-medium">Study materials coming soon</p>
              <p className="text-xs mt-1 opacity-60">Check back later for module PDFs</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const CourseCard = ({ course, onClick }) => (
  <SpotlightCard
    {...staggerItem}
    whileHover={{ y: -6, scale: 1.01, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}
    transition={{ duration: 0.3, ease: APPLE }}
    className="outline outline-1 outline-outline-variant/10 bg-surface-container-low p-6 flex flex-col justify-between hover:bg-surface-container hover:outline-primary/20 transition-all duration-300 group rounded-xl cursor-pointer overflow-hidden"
    onClick={() => onClick(course)}
  >
    <div>
      <div className="flex justify-between items-start mb-6">
        <span className="font-mono text-xs text-primary font-medium">{course.code}</span>
        {course.status === 'new' && (
          <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">New</span>
        )}
        {course.status === 'popular' && (
          <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Popular</span>
        )}
      </div>
      <h2 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-primary transition-colors">{course.name}</h2>
      <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">{course.description}</p>
    </div>
    <div className="space-y-4 pt-6 border-t border-outline-variant/10">
      <div className="flex items-center gap-3">
        <span className="text-xs text-on-surface font-medium">{course.instructor}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] font-mono text-outline uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">schedule</span>
          {course.schedule?.split('·')[0]?.trim() ?? course.schedule}
        </span>
        <span>{course.credits} cr</span>
      </div>
    </div>
  </SpotlightCard>
);

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = user?.section ? `?section=${encodeURIComponent(user.section)}` : '';
    api.get(`/api/courses${params}`)
      .then((res) => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load courses. Please try again later.'))
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.code?.toLowerCase().includes(q) ||
      c.instructor?.toLowerCase().includes(q)
    );
  });

  // When not logged in — group by section
  const grouped = !user
    ? filtered.reduce((acc, c) => {
        const s = c.section || 'Other';
        if (!acc[s]) acc[s] = [];
        acc[s].push(c);
        return acc;
      }, {})
    : null;

  const sectionLabel = user?.section
    ? `Section ${user.section}`
    : null;

  return (
    <>
      <motion.main
        {...pageTransition}
        className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto"
      >
        <motion.section {...fadeUpBlur} className="mb-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 font-satoshi">
              Expand your <span className="text-primary">intelligence</span> footprint.
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mb-4 leading-relaxed">
              {user
                ? `Showing courses for ${sectionLabel ?? 'your section'}. Click any course to view study materials.`
                : 'Access the complete directory of curriculum. Log in to filter by your section and access study materials.'}
            </p>
            {user && (
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filtered: {sectionLabel}
              </div>
            )}
            <div className="relative max-w-2xl group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                className="w-full bg-surface-container-high border-none rounded-lg pl-12 pr-4 py-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                placeholder="Search by course name, code, or instructor..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </motion.section>

        {error && (
          <div className="mb-6 p-4 rounded-md bg-error/10 border border-error/30 text-sm text-red-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : user ? (
          /* ── Logged in: flat grid filtered by section ── */
          <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-4 block">search_off</span>
                No courses found{search ? ' matching your search' : ''}.
              </div>
            ) : filtered.map((course) => (
              <CourseCard
                key={course._id ?? course.code}
                course={course}
                onClick={setSelectedCourse}
              />
            ))}
          </motion.div>
        ) : (
          /* ── Logged out: grouped by section with headers ── */
          filtered.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-4 block">search_off</span>
              No courses found matching your search.
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([section, sectionCourses]) => (
                <div key={section}>
                  <div className="flex items-center gap-4 mb-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
                        {section.startsWith('4') ? '4th Semester' : section.startsWith('6') ? '6th Semester' : 'Courses'}
                      </p>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Section {section}</h2>
                    </div>
                    <div className="flex-1 h-px bg-outline-variant/10 mt-4"></div>
                    <span className="text-xs font-mono text-outline mt-4">{sectionCourses.length} courses</span>
                  </div>
                  <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sectionCourses.map((course) => (
                      <CourseCard
                        key={course._id ?? course.code}
                        course={course}
                        onClick={setSelectedCourse}
                      />
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          )
        )}
      </motion.main>

      {/* ── Course Modal ── */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Courses;
