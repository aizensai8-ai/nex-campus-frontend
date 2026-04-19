import Timetable from '../models/Timetable.js';

const TIMETABLE_4C = {
  Mon: [
    { time: '9:00AM–9:55AM',   sub: 'MC' },
    { time: '9:55AM–10:50AM',  sub: 'LATEX',    note: 'Individual' },
    { time: '10:50AM–11:10AM', sub: 'BREAK',    type: 'break' },
    { time: '11:10AM–12:05PM', sub: 'DBMS' },
    { time: '12:05PM–1:00PM',  sub: 'ADA' },
    { time: '1:00PM–1:40PM',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40PM–3:20PM',   sub: 'ADA/LATEX', note: 'C1/C2', span: true },
    null,
    { time: '3:20PM–4:10PM',   sub: 'PROCTOR' },
  ],
  Tue: [
    { time: '9:00AM–9:55AM',   sub: 'BIO' },
    { time: '9:55AM–10:50AM',  sub: 'DBMS' },
    { time: '10:50AM–11:10AM', sub: 'BREAK',    type: 'break' },
    { time: '11:10AM–1:00PM',  sub: 'MC/DBMS',  note: 'C1/C2', span: true },
    null,
    { time: '1:00PM–1:40PM',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40PM–2:30PM',   sub: 'MATHS' },
    { time: '2:30PM–3:20PM',   sub: 'Jargon',   note: 'Technical' },
    { time: '3:20PM–4:10PM',   sub: 'TECHNICAL' },
  ],
  Wed: [
    { time: '9:00AM–10:50AM',  sub: 'LATEX/ADA', note: 'C1/C2', span: true },
    null,
    { time: '10:50AM–11:10AM', sub: 'BREAK',    type: 'break' },
    { time: '11:10AM–12:05PM', sub: 'MC' },
    { time: '12:05PM–1:00PM',  sub: 'ADA' },
    { time: '1:00PM–1:40PM',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40PM–2:30PM',   sub: 'DBMS' },
    { time: '2:30PM–3:20PM',   sub: 'MATHS' },
    { time: '3:20PM–4:10PM',   sub: 'LIBRARY' },
  ],
  Thu: [
    { time: '9:00AM–9:55AM',   sub: 'MATHS' },
    { time: '9:55AM–10:50AM',  sub: 'MC' },
    { time: '10:50AM–11:10AM', sub: 'BREAK',    type: 'break' },
    { time: '11:10AM–12:05PM', sub: 'UHV' },
    { time: '12:05PM–1:00PM',  sub: 'ADA',      note: 'Individual' },
    { time: '1:00PM–1:40PM',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40PM–2:30PM',   sub: 'DBMS',     note: 'Individual' },
    { time: '2:30PM–4:10PM',   sub: 'SPORTS/CUL', span: true },
    null,
  ],
  Fri: [
    { time: '9:00AM–9:55AM',   sub: 'MC',       note: 'Individual' },
    { time: '9:55AM–10:50AM',  sub: 'BIO' },
    { time: '10:50AM–11:10AM', sub: 'BREAK',    type: 'break' },
    { time: '11:10AM–12:05PM', sub: 'ADA' },
    { time: '12:05PM–1:00PM',  sub: 'MATHS' },
    { time: '1:00PM–1:40PM',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40PM–3:20PM',   sub: 'DBMS/MC',  note: 'C1/C2', span: true },
    null,
    { time: '3:20PM–4:10PM',   sub: 'TUTORIAL' },
  ],
  Sat: [
    { time: '9:00AM–9:55AM',   sub: 'ADA' },
    { time: '9:55AM–10:50AM',  sub: 'DBMS' },
    { time: '10:50AM–11:10AM', sub: 'BREAK',    type: 'break' },
    { time: '11:10AM–12:05PM', sub: 'MATHS' },
    { time: '12:05PM–1:00PM',  sub: 'MC' },
    { time: '1:00PM–1:40PM',   sub: null },
    { time: '1:40PM–3:20PM',   sub: 'NSS/AICTE', note: 'Grp1: NSS · Grp2: AICTE', span: true },
    null,
    { time: '3:20PM–4:10PM',   sub: null },
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
    { time: '1:40–3:20',   sub: 'MC/DBMS',  note: 'B1/B2', span: true },
    null,
    { time: '3:20–4:10',   sub: 'PROCTOR' },
  ],
  Tue: [
    { time: '9:00–10:50',  sub: 'ADA/LATEX', note: 'B1/B2', span: true },
    null,
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
    { time: '1:40–3:20',   sub: 'LATEX/ADA', note: 'B1/B2', span: true },
    null,
    { time: '3:20–4:10',   sub: 'LIBRARY' },
  ],
  Thu: [
    { time: '9:00–10:50',  sub: 'DBMS/MC',  note: 'B1/B2', span: true },
    null,
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'BIO' },
    { time: '12:05–1:00',  sub: 'MC' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'MATHS' },
    { time: '2:30–4:10',   sub: 'SPORTS/CUL', span: true },
    null,
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
    { time: '1:00–1:40',   sub: null },
    { time: '1:40–3:20',   sub: 'NSS',      note: 'Grp1: NSS · Grp2: AICTE', span: true },
    null,
    { time: '3:20–4:10',   sub: null },
  ],
};

const TIMETABLE_6B = {
  Mon: [
    { time: '9:00–10:50',  sub: 'CC/ML',    note: 'B1/B2', span: true },
    null,
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
    { time: '2:30–4:10',   sub: 'TECHNICAL', span: true },
    null,
  ],
  Wed: [
    { time: '9:00–9:55',   sub: 'IWM' },
    { time: '9:55–10:50',  sub: 'ML' },
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'BC' },
    { time: '12:05–1:00',  sub: 'CC' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–3:20',   sub: 'ML/DEVOPS', note: 'B1/B2', span: true },
    null,
    { time: '3:20–4:10',   sub: 'LIBRARY' },
  ],
  Thu: [
    { time: '9:00–10:50',  sub: 'DEVOPS/CC', note: 'B1/B2', span: true },
    null,
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–12:05', sub: 'CC',       note: 'Individual' },
    { time: '12:05–1:00',  sub: 'IWM' },
    { time: '1:00–1:40',   sub: 'LUNCH',    type: 'lunch' },
    { time: '1:40–2:30',   sub: 'BC' },
    { time: '2:30–4:10',   sub: 'SPORTS/CUL', span: true },
    null,
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
    { time: '9:00–10:50',  sub: 'PROJECT',  note: 'Project Phase 1', span: true },
    null,
    { time: '10:50–11:10', sub: 'BREAK',    type: 'break' },
    { time: '11:10–1:00',  sub: 'PROJECT',  note: 'Project Phase 1', span: true },
    null,
    { time: '1:00–1:40',   sub: null },
    { time: '1:40–3:20',   sub: 'NSS',      note: 'Grp1: NSS · Grp2: AICTE', span: true },
    null,
    { time: '3:20–4:10',   sub: null },
  ],
};

const SECTION_META = {
  '4C': { room: 'Room 301', classTeacher: 'Prof. Pavithra L', proctor: 'Prof. Kavitha N · Prof. Ayesha Sana' },
  '4B': { room: 'Room 311', classTeacher: 'Prof. Vanishree', proctor: 'Prof. Vanishree' },
  '6B': { room: 'Room TR-1', classTeacher: 'Prof. Swathi J K', proctor: 'Prof. Swathi J K · Prof. Malashree N' },
};

const SECTION_TEACHERS = {
  '4C': {
    ADA: 'Prof. Pavithra L',
    MC: 'Prof. Nandini A',
    DBMS: 'Prof. Manjunath Singh H',
    MATHS: 'Prof. Pavithra H V',
    LATEX: 'Prof. Sheela S',
    BIO: 'Prof. Monica M',
    UHV: 'Prof. Ayesha Sana',
    NSS: 'Prof. Manjunath Singh H',
    PROCTOR: 'Prof. Kavitha N · Prof. Ayesha Sana',
    'ADA/LATEX': 'Prof. Pavithra L & Sarika CG (C1) / Prof. Sheela S & Manjunath Singh H (C2)',
    'LATEX/ADA': 'Prof. Sheela S & Anitha P (C1) / Prof. Pavithra L & Manjunath Singh H (C2)', 
    'MC/DBMS': 'Prof. Nandini A & Vanishree (C1) / Prof. Manjunath Singh H & Hareesh C (C2)',
    'DBMS/MC': 'Prof. Manjunath Singh H & Hareesh C (C1) / Prof. Nandini A & Vanishree (C2)',
  },
  '4B': {
    ADA: 'Dr. Vasudeva R',         
    'ADA/LATEX': 'Prof. Malashree N (B1) / Prof. Hareesh C (B2)',
    'LATEX/ADA': 'Prof. Ayesha Sana (B1) / Prof. Hareesh C (B2)',
    MC:  'Prof. Vanishree',        
    'MC/DBMS':  'Prof. Vanishree (B1) / Prof. Anitha P (B2)',
    DBMS:'Prof. Anitha P',         
    'DBMS/MC':  'Prof. Anitha P (B1) / Prof. Vanishree (B2)',
    MATHS:'Prof. Nagaraj S A',     
    LATEX: 'Prof. Sarika C G',
    BIO: 'Prof. Monica',           
    UHV:   'Prof. Anitha P',
    NSS: 'Prof. Manjunath Singh H',
    PROCTOR:'Prof. Vanishree',
  },
  '6B': {
    CC:  'Prof. Swathi J K',       'CC/ML':    'Prof. Vanishree (B1) / Prof. Hareesh (B2)',
    ML:  'Prof. Sagar G S',        'ML/DEVOPS':'Prof. Sumranai H (B1) / Prof. Kavitha N (B2)',
    BC:  'Prof. Malashree N',      IWM:   'Prof. Arun Kumar P',
    DEVOPS:'Prof. Sheela S',       'DEVOPS/CC':'Prof. Sarika CG (B1) / Prof. Mahalakshmi R (B2)',
    PROJECT:'Dr. Vasudeva R & Prof. Kavitha N',
    NSS: 'Prof. Manjunath Singh H',IKS:   'Prof. Vanishree',
    PROCTOR:'Prof. Swathi J K, Prof. Malashree N',
  },
};

// Helper to convert array with nulls into array of clean objects avoiding schema null errs
const cleanDays = (daysObj) => {
  const clean = {};
  for (const [day, arr] of Object.entries(daysObj)) {
    clean[day] = arr.map(c => {
      if (!c) return { time: 'span', sub: null }; // placeholder representation
      return { ...c, sub: c.sub || null };
    });
  }
  return clean;
};

export const seedTimetables = async () => {
  try {
    const count = await Timetable.countDocuments();
    if (count === 0) {
      console.log('Seeding initial timetables...');
      const tts = [
        { section: '4B', days: cleanDays(TIMETABLE_4B), teachers: SECTION_TEACHERS['4B'], meta: SECTION_META['4B'] },
        { section: '6B', days: cleanDays(TIMETABLE_6B), teachers: SECTION_TEACHERS['6B'], meta: SECTION_META['6B'] },
      ];
      await Timetable.insertMany(tts);
      console.log('Timetables seeded successfully.');
    }
    
    // Auto-update 4C since there were heavy explicit modifications requested
    await Timetable.findOneAndUpdate(
       { section: '4C' },
       { section: '4C', days: cleanDays(TIMETABLE_4C), teachers: SECTION_TEACHERS['4C'], meta: SECTION_META['4C'] },
       { upsert: true }
    );
  } catch (err) {
    console.error('Error seeding timetables:', err.message);
  }
};
