import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem, pageTransition } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

// ── Timetable data ────────────────────────────────────────────────────────────
const TIMETABLE_4C = {
  Mon: [
    { time: '9:00–9:55',   sub: 'MC' },
    { time: '9:55–10:50',  sub: 'LATEX',    note: 'Individual' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'DBMS' },
    { time: '12:05–1:00',  sub: 'ADA' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'ADA/LATEX', note: 'C1/C2' },
    { time: '2:30–3:20',   sub: null },
    { time: '3:20–4:10',   sub: 'PROCTOR' },
  ],
  Tue: [
    { time: '9:00–9:55',   sub: 'BIO' },
    { time: '9:55–10:50',  sub: 'DBMS' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–1:00',  sub: 'MC/DBMS',  note: 'C1/C2', span: true },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'MATHS' },
    { time: '2:30–3:20',   sub: 'Jargon',   note: 'Technical' },
    { time: '3:20–4:10',   sub: 'TECHNICAL' },
  ],
  Wed: [
    { time: '9:00–10:50',  sub: 'LATEX/ADA', note: 'C1/C2', span: true },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'MC' },
    { time: '12:05–1:00',  sub: 'ADA' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'DBMS' },
    { time: '2:30–3:20',   sub: 'MATHS' },
    { time: '3:20–4:10',   sub: 'LIBRARY' },
  ],
  Thu: [
    { time: '9:00–9:55',   sub: 'MATHS' },
    { time: '9:55–10:50',  sub: 'MC' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'UHV' },
    { time: '12:05–1:00',  sub: 'ADA',      note: 'Individual' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'DBMS',     note: 'Individual' },
    { time: '2:30–3:20',   sub: null },
    { time: '3:20–4:10',   sub: 'SPORTS/CUL' },
  ],
  Fri: [
    { time: '9:00–9:55',   sub: 'MC',       note: 'Individual' },
    { time: '9:55–10:50',  sub: null },
    { time: '10:50–11:10', sub: 'BIO' },
    { time: '11:10–12:05', sub: 'ADA' },
    { time: '12:05–1:00',  sub: 'MATHS' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'DBMS/MC',  note: 'C1/C2' },
    { time: '2:30–3:20',   sub: null },
    { time: '3:20–4:10',   sub: 'TUTORIAL' },
  ],
  Sat: [
    { time: '9:00–9:55',   sub: 'ADA' },
    { time: '9:55–10:50',  sub: 'DBMS' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'MATHS' },
    { time: '12:05–1:00',  sub: 'MC' },
  ],
};

const TIMETABLE_4B = {
  Mon: [
    { time: '9:00–9:55',   sub: 'MATHS' },
    { time: '9:55–10:50',  sub: 'ADA' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'MC' },
    { time: '12:05–1:00',  sub: 'DBMS' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'MC/DBMS',  note: 'B1/B2' },
    { time: '2:30–3:20',   sub: null },
    { time: '3:20–4:10',   sub: 'PROCTOR' },
  ],
  Tue: [
    { time: '9:00–10:50',  sub: 'ADA/LATEX', note: 'B1/B2', span: true },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'DBMS' },
    { time: '12:05–1:00',  sub: 'MATHS' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'UHV' },
    { time: '2:30–3:20',   sub: 'Jargon',   note: 'Technical' },
    { time: '3:20–4:10',   sub: 'TECHNICAL' },
  ],
  Wed: [
    { time: '9:00–9:55',   sub: 'MC' },
    { time: '9:55–10:50',  sub: 'ADA' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'BIO' },
    { time: '12:05–1:00',  sub: 'DBMS',     note: 'Individual' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'LATEX/ADA', note: 'B1/B2' },
    { time: '2:30–3:20',   sub: null },
    { time: '3:20–4:10',   sub: 'LIBRARY' },
  ],
  Thu: [
    { time: '9:00–10:50',  sub: 'DBMS/MC',  note: 'B1/B2', span: true },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'BIO' },
    { time: '12:05–1:00',  sub: 'MC' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'MATHS' },
    { time: '2:30–3:20',   sub: null },
    { time: '3:20–4:10',   sub: 'SPORTS/CUL' },
  ],
  Fri: [
    { time: '9:00–9:55',   sub: 'DBMS' },
    { time: '9:55–10:50',  sub: 'ADA',      note: 'Individual' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'MC',       note: 'Individual' },
    { time: '12:05–1:00',  sub: 'ADA' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'MATHS' },
    { time: '2:30–3:20',   sub: 'LATEX',    note: 'Individual' },
    { time: '3:20–4:10',   sub: 'TUTORIAL' },
  ],
  Sat: [
    { time: '9:00–9:55',   sub: 'MC' },
    { time: '9:55–10:50',  sub: 'MATHS' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'ADA' },
    { time: '12:05–1:00',  sub: 'DBMS' },
  ],
};

