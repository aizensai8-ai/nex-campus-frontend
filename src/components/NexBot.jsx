import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const SUGGESTIONS = [
  { id: 'tt',   icon: 'calendar_month',  title: "Today's Timetable",  hint: 'Classes & schedule',        prompt: "Show today's timetable" },
  { id: 'att',  icon: 'fact_check',      title: 'My Attendance',      hint: 'Check % per subject',       prompt: 'What is my attendance?' },
  { id: 'next', icon: 'schedule',        title: 'Next Class',         hint: 'Upcoming class info',       prompt: 'When is my next class?' },
  { id: 'acad', icon: 'military_tech',   title: 'CIE Grades',         hint: 'Internal marks',            prompt: 'What are my grades?' },
  { id: 'bus',  icon: 'directions_bus',  title: 'My Bus Route',       hint: 'Find my commute',           prompt: 'What bus should I take?' },
  { id: 'ann',  icon: 'campaign',        title: 'Announcements',      hint: 'Latest notices',            prompt: 'Any new announcements?' },
  { id: 'evt',  icon: 'event',           title: 'Events This Week',   hint: 'Fests, workshops & more',   prompt: 'What events are happening this week?' },
  { id: 'loc',  icon: 'location_on',     title: 'Find a Location',    hint: 'Labs, blocks & rooms',      prompt: 'Where is the CSE lab?' },
  { id: 'lib',  icon: 'library_books',   title: 'Digital Library',    hint: 'Notes & Syllabus',          action: '/portal?tab=library' },
  { id: 'sup',  icon: 'support_agent',   title: 'Raise a Ticket',     hint: 'Report campus issues',      action: '/support' },
];

const CAMPUS_LOCATIONS = {
  'cse lab':    'CSE Labs are in Block C, 2nd & 3rd Floor.',
  'ece lab':    'ECE Labs are in Block B, 1st Floor.',
  'me lab':     'ME Labs are in Block D, Ground Floor.',
  'civil lab':  'Civil Labs are in Block D, 1st Floor.',
  'library':    'Central Library is in Block A, Ground Floor.',
  'canteen':    'Canteen is between Block A and Block B.',
  'admin':      'Admin Block is at the main entrance.',
  'principal':  "Principal's Office — Admin Block, 1st Floor.",
  'sports':     'Sports Ground is behind Block D, near the back gate.',
  'auditorium': 'Auditorium is in Block A, Ground Floor.',
  'parking':    'Parking area is at the main gate, left side.',
  'medical':    'Medical Room is in Block A, Ground Floor — 9 AM to 5 PM.',
  'seminar':    'Seminar Hall is in Block A, 2nd Floor.',
  'hostel':     'Hostels are at the rear of the campus, accessible via the back gate.',
  'gym':        'Gymnasium is near the sports ground, behind Block D.',
};

const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parseTimeMins = (timeStr) => {
  const match = String(timeStr || '').match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
};

