/**
 * Nex Campus — Database Seed (CBIT Kolar)
 *
 * Usage:
 *   node utils/seedData.js
 */

import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
require('dotenv').config({ path: join(__dirname, '../.env') });

import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Event from '../models/Event.js';
import Facility from '../models/Facility.js';
import Announcement from '../models/Announcement.js';
import Attendance from '../models/Attendance.js';

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN USER  (upserted — never wiped)
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN = {
  name: 'Sai',
  email: 'jinkazamaxui@gmail.com',
  password: 'sai@7860',
  usn: '1ck24cs104',
  role: 'admin',
  section: '4C',
  semester: 4,
};

// ─────────────────────────────────────────────────────────────────────────────
// MODULE HELPER
// ─────────────────────────────────────────────────────────────────────────────
const makeModules = (folder, titles) =>
  titles.map((title, i) => ({
    number: i + 1,
    title,
    pdfUrl: `/pdfs/${folder}/module${i + 1}.pdf`,
  }));

const COURSE_MODULES = {
  BCS401:  makeModules('ada',    ['Introduction to Algorithm Analysis', 'Divide & Conquer Strategies', 'Greedy Algorithms', 'Dynamic Programming', 'Graph Algorithms & NP-Completeness']),
  BCS402:  makeModules('mc',     ['8051 Architecture & Programming', 'Instruction Set & Assembly Language', 'Timers, Interrupts & Serial Communication', 'ARM Architecture & Cortex-M', 'Peripheral Interfacing & Embedded Design']),
  BCS403:  makeModules('dbms',   ['Relational Model & ER Diagrams', 'SQL & Relational Algebra', 'Normalization (1NF–BCNF)', 'Transaction Management & Concurrency Control', 'NoSQL & Advanced Databases']),
  BCS405A: makeModules('maths',  ['Logic, Proofs & Set Theory', 'Relations & Functions', 'Graph Theory & Trees', 'Algebraic Structures (Groups, Rings)', 'Combinatorics & Counting Principles']),
};