const TIMETABLE_6B = {
  Mon: [
    { time: '9:00–10:50',  sub: 'CC/ML',    note: 'B1/B2', span: true },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'ML' },
    { time: '12:05–1:00',  sub: 'CC' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'ML' },
    { time: '2:30–3:20',   sub: 'IWM' },
    { time: '3:20–4:10',   sub: 'PROCTOR' },
  ],
  Tue: [
    { time: '9:00–9:55',   sub: 'BC' },
    { time: '9:55–10:50',  sub: 'ML',       note: 'Individual' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'IKS' },
    { time: '12:05–1:00',  sub: 'ML' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'CC' },
    { time: '2:30–3:20',   sub: null },
    { time: '3:20–4:10',   sub: 'TECHNICAL' },
  ],
  Wed: [
    { time: '9:00–9:55',   sub: 'IWM' },
    { time: '9:55–10:50',  sub: 'ML' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'BC' },
    { time: '12:05–1:00',  sub: 'CC' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'ML/DEVOPS', note: 'B1/B2' },
    { time: '2:30–3:20',   sub: null },
    { time: '3:20–4:10',   sub: 'LIBRARY' },
  ],
  Thu: [
    { time: '9:00–10:50',  sub: 'DEVOPS/CC', note: 'B1/B2', span: true },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'CC',       note: 'Individual' },
    { time: '12:05–1:00',  sub: 'IWM' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'BC' },
    { time: '2:30–3:20',   sub: null },
    { time: '3:20–4:10',   sub: 'SPORTS/CUL' },
  ],
  Fri: [
    { time: '9:00–9:55',   sub: 'ML' },
    { time: '9:55–10:50',  sub: 'BC' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'IWM' },
    { time: '12:05–1:00',  sub: 'DEVOPS',   note: 'Individual' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'CC' },
    { time: '2:30–3:20',   sub: 'Jargon',   note: 'Technical' },
    { time: '3:20–4:10',   sub: 'TUTORIAL' },
  ],
  Sat: [
    { time: '9:00–1:00',   sub: 'PROJECT',  note: 'Project Phase 1', span: true },
  ],
};

const TIMETABLES = { '4C': TIMETABLE_4C, '4B': TIMETABLE_4B, '6B': TIMETABLE_6B };

const SECTION_META = {
  '4C': { room: 'Room 301', classTeacher: 'Prof. Pavithra L', proctor: 'Prof. Kavitha N · Prof. Ayesha Sana' },
  '4B': { room: 'Room 311', classTeacher: 'Prof. Vanishree',   proctor: 'Prof. Vanishree' },
  '6B': { room: 'Room TR-1', classTeacher: 'Prof. Swathi J K', proctor: 'Prof. Swathi J K · Prof. Malashree N' },
};

