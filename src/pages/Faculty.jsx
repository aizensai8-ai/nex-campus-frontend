import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpBlur, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import api from '../lib/api';

const APPLE = [0.22, 1, 0.36, 1];

// Static enrichment: keyed by instructor name from courses API.
// Provides designation, cabin, officeHours, specialization, email.
const FACULTY_PROFILES = {
  // CSE
  'Dr. Rajesh Kumar':      { designation: 'Professor & HOD', cabin: 'CSE Block, Room 101', officeHours: 'Mon–Fri, 10–12 AM', specialization: 'Distributed Systems, Cloud Computing', email: 'rajesh.kumar@cbit.ac.in' },
  'Dr. Anitha Rao':        { designation: 'Professor',        cabin: 'CSE Block, Room 104', officeHours: 'Tue & Thu, 2–4 PM',  specialization: 'Machine Learning, Data Mining',         email: 'anitha.rao@cbit.ac.in' },
  'Prof. Suresh Nair':     { designation: 'Associate Professor', cabin: 'CSE Block, Room 107', officeHours: 'Mon & Wed, 11 AM–1 PM', specialization: 'Computer Networks, Security',    email: 'suresh.nair@cbit.ac.in' },
  'Dr. Kavitha Menon':     { designation: 'Associate Professor', cabin: 'CSE Block, Room 109', officeHours: 'Fri, 9–11 AM',      specialization: 'Compiler Design, OS',                 email: 'kavitha.menon@cbit.ac.in' },
  'Prof. Arun Sharma':     { designation: 'Assistant Professor',  cabin: 'CSE Block, Room 112', officeHours: 'Mon–Fri, 3–4 PM',  specialization: 'Web Technologies, JavaScript',        email: 'arun.sharma@cbit.ac.in' },
  'Prof. Deepika S':       { designation: 'Assistant Professor',  cabin: 'CSE Block, Room 113', officeHours: 'Wed & Fri, 2–3 PM', specialization: 'Data Structures, Algorithms',         email: 'deepika.s@cbit.ac.in' },
  // AIML
  'Dr. Priya Venkatesh':   { designation: 'Professor & HOD', cabin: 'AIML Block, Room 201', officeHours: 'Tue & Thu, 10 AM–12 PM', specialization: 'Deep Learning, Computer Vision',   email: 'priya.venkatesh@cbit.ac.in' },
  'Dr. Kiran Reddy':       { designation: 'Professor',        cabin: 'AIML Block, Room 205', officeHours: 'Mon & Wed, 2–4 PM',    specialization: 'NLP, Transformers, LLMs',            email: 'kiran.reddy@cbit.ac.in' },
  'Prof. Sneha Kulkarni':  { designation: 'Associate Professor', cabin: 'AIML Block, Room 208', officeHours: 'Fri, 10 AM–12 PM', specialization: 'Reinforcement Learning, Robotics',   email: 'sneha.kulkarni@cbit.ac.in' },
  'Prof. Arjun Hegde':     { designation: 'Assistant Professor',  cabin: 'AIML Block, Room 210', officeHours: 'Mon–Fri, 4–5 PM',  specialization: 'Statistics, Python, MLOps',           email: 'arjun.hegde@cbit.ac.in' },
  // ISE
  'Dr. Meena Krishnan':    { designation: 'Professor & HOD', cabin: 'ISE Block, Room 301', officeHours: 'Mon & Thu, 10–12 AM',  specialization: 'Information Security, Cryptography', email: 'meena.krishnan@cbit.ac.in' },
  'Prof. Ravi Prasad':     { designation: 'Associate Professor', cabin: 'ISE Block, Room 305', officeHours: 'Tue & Fri, 11 AM–1 PM', specialization: 'Web Development, Cloud',          email: 'ravi.prasad@cbit.ac.in' },
  'Prof. Usha Bhat':       { designation: 'Assistant Professor',  cabin: 'ISE Block, Room 308', officeHours: 'Mon–Fri, 3–4 PM',  specialization: 'Database Systems, Big Data',          email: 'usha.bhat@cbit.ac.in' },
  // ECE
  'Dr. Nagaraj Patil':     { designation: 'Professor & HOD', cabin: 'ECE Block, Room 401', officeHours: 'Mon–Fri, 9–11 AM',     specialization: 'VLSI Design, Embedded Systems',      email: 'nagaraj.patil@cbit.ac.in' },
  'Dr. Shobha Rani':       { designation: 'Professor',        cabin: 'ECE Block, Room 405', officeHours: 'Tue & Thu, 2–4 PM',   specialization: 'Signal Processing, Communication',   email: 'shobha.rani@cbit.ac.in' },
  'Prof. Mahesh Gowda':    { designation: 'Associate Professor', cabin: 'ECE Block, Room 408', officeHours: 'Wed & Fri, 10 AM–12 PM', specialization: 'Microwave Engineering, Antennas', email: 'mahesh.gowda@cbit.ac.in' },
  'Prof. Divya Shetty':    { designation: 'Assistant Professor',  cabin: 'ECE Block, Room 410', officeHours: 'Mon–Fri, 3–5 PM',  specialization: 'Digital Electronics, Microcontrollers', email: 'divya.shetty@cbit.ac.in' },
  // EEE
  'Dr. Venkatesh Murthy':  { designation: 'Professor & HOD', cabin: 'EEE Block, Room 501', officeHours: 'Mon & Wed, 10–12 AM', specialization: 'Power Systems, Smart Grid',           email: 'venkatesh.murthy@cbit.ac.in' },
  'Prof. Lakshmi Devi':    { designation: 'Associate Professor', cabin: 'EEE Block, Room 504', officeHours: 'Tue & Thu, 2–4 PM', specialization: 'Control Systems, Drives',             email: 'lakshmi.devi@cbit.ac.in' },
  'Prof. Sunil Kumar B':   { designation: 'Assistant Professor',  cabin: 'EEE Block, Room 507', officeHours: 'Fri, 10 AM–12 PM', specialization: 'Power Electronics, Renewable Energy', email: 'sunil.kumarb@cbit.ac.in' },
  // Civil
  'Dr. Ramesh Babu':       { designation: 'Professor & HOD', cabin: 'Civil Block, Room 601', officeHours: 'Mon–Fri, 9–11 AM',  specialization: 'Structural Engineering, Concrete',   email: 'ramesh.babu@cbit.ac.in' },
  'Prof. Geeta Naik':      { designation: 'Associate Professor', cabin: 'Civil Block, Room 604', officeHours: 'Tue & Fri, 2–4 PM', specialization: 'Geotechnical Engg., Foundation',  email: 'geeta.naik@cbit.ac.in' },
  'Prof. Santhosh M':      { designation: 'Assistant Professor',  cabin: 'Civil Block, Room 607', officeHours: 'Wed, 11 AM–1 PM', specialization: 'Environmental Engg., Water Supply',  email: 'santhosh.m@cbit.ac.in' },
  // Mechanical
  'Dr. Prakash Rao':       { designation: 'Professor & HOD', cabin: 'Mech Block, Room 701', officeHours: 'Mon & Thu, 9–11 AM', specialization: 'Thermodynamics, Heat Transfer',       email: 'prakash.rao@cbit.ac.in' },
  'Dr. Savita Jain':       { designation: 'Professor',        cabin: 'Mech Block, Room 705', officeHours: 'Tue & Fri, 2–4 PM',  specialization: 'CAD/CAM, Manufacturing Technology',   email: 'savita.jain@cbit.ac.in' },
  'Prof. Aditya Kumar':    { designation: 'Associate Professor', cabin: 'Mech Block, Room 708', officeHours: 'Mon & Wed, 11 AM–1 PM', specialization: 'Machine Design, Kinematics',      email: 'aditya.kumar@cbit.ac.in' },
};