const NexBot = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [query, setQuery]       = useState('');
  const [botReply, setBotReply] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setIsOpen(p => !p); }
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setBotReply(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const goTo = (url, text) => {
    setBotReply({ type: 'navigate', text: text || 'Opening...' });
    setTimeout(() => { navigate(url); setIsOpen(false); }, 380);
  };

  // ── Fetch helpers ─────────────────────────────────────────────────────────

  const fetchAttendance = useCallback(async () => {
    const res = await api.get('/api/attendance/summary');
    const data = Array.isArray(res.data) ? res.data : [];
    if (!data.length) return {
      type: 'text', icon: 'fact_check',
      text: 'No attendance records yet. Check back after classes begin.',
      link: '/portal?tab=attendance', linkText: 'View Attendance',
    };
    const withPct = data.filter(d => d.percent != null);
    const avg = withPct.length
      ? Math.round(withPct.reduce((s, d) => s + d.percent, 0) / withPct.length)
      : null;
    const items = data.map(d =>
      `${d.course.code}: ${d.percent ?? '—'}%  (${d.attendedClasses}/${d.course.totalClasses} classes)`
    );
    const low = data.filter(d => d.percent != null && d.percent < 75).sort((a, b) => a.percent - b.percent);
    return {
      type: 'list',
      title: avg != null ? `Overall: ~${avg}% attendance` : 'Attendance Summary',
      items,
      warning: low.length ? `⚠️ ${low[0].course.code} is at ${low[0].percent}% — below 75% threshold.` : null,
      link: '/portal?tab=attendance', linkText: 'Full breakdown →',
    };
  }, []);

  const fetchTodayTimetable = useCallback(async () => {
    if (!user?.section) return {
      type: 'text', icon: 'edit',
      text: 'Update your section in Edit Profile to see your timetable.',
      link: '/profile', linkText: 'Edit Profile',
    };
    const res = await api.get(`/api/timetables/${user.section}`);
    const tt = res.data;
    const todayKey = DAY_KEYS[new Date().getDay()];
    if (todayKey === 'Sun') return { type: 'text', icon: 'weekend', text: "It's Sunday — no classes today. Rest up! 😌" };
    const slots = (tt.days?.[todayKey] || []).filter(s => s.sub && s.type !== 'break' && !s.span);
    if (!slots.length) return {
      type: 'text', icon: 'event_available',
      text: `No classes found for ${todayKey} in Section ${user.section}.`,
      link: '/portal?tab=timetable', linkText: 'Open Timetable',
    };
    const teachers = tt.teachers || {};
    const items = slots.map(s => {
      const t = teachers[s.sub] ? ` · ${teachers[s.sub]}` : '';
      return `${s.time} — ${s.sub}${t}`;
    });
    return {
      type: 'list',
      title: `Section ${user.section} · ${todayKey}'s classes`,
      items,
      link: '/portal?tab=timetable', linkText: 'Full timetable →',
    };
  }, [user]);

  const fetchNextClass = useCallback(async () => {
    if (!user?.section) return {
      type: 'text', icon: 'edit',
      text: 'Set your section in Edit Profile to find upcoming classes.',
      link: '/profile', linkText: 'Edit Profile',
    };
    const res = await api.get(`/api/timetables/${user.section}`);
    const tt = res.data;
    const todayIdx = new Date().getDay();
    const todayKey = DAY_KEYS[todayIdx];
    if (todayKey === 'Sun') return { type: 'text', icon: 'weekend', text: "It's Sunday! Your next classes start Monday. 🎉" };
    const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
    const teachers = tt.teachers || {};
    const todaySlots = (tt.days?.[todayKey] || []).filter(s => s.sub && s.type !== 'break' && !s.span);
    const next = todaySlots.find(s => (parseTimeMins(s.time) ?? 0) > nowMins);
    if (next) {
      const t = teachers[next.sub] ? ` with ${teachers[next.sub]}` : '';
      return {
        type: 'text', icon: 'schedule',
        text: `Next up: ${next.sub}${t} at ${next.time}.`,
        link: '/portal?tab=timetable', linkText: 'View full schedule',
      };
    }
    // No more today — check tomorrow
    const tomorrowIdx = (todayIdx + 1) % 7;
    const tomorrowKey = DAY_KEYS[tomorrowIdx];
    if (tomorrowIdx === 0) return { type: 'text', icon: 'event_available', text: 'No more classes today. Enjoy the weekend! 🎉' };
    const tSlots = (tt.days?.[tomorrowKey] || []).filter(s => s.sub && s.type !== 'break' && !s.span);
    if (tSlots.length) {
      const first = tSlots[0];
      const t = teachers[first.sub] ? ` with ${teachers[first.sub]}` : '';
      return {
        type: 'text', icon: 'schedule',
        text: `No more classes today. Tomorrow (${tomorrowKey}) starts with ${first.sub}${t} at ${first.time}.`,
        link: '/portal?tab=timetable', linkText: 'View Timetable',
      };
    }
    return {
      type: 'text', icon: 'event_available',
      text: 'No more classes today. Check the timetable for upcoming days.',
      link: '/portal?tab=timetable', linkText: 'View Timetable',
    };
  }, [user]);

  const fetchGrades = useCallback(async () => {
    const res = await api.get('/api/grades/mine');
    const grades = Array.isArray(res.data) ? res.data : [];
    if (!grades.length) return {
      type: 'text', icon: 'military_tech',
      text: 'No grades published yet. Check back after CIE results.',
      link: '/portal?tab=academics', linkText: 'View Academics',
    };
    const items = grades.map(g => {
      const max = (g.maxCie || 50) * 3;
      const pct = max > 0 ? Math.round((g.totalMarks / max) * 100) : 0;
      return `${g.course?.code || '—'}: ${g.totalMarks}/${max}  (${pct}%)`;
    });
    const avg = Math.round(
      grades.reduce((s, g) => {
        const max = (g.maxCie || 50) * 3;
        return s + (max > 0 ? (g.totalMarks / max) * 100 : 0);
      }, 0) / grades.length
    );
    return {
      type: 'list',
      title: `CIE Grades · Avg ${avg}%`,
      items,
      link: '/portal?tab=academics', linkText: 'Detailed view →',
    };
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    const res = await api.get('/api/announcements?limit=4');
    const data = Array.isArray(res.data) ? res.data : [];
    if (!data.length) return { type: 'text', icon: 'campaign', text: 'No announcements at the moment. Check back later.' };
    const items = data.map(a => {
      const tag = a.pinned ? '📌 ' : a.priority === 'critical' ? '🚨 ' : a.priority === 'high' ? '⚡ ' : '';
      return `${tag}${a.title}`;
    });
    return {
      type: 'list', title: 'Latest Announcements',
      items, link: '/portal', linkText: 'See all →',
    };
  }, []);

  const fetchBus = useCallback(async () => {
    const res = await api.get('/api/transport');
    const buses = Array.isArray(res.data) ? res.data : [];
    if (!buses.length) return {
      type: 'text', icon: 'directions_bus',
      text: 'No transport routes configured yet.',
      link: '/portal?tab=commute', linkText: 'View Commute',
    };
    const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const userLoc = norm(user?.address || '');
    const matched = userLoc
      ? buses.find(b => b.areasServed?.some(a => norm(a).includes(userLoc) || userLoc.includes(norm(a))))
      : null;
    if (matched) return {
      type: 'text', icon: 'directions_bus',
      text: `Bus ${matched.busNumber} (→ ${matched.destination}) covers your area. ${matched.schedule || 'Standard college hours'}.`,
      link: '/portal?tab=commute', linkText: 'Full route details →',
    };
    const items = buses.slice(0, 6).map(b =>
      `Bus ${b.busNumber} → ${b.destination}  (${b.areasServed?.slice(0, 2).join(', ') || 'Various areas'})`
    );
    return {
      type: 'list',
      title: userLoc ? `No match for "${user.address}" — All routes` : 'Available Bus Routes',
      items,
      warning: !userLoc ? 'Add your home address in Edit Profile to auto-match your route.' : null,
      link: '/portal?tab=commute', linkText: 'Full commute details →',
    };
  }, [user]);

  const fetchEvents = useCallback(async () => {
    const from = new Date().toISOString();
    const to = new Date(Date.now() + 7 * 86400000).toISOString();
    const res = await api.get(`/api/events?from=${from}&to=${to}&sort=date&limit=5`);
    const data = Array.isArray(res.data) ? res.data : [];
    if (!data.length) return {
      type: 'text', icon: 'event',
      text: 'No events scheduled this week. Check the events page for upcoming ones.',
      link: '/events', linkText: 'Events Page',
    };
    const items = data.map(e => {
      const d = new Date(e.date);
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
      return `${label} · ${e.title}${e.location ? ' @ ' + e.location : ''}`;
    });
    return {
      type: 'list', title: 'Upcoming Events This Week',
      items, link: '/events', linkText: 'All events →',
    };
  }, []);

  const findLocation = useCallback((input) => {
    for (const [key, desc] of Object.entries(CAMPUS_LOCATIONS)) {
      if (input.includes(key)) return {
        type: 'text', icon: 'location_on', text: desc,
        link: '/campus-map', linkText: 'Open Campus Map',
      };
    }
    return {
      type: 'text', icon: 'explore',
      text: "Couldn't pinpoint that location. Try the interactive campus map.",
      link: '/campus-map', linkText: 'Open Campus Map',
    };
  }, []);

  const fetchInstructor = useCallback(async (input) => {
    const match = input.match(/(?:who teaches?|instructor (?:for|of)?|teacher (?:of|for)?|faculty for|professor (?:for|of)?)\s+(.+)/i);
    const subject = match?.[1]?.trim();
    if (!subject) return { type: 'text', icon: 'school', text: 'Try: "Who teaches DBMS?" or "Instructor for ADA?"' };
    const res = await api.get(`/api/courses?search=${encodeURIComponent(subject)}&limit=3`);
    const courses = Array.isArray(res.data) ? res.data : [];
    if (!courses.length) return {
      type: 'text', icon: 'school',
      text: `No course found matching "${subject}". Check spelling or try the full name.`,
      link: '/courses', linkText: 'Browse Courses',
    };
    const items = courses.map(c => `${c.code} — ${c.name}: ${c.instructor}`);
    return {
      type: 'list', title: `Instructor for "${subject}"`,
      items, link: '/courses', linkText: 'All courses →',
    };
  }, []);

  // ── Intent resolver ───────────────────────────────────────────────────────

  const resolveIntent = useCallback(async (input) => {
    const needsAuth = /(attendance|grade|mark|cie|result|timetable|schedule|class|bus|commute|route|next class)/i.test(input);
    if (needsAuth && !user) return {
      type: 'text', icon: 'lock',
      text: 'Log in to access your personal data — timetable, grades, attendance, and bus route.',
      link: '/login', linkText: 'Sign in →',
    };

    if (/(attendance|how many.*absent|present|bunk|skip class)/i.test(input))             return fetchAttendance();
    if (/(next class|when.*class|upcoming class|class.*next)/i.test(input))               return fetchNextClass();
    if (/(today|timetable|schedule|my class|show class)/i.test(input))                    return fetchTodayTimetable();
    if (/(grade|mark|cie|result|academic|score)/i.test(input))                            return fetchGrades();
    if (/(announcement|notice|news|update|notification)/i.test(input))                    return fetchAnnouncements();
    if (/(bus|commute|transport|route|travel home)/i.test(input))                         return fetchBus();
    if (/(event|happening|this week|fest|workshop|hackathon|seminar|symposium)/i.test(input)) return fetchEvents();
    if (/(where|which block|which room|how to reach|navigate|find the)/i.test(input))    return findLocation(input);
    if (/(who teach|instructor|professor|faculty for|teacher of)/i.test(input))           return fetchInstructor(input);

    // Static FAQs
    if (/(wifi|wi-fi|internet password)/i.test(input))          return { type: 'text', icon: 'wifi',          text: "Guest Wi-Fi: 'Nex_Guest' | Password: nex@123" };
    if (/(fee|payment|pay tuition)/i.test(input))               return { type: 'text', icon: 'payments',      text: 'Fees at Admin Block (Ground Floor), Mon–Fri, 10 AM – 3 PM.' };
    if (/(hostel|curfew|mess|food)/i.test(input))               return { type: 'text', icon: 'home',          text: 'Hostel curfew: 8:30 PM | Mess closes at 9:00 PM.' };
    if (/(holiday|vacation|break|vtu calendar)/i.test(input))   return { type: 'text', icon: 'event_busy',   text: 'Following VTU academic calendar. Next break after final CIEs!' };
    if (/(emergency|ambulance|medical|security|danger)/i.test(input)) return { type: 'text', icon: 'emergency', text: '🚨 Security: +91-9876543210 | Medical Room: Block A, Ground Floor.' };
    if (/^(hello|hi |hey|sup\b)/i.test(input))                  return { type: 'text', icon: 'waving_hand',  text: `Hey${user?.name ? ' ' + user.name.split(' ')[0] : ''}! Ask me about your timetable, grades, attendance, or bus route.` };
    if (/(who made|creator|built you|about nexbot)/i.test(input)) return { type: 'text', icon: 'auto_awesome', text: "I'm NexBot, built into NexCampus for CBIT Kolar. I answer campus questions using live data." };
    if (/(joke|funny|laugh)/i.test(input))                      return { type: 'text', icon: 'sentiment_very_satisfied', text: 'Why do programmers prefer dark mode? Because light attracts bugs. 😂' };

    return {
      type: 'error',
      text: `No result for "${input}". Try: "my attendance", "today's timetable", "any announcements", or "where is the library".`,
      link: '/portal', linkText: 'Open Portal',
    };
  }, [user, fetchAttendance, fetchNextClass, fetchTodayTimetable, fetchGrades, fetchAnnouncements, fetchBus, fetchEvents, findLocation, fetchInstructor]);

  // ── Submit handler ────────────────────────────────────────────────────────

  const submitQuery = useCallback(async (text) => {
    if (!text?.trim()) return;
    setIsLoading(true);
    setBotReply(null);
    try {
      const reply = await resolveIntent(text.trim().toLowerCase());
      setBotReply(reply);
    } catch {
      setBotReply({ type: 'error', text: 'Something went wrong fetching that. Please try again.', link: '/portal', linkText: 'Open Portal' });
    } finally {
      setIsLoading(false);
    }
  }, [resolveIntent]);

  const handleCommand = (e) => { e.preventDefault(); submitQuery(query); };

  const handleSuggestionClick = (item) => {
    if (item.action) { goTo(item.action, `Opening ${item.title}...`); return; }
    if (item.prompt) { setQuery(item.prompt); submitQuery(item.prompt); }
  };

  const filteredSuggestions = SUGGESTIONS.filter(s =>
    !query || s.title.toLowerCase().includes(query.toLowerCase()) || s.hint.toLowerCase().includes(query.toLowerCase())
  );

  // ── Reply renderer ────────────────────────────────────────────────────────

  const ReplyView = ({ reply }) => {
    if (reply.type === 'navigate') return (
      <div className="flex items-center justify-center min-h-[160px] p-6 text-center">
        <div>
          <span className="material-symbols-outlined text-4xl text-primary/40 mb-3 block animate-pulse">open_in_new</span>
          <p className="text-xl text-white font-medium">{reply.text}</p>
        </div>
      </div>
    );

    if (reply.type === 'list') return (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
          <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
          <p className="text-[11px] font-mono tracking-widest uppercase text-primary/80">{reply.title}</p>
        </div>
        {reply.warning && (
          <p className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">{reply.warning}</p>
        )}
        <ul className="space-y-2">
          {reply.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="text-primary/40 mt-0.5 shrink-0 text-[10px] font-mono pt-[3px]">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-white/80 leading-snug">{item}</span>
            </li>
          ))}
        </ul>
        {reply.link && (
          <button
            onClick={() => { navigate(reply.link); setIsOpen(false); }}
            className="text-xs text-primary hover:text-primary/70 flex items-center gap-1 mt-1 transition-colors"
          >
            {reply.linkText} <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        )}
      </div>
    );

    // text / error
    const isError = reply.type === 'error';
    const icon = reply.icon || (isError ? 'error_outline' : 'psychology');
    return (
      <div className="flex flex-col items-center justify-center min-h-[160px] p-6 text-center gap-3">
        <span className={`material-symbols-outlined text-4xl mb-1 ${isError ? 'text-outline/40' : 'text-primary/40'}`}>{icon}</span>
        <p className={`text-lg font-medium leading-relaxed ${isError ? 'text-on-surface-variant' : 'text-white'}`}>{reply.text}</p>
        {reply.link && (
          <button
            onClick={() => { navigate(reply.link); setIsOpen(false); }}
            className="text-xs text-primary hover:text-primary/70 flex items-center gap-1 mt-1 transition-colors"
          >
            {reply.linkText} <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-2xl bg-surface-container-low/80 backdrop-blur-2xl border border-outline-variant/30 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Input */}
              <form onSubmit={handleCommand} className="relative flex items-center px-6 py-5 border-b border-outline-variant/10">
                <span className="material-symbols-outlined text-outline text-2xl mr-4">search</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask NexBot — timetable, grades, bus, events..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setBotReply(null); }}
                  className="w-full bg-transparent border-none outline-none text-2xl text-white placeholder:text-outline-variant font-satoshi font-medium"
                />
                <div className="flex items-center gap-1.5 ml-4">
                  <kbd className="bg-surface-container px-2 py-1 flex items-center justify-center rounded text-[10px] text-outline border border-outline-variant/20 font-mono">esc</kbd>
                </div>
              </form>

              {/* Content */}
              <div className="relative min-h-[160px] max-h-[420px] overflow-y-auto hide-scrollbar bg-surface-container-lowest/50">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center min-h-[160px] gap-3"
                    >
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary/60"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-outline font-mono uppercase tracking-widest">Fetching data...</p>
                    </motion.div>
                  ) : botReply ? (
                    <motion.div
                      key="reply"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    >
                      <ReplyView reply={botReply} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="suggestions"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="p-3"
                    >
                      <div className="px-3 pt-2 pb-1">
                        <p className="text-[10px] font-mono tracking-widest uppercase text-outline">Ask me anything</p>
                      </div>
                      <div className="mt-2 space-y-1">
                        {filteredSuggestions.map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleSuggestionClick(item)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-container-highest transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:border-primary/30 transition-colors">
                                <span className="material-symbols-outlined">{item.icon}</span>
                              </div>
                              <div className="text-left">
                                <p className="text-white font-medium">{item.title}</p>
                                <p className="text-xs text-outline">{item.hint}</p>
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity">keyboard_return</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="bg-surface-container-highest/50 px-6 py-3 border-t border-outline-variant/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full transition-colors ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
                  <span className="text-[10px] text-outline font-mono uppercase tracking-widest">
                    {isLoading ? 'NexBot Thinking...' : 'NexBot Active'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-outline">
                  <kbd className="bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/20 font-mono">↵</kbd>
                  <span>to ask</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-surface-container-high/80 backdrop-blur-xl border border-outline-variant/30 text-white rounded-full shadow-2xl flex justify-center items-center z-[9000] hover:scale-105 hover:bg-surface-container-highest transition-all group overflow-hidden"
          >
            <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">search</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default NexBot;
