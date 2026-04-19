import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpBlur, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const APPLE = [0.22, 1, 0.36, 1];

const BRANCHES = [
  {
    id: 'cse', code: 'CSE', name: 'Computer Science & Engineering', shortName: 'Comp. Science',
    description: 'A four-year program covering algorithms, OS, networks, databases, AI/ML, and software engineering. Among the most placed branches at CBIT.',
    icon: 'terminal', intake: 120, facultyCount: 18, duration: '4 Years', degree: 'B.E.',
    department: 'Computer Science',
    labs: ['Programming Lab', 'Advanced Computing Lab', 'Networks Lab', 'AI & ML Lab', 'Project Lab'],
    placementPct: 92, avgPackage: '6.2 LPA', topPackage: '28 LPA',
    topRecruiters: ['Infosys', 'TCS', 'Wipro', 'Cognizant', 'Accenture', 'Amazon', 'Flipkart', 'Capgemini'],
    curriculum: {
      1: ['Engineering Mathematics I', 'Engineering Physics', 'Programming in C', 'Engineering Graphics', 'Kannada / Hindi'],
      2: ['Engineering Mathematics II', 'Data Structures', 'Digital Electronics', 'OOP with Java', 'Constitution of India'],
      3: ['Discrete Maths', 'Design & Analysis of Algorithms', 'Computer Organization', 'Database Management', 'Operating Systems'],
      4: ['Theory of Computation', 'Computer Networks', 'Software Engineering', 'Microprocessors', 'Unix & Shell Programming'],
      5: ['System Software', 'Compiler Design', 'Data Warehousing & Mining', 'Mobile Computing', 'Computer Graphics'],
      6: ['Distributed Computing', 'Cryptography & Network Security', 'Machine Learning', 'Cloud Computing', 'Big Data Analytics'],
      7: ['Internet of Things', 'Natural Language Processing', 'Deep Learning', 'Elective III', 'Elective IV'],
      8: ['Industry Internship', 'Technical Seminar', 'Final Year Project', 'Professional Ethics'],
    },
  },
  {
    id: 'aiml', code: 'AIML', name: 'Artificial Intelligence & Machine Learning', shortName: 'AI & ML',
    description: 'Focused on intelligent systems, neural networks, computer vision, and data-driven decision making. Purpose-built for the next wave of software.',
    icon: 'smart_toy', intake: 60, facultyCount: 12, duration: '4 Years', degree: 'B.E.',
    department: 'Artificial Intelligence',
    labs: ['AI Research Lab', 'Computer Vision Lab', 'NLP Lab', 'GPU Computing Lab'],
    placementPct: 88, avgPackage: '7.1 LPA', topPackage: '32 LPA',
    topRecruiters: ['Google', 'Microsoft', 'Amazon', 'IBM', 'Mu Sigma', 'Fractal Analytics', 'TCS iON', 'Wipro AI'],
    curriculum: {
      1: ['Engineering Mathematics I', 'Engineering Physics', 'Programming in Python', 'Introduction to AI', 'Engineering Graphics'],
      2: ['Engineering Mathematics II', 'Data Structures', 'Statistics & Probability', 'OOP with Python', 'Constitution of India'],
      3: ['Discrete Mathematics', 'Design & Analysis of Algorithms', 'Database Management', 'Linear Algebra for ML', 'Pattern Recognition'],
      4: ['Machine Learning Fundamentals', 'Computer Vision', 'Natural Language Processing', 'Knowledge Representation', 'Python for Data Science'],
      5: ['Deep Learning', 'Reinforcement Learning', 'Speech Processing', 'AI Ethics & Governance', 'Big Data Technologies'],
      6: ['Generative AI', 'Autonomous Systems', 'Explainable AI', 'MLOps & Deployment', 'Research Methodology'],
      7: ['Advanced NLP', 'Computer Vision Applications', 'Edge AI', 'Elective III', 'Elective IV'],
      8: ['Industry Internship', 'Technical Seminar', 'Final Year Project', 'Professional Ethics'],
    },
  },
  {
    id: 'ise', code: 'ISE', name: 'Information Science & Engineering', shortName: 'Info. Science',
    description: 'Bridges software engineering and information management. Covers web tech, cybersecurity, data analytics, and enterprise systems.',
    icon: 'data_object', intake: 60, facultyCount: 14, duration: '4 Years', degree: 'B.E.',
    department: 'Data Science',
    labs: ['Web Technologies Lab', 'Cybersecurity Lab', 'Data Analytics Lab', 'Software Testing Lab'],
    placementPct: 85, avgPackage: '5.8 LPA', topPackage: '22 LPA',
    topRecruiters: ['Infosys', 'HCL', 'Mphasis', 'Mindtree', 'Tech Mahindra', 'Zensar', 'UST Global', 'Hexaware'],
    curriculum: {
      1: ['Engineering Mathematics I', 'Engineering Physics', 'Programming in C', 'Digital Electronics', 'Engineering Graphics'],
      2: ['Engineering Mathematics II', 'Data Structures', 'Web Technologies', 'OOP with Java', 'Constitution of India'],
      3: ['Discrete Mathematics', 'Algorithms', 'Database Systems', 'Computer Networks', 'Operating Systems'],
      4: ['Information Theory', 'Software Engineering', 'Network Security', 'System Administration', 'Shell Scripting'],
      5: ['Data Warehousing', 'Web Services & SOA', 'Information Retrieval', 'Mobile App Development', 'ERP Systems'],
      6: ['Cloud Technologies', 'Cybersecurity', 'Hadoop & Big Data', 'Business Intelligence', 'Research Methods'],
      7: ['Blockchain Technology', 'DevOps', 'Advanced Web Frameworks', 'Elective III', 'Elective IV'],
      8: ['Industry Internship', 'Technical Seminar', 'Final Year Project', 'Professional Ethics'],
    },
  },
  {
    id: 'ece', code: 'ECE', name: 'Electronics & Communication Engineering', shortName: 'Electronics & Comm.',
    description: 'Covers analog/digital electronics, communication systems, signal processing, and embedded systems. Strong bridge between hardware and software.',
    icon: 'developer_board', intake: 60, facultyCount: 16, duration: '4 Years', degree: 'B.E.',
    department: 'Engineering',
    labs: ['Electronics Lab', 'Communication Systems Lab', 'Embedded Systems Lab', 'VLSI Lab', 'Signal Processing Lab'],
    placementPct: 78, avgPackage: '5.2 LPA', topPackage: '18 LPA',
    topRecruiters: ['Bosch', 'Texas Instruments', 'Qualcomm', 'Intel', 'Samsung', 'L&T', 'ISRO', 'DRDO'],
    curriculum: {
      1: ['Engineering Mathematics I', 'Engineering Physics', 'Programming in C', 'Basic Electrical Engg.', 'Engineering Graphics'],
      2: ['Engineering Mathematics II', 'Electronic Devices & Circuits', 'Digital Electronics', 'Network Analysis', 'Constitution of India'],
      3: ['Mathematics III', 'Signals & Systems', 'Analog Communication', 'Field Theory', 'Microcontrollers'],
      4: ['Digital Communication', 'Digital Signal Processing', 'Linear ICs & Applications', 'VLSI Design', 'Microwave Engineering'],
      5: ['Wireless Communication', 'Embedded Systems', 'Antennas & Propagation', 'Advanced DSP', 'OFDM Systems'],
      6: ['Fiber Optic Communication', 'Advanced VLSI', 'RF Circuit Design', 'Speech Processing', 'Research Methods'],
      7: ['5G Networks', 'IoT Systems', 'Radar Technology', 'Elective III', 'Elective IV'],
      8: ['Industry Internship', 'Technical Seminar', 'Final Year Project', 'Professional Ethics'],
    },
  },
  {
    id: 'eee', code: 'EEE', name: 'Electrical & Electronics Engineering', shortName: 'Electrical',
    description: 'Focuses on power systems, electrical machines, control systems, and renewable energy. Strong industry links with the power sector.',
    icon: 'electric_bolt', intake: 60, facultyCount: 14, duration: '4 Years', degree: 'B.E.',
    department: 'Engineering',
    labs: ['Electrical Machines Lab', 'Power Electronics Lab', 'Control Systems Lab', 'Measurements Lab', 'Simulation Lab'],
    placementPct: 75, avgPackage: '4.8 LPA', topPackage: '14 LPA',
    topRecruiters: ['BESCOM', 'KPCL', 'NTPC', 'ABB', 'Siemens', 'Schneider Electric', 'BHEL', 'L&T Power'],
    curriculum: {
      1: ['Engineering Mathematics I', 'Engineering Physics', 'Programming in C', 'Basic Electrical Engg.', 'Engineering Graphics'],
      2: ['Engineering Mathematics II', 'Network Analysis', 'Electronic Devices', 'Electrical Machines I', 'Constitution of India'],
      3: ['Mathematics III', 'Electrical Machines II', 'Power Electronics', 'Control Systems', 'Electromagnetic Fields'],
      4: ['Power Systems I', 'Microcontrollers', 'Electrical Measurements', 'Digital Electronics', 'Signals & Systems'],
      5: ['Power Systems II', 'Drives & Control', 'Power System Protection', 'Flexible AC Transmission', 'Energy Auditing'],
      6: ['Smart Grid', 'Renewable Energy Systems', 'High Voltage Engineering', 'SCADA Systems', 'Research Methods'],
      7: ['Power Quality', 'Electric Vehicles', 'Distribution Automation', 'Elective III', 'Elective IV'],
      8: ['Industry Internship', 'Technical Seminar', 'Final Year Project', 'Professional Ethics'],
    },
  },
  {
    id: 'civil', code: 'Civil', name: 'Civil Engineering', shortName: 'Civil',
    description: 'Covers structural analysis, construction technology, environmental engineering, and infrastructure design. Prepares for both public and private sector.',
    icon: 'apartment', intake: 60, facultyCount: 15, duration: '4 Years', degree: 'B.E.',
    department: 'Engineering',
    labs: ['Concrete Lab', 'Soil Mechanics Lab', 'Fluid Mechanics Lab', 'Survey Lab', 'CAD Lab'],
    placementPct: 70, avgPackage: '4.2 LPA', topPackage: '12 LPA',
    topRecruiters: ['L&T Construction', 'NHAI', 'Shapoorji Pallonji', 'NCC Ltd', 'AECOM', 'KRDCL', 'BBMP', 'DLF'],
    curriculum: {
      1: ['Engineering Mathematics I', 'Engineering Physics', 'Engineering Chemistry', 'Engineering Graphics', 'Basic Civil Engg.'],
      2: ['Engineering Mathematics II', 'Engineering Mechanics', 'Basic Electrical Engg.', 'Surveying I', 'Constitution of India'],
      3: ['Mathematics III', 'Strength of Materials', 'Fluid Mechanics', 'Building Materials', 'Surveying II'],
      4: ['Structural Analysis I', 'Hydraulics', 'Geotechnical Engineering I', 'Concrete Technology', 'Transportation Engg.'],
      5: ['Structural Analysis II', 'Geotechnical Engineering II', 'Environmental Engg.', 'Water Supply Engg.', 'Estimation & Costing'],
      6: ['Design of RC Structures', 'Sewage Treatment', 'Urban Planning', 'Bridge Engineering', 'Research Methods'],
      7: ['Advanced Structural Design', 'Foundation Engineering', 'Construction Management', 'Elective III', 'Elective IV'],
      8: ['Industry Internship', 'Technical Seminar', 'Final Year Project', 'Professional Ethics'],
    },
  },
  {
    id: 'mech', code: 'Mech', name: 'Mechanical Engineering', shortName: 'Mechanical',
    description: 'Covers thermodynamics, machine design, manufacturing processes, and fluid dynamics. Strong foundation for core engineering and product development.',
    icon: 'settings', intake: 60, facultyCount: 15, duration: '4 Years', degree: 'B.E.',
    department: 'Engineering',
    labs: ['Thermodynamics Lab', 'Manufacturing Lab', 'CAD/CAM Lab', 'Strength of Materials Lab', 'Fluid Mechanics Lab'],
    placementPct: 72, avgPackage: '4.5 LPA', topPackage: '13 LPA',
    topRecruiters: ['TATA Motors', 'Mahindra', 'Bajaj Auto', 'Toyota', 'Bosch', 'Atlas Copco', 'ISRO', 'HAL'],
    curriculum: {
      1: ['Engineering Mathematics I', 'Engineering Physics', 'Engineering Chemistry', 'Engineering Graphics', 'Basic Mechanical Engg.'],
      2: ['Engineering Mathematics II', 'Engineering Mechanics', 'Thermodynamics', 'Basic Electrical Engg.', 'Constitution of India'],
      3: ['Mathematics III', 'Mechanics of Materials', 'Fluid Mechanics', 'Manufacturing Technology I', 'Metal Casting'],
      4: ['Machine Design', 'Heat Transfer', 'Kinematics of Machines', 'Manufacturing Technology II', 'Metrology'],
      5: ['Design of Machine Elements', 'Turbo Machines', 'Dynamics of Machines', 'Industrial Engineering', 'Finite Element Analysis'],
      6: ['Automobile Engineering', 'Refrigeration & Air Conditioning', 'CNC & CAM', 'Robotics', 'Research Methods'],
      7: ['Advanced Manufacturing', 'Product Design', 'Mechatronics', 'Elective III', 'Elective IV'],
      8: ['Industry Internship', 'Technical Seminar', 'Final Year Project', 'Professional Ethics'],
    },
  },
];