const SECTION_TEACHERS = {
  '4C': {
    ADA: 'Prof. Pavithra L',       'ADA/LATEX': 'Prof. Pavithra L (C1) / Prof. Sheela S (C2)',
    'LATEX/ADA': 'Prof. Sheela S (C1) / Prof. Pavithra L (C2)',
    MC:  'Prof. Nandini A',        'MC/DBMS':  'Prof. Nandini A (C1) / Prof. Manjunath Singh H (C2)',
    DBMS:'Prof. Manjunath Singh H','DBMS/MC':  'Prof. Manjunath Singh H (C1) / Prof. Nandini A (C2)',
    MATHS:'Prof. Pavithra H V',    LATEX: 'Prof. Sheela S',
    BIO: 'Prof. Monica M',         UHV:   'Prof. Ayesha Sana',
    NSS: 'Prof. Manjunath Singh H',PROCTOR:'Prof. Kavitha N, Prof. Ayesha Sana',
  },
  '4B': {
    ADA: 'Dr. Vasudeva R',         'ADA/LATEX': 'Dr. Vasudeva R (B1) / Prof. Sarika C G (B2)',
    'LATEX/ADA': 'Prof. Sarika C G (B1) / Dr. Vasudeva R (B2)',
    MC:  'Prof. Vanishree',        'MC/DBMS':  'Prof. Vanishree (B1) / Prof. Anitha P (B2)',
    DBMS:'Prof. Anitha P',         'DBMS/MC':  'Prof. Anitha P (B1) / Prof. Vanishree (B2)',
    MATHS:'Prof. Nagaraj S A',     LATEX: 'Prof. Sarika C G',
    BIO: 'Prof. Monica',           UHV:   'Prof. Anitha P',
    NSS: 'Prof. Manjunath Singh H',PROCTOR:'Prof. Vanishree',
  },
  '6B': {
    CC:  'Prof. Swathi J K',       'CC/ML':    'Prof. Swathi J K (B1) / Prof. Sagar G S (B2)',
    ML:  'Prof. Sagar G S',        'ML/DEVOPS':'Prof. Sagar G S (B1) / Prof. Sheela S (B2)',
    BC:  'Prof. Malashree N',      IWM:   'Prof. Arun Kumar P',
    DEVOPS:'Prof. Sheela S',       'DEVOPS/CC':'Prof. Sheela S (B1) / Prof. Swathi J K (B2)',
    PROJECT:'Dr. Vasudeva R & Prof. Kavitha N',
    NSS: 'Prof. Manjunath Singh H',IKS:   'Prof. Vanishree',
    PROCTOR:'Prof. Swathi J K, Prof. Malashree N',
  },
};

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
const SectionTimetable = ({ timetable, sectionKey }) => {
  const maxSlots = Math.max(...DAYS.map((d) => (timetable[d] || []).length));
  const meta     = SECTION_META[sectionKey]     || {};
  const teachers = SECTION_TEACHERS[sectionKey] || {};

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

      <div className="overflow-x-auto -mx-2 px-2">
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
              const cells = DAYS.map((day) => (timetable[day] || [])[rowIdx] || null);
              return (
                <tr key={rowIdx}>
                  <td className="py-1.5 pr-3 font-mono text-[10px] text-outline whitespace-nowrap align-middle">
                    {cells.find((c) => c)?.time ?? ''}
                  </td>
                  {cells.map((cell, colIdx) => {
                    if (!cell) return <td key={colIdx} className={`py-1 px-1.5 ${colIdx === todayDayIndex ? 'bg-primary/5' : ''}`} />;

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
                      <td key={colIdx} className={`py-1 px-1.5 align-middle ${colIdx === todayDayIndex ? 'bg-primary/5' : ''}`}>
                        <div className="relative group/tip">
                          <div className={`rounded-md px-2 py-1.5 ${subColor(cell.sub)} ${cell.span ? 'py-3' : ''}`}>
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
          <div key={i} className="h-24 bg-surface-container-high rounded-xl animate-pulse" />
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
  const [activeTab, setActiveTab] = useState('timetable'); // 'timetable' | 'attendance'

  useEffect(() => {
    api.get('/api/announcements')
      .then((res) => setAnnouncements(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setAnnLoading(false));
  }, []);

  const TABS = [
    { key: 'timetable', label: 'Timetable',  icon: 'calendar_month' },
    { key: 'attendance', label: 'Attendance', icon: 'fact_check' },
  ];

  return (
    <motion.main {...pageTransition} className="pt-24 pb-20">
      {/* ── Hero ── */}
      <motion.section {...fadeUp} className="max-w-[1440px] mx-auto px-6 mb-16">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low min-h-[400px] flex flex-col justify-center items-center text-center p-8">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFK-JOIqRc96iV4q-x7SAButIXxoVj0u9yDVgsSS6xsGilQvXDwRYL_7Ed6Bjn-hvfLNjSekf1p3QbOSYzOAjcsGmUfK4VNw5BnHD60StvQqzher_mOQlhAGsvWW60DCd-Zpodd-ejuE1hX1PJ7_Wx8f-aQCCPsT7Ce0R3gSOx8CCV82zPpBOhHzQ76NVfk6abM4-MoINcHmTVQTlQG2eeFV9UktNweBbovqfF5lFmhheFmP2OPm-vg0Wve9x6Zm-Z5PbQD8GDxJM" alt="Network visualization" />
          </div>

          {authLoading ? (
            <div className="animate-pulse space-y-4 w-full max-w-md">
              <div className="h-8 bg-surface-container-high rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-surface-container-high rounded w-1/2 mx-auto"></div>
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
                onClick={() => setActiveTab(tab.key)}
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
                <div className="bg-surface-container-low rounded-xl p-6 ghost-border">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white font-satoshi">Weekly Timetable</h2>
                      <p className="text-on-surface-variant text-sm mt-0.5">
                        Section {user.section ?? '—'} · {(() => { const n = parseInt(user.section?.[0]); return n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : n ? `${n}th` : '—'; })()} Semester CSE · CBIT Kolar
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-outline uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      Today: {DAYS[todayDayIndex] ?? 'Sun'}
                    </div>
                  </div>

                  {TIMETABLES[user.section] ? (
                    <SectionTimetable timetable={TIMETABLES[user.section]} sectionKey={user.section} />
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
                <div className="bg-surface-container-low rounded-xl p-6 ghost-border">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white font-satoshi">Attendance Tracker</h2>
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
          <motion.div
            {...staggerItem}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:col-span-8 bg-surface-container-low ghost-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-container transition-colors duration-200"
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
          </motion.div>

          <motion.div
            {...staggerItem}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:col-span-4 bg-surface-container-low ghost-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-container transition-colors duration-200"
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
          </motion.div>

          <motion.div
            {...staggerItem}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:col-span-4 bg-surface-container-low ghost-border rounded-xl p-8 flex flex-col justify-between group cursor-pointer hover:bg-surface-container transition-colors duration-200"
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
          </motion.div>

          <motion.div
            {...staggerItem}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:col-span-8 bg-surface-container-low ghost-border rounded-xl p-8 flex items-center gap-8 group cursor-pointer hover:bg-surface-container transition-colors duration-200 overflow-hidden"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">support_agent</span>
                <span className="font-berkeley-mono text-xs text-primary uppercase tracking-widest">24/7 Concierge</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Campus support</h3>
              <p className="text-on-surface-variant">Direct line to academic advisors and technical support teams for immediate assistance.</p>
            </div>
            <div className="hidden lg:block w-48 h-48 relative">
              <img className="absolute inset-0 w-full h-full object-cover rounded-xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYB3PbAClabbSeyeYt8cbrLZREHl7wVDDVnTZig7mZipc7Gn01LgZ0QWfL_rz1SrCTMoEN-tErZv0aRTTenWRhU2_dIUT_1KZG-_ns9mNE-pbTdey7EdO0mvNNoSCgN0o9u1XtNWuaNc4XnU9A__i8e06L_Qv5K_0VFVHiQFg2ahof-BNKvRgCu0iGXN-FITRtgB28lhW6B1yOT3RIrlPsFqBfIotLqtVwEWYb5hrZrZ8NrZAykKpgQAf7l60xagFNh7QfW8EaD8Y" alt="Support" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Content Sections ── */}
      <motion.section {...fadeUp} className="max-w-[1440px] mx-auto px-6">
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
                <motion.div
                  key={service.title}
                  {...staggerItem}
                  whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.2)' }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="bg-surface-container-low p-6 rounded-xl ghost-border hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-surface-variant mb-4">{service.icon}</span>
                  <h4 className="text-white font-semibold mb-1">{service.title}</h4>
                  <p className="text-on-surface-variant text-xs">{service.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default Portal;