const DEPT_LABELS = {
  'Computer Science':      { short: 'CSE',   color: 'text-blue-400',   bg: 'bg-blue-400/10'   },
  'Artificial Intelligence':{ short: 'AIML', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  'Data Science':          { short: 'ISE',   color: 'text-cyan-400',   bg: 'bg-cyan-400/10'   },
  'Engineering':           { short: 'Engg.', color: 'text-green-400',  bg: 'bg-green-400/10'  },
  'Physics & Math':        { short: 'Sci.',  color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  'General':               { short: 'Gen.',  color: 'text-orange-400', bg: 'bg-orange-400/10' },
  'Other':                 { short: 'Misc.', color: 'text-outline',    bg: 'bg-surface-container' },
};

const DESIG_ORDER = ['Professor & HOD', 'Professor', 'Associate Professor', 'Assistant Professor'];

const FacultyModal = ({ faculty, onClose }) => {
  const profile = FACULTY_PROFILES[faculty.name] || {};
  const deptMeta = DEPT_LABELS[faculty.department] || DEPT_LABELS['Other'];

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-surface-container-low rounded-2xl w-full max-w-lg border border-outline-variant/10 shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0, transition: { duration: 0.25, ease: APPLE } }}
        exit={{ scale: 0.95, opacity: 0, y: 10, transition: { duration: 0.18 } }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-outline-variant/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${deptMeta.bg} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-2xl font-bold font-mono ${deptMeta.color}`}>
                  {faculty.name.split(' ').filter(p => /^[A-Z]/.test(p)).slice(0, 2).map(p => p[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{faculty.name}</h2>
                <p className={`text-xs font-semibold mt-0.5 ${deptMeta.color}`}>{profile.designation || 'Faculty'}</p>
                <p className="text-xs text-outline">{faculty.department}</p>
              </div>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {profile.specialization && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Specialization</p>
              <p className="text-sm text-on-surface">{profile.specialization}</p>
            </div>
          )}

          {faculty.subjects.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Subjects Taught</p>
              <div className="flex flex-wrap gap-2">
                {faculty.subjects.map(s => (
                  <span key={s.code} className="px-2.5 py-1 bg-surface-container rounded-lg text-xs text-on-surface-variant border border-outline-variant/10">
                    <span className="font-mono text-primary mr-1.5">{s.code}</span>{s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {profile.cabin && (
              <div className="p-3 bg-surface-container rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Cabin</p>
                <p className="text-xs text-on-surface">{profile.cabin}</p>
              </div>
            )}
            {profile.officeHours && (
              <div className="p-3 bg-surface-container rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">Office Hours</p>
                <p className="text-xs text-on-surface">{profile.officeHours}</p>
              </div>
            )}
          </div>

          {profile.email && (
            <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl">
              <span className="material-symbols-outlined text-outline text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              <a href={`mailto:${profile.email}`} className="text-sm text-primary hover:underline">{profile.email}</a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const FacultyCard = ({ faculty, onClick }) => {
  const profile = FACULTY_PROFILES[faculty.name] || {};
  const deptMeta = DEPT_LABELS[faculty.department] || DEPT_LABELS['Other'];
  const initials = faculty.name.split(' ').filter(p => /^[A-Z]/.test(p)).slice(0, 2).map(p => p[0]).join('');

  return (
    <motion.div {...staggerItem}
      whileHover={{ y: -3 }} transition={{ duration: 0.2, ease: APPLE }}
      onClick={() => onClick(faculty)}
      className="bg-surface-container-low border border-outline-variant/10 hover:border-outline-variant/30 rounded-xl p-4 cursor-pointer transition-all duration-250 group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-11 h-11 rounded-xl ${deptMeta.bg} flex items-center justify-center flex-shrink-0`}>
          <span className={`text-base font-bold font-mono ${deptMeta.color}`}>{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white group-hover:text-white/90 truncate">{faculty.name}</p>
          <p className="text-xs text-on-surface-variant truncate">{profile.designation || 'Faculty'}</p>
        </div>
      </div>

      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${deptMeta.bg} mb-3`}>
        <span className={`text-[10px] font-bold font-mono ${deptMeta.color}`}>{deptMeta.short}</span>
        <span className="text-[10px] text-on-surface-variant">{faculty.department}</span>
      </div>

      {faculty.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {faculty.subjects.slice(0, 3).map(s => (
            <span key={s.code} className="text-[10px] px-2 py-0.5 bg-surface-container rounded text-outline font-mono">{s.code}</span>
          ))}
          {faculty.subjects.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 bg-surface-container rounded text-outline">+{faculty.subjects.length - 3}</span>
          )}
        </div>
      )}

      {profile.cabin && (
        <p className="text-[10px] text-outline mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">room</span>{profile.cabin}
        </p>
      )}
    </motion.div>
  );
};

const DEPT_FILTERS = ['All', 'Computer Science', 'Artificial Intelligence', 'Data Science', 'Engineering', 'General'];

const Faculty = () => {
  const [allFaculty, setAllFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    setLoading(true);
    setApiError(false);
    api.get('/api/courses/faculty')
      .then(res => {
        const fromApi = Array.isArray(res.data) ? res.data : [];

        // Merge API results with static profiles (profiles fill in cabin/hours/email;
        // API fills in subjects. Faculty in static profiles but not in DB still appear.)
        const map = {};
        fromApi.forEach(f => { map[f.name] = f; });

        Object.keys(FACULTY_PROFILES).forEach(name => {
          if (!map[name]) {
            const cabin = FACULTY_PROFILES[name].cabin || '';
            let dept = 'General';
            if (cabin.includes('CSE')) dept = 'Computer Science';
            else if (cabin.includes('AIML')) dept = 'Artificial Intelligence';
            else if (cabin.includes('ISE')) dept = 'Data Science';
            else if (cabin.includes('ECE') || cabin.includes('EEE') || cabin.includes('Civil') || cabin.includes('Mech')) dept = 'Engineering';
            map[name] = { name, department: dept, subjects: [] };
          }
        });

        const list = Object.values(map).sort((a, b) => {
          const da = DESIG_ORDER.indexOf(FACULTY_PROFILES[a.name]?.designation || 'Assistant Professor');
          const db = DESIG_ORDER.indexOf(FACULTY_PROFILES[b.name]?.designation || 'Assistant Professor');
          return da - db;
        });

        setAllFaculty(list);
      })
      .catch(() => {
        setApiError(true);
        const list = Object.entries(FACULTY_PROFILES).map(([name, p]) => {
          const cabin = p.cabin || '';
          let dept = 'General';
          if (cabin.includes('CSE')) dept = 'Computer Science';
          else if (cabin.includes('AIML')) dept = 'Artificial Intelligence';
          else if (cabin.includes('ISE')) dept = 'Data Science';
          else if (cabin.includes('ECE') || cabin.includes('EEE') || cabin.includes('Civil') || cabin.includes('Mech')) dept = 'Engineering';
          return { name, department: dept, subjects: [] };
        });
        setAllFaculty(list);
      })
      .finally(() => setLoading(false));
  }, [retryKey]);

  const filtered = useMemo(() => {
    let list = allFaculty;
    if (deptFilter !== 'All') list = list.filter(f => f.department === deptFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.subjects.some(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) ||
        (FACULTY_PROFILES[f.name]?.specialization || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [allFaculty, deptFilter, search]);

  const deptCounts = useMemo(() => {
    const counts = {};
    allFaculty.forEach(f => { counts[f.department] = (counts[f.department] || 0) + 1; });
    return counts;
  }, [allFaculty]);

  return (
    <>
      <motion.main {...pageTransition} className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto">

        {/* Header */}
        <motion.section {...fadeUpBlur} className="mb-10">
          <div className="max-w-3xl mb-8">
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-outline mb-3">CBIT Kolar — Faculty</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4 font-satoshi leading-tight">
              The people who<br />
              <span className="text-primary">teach here.</span>
            </h1>
            <p className="text-on-surface-variant text-base max-w-xl leading-relaxed">
              Search faculty by name, subject, or specialization. Click any card to see cabin location, office hours, and contact.
            </p>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { label: 'Total Faculty', value: allFaculty.length },
                { label: 'Departments', value: Object.keys(deptCounts).length },
                { label: 'HODs', value: Object.values(FACULTY_PROFILES).filter(p => p.designation?.includes('HOD')).length },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/10 rounded-xl">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-xs text-on-surface-variant">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative max-w-xl mb-5">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl pl-12 pr-4 py-3.5 text-on-surface text-sm placeholder:text-outline focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all outline-none"
              placeholder="Search by name, subject, or specialization..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          {/* Dept filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 md:flex-wrap" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {DEPT_FILTERS.map(d => (
              <button key={d} onClick={() => setDeptFilter(d)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  deptFilter === d
                    ? 'bg-primary/15 text-primary border border-primary/25'
                    : 'bg-surface-container text-on-surface-variant hover:text-white border border-outline-variant/10'
                }`}>
                {d}
                {d !== 'All' && deptCounts[d] ? <span className="ml-1.5 opacity-60">{deptCounts[d]}</span> : null}
              </button>
            ))}
          </div>
        </motion.section>

        {/* NexBot hint */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15 mb-8 max-w-lg">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          <p className="text-xs text-on-surface-variant">
            Ask NexBot <span className="text-primary font-medium">"Who teaches DBMS?"</span> for instant faculty lookup using your timetable.
          </p>
        </div>

        {/* API error banner */}
        {apiError && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/15 mb-6 max-w-lg">
            <span className="material-symbols-outlined text-yellow-400 flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>wifi_off</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-yellow-400">Showing offline directory</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Couldn't reach the server — displaying cached profiles.</p>
            </div>
            <button onClick={() => setRetryKey(k => k + 1)}
              className="text-xs text-primary font-semibold hover:underline flex-shrink-0">
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-3 opacity-30" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
            <p className="font-medium">No faculty matched.</p>
            <p className="text-xs mt-1 opacity-70">Try a different name or subject.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-outline mb-4">{filtered.length} faculty member{filtered.length !== 1 ? 's' : ''}</p>
            <motion.div {...staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(f => (
                <FacultyCard key={f.name} faculty={f} onClick={setSelectedFaculty} />
              ))}
            </motion.div>
          </>
        )}
      </motion.main>

      <AnimatePresence>
        {selectedFaculty && (
          <FacultyModal faculty={selectedFaculty} onClose={() => setSelectedFaculty(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Faculty;