const COLOR = {
  cse:   { text: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/20',   dot: '#60a5fa' },
  aiml:  { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', dot: '#a78bfa' },
  ise:   { text: 'text-cyan-400',   bg: 'bg-cyan-400/10',   border: 'border-cyan-400/20',   dot: '#22d3ee' },
  ece:   { text: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/20',  dot: '#4ade80' },
  eee:   { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', dot: '#facc15' },
  civil: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', dot: '#fb923c' },
  mech:  { text: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/20',    dot: '#f87171' },
};

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const BranchDetail = ({ branch, onClose }) => {
  const [tab, setTab] = useState('overview');
  const [semTab, setSemTab] = useState(1);
  const [liveCourses, setLiveCourses] = useState([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const { user } = useAuth();
  const c = COLOR[branch.id] || COLOR.cse;

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (tab !== 'courses') return;
    setLoadingLive(true);
    api.get(`/api/courses?department=${encodeURIComponent(branch.department)}&limit=50`)
      .then(res => setLiveCourses(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoadingLive(false));
  }, [tab, branch.department]);

  const subjects = branch.curriculum[semTab] || [];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-surface-container-low rounded-2xl w-full max-w-3xl max-h-[88vh] overflow-hidden flex flex-col border border-outline-variant/10 shadow-2xl"
        initial={{ scale: 0.95, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0, transition: { duration: 0.28, ease: APPLE } }}
        exit={{ scale: 0.95, opacity: 0, y: 12, transition: { duration: 0.18 } }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                <span className={`material-symbols-outlined text-2xl ${c.text}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}>{branch.icon}</span>
              </div>
              <div>
                <span className={`text-xs font-mono font-bold tracking-wider ${c.text}`}>{branch.code} · {branch.degree}</span>
                <h2 className="text-xl font-bold text-white leading-tight mt-0.5">{branch.name}</h2>
              </div>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed mt-3 mb-4">{branch.description}</p>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: 'group', label: `${branch.intake} intake` },
              { icon: 'person_check', label: `${branch.facultyCount} faculty` },
              { icon: 'trending_up', label: `${branch.placementPct}% placed` },
              { icon: 'payments', label: `Avg. ${branch.avgPackage}` },
              { icon: 'star', label: `Top ${branch.topPackage}` },
            ].map(s => (
              <span key={s.label} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-outline" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                {s.label}
              </span>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5 bg-surface-container rounded-lg p-1 w-fit">
            {[['overview', 'Overview'], ['curriculum', 'Curriculum'], ['courses', 'Live Courses']].map(([v, l]) => (
              <button key={v} onClick={() => setTab(v)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === v ? 'bg-surface-container-high text-white' : 'text-on-surface-variant hover:text-white'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Labs */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-3">Laboratories</p>
                <div className="flex flex-wrap gap-2">
                  {branch.labs.map(lab => (
                    <span key={lab} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${c.bg} ${c.text} border ${c.border}`}>{lab}</span>
                  ))}
                </div>
              </div>

              {/* Placement bar */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-3">Placement Rate (2024 batch)</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <motion.div className={`h-full rounded-full`} style={{ backgroundColor: c.dot }}
                      initial={{ width: 0 }} animate={{ width: `${branch.placementPct}%` }}
                      transition={{ duration: 0.8, ease: APPLE }} />
                  </div>
                  <span className={`text-sm font-bold ${c.text}`}>{branch.placementPct}%</span>
                </div>
              </div>

              {/* Recruiters */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-3">Top Recruiters</p>
                <div className="flex flex-wrap gap-2">
                  {branch.topRecruiters.map(r => (
                    <span key={r} className="px-3 py-1.5 bg-surface-container rounded-lg text-xs text-on-surface-variant border border-outline-variant/10">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'curriculum' && (
            <div>
              {/* Semester tabs */}
              <div className="flex gap-1 flex-wrap mb-5">
                {SEMESTERS.map(s => (
                  <button key={s} onClick={() => setSemTab(s)}
                    className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${semTab === s ? `${c.bg} ${c.text}` : 'bg-surface-container text-on-surface-variant hover:text-white'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-3">Semester {semTab} subjects</p>
              <div className="space-y-2">
                {subjects.map((sub, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant/10">
                    <span className={`w-7 h-7 rounded-lg ${c.bg} ${c.text} text-xs font-bold flex items-center justify-center flex-shrink-0`}>{i + 1}</span>
                    <span className="text-sm text-on-surface">{sub}</span>
                    {sub.toLowerCase().includes('elective') && (
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-outline font-mono">ELECTIVE</span>
                    )}
                    {sub.toLowerCase().includes('lab') && (
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-outline font-mono">LAB</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'courses' && (
            <div>
              {loadingLive ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl skeleton-shimmer" />)}
                </div>
              ) : liveCourses.length === 0 ? (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined text-4xl text-outline/30 block mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                  <p className="text-on-surface-variant text-sm">No courses listed yet for this department.</p>
                  <p className="text-outline text-xs mt-1">Admins can add courses from the Admin panel.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {liveCourses.map(course => (
                    <div key={course._id} className="flex items-center justify-between gap-4 p-4 bg-surface-container rounded-xl border border-outline-variant/10">
                      <div className="min-w-0">
                        <p className={`text-xs font-mono font-bold ${c.text} mb-0.5`}>{course.code}</p>
                        <p className="text-sm text-on-surface font-medium truncate">{course.name}</p>
                        <p className="text-xs text-outline">{course.instructor} · {course.credits} cr</p>
                      </div>
                      {course.section && (
                        <span className="text-xs text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-lg font-mono flex-shrink-0">§{course.section}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const BranchCard = ({ branch, onClick }) => {
  const c = COLOR[branch.id] || COLOR.cse;
  return (
    <motion.div {...staggerItem}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
      transition={{ duration: 0.25, ease: APPLE }}
      onClick={() => onClick(branch)}
      className="bg-surface-container-low border border-outline-variant/10 hover:border-outline-variant/30 rounded-xl p-5 cursor-pointer transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
          <span className={`material-symbols-outlined text-xl ${c.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>{branch.icon}</span>
        </div>
        <div className="text-right">
          <p className={`text-xs font-mono font-bold ${c.text}`}>{branch.placementPct}%</p>
          <p className="text-[10px] text-outline">placed</p>
        </div>
      </div>

      <p className={`text-xs font-mono font-semibold ${c.text} mb-1`}>{branch.code} · {branch.degree}</p>
      <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-white/90">{branch.name}</h3>
      <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">{branch.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
        <div className="flex items-center gap-3 text-xs text-outline">
          <span>{branch.intake} seats</span>
          <span>·</span>
          <span>{branch.facultyCount} faculty</span>
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold ${c.text}`}>
          Explore
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </span>
      </div>
    </motion.div>
  );
};

const Courses = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);

  const totalStudents = BRANCHES.reduce((s, b) => s + b.intake * 4, 0);
  const avgPlacement = Math.round(BRANCHES.reduce((s, b) => s + b.placementPct, 0) / BRANCHES.length);

  const filtered = BRANCHES.filter(b => {
    const q = search.toLowerCase();
    if (!q) return true;
    const allSubjects = Object.values(b.curriculum).flat().join(' ').toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.shortName.toLowerCase().includes(q) ||
      allSubjects.includes(q)
    );
  });

  return (
    <>
      <motion.main {...pageTransition} className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto">

        {/* Header */}
        <motion.section {...fadeUpBlur} className="mb-12">
          <div className="max-w-3xl mb-8">
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-outline mb-3">CBIT Kolar — Dept. Explorer</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4 font-satoshi leading-tight">
              Seven branches.<br />
              <span className="text-primary">One campus.</span>
            </h1>
            <p className="text-on-surface-variant text-base max-w-xl leading-relaxed">
              Explore curriculum, labs, placement stats, and top recruiters for every branch at CBIT.
              Click any card to open the full detail view.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-2xl">
            {[
              { label: 'Branches', value: '7', icon: 'school' },
              { label: 'Total Capacity', value: `${totalStudents / 4 * 1}+`, icon: 'group' },
              { label: 'Avg. Placement', value: `${avgPlacement}%`, icon: 'trending_up' },
              { label: 'Semester System', value: 'VTU', icon: 'calendar_today' },
            ].map(s => (
              <div key={s.label} className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-4">
                <span className="material-symbols-outlined text-outline text-lg block mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-on-surface-variant">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl pl-12 pr-4 py-3.5 text-on-surface text-sm placeholder:text-outline focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all outline-none"
              placeholder="Search branches or subjects — e.g. 'Machine Learning', 'ECE'"
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

          {search && (
            <p className="text-xs text-outline mt-2 ml-1">
              {filtered.length === 0 ? 'No branches matched.' : `${filtered.length} branch${filtered.length === 1 ? '' : 'es'} found`}
            </p>
          )}
        </motion.section>

        {/* Branch grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl block mb-3 opacity-30">search_off</span>
            <p>No branches matched. Try a subject name like "VLSI" or "Machine Learning".</p>
          </div>
        ) : (
          <motion.div {...staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(branch => (
              <BranchCard key={branch.id} branch={branch} onClick={setSelectedBranch} />
            ))}
          </motion.div>
        )}

        {/* Note for logged-in users about their courses */}
        {user && (
          <motion.div {...fadeUpBlur} className="mt-12 p-4 rounded-xl bg-surface-container border border-outline-variant/10 flex items-center gap-3 max-w-xl">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <p className="text-sm text-on-surface-variant">
              Your section-specific courses are in the{' '}
              <a href="/portal" className="text-primary hover:underline">Portal → Courses tab</a>.
            </p>
          </motion.div>
        )}
      </motion.main>

      <AnimatePresence>
        {selectedBranch && (
          <BranchDetail branch={selectedBranch} onClose={() => setSelectedBranch(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Courses;