// ─────────────────────────────────────────────────────────────────────────────
// COURSES — 4C (4th Semester, CSE, Section 4C)
// ─────────────────────────────────────────────────────────────────────────────
const courses4C = [
  {
    code: 'BCS401',
    name: 'Analysis & Design of Algorithms',
    description: 'Covers design paradigms: divide & conquer, greedy, dynamic programming, backtracking, and branch & bound. Analysis of time and space complexity using asymptotic notations.',
    instructor: 'Prof. Pavithra L',
    schedule: 'Mon 11:10–12:05 · Mon 12:05–1:00 · Wed 11:10–12:05 · Wed 12:05–1:00 · Sat 9:00–9:55',
    credits: 4,
    department: 'Computer Science',
    level: 400,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 60,
    enrolled: 58,
    section: '4C',
    totalClasses: 30,
    tags: ['Algorithms', 'Complexity', 'Data Structures'],
  },
  {
    code: 'BCS402',
    name: 'Microcontrollers',
    description: 'Introduction to 8051 and ARM microcontrollers. Topics include architecture, instruction set, assembly language programming, interfacing peripherals, and embedded system design.',
    instructor: 'Prof. Nandini A',
    schedule: 'Mon 9:00–9:55 · Tue 9:55–10:50 · Thu 9:55–10:50 · Wed 11:10–12:05 · Sat 12:05–1:00',
    credits: 4,
    department: 'Computer Science',
    level: 400,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 60,
    enrolled: 55,
    section: '4C',
    totalClasses: 30,
    tags: ['Embedded Systems', 'Microcontrollers', 'Hardware'],
  },
  {
    code: 'BCS403',
    name: 'Database Management Systems',
    description: 'Relational model, ER diagrams, SQL, normalization (1NF–BCNF), transaction management, concurrency control, and introduction to NoSQL databases.',
    instructor: 'Prof. Manjunath Singh H',
    schedule: 'Tue 9:55–10:50 · Mon 11:10–12:05 · Wed 1:40–2:30 · Thu 1:40–2:30 · Sat 9:55–10:50',
    credits: 4,
    department: 'Computer Science',
    level: 400,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 60,
    enrolled: 60,
    section: '4C',
    totalClasses: 30,
    tags: ['SQL', 'Database', 'Normalization'],
  },
  {
    code: 'BCSL404',
    name: 'Analysis & Design of Algorithms Lab',
    description: 'Practical implementation of algorithms studied in BCS401. Programs in C/C++ covering sorting, searching, graph algorithms, and dynamic programming.',
    instructor: 'Prof. Pavithra L',
    schedule: 'As per lab timetable (C1/C2 batches)',
    credits: 2,
    department: 'Computer Science',
    level: 400,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 30,
    enrolled: 29,
    section: '4C',
    totalClasses: 30,
    tags: ['Lab', 'Algorithms', 'Programming'],
  },
  {
    code: 'BCS405A',
    name: 'Discrete Mathematical Structures',
    description: 'Logic and proofs, set theory, relations, functions, graph theory, trees, algebraic structures, and combinatorics. Core mathematical foundation for Computer Science.',
    instructor: 'Prof. Pavithra H V',
    schedule: 'Tue 1:40–2:30 · Wed 2:30–3:20 · Thu 9:00–9:55 · Fri 12:05–1:00 · Sat 11:10–12:05',
    credits: 3,
    department: 'Computer Science',
    level: 400,
    difficulty: 'advanced',
    status: 'active',
    capacity: 60,
    enrolled: 57,
    section: '4C',
    totalClasses: 30,
    tags: ['Mathematics', 'Discrete Math', 'Graph Theory'],
  },
  {
    code: 'BCSL456D',
    name: 'Technical Writing using LaTeX',
    description: 'Document preparation using LaTeX: typesetting, mathematical formulas, tables, figures, bibliography management with BibTeX, and creating professional reports and presentations.',
    instructor: 'Prof. Sheela S',
    schedule: 'Mon 9:55–10:50 (Individual) · Wed 9:00–10:50 (C1 batch)',
    credits: 2,
    department: 'Computer Science',
    level: 400,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 54,
    section: '4C',
    totalClasses: 30,
    tags: ['LaTeX', 'Technical Writing', 'Documentation'],
  },
  {
    code: 'BBOC407',
    name: 'Biology for Computer Engineers',
    description: 'Interdisciplinary course covering bioinformatics, computational biology, DNA computing, neural networks inspired by biology, and applications of CS in healthcare.',
    instructor: 'Prof. Monica M',
    schedule: 'Tue 9:00–9:55 · Fri 10:50–11:10',
    credits: 3,
    department: 'Computer Science',
    level: 400,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 60,
    section: '4C',
    totalClasses: 30,
    tags: ['Biology', 'Bioinformatics', 'Interdisciplinary'],
  },
  {
    code: 'BUHK408',
    name: 'Universal Human Values Course',
    description: 'Explores human values, ethics, professional conduct, and holistic development. Topics include self-discovery, relationships, societal harmony, and sustainable living.',
    instructor: 'Prof. Ayesha Sana',
    schedule: 'Thu 11:10–12:05',
    credits: 1,
    department: 'General',
    level: 400,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 60,
    section: '4C',
    totalClasses: 30,
    tags: ['Ethics', 'Values', 'Holistic Development'],
  },
  {
    code: 'BNSK459',
    name: 'National Service Scheme',
    description: 'NSS activities fostering community service, social responsibility, and national development. Saturday sessions include camps, awareness drives, and volunteering.',
    instructor: 'Prof. Manjunath Singh H',
    schedule: 'Saturday sessions',
    credits: 0,
    department: 'General',
    level: 400,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 45,
    section: '4C',
    totalClasses: 30,
    tags: ['NSS', 'Community Service', 'Social'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COURSES — 4B (4th Semester, CSE, Section 4B — same subjects, different instructors)
// ─────────────────────────────────────────────────────────────────────────────
const courses4B = [
  {
    code: 'BCS401',
    name: 'Analysis & Design of Algorithms',
    description: 'Covers design paradigms: divide & conquer, greedy, dynamic programming, backtracking, and branch & bound. Analysis of time and space complexity using asymptotic notations.',
    instructor: 'Dr. Vasudeva R',
    schedule: 'Mon 9:55–10:50 · Fri 9:55–10:50 · Sat 11:10–12:05',
    credits: 4,
    department: 'Computer Science',
    level: 400,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 60,
    enrolled: 55,
    section: '4B',
    totalClasses: 30,
    tags: ['Algorithms', 'Complexity', 'Data Structures'],
  },
  {
    code: 'BCS402',
    name: 'Microcontrollers',
    description: 'Introduction to 8051 and ARM microcontrollers. Topics include architecture, instruction set, assembly language programming, interfacing peripherals, and embedded system design.',
    instructor: 'Prof. Vanishree',
    schedule: 'Mon 11:10–12:05 · Wed 9:00–9:55 · Thu 12:05–1:00 · Sat 9:00–9:55',
    credits: 4,
    department: 'Computer Science',
    level: 400,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 60,
    enrolled: 52,
    section: '4B',
    totalClasses: 30,
    tags: ['Embedded Systems', 'Microcontrollers', 'Hardware'],
  },
  {
    code: 'BCS403',
    name: 'Database Management Systems',
    description: 'Relational model, ER diagrams, SQL, normalization (1NF–BCNF), transaction management, concurrency control, and introduction to NoSQL databases.',
    instructor: 'Prof. Anitha P',
    schedule: 'Mon 12:05–1:00 · Tue 11:10–12:05 · Wed 12:05–1:00 · Sat 12:05–1:00',
    credits: 4,
    department: 'Computer Science',
    level: 400,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 60,
    enrolled: 58,
    section: '4B',
    totalClasses: 30,
    tags: ['SQL', 'Database', 'Normalization'],
  },
  {
    code: 'BCSL404',
    name: 'Analysis & Design of Algorithms Lab',
    description: 'Practical implementation of algorithms studied in BCS401. Programs in C/C++ covering sorting, searching, graph algorithms, and dynamic programming.',
    instructor: 'Prof. Pavithra L',
    schedule: 'As per lab timetable (B1/B2 batches)',
    credits: 2,
    department: 'Computer Science',
    level: 400,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 30,
    enrolled: 28,
    section: '4B',
    totalClasses: 30,
    tags: ['Lab', 'Algorithms', 'Programming'],
  },
  {
    code: 'BCS405A',
    name: 'Discrete Mathematical Structures',
    description: 'Logic and proofs, set theory, relations, functions, graph theory, trees, algebraic structures, and combinatorics. Core mathematical foundation for Computer Science.',
    instructor: 'Prof. Nagaraj S A',
    schedule: 'Mon 9:00–9:55 · Tue 12:05–1:00 · Thu 1:40–2:30 · Fri 1:40–2:30 · Sat 9:55–10:50',
    credits: 3,
    department: 'Computer Science',
    level: 400,
    difficulty: 'advanced',
    status: 'active',
    capacity: 60,
    enrolled: 56,
    section: '4B',
    totalClasses: 30,
    tags: ['Mathematics', 'Discrete Math', 'Graph Theory'],
  },
  {
    code: 'BCSL456D',
    name: 'Technical Writing using LaTeX',
    description: 'Document preparation using LaTeX: typesetting, mathematical formulas, tables, figures, bibliography management with BibTeX, and creating professional reports and presentations.',
    instructor: 'Prof. Sarika C G',
    schedule: 'Fri 2:30–3:20 (Individual) · Wed 1:40–2:30 (B1 batch)',
    credits: 2,
    department: 'Computer Science',
    level: 400,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 52,
    section: '4B',
    totalClasses: 30,
    tags: ['LaTeX', 'Technical Writing', 'Documentation'],
  },
  {
    code: 'BBOC407',
    name: 'Biology for Computer Engineers',
    description: 'Interdisciplinary course covering bioinformatics, computational biology, DNA computing, neural networks inspired by biology, and applications of CS in healthcare.',
    instructor: 'Prof. Monica',
    schedule: 'Wed 11:10–12:05 · Thu 11:10–12:05',
    credits: 3,
    department: 'Computer Science',
    level: 400,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 60,
    section: '4B',
    totalClasses: 30,
    tags: ['Biology', 'Bioinformatics', 'Interdisciplinary'],
  },
  {
    code: 'BUHK408',
    name: 'Universal Human Values Course',
    description: 'Explores human values, ethics, professional conduct, and holistic development.',
    instructor: 'Prof. Anitha P',
    schedule: 'Tue 1:40–2:30',
    credits: 1,
    department: 'General',
    level: 400,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 60,
    section: '4B',
    totalClasses: 30,
    tags: ['Ethics', 'Values', 'Holistic Development'],
  },
  {
    code: 'BNSK459',
    name: 'National Service Scheme',
    description: 'NSS activities fostering community service, social responsibility, and national development.',
    instructor: 'Prof. Manjunath Singh H',
    schedule: 'Saturday sessions',
    credits: 0,
    department: 'General',
    level: 400,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 45,
    section: '4B',
    totalClasses: 30,
    tags: ['NSS', 'Community Service', 'Social'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COURSES — 6B (6th Semester, CSE, Section 6B)
// ─────────────────────────────────────────────────────────────────────────────
const courses6B = [
  {
    code: 'BCS601',
    name: 'Cloud Computing',
    description: 'Fundamentals of cloud computing: service models (IaaS, PaaS, SaaS), deployment models, virtualization, containerization, AWS/Azure/GCP overview, and cloud security.',
    instructor: 'Prof. Swathi J K',
    schedule: 'Mon 11:10–12:05 · Tue 1:40–2:30 · Wed 12:05–1:00 · Fri 1:40–2:30',
    credits: 4,
    department: 'Computer Science',
    level: 600,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 60,
    enrolled: 55,
    section: '6B',
    totalClasses: 30,
    tags: ['Cloud', 'AWS', 'Virtualization'],
  },
  {
    code: 'BCS602',
    name: 'Machine Learning',
    description: 'Supervised and unsupervised learning, regression, classification, clustering, neural networks, feature engineering, and model evaluation metrics.',
    instructor: 'Prof. Sagar G S',
    schedule: 'Mon 1:40–2:30 · Tue 12:05–1:00 · Wed 9:55–10:50 · Fri 9:00–9:55',
    credits: 4,
    department: 'Artificial Intelligence',
    level: 600,
    difficulty: 'advanced',
    status: 'active',
    capacity: 60,
    enrolled: 58,
    section: '6B',
    totalClasses: 30,
    tags: ['ML', 'AI', 'Deep Learning'],
  },
  {
    code: 'BCS613A',
    name: 'Blockchain Technology',
    description: 'Distributed ledger technology, cryptographic hashing, consensus mechanisms, smart contracts, Ethereum, Solidity, and blockchain applications in finance and supply chain.',
    instructor: 'Prof. Malashree N',
    schedule: 'Tue 9:00–9:55 · Wed 11:10–12:05 · Thu 1:40–2:30 · Fri 9:55–10:50',
    credits: 3,
    department: 'Computer Science',
    level: 600,
    difficulty: 'advanced',
    status: 'active',
    capacity: 60,
    enrolled: 50,
    section: '6B',
    totalClasses: 30,
    tags: ['Blockchain', 'Crypto', 'Smart Contracts'],
  },
  {
    code: 'BCV654C',
    name: 'Integrated Waste Management',
    description: 'Principles of solid and e-waste management, sustainability, recycling technologies, environmental impact assessment, and green computing practices.',
    instructor: 'Prof. Arun Kumar P',
    schedule: 'Mon 2:30–3:20 · Tue 11:10–12:05 · Wed 9:00–9:55 · Thu 12:05–1:00 · Fri 11:10–12:05',
    credits: 3,
    department: 'Other',
    level: 600,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 60,
    section: '6B',
    totalClasses: 30,
    tags: ['Environment', 'Sustainability', 'Green Tech'],
  },
  {
    code: 'BCS685',
    name: 'Project Phase 1',
    description: 'Final year project first phase: literature review, problem statement, requirement analysis, system design, and preliminary implementation. Team-based project work.',
    instructor: 'Dr. Vasudeva R & Prof. Kavitha N',
    schedule: 'Saturday 9:00–1:00',
    credits: 4,
    department: 'Computer Science',
    level: 600,
    difficulty: 'advanced',
    status: 'active',
    capacity: 60,
    enrolled: 55,
    section: '6B',
    totalClasses: 30,
    tags: ['Project', 'Research', 'Design'],
  },
  {
    code: 'BCSL606',
    name: 'Machine Learning Lab',
    description: 'Practical implementation of ML algorithms using Python, scikit-learn, TensorFlow, and Jupyter notebooks.',
    instructor: 'Prof. Sagar G S',
    schedule: 'As per lab timetable (B1/B2 batches)',
    credits: 2,
    department: 'Artificial Intelligence',
    level: 600,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 30,
    enrolled: 28,
    section: '6B',
    totalClasses: 30,
    tags: ['Lab', 'Python', 'ML'],
  },
  {
    code: 'BCSL657D',
    name: 'DevOps',
    description: 'CI/CD pipelines, Docker, Kubernetes, Jenkins, Git workflows, infrastructure as code, monitoring, and cloud deployment practices.',
    instructor: 'Prof. Sheela S',
    schedule: 'As per lab timetable (B1/B2 batches)',
    credits: 2,
    department: 'Computer Science',
    level: 600,
    difficulty: 'intermediate',
    status: 'active',
    capacity: 30,
    enrolled: 28,
    section: '6B',
    totalClasses: 30,
    tags: ['DevOps', 'Docker', 'CI/CD'],
  },
  {
    code: 'BNSK658',
    name: 'National Service Scheme',
    description: 'NSS activities fostering community service, social responsibility, and national development.',
    instructor: 'Prof. Manjunath Singh H',
    schedule: 'Saturday sessions',
    credits: 0,
    department: 'General',
    level: 600,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 45,
    section: '6B',
    totalClasses: 30,
    tags: ['NSS', 'Community Service', 'Social'],
  },
  {
    code: 'BIKS609',
    name: 'Indian Knowledge System',
    description: 'Exploration of ancient Indian scientific and philosophical contributions: Vedic mathematics, Ayurveda, astronomy, architecture, and their modern relevance.',
    instructor: 'Prof. Vanishree',
    schedule: 'Tue 11:10–12:05',
    credits: 1,
    department: 'General',
    level: 600,
    difficulty: 'beginner',
    status: 'active',
    capacity: 60,
    enrolled: 60,
    section: '6B',
    totalClasses: 30,
    tags: ['Culture', 'History', 'Philosophy'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────────────────────────────
const events = [
  {
    title: 'Webtopia Hackathon 2026',
    description: 'A 24-hour web development hackathon organized by AIMAN. Teams competed to build innovative web solutions. 🏆 First Prize: Misba & Saikiran | 🥈 Second Prize: Bharadwaj & Rohith. Congratulations to all participants!',
    date: new Date('2026-04-10'),
    time: '09:00',
    endTime: '09:00',
    location: 'College Auditorium',
    category: 'hackathon',
    capacity: 100,
    status: 'past',
    featured: true,
    organizer: 'AIMAN Club',
    tags: ['Hackathon', 'Web Dev', 'AIMAN'],
  },
  {
    title: '4th Internals Examination',
    description: 'Fourth internal assessment examinations for all departments. Timetable will be announced by the exam cell. Students must carry valid college ID cards. No electronic devices allowed in examination halls.',
    date: new Date('2026-04-21'),
    time: '09:00',
    endTime: '12:00',
    location: 'Respective Classrooms',
    category: 'academic',
    capacity: 0,
    status: 'upcoming',
    featured: false,
    organizer: 'Examination Cell, CBIT Kolar',
    tags: ['Exams', 'Internals', 'Assessment'],
  },
  {
    title: 'Annual Sports Meet 2026',
    description: 'CBIT Kolar Annual Sports Meet featuring track and field events, cricket, football, volleyball, kabaddi, and more. All departments participate. Register with your department sports coordinator by April 28th.',
    date: new Date('2026-05-05'),
    time: '08:00',
    endTime: '17:00',
    location: 'Main Sports Ground',
    category: 'sports',
    capacity: 500,
    status: 'upcoming',
    featured: false,
    organizer: 'Physical Education Department',
    tags: ['Sports', 'Athletics', 'Inter-Department'],
  },
  {
    title: 'Food Court Festival',
    description: 'Campus food festival featuring stalls from local vendors, cooking competitions, and cultural performances. Open to all students and faculty. Come hungry, leave happy!',
    date: new Date('2026-05-10'),
    time: '11:00',
    endTime: '20:00',
    location: 'Campus Ground',
    category: 'cultural',
    capacity: 300,
    status: 'upcoming',
    featured: false,
    organizer: 'Student Cultural Committee',
    tags: ['Food', 'Cultural', 'Festival'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FACILITIES
// ─────────────────────────────────────────────────────────────────────────────
const facilities = [
  {
    name: 'Central Library',
    description: 'Extensive collection of textbooks, reference materials, journals, and digital resources. Quiet study zones on all floors. Photocopy and printing available.',
    location: 'Near Civil Block',
    hours: '8:30 AM – 5:30 PM',
    capacity: 200,
    currentOccupancy: 80,
    status: 'open',
    type: 'library',
    featured: true,
    image: '/images/library.jpg',
    amenities: ['Study Zones', 'Digital Catalog', 'Photocopier', 'Reference Section', 'Journals'],
  },
  {
    name: 'Computer Science Lab (Java / OOP)',
    description: 'Equipped with desktop computers for Java programming, OOP concepts, and software development practicals.',
    location: 'CSE Block, Room 302',
    hours: '9:00 AM – 4:00 PM',
    capacity: 60,
    currentOccupancy: 0,
    status: 'open',
    type: 'lab',
    image: '/images/cs-lab.jpg',
    amenities: ['Desktop PCs', 'JDK', 'Eclipse IDE', 'Wi-Fi', 'Projector'],
  },
  {
    name: 'Physics Lab',
    description: 'General physics laboratory for engineering physics practicals and experiments.',
    location: 'Science Block, Ground Floor',
    hours: '9:00 AM – 4:00 PM',
    capacity: 40,
    currentOccupancy: 0,
    status: 'open',
    type: 'lab',
    image: '/images/physics-lab.jpg',
    amenities: ['Optical Instruments', 'Measurement Tools', 'Experiment Kits'],
  },
  {
    name: 'Chemistry Lab',
    description: 'Chemistry laboratory for engineering chemistry practicals including volumetric analysis, spectroscopy, and material testing.',
    location: 'Science Block, First Floor',
    hours: '9:00 AM – 4:00 PM',
    capacity: 40,
    currentOccupancy: 0,
    status: 'open',
    type: 'lab',
    image: '/images/chemistry-lab.jpg',
    amenities: ['Fume Hood', 'Spectrophotometer', 'Chemical Reagents', 'Safety Equipment'],
  },
  {
    name: 'Campus Canteen',
    description: 'Main canteen serving breakfast, lunch, and snacks. Affordable meals for students and staff. Special thali available on weekdays.',
    location: 'Central Campus',
    hours: '8:00 AM – 6:00 PM',
    capacity: 150,
    currentOccupancy: 40,
    status: 'open',
    type: 'canteen',
    image: '/images/canteen.jpg',
    amenities: ['Hot Meals', 'Snacks', 'Beverages', 'Outdoor Seating'],
    menuItems: [
      { name: 'Parota Plate', price: 40, description: '2 parotas served hot' },
      { name: 'Rice & Sambar Plate', price: 50, description: 'Full plate rice with sambar' },
      { name: 'Veg Thali', price: 60, description: 'Rice, dal, sabzi, roti, pickle' },
      { name: 'Tea / Coffee', price: 10, description: 'Fresh brewed hot beverages' },
      { name: 'Biscuits & Snacks', price: 15, description: 'Packaged biscuits and chips' },
    ],
  },
  {
    name: 'College Auditorium',
    description: 'Main auditorium for events, seminars, guest lectures, national day celebrations, and cultural programs. Fully air-conditioned. Seats 500+ students.',
    location: 'Main Building, Ground Floor',
    hours: 'By Reservation',
    capacity: 500,
    currentOccupancy: 0,
    status: 'open',
    type: 'auditorium',
    image: '/images/auditorium.jpg',
    bookingRequired: true,
    amenities: ['AC', 'Stage', 'PA System', 'Projector Screen', 'Green Room'],
  },
  {
    name: 'Sports Ground',
    description: 'Large open ground with cricket pitch, football field, volleyball court, and outdoor exercise equipment.',
    location: 'Behind Hostel Block',
    hours: '6:00 AM – 7:00 PM',
    capacity: 300,
    currentOccupancy: 30,
    status: 'open',
    type: 'sports',
    image: '/images/sports-ground.jpg',
    amenities: ['Cricket Pitch', 'Football Field', 'Volleyball Court', 'Outdoor Gym'],
  },
  {
    name: 'Campus Stationery',
    description: 'Buy record books, assignment books, lab manuals, pens, and other stationery. Record books and assignment books are mandatory for all lab courses.',
    location: 'Near Main Gate',
    hours: '8:30 AM – 4:30 PM',
    capacity: 10,
    currentOccupancy: 0,
    status: 'open',
    type: 'shop',
    image: '/images/stationery.jpg',
    amenities: ['Record Books', 'Assignment Books', 'Lab Manuals', 'Pens', 'Graph Sheets'],
  },
  {
    name: 'Boys Hostel',
    description: 'On-campus hostel facility for male students. Includes mess hall, common study rooms, recreational area, and 24/7 security.',
    location: 'East Campus',
    hours: '24/7',
    capacity: 200,
    currentOccupancy: 160,
    status: 'open',
    type: 'hostel',
    image: '/images/hostel.jpg',
    amenities: ['Mess Hall', 'Study Rooms', 'Wi-Fi', 'Laundry', '24/7 Security'],
  },
  {
    name: 'Campus Garden Seating',
    description: 'Open-air seating area with brick-shaped benches near the mango tree clusters. Popular hangout spot for students between classes.',
    location: 'Central Campus, Near Mango Trees',
    hours: 'Open 24/7',
    capacity: 100,
    currentOccupancy: 20,
    status: 'open',
    type: 'recreation',
    image: '/images/garden.jpg',
    amenities: ['Benches', 'Shade', 'Open Air', 'Wi-Fi (partial)'],
  },
  {
    name: 'Data Structures & Algorithms Lab',
    description: 'Dedicated lab for Data Structures and Algorithms practicals using C/C++. Used for BCSL404 (ADA Lab) sessions.',
    location: 'CSE Block, Room 303',
    hours: '9:00 AM – 4:00 PM',
    capacity: 60,
    currentOccupancy: 0,
    status: 'open',
    type: 'lab',
    amenities: ['Desktop PCs', 'GCC Compiler', 'Code::Blocks', 'Wi-Fi'],
  },
  {
    name: 'LaTeX Lab',
    description: 'Lab for Technical Writing using LaTeX (BCSL456D). Equipped with TeX Live distributions, Overleaf access, and document preparation tools.',
    location: 'CSE Block, Room 304',
    hours: '9:00 AM – 4:00 PM',
    capacity: 40,
    currentOccupancy: 0,
    status: 'open',
    type: 'lab',
    amenities: ['TeX Live', 'Overleaf Access', 'TeXstudio', 'Wi-Fi'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────────────────────────
const announcements = [
  {
    title: 'Webtopia Hackathon Results — Congratulations!',
    content: 'Congratulations to all participants of the Webtopia Hackathon 2026 organized by AIMAN! 🏆 First Prize: Misba & Saikiran | 🥈 Second Prize: Bharadwaj & Rohith. A big thank you to all teams and the AIMAN club for organizing this amazing event.',
    category: 'events',
    priority: 'high',
    pinned: true,
    targetRoles: ['all'],
    authorName: 'Sai',
  },
  {
    title: '4th Internals Starting April 21st',
    content: 'The 4th Internal Assessment examinations will begin from April 21st, 2026. Detailed timetable with subjects per day will be announced by the exam cell shortly. Students are advised to prepare accordingly and carry their college ID cards.',
    category: 'academic',
    priority: 'high',
    pinned: true,
    targetRoles: ['all'],
    authorName: 'Sai',
  },
  {
    title: 'Holiday on April 14 — Dr. Ambedkar Jayanti',
    content: 'April 14th, 2026 (Monday) is a holiday on account of Dr. B.R. Ambedkar Jayanti. Regular classes and lab sessions will resume on Tuesday, April 15th.',
    category: 'general',
    priority: 'medium',
    pinned: false,
    targetRoles: ['all'],
    authorName: 'Sai',
  },
  {
    title: 'Assignment Deadline — April 25th',
    content: 'Reminder: Assignments for ADA (BCS401), Technical Writing / LaTeX (BCSL456D), and DBMS (BCS403) must be submitted by April 25th, 2026. Late submissions will not be accepted. Submit physical copies to the respective faculty.',
    category: 'academic',
    priority: 'high',
    pinned: false,
    targetRoles: ['all'],
    authorName: 'Sai',
  },
  {
    title: 'Annual Sports Meet — Register by April 28th',
    content: 'The Annual Sports Meet is scheduled for May 5th, 2026 at the Main Sports Ground. Students interested in participating must register with their department sports coordinator by April 28th. Events: cricket, football, volleyball, kabaddi, track & field.',
    category: 'events',
    priority: 'medium',
    pinned: false,
    targetRoles: ['all'],
    authorName: 'Sai',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RUNNER
// ─────────────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB\n');

    // ── Upsert admin user (never delete) ────────────────────────────────────
    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      existing.name     = ADMIN.name;
      existing.usn      = ADMIN.usn;
      existing.role     = ADMIN.role;
      existing.section  = ADMIN.section;
      existing.semester = ADMIN.semester;
      await existing.save({ validateBeforeSave: false });
      console.log(`👤  Admin user preserved: ${ADMIN.email}`);
    } else {
      const u = new User(ADMIN);
      await u.save();
      console.log(`👤  Admin user created: ${ADMIN.email}`);
    }

    // ── Clear content collections ────────────────────────────────────────────
    console.log('\n🗑️   Clearing content collections...');
    await Promise.all([
      Course.deleteMany({}),
      Event.deleteMany({}),
      Facility.deleteMany({}),
      Announcement.deleteMany({}),
      Attendance.deleteMany({}),
    ]);

    // ── Drop the old code unique index if it exists ──────────────────────────
    try {
      await Course.collection.dropIndex('code_1');
      console.log('🔧  Dropped old code_1 unique index');
    } catch (_) { /* index may not exist, ignore */ }

    // ── Get admin ref for announcements ──────────────────────────────────────
    const admin = await User.findOne({ email: ADMIN.email });

    // ── Insert all data ───────────────────────────────────────────────────────
    const addModules = (courses) =>
      courses.map((c) => ({ ...c, modules: COURSE_MODULES[c.code] || [] }));

    const allCourses = [...addModules(courses4C), ...addModules(courses4B), ...courses6B];
    const [c, e, f, a] = await Promise.all([
      Course.insertMany(allCourses),
      Event.insertMany(events),
      Facility.insertMany(facilities),
      Announcement.insertMany(announcements.map((ann) => ({ ...ann, author: admin._id }))),
    ]);

    console.log(`\n📚  Courses        : ${c.length} (4C: ${courses4C.length}, 4B: ${courses4B.length}, 6B: ${courses6B.length})`);
    console.log(`📅  Events         : ${e.length}`);
    console.log(`🏛️   Facilities     : ${f.length}`);
    console.log(`📢  Announcements  : ${a.length}`);
    console.log('\n🎉  Seed complete!\n');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    if (err.errors) Object.values(err.errors).forEach((e) => console.error('  ', e.message));
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
