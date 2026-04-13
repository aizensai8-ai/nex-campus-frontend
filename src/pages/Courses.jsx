import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { fadeUp, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import api from '../lib/api';

const SkeletonCard = () => (
  <div className="outline outline-1 outline-outline-variant/15 bg-surface-container-low p-6 flex flex-col justify-between rounded-lg animate-pulse">
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="h-3 w-16 bg-surface-container-high rounded"></div>
      </div>
      <div className="h-5 w-3/4 bg-surface-container-high rounded mb-2"></div>
      <div className="h-4 w-full bg-surface-container-high rounded mb-1"></div>
      <div className="h-4 w-2/3 bg-surface-container-high rounded mb-6"></div>
    </div>
    <div className="space-y-4 pt-6 border-t border-outline-variant/10">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-surface-container-high"></div>
        <div className="h-3 w-24 bg-surface-container-high rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-28 bg-surface-container-high rounded"></div>
        <div className="h-3 w-16 bg-surface-container-high rounded"></div>
      </div>
    </div>
  </div>
);

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    api.get('/api/courses')
      .then((res) => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load courses. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.title?.toLowerCase().includes(q) ||
      c.code?.toLowerCase().includes(q) ||
      c.instructor?.toLowerCase().includes(q)
    );
  });

  return (
    <motion.main
      {...pageTransition}
      className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto"
    >
      <motion.section {...fadeUp} className="mb-16">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 font-satoshi">
            Expand your <span className="text-primary">intelligence</span> footprint.
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Access the complete directory of next-generation curriculum. From Quantum Computing to Ethical AI, browse our specialized campus offerings.
          </p>
          <div className="relative max-w-2xl group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full bg-surface-container-high border-none rounded-lg pl-12 pr-4 py-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              placeholder="Search by course name, code, or instructor..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium text-outline bg-surface-container rounded border border-outline-variant/20">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
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
      ) : (
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-4 block">search_off</span>
              No courses found matching your search.
            </div>
          ) : filtered.map((course) => (
            <motion.div
              key={course._id ?? course.code}
              {...staggerItem}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="outline outline-1 outline-outline-variant/15 bg-surface-container-low p-6 flex flex-col justify-between hover:bg-surface-container transition-colors duration-300 group rounded-lg cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-xs text-primary font-medium">{course.code}</span>
                  {course.badge && (
                    <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">{course.badge}</span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-primary transition-colors">{course.title}</h2>
                <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">{course.description ?? course.desc}</p>
              </div>
              <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                <div className="flex items-center gap-3">
                  {course.avatar && (
                    <img alt="Instructor" className="w-6 h-6 rounded-full object-cover" src={course.avatar} />
                  )}
                  <span className="text-xs text-on-surface font-medium">{course.instructor}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-outline uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {course.schedule}
                  </span>
                  <span>{course.credits}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.main>
  );
};

export default Courses;
