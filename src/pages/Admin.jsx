import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

// ── Field configs ─────────────────────────────────────────────────────────────
const CONFIGS = {
  dashboard: {
    label: 'Overview', icon: 'dashboard',
    color: 'text-primary', bg: 'bg-primary/10',
    isDashboard: true, display: null, fields: [],
  },
  announcements: {
    label: 'Announcements', icon: 'campaign',
    endpoint: '/api/announcements',
    color: 'text-primary', bg: 'bg-primary/10',
    fields: [
      { name: 'title',    label: 'Title',      type: 'text',     required: true },
      { name: 'content',  label: 'Content',    type: 'textarea', required: true },
      { name: 'category', label: 'Category',   type: 'select',   options: ['general', 'academic', 'events', 'facilities', 'urgent'] },
      { name: 'priority', label: 'Priority',   type: 'select',   options: ['low', 'medium', 'high', 'critical'] },
      { name: 'pinned',   label: 'Pin to top', type: 'checkbox' },
    ],
    display: (i) => ({ title: i.title, sub: i.content?.slice(0, 90) + (i.content?.length > 90 ? '…' : ''), badge: i.category, flag: i.pinned ? '📌' : '' }),
  },
  courses: {
    label: 'Courses', icon: 'school',
    endpoint: '/api/courses',
    color: 'text-secondary', bg: 'bg-secondary/10',
    fields: [
      { name: 'code',         label: 'Course Code',   type: 'text',   required: true },
      { name: 'name',         label: 'Course Name',   type: 'text',   required: true },
      { name: 'description',  label: 'Description',   type: 'textarea' },
      { name: 'instructor',   label: 'Instructor',    type: 'text',   required: true },
      { name: 'schedule',     label: 'Schedule',      type: 'text',   placeholder: 'Mon 9:00–10:00 · Wed 11:00–12:00' },
      { name: 'credits',      label: 'Credits',       type: 'number', required: true },
      { name: 'section',      label: 'Section',       type: 'select', options: ['A', 'B', 'C', 'D', 'E'] },
      { name: 'totalClasses', label: 'Total Classes', type: 'number', placeholder: '0' },
      { name: 'department',   label: 'Department',    type: 'select', required: true, options: ['Computer Science', 'General'] },
      { name: 'difficulty',   label: 'Difficulty',    type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
      { name: 'status',       label: 'Status',        type: 'select', options: ['active', 'new', 'popular', 'archived'] },
      { name: 'capacity',     label: 'Capacity',      type: 'number' },
    ],
    display: (i) => ({ title: `${i.code} — ${i.name}`, sub: `${i.instructor}  ·  ${i.section ? 'Sec ' + i.section + '  ·  ' : ''}${i.totalClasses || 0} classes`, badge: i.difficulty }),
  },
  events: {
    label: 'Events', icon: 'event',
    endpoint: '/api/events',
    color: 'text-tertiary', bg: 'bg-tertiary/10',
    fields: [
      { name: 'title',       label: 'Title',       type: 'text',     required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'date',        label: 'Date',        type: 'date',     required: true },
      { name: 'time',        label: 'Start Time',  type: 'text',     placeholder: '09:00' },
      { name: 'endTime',     label: 'End Time',    type: 'text',     placeholder: '17:00' },
      { name: 'location',    label: 'Location',    type: 'text' },
      { name: 'organizer',   label: 'Organizer',   type: 'text' },
      { name: 'category',    label: 'Category',    type: 'select',   options: ['keynote', 'hackathon', 'workshop', 'symposium', 'networking', 'open-house', 'sports', 'cultural', 'academic', 'other'] },
      { name: 'status',      label: 'Status',      type: 'select',   options: ['upcoming', 'live', 'past', 'cancelled', 'waitlist'] },
      { name: 'capacity',    label: 'Capacity',    type: 'number' },
      { name: 'featured',    label: 'Featured',    type: 'checkbox' },
    ],
    display: (i) => ({ title: i.title, sub: `${i.date ? new Date(i.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}${i.location ? '  ·  ' + i.location : ''}`, badge: i.status, flag: i.featured ? '⭐' : '' }),
  },
  facilities: {
    label: 'Facilities', icon: 'domain',
    endpoint: '/api/facilities',
    color: 'text-on-surface-variant', bg: 'bg-surface-container-high',
    fields: [
      { name: 'name',             label: 'Name',              type: 'text',     required: true },
      { name: 'description',      label: 'Description',       type: 'textarea' },
      { name: 'location',         label: 'Location',          type: 'text' },
      { name: 'hours',            label: 'Hours',             type: 'text',     placeholder: '9:00 AM – 5:00 PM' },
      { name: 'capacity',         label: 'Capacity',          type: 'number' },
      { name: 'currentOccupancy', label: 'Current Occupancy', type: 'number' },
      { name: 'type',             label: 'Type',              type: 'select',   required: true, options: ['library', 'lab', 'gym', 'dining', 'auditorium', 'studio', 'center', 'canteen', 'sports', 'recreation', 'hostel', 'shop', 'other'] },
      { name: 'status',           label: 'Status',            type: 'select',   options: ['open', 'closed', 'reserved', 'maintenance', 'peak'] },
      { name: 'bookingRequired',  label: 'Booking Required',  type: 'checkbox' },
      { name: 'featured',         label: 'Featured',          type: 'checkbox' },
      { name: 'menuItems',        label: 'Menu Items',        type: 'menu-items' },
    ],
    display: (i) => ({ title: i.name, sub: `${i.type}  ·  ${i.location || 'TBA'}  ·  ${i.hours || ''}`, badge: i.status, flag: i.type === 'canteen' && i.menuItems?.length ? `🍽️ ${i.menuItems.length}` : '' }),
  },
  attendance: {
    label: 'Attendance', icon: 'fact_check',
    endpoint: '/api/attendance/admin/summary',
    color: 'text-green-400', bg: 'bg-green-500/10',
    isAttendance: true, display: null, fields: [],
  },
  timetables: {
    label: 'Timetables', icon: 'calendar_month',
    endpoint: '/api/timetables',
    color: 'text-purple-400', bg: 'bg-purple-500/10',
    isTimetables: true, display: null, fields: [],
  },
  support: {
    label: 'Support', icon: 'support_agent',
    endpoint: '/api/support',
    color: 'text-orange-400', bg: 'bg-orange-500/10',
    isSupport: true, display: null, fields: [],
  },
  users: {
    label: 'Users', icon: 'group',
    endpoint: '/api/users',
    color: 'text-indigo-400', bg: 'bg-indigo-500/10',
    fields: [
      { name: 'name',     label: 'Name',             type: 'text',   disabled: true },
      { name: 'email',    label: 'Email',            type: 'text',   disabled: true },
      { name: 'usn',      label: 'USN',              type: 'text',   disabled: true },
      { name: 'role',     label: 'Role',             type: 'select', options: ['student', 'faculty', 'admin'] },
      { name: 'section',  label: 'Section',          type: 'text' },
      { name: 'address',  label: 'Address / Region', type: 'text' },
      { name: 'semester', label: 'Semester',         type: 'number' },
    ],
    display: (i) => ({ title: i.name, sub: `${i.email} · ${i.usn || 'No USN'}`, badge: i.role }),
  },
  resources: {
    label: 'Resources', icon: 'library_books',
    endpoint: '/api/resources',
    color: 'text-cyan-400', bg: 'bg-cyan-500/10',
    fields: [
      { name: 'title',    label: 'Title',    type: 'text',   required: true },
      { name: 'type',     label: 'Type',     type: 'select', options: ['Syllabus', 'Notes', 'PYQ', 'Calendar', 'Other'] },
      { name: 'semester', label: 'Semester', type: 'number', required: true },
      { name: 'branch',   label: 'Branch',   type: 'select', options: ['CSE', 'ECE', 'MECH', 'CIVIL', 'ISE', 'General'] },
      { name: 'url',      label: 'Drive Link (URL)', type: 'text', required: true },
    ],
    display: (i) => ({ title: i.title, sub: `Sem ${i.semester} · ${i.branch}`, badge: i.type }),
  },
  transport: {
    label: 'Transport', icon: 'directions_bus',
    endpoint: '/api/transport',
    color: 'text-yellow-400', bg: 'bg-yellow-500/10',
    fields: [
      { name: 'busNumber',    label: 'Bus Number',                      type: 'number', required: true },
      { name: 'destination',  label: 'Destination',                     type: 'text',   required: true },
      { name: 'areasServed',  label: 'Areas Served (comma-separated)',   type: 'array',  placeholder: 'Bangarpet, Kolar...' },
      { name: 'driverName',   label: 'Driver Name',                     type: 'text' },
      { name: 'driverContact',label: 'Driver Contact',                  type: 'text' },
      { name: 'schedule',     label: 'Schedule',                        type: 'text' },
    ],
    display: (i) => ({ title: `Bus ${i.busNumber} — ${i.destination}`, sub: `Areas: ${i.areasServed?.join(', ')}`, badge: i.driverName ? 'Assigned' : 'Unassigned' }),
  },
  grades: {
    label: 'Grades', icon: 'military_tech',
    endpoint: '/api/grades',
    color: 'text-pink-400', bg: 'bg-pink-500/10',
    fields: [
      { name: 'student',  label: 'Student ID',  type: 'text',   required: true },
      { name: 'course',   label: 'Course ID',   type: 'text',   required: true },
      { name: 'semester', label: 'Semester',    type: 'number', required: true },
      { name: 'cie1',     label: 'CIE 1 Marks', type: 'number' },
      { name: 'cie2',     label: 'CIE 2 Marks', type: 'number' },
      { name: 'cie3',     label: 'CIE 3 Marks', type: 'number' },
    ],
    display: (i) => ({ title: `${i.course?.name || i.course} (Sem ${i.semester})`, sub: `Student: ${i.student?.name || i.student}`, badge: `${i.totalMarks || 0} / ${((i.maxCie || 50) * 3)}` }),
  },
  placements: {
    label: 'Placements', icon: 'work',
    color: 'text-yellow-400', bg: 'bg-yellow-500/10',
    isPlacements: true, display: null, fields: [],
  },
  notifications: {
    label: 'Notifications', icon: 'notifications',
    color: 'text-indigo-400', bg: 'bg-indigo-500/10',
    isNotifications: true, display: null, fields: [],
  },
};

const CONTENT_TABS = ['users', 'announcements', 'courses', 'events', 'facilities', 'resources', 'transport', 'grades'];
const SPECIAL_TABS = ['attendance', 'timetables', 'support', 'placements', 'notifications'];
const ALL_TABS = ['dashboard', ...CONTENT_TABS, ...SPECIAL_TABS];

const STATUS_COLOR = {
  open: 'text-green-400', upcoming: 'text-primary', past: 'text-outline',
  active: 'text-green-400', new: 'text-secondary', popular: 'text-tertiary',
  archived: 'text-outline', closed: 'text-red-400', maintenance: 'text-secondary',
  live: 'text-green-400', cancelled: 'text-red-400', waitlist: 'text-secondary',
  reserved: 'text-secondary', peak: 'text-secondary',
};

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = ({ size = 4 }) => (
  <svg className={`animate-spin h-${size} w-${size}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

// ── MenuItemsEditor ───────────────────────────────────────────────────────────
function MenuItemsEditor({ value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const add = () => onChange([...items, { name: '', price: '', description: '' }]);
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
  const update = (idx, field, val) =>
    onChange(items.map((item, i) =>
      i === idx ? { ...item, [field]: field === 'price' ? (val === '' ? '' : Number(val)) : val } : item
    ));
  return (
    <div className="space-y-2.5">
      {items.map((item, idx) => (
        <div key={idx} className="bg-surface-container-highest rounded-lg p-3 space-y-2 border border-outline-variant/15">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-outline uppercase tracking-wider">Item {idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-outline hover:text-red-400 transition-colors">
              <span className="material-symbols-outlined text-[15px]">delete</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <input placeholder="Item name" value={item.name} onChange={(e) => update(idx, 'name', e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/20 rounded py-1.5 px-2.5 text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/50" />
            </div>
            <input placeholder="₹ Price" type="number" value={item.price} onChange={(e) => update(idx, 'price', e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/20 rounded py-1.5 px-2.5 text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/50" />
          </div>
          <input placeholder="Description (optional)" value={item.description} onChange={(e) => update(idx, 'description', e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/20 rounded py-1.5 px-2.5 text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/50" />
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1.5 text-xs text-primary hover:text-white transition-colors py-1">
        <span className="material-symbols-outlined text-[15px]">add</span>Add menu item
      </button>
    </div>
  );
}

// ── ItemForm ──────────────────────────────────────────────────────────────────
function ItemForm({ fields, initial, onSave, onCancel, saving }) {
  const [values, setValues] = useState(() => {
    const d = {};
    fields.forEach((f) => {
      if (f.type === 'checkbox') d[f.name] = initial?.[f.name] ?? false;
      else if (f.type === 'date' && initial?.[f.name]) d[f.name] = new Date(initial[f.name]).toISOString().split('T')[0];
      else if (f.type === 'menu-items') d[f.name] = initial?.[f.name] ?? [];
      else if (f.type === 'array') d[f.name] = initial?.[f.name] ?? [];
      else d[f.name] = initial?.[f.name] ?? '';
    });
    return d;
  });
  const set = (name, val) => setValues((v) => ({ ...v, [name]: val }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(values); }} className="space-y-4">
      {fields.map((f) => (
        <div key={f.name} className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-widest text-outline">
            {f.label}{f.required && <span className="text-primary ml-0.5">*</span>}
          </label>
          {f.type === 'textarea' ? (
            <textarea rows={3} className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm placeholder:text-outline/50 focus:ring-1 focus:ring-primary outline-none resize-none"
              value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} required={f.required} placeholder={f.placeholder} />
          ) : f.type === 'select' ? (
            <select className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-1 focus:ring-primary outline-none"
              value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} required={f.required}>
              <option value="">— select —</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : f.type === 'checkbox' ? (
            <label className="flex items-center gap-2.5 cursor-pointer w-fit">
              <input type="checkbox" className="w-4 h-4 rounded accent-primary" checked={values[f.name]} onChange={(e) => set(f.name, e.target.checked)} />
              <span className="text-sm text-on-surface-variant">Yes</span>
            </label>
          ) : f.type === 'menu-items' ? (
            <MenuItemsEditor value={values[f.name]} onChange={(v) => set(f.name, v)} />
          ) : f.type === 'array' ? (
            <input type="text" className={`w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm placeholder:text-outline/50 focus:ring-1 focus:ring-primary outline-none ${f.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              value={Array.isArray(values[f.name]) ? values[f.name].join(', ') : ''}
              onChange={(e) => set(f.name, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              required={f.required} placeholder={f.placeholder} disabled={f.disabled} />
          ) : (
            <input type={f.type} className={`w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm placeholder:text-outline/50 focus:ring-1 focus:ring-primary outline-none ${f.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              value={values[f.name]}
              onChange={(e) => set(f.name, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
              required={f.required} placeholder={f.placeholder} disabled={f.disabled} />
          )}
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="flex-1 bg-primary text-on-primary font-bold py-2.5 rounded-lg hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
          {saving ? <><Spinner />Saving…</> : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-white text-sm transition-colors">Cancel</button>
      </div>
    </form>
  );
}

// ── AttendanceAdminPanel ──────────────────────────────────────────────────────
function AttendanceAdminPanel({ showToast }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/attendance/admin/summary')
      .then((r) => setCourses(Array.isArray(r.data) ? r.data : []))
      .catch(() => showToast('Failed to load attendance data.', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const addClassHeld = async (courseId) => {
    setAdding(courseId);
    try {
      const r = await api.patch(`/api/attendance/admin/add-class/${courseId}`);
      setCourses((prev) => prev.map((c) => c._id === courseId ? { ...c, totalClasses: r.data.totalClasses } : c));
      showToast('Class added — attendance updated.');
    } catch { showToast('Failed to add class.', 'error'); } finally { setAdding(null); }
  };

  if (loading) return <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-xl skeleton-shimmer" />)}</div>;
  if (!courses.length) return <div className="py-20 text-center text-on-surface-variant"><span className="material-symbols-outlined text-5xl text-outline mb-3 block">fact_check</span><p>No courses found.</p></div>;

  const totalClasses = courses.reduce((a, c) => a + (c.totalClasses || 0), 0);
  const totalAbsences = courses.reduce((a, c) => a + (c.absentRecords || 0), 0);

  return (
    <>
      <div className="grid grid-cols-3 divide-x divide-outline-variant/10 border-b border-outline-variant/10">
        {[{ label: 'Courses', value: courses.length }, { label: 'Classes Held', value: totalClasses }, { label: 'Absence Records', value: totalAbsences }].map(({ label, value }) => (
          <div key={label} className="py-4 text-center">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-[10px] font-mono text-outline uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <ul className="divide-y divide-outline-variant/10">
        {courses.map((course) => (
          <li key={course._id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container transition-colors group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[10px] text-outline uppercase tracking-wider">{course.code}</span>
                {course.section && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono border border-primary/20">§{course.section}</span>}
              </div>
              <p className="text-white font-semibold text-sm">{course.name}</p>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="text-xs text-on-surface-variant">Classes: <span className="text-white font-semibold">{course.totalClasses}</span></span>
                <span className="text-xs text-on-surface-variant">Students: <span className="text-white font-semibold">{course.totalStudents}</span></span>
                <span className="text-xs text-on-surface-variant">Absences: <span className={`font-semibold ${course.absentRecords > 0 ? 'text-red-400' : 'text-green-400'}`}>{course.absentRecords}</span></span>
              </div>
            </div>
            <div className="text-center flex-shrink-0 hidden sm:block">
              <p className="text-2xl font-bold text-white">{course.totalClasses}</p>
              <p className="text-[9px] font-mono text-outline uppercase tracking-wider">classes</p>
            </div>
            <button onClick={() => addClassHeld(course._id)} disabled={adding === course._id}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all text-xs font-semibold disabled:opacity-50">
              {adding === course._id ? <Spinner size={3} /> : <span className="material-symbols-outlined text-[14px]">add</span>}
              Add Class
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

// ── TimetableAdminPanel ───────────────────────────────────────────────────────
function TimetableAdminPanel({ showToast }) {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = () => {
    setLoading(true);
    api.get('/api/timetables')
      .then(res => setSections(res.data.map ? res.data.map(t => t.section) : []))
      .catch(() => showToast('Failed to load sections', 'error'))
      .finally(() => setLoading(false));
  };

  const loadTimetable = (section) => {
    setLoading(true);
    api.get(`/api/timetables/${section}`)
      .then(res => { setFormData(res.data); setSelectedSection(section); setIsNew(false); })
      .catch(() => showToast('Failed to load timetable', 'error'))
      .finally(() => setLoading(false));
  };

  const initNewTimetable = () => {
    const emptyDays = {};
    DAYS.forEach(d => { emptyDays[d] = Array.from({ length: 9 }).map((_, i) => ({ time: `Slot ${i+1}`, sub: '', note: '', type: '', span: false })); });
    setFormData({ section: '', days: emptyDays, teachers: {}, meta: { room: '', classTeacher: '', proctor: '' } });
    setSelectedSection(''); setIsNew(true);
  };

  const handleSave = async () => {
    if (!formData.section) return showToast('Section name is required', 'error');
    setSaving(true);
    try {
      if (isNew) { await api.post('/api/timetables', formData); showToast('Timetable created.'); fetchSections(); setIsNew(false); setSelectedSection(formData.section); }
      else { await api.put(`/api/timetables/${formData.section}`, formData); showToast('Timetable updated.'); }
    } catch (err) { showToast(err.response?.data?.message || 'Failed to save.', 'error'); }
    finally { setSaving(false); }
  };

  const handleCellChange = (day, rowIdx, field, val) => {
    const updated = { ...formData };
    if (!updated.days[day][rowIdx]) updated.days[day][rowIdx] = {};
    updated.days[day][rowIdx][field] = val;
    setFormData(updated);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete timetable for Section ${formData.section}?`)) return;
    try { await api.delete(`/api/timetables/${formData.section}`); showToast('Deleted.'); setFormData(null); setSelectedSection(''); fetchSections(); }
    catch { showToast('Failed to delete.', 'error'); }
  };

  if (loading && !formData && !sections.length) return <div className="p-6 text-center text-outline">Loading…</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-outline-variant/10 flex-wrap">
        <select className="bg-surface-container-high text-white font-semibold text-sm px-4 py-2 border border-outline-variant/20 rounded-lg outline-none cursor-pointer"
          value={isNew ? 'NEW' : selectedSection}
          onChange={(e) => { if (e.target.value === 'NEW') initNewTimetable(); else if (e.target.value) loadTimetable(e.target.value); else { setFormData(null); setSelectedSection(''); setIsNew(false); } }}>
          <option value="">Select Section…</option>
          {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
          <option value="NEW">+ Create New Section Timetable</option>
        </select>
        {formData && <button disabled={saving} onClick={handleSave} className="ml-auto bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:opacity-90 disabled:opacity-50">{saving ? 'Saving…' : 'Save Changes'}</button>}
        {formData && !isNew && <button onClick={handleDelete} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-500/20">Delete</button>}
      </div>

      {formData ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-high/50 p-4 rounded-xl border border-outline-variant/10">
            {[
              { label: 'Section Name', field: 'section', val: formData.section, dis: !isNew, onChange: v => setFormData({ ...formData, section: v.toUpperCase() }) },
              { label: 'Room No', field: 'room', val: formData.meta.room, onChange: v => setFormData({ ...formData, meta: { ...formData.meta, room: v } }) },
              { label: 'Class Teacher', field: 'ct', val: formData.meta.classTeacher, onChange: v => setFormData({ ...formData, meta: { ...formData.meta, classTeacher: v } }) },
              { label: 'Proctor', field: 'proctor', val: formData.meta.proctor, onChange: v => setFormData({ ...formData, meta: { ...formData.meta, proctor: v } }) },
            ].map(f => (
              <div key={f.field}>
                <label className="text-[10px] font-mono text-outline uppercase tracking-wider block mb-1">{f.label}</label>
                <input type="text" value={f.val} disabled={f.dis} onChange={e => f.onChange(e.target.value)} className="w-full bg-surface-container text-white px-3 py-2 rounded border border-outline-variant/20 outline-none focus:border-primary disabled:opacity-50" />
              </div>
            ))}
          </div>

          <div className="overflow-x-auto bg-surface-container-high/20 rounded-xl p-4 border border-outline-variant/10">
            <h3 className="text-white font-bold mb-4 font-satoshi text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400">grid_on</span>Grid Planner
            </h3>
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr>
                  <th className="w-32 uppercase text-[10px] text-outline tracking-wider pb-4 px-2">Days / Slots</th>
                  {Array.from({ length: 9 }).map((_, i) => <th key={i} className="px-1 pb-4 text-[10px] text-outline font-mono text-center tracking-wider w-24">Slot {i+1}</th>)}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day} className="border-t border-outline-variant/10">
                    <td className="py-3 px-2 font-bold text-sm text-white font-mono bg-surface-container/30">{day}</td>
                    {Array.from({ length: 9 }).map((_, rowIdx) => {
                      const cell = formData.days[day]?.[rowIdx] || { time: '', sub: '', type: '', span: false };
                      return (
                        <td key={rowIdx} className="p-1 align-top">
                          <div className={`p-1.5 rounded-md border flex flex-col gap-1 ${cell.type === 'break' ? 'border-primary/30 bg-primary/5' : cell.type === 'lunch' ? 'border-orange-500/30 bg-orange-500/5' : cell.sub ? 'border-purple-500/30 bg-purple-500/5' : 'border-outline-variant/20 bg-surface-container'}`}>
                            <input placeholder="Time" className="w-full text-[9px] bg-transparent outline-none text-white font-mono px-1 pb-0.5 border-b border-outline-variant/10" value={cell.time} onChange={e => handleCellChange(day, rowIdx, 'time', e.target.value)} />
                            <input placeholder="Sub" className="w-full text-[10px] bg-transparent outline-none text-white font-bold px-1" value={cell.sub || ''} onChange={e => handleCellChange(day, rowIdx, 'sub', e.target.value)} />
                            <input placeholder="Type (break/lunch)" className="w-full text-[9px] bg-transparent outline-none text-outline px-1" value={cell.type || ''} onChange={e => handleCellChange(day, rowIdx, 'type', e.target.value)} />
                            <label className="flex items-center gap-1.5 px-1 mt-0.5 cursor-pointer">
                              <input type="checkbox" className="w-2.5 h-2.5" checked={cell.span} onChange={e => handleCellChange(day, rowIdx, 'span', e.target.checked)} />
                              <span className="text-[8px] text-outline uppercase">Span</span>
                            </label>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-on-surface-variant flex flex-col items-center">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">edit_calendar</span>
          <p className="text-lg text-white font-semibold mb-2">Manage Class Timetables</p>
          <p className="max-w-sm">Select a section to edit its timetable, or create a new one from scratch.</p>
        </div>
      )}
    </div>
  );
}

// ── Support Admin Panel (Upgraded) ────────────────────────────────────────────
function SupportAdminPanel({ showToast }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [inProgress, setInProgress] = useState(new Set());
  const [replies, setReplies] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminTicketReplies') || '{}'); } catch { return {}; }
  });
  const [replyDraft, setReplyDraft] = useState({});

  useEffect(() => {
    api.get('/api/support')
      .then((r) => setTickets(Array.isArray(r.data) ? r.data : []))
      .catch(() => showToast('Failed to load support tickets.', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const resolve = async (id) => {
    setResolving(id);
    try {
      await api.patch(`/api/support/${id}/resolve`);
      setTickets((p) => p.map((t) => t._id === id ? { ...t, status: 'resolved' } : t));
      setInProgress(p => { const n = new Set(p); n.delete(id); return n; });
      showToast('Ticket resolved.');
    } catch { showToast('Failed to resolve.', 'error'); } finally { setResolving(null); }
  };

  const sendReply = (ticket) => {
    const text = replyDraft[ticket._id] || '';
    if (!text.trim()) return;
    const subject = `Re: Your support request — CBIT Kolar`;
    const body = `Dear ${ticket.name},\n\n${text}\n\nRegards,\nCBIT Support Team`;
    window.open(`mailto:${ticket.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    const updated = { ...replies, [ticket._id]: text };
    setReplies(updated);
    localStorage.setItem('adminTicketReplies', JSON.stringify(updated));
    setReplyDraft(d => ({ ...d, [ticket._id]: '' }));
    showToast('Reply opened in email client.');
  };

  const detectPriority = (msg) => {
    const m = (msg || '').toLowerCase();
    if (/urgent|critical|emergency|asap|immediately/.test(m)) return 'critical';
    if (/important|soon|need help|broken/.test(m)) return 'high';
    return 'normal';
  };

  const getStatus = (ticket) => {
    if (ticket.status === 'resolved') return 'resolved';
    if (inProgress.has(ticket._id)) return 'in-progress';
    return 'open';
  };

  const filtered = tickets.filter(t => {
    const s = getStatus(t);
    if (statusFilter !== 'all' && s !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name?.toLowerCase().includes(q) || t.usn?.toLowerCase().includes(q) || t.message?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = { open: tickets.filter(t => t.status === 'open' && !inProgress.has(t._id)).length, 'in-progress': inProgress.size, resolved: tickets.filter(t => t.status === 'resolved').length };

  if (loading) return <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl skeleton-shimmer" />)}</div>;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-outline-variant/10 border-b border-outline-variant/10">
        {[
          { label: 'Open', value: counts.open, color: 'text-orange-400' },
          { label: 'In Progress', value: counts['in-progress'], color: 'text-yellow-400' },
          { label: 'Resolved', value: counts.resolved, color: 'text-green-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="py-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-[10px] font-mono text-outline uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined text-outline text-[18px] absolute left-3 top-1/2 -translate-y-1/2">search</span>
          <input type="text" placeholder="Search by name, USN, or message…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 pl-9 pr-3 text-sm text-on-surface placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex items-center gap-1">
          {['all', 'open', 'in-progress', 'resolved'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-white hover:bg-surface-container'}`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket list */}
      {!filtered.length ? (
        <div className="py-16 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl text-outline mb-3 block">inbox</span>
          <p>{search || statusFilter !== 'all' ? 'No tickets match your filters.' : 'No support tickets yet.'}</p>
        </div>
      ) : (
        <ul className="divide-y divide-outline-variant/10">
          {filtered.map((ticket) => {
            const status = getStatus(ticket);
            const priority = detectPriority(ticket.message);
            const isExpanded = expanded === ticket._id;
            const statusColors = { open: 'text-orange-400 bg-orange-500/10 border-orange-500/20', 'in-progress': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', resolved: 'text-green-400 bg-green-500/10 border-green-500/20' };
            const priorityColors = { critical: 'text-red-400', high: 'text-yellow-400', normal: 'text-outline' };
            const savedReply = replies[ticket._id];

            return (
              <li key={ticket._id} className={`transition-colors ${isExpanded ? 'bg-surface-container' : 'hover:bg-surface-container/60'}`}>
                <div className="flex items-start gap-4 px-6 py-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : ticket._id)}>
                  <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${status === 'open' ? 'bg-orange-400' : status === 'in-progress' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-white font-semibold text-sm">{ticket.name}</span>
                      {ticket.usn && <span className="font-mono text-[10px] text-outline bg-surface-container-high px-1.5 py-0.5 rounded">{ticket.usn}</span>}
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${statusColors[status]}`}>{status}</span>
                      {priority !== 'normal' && <span className={`text-[10px] font-mono uppercase ${priorityColors[priority]}`}>{priority}</span>}
                    </div>
                    <p className="text-on-surface-variant text-xs">{ticket.email}{ticket.phone ? ` · ${ticket.phone}` : ''}</p>
                    <p className={`text-sm mt-1 ${isExpanded ? 'text-on-surface' : 'text-on-surface-variant line-clamp-1'}`}>{ticket.message}</p>
                    {savedReply && !isExpanded && (
                      <p className="text-[10px] text-primary/70 mt-0.5 font-mono">↩ Reply sent</p>
                    )}
                    <p className="text-outline text-[10px] font-mono mt-1">
                      {new Date(ticket.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {status === 'open' && (
                      <button onClick={(e) => { e.stopPropagation(); setInProgress(p => { const n = new Set(p); n.has(ticket._id) ? n.delete(ticket._id) : n.add(ticket._id); return n; }); }}
                        className="px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-semibold hover:bg-yellow-500/20 transition-colors">
                        {inProgress.has(ticket._id) ? 'Revert' : 'In Progress'}
                      </button>
                    )}
                    {status !== 'resolved' && (
                      <button onClick={(e) => { e.stopPropagation(); resolve(ticket._id); }} disabled={resolving === ticket._id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-xs font-semibold disabled:opacity-50">
                        {resolving === ticket._id ? <Spinner size={3} /> : <span className="material-symbols-outlined text-[13px]">check_circle</span>}
                        Resolve
                      </button>
                    )}
                    <span className={`material-symbols-outlined text-outline text-[18px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                  </div>
                </div>

                {/* Expanded reply area */}
                {isExpanded && (
                  <div className="px-6 pb-5 pl-12 space-y-3">
                    {savedReply && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-1">Last reply sent</p>
                        <p className="text-sm text-on-surface-variant">{savedReply}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-[10px] font-mono text-outline uppercase tracking-wider block mb-1.5">Reply to {ticket.email}</label>
                      <textarea
                        rows={3}
                        placeholder="Type your reply…"
                        value={replyDraft[ticket._id] || ''}
                        onChange={e => setReplyDraft(d => ({ ...d, [ticket._id]: e.target.value }))}
                        className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-sm text-on-surface placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>
                    <button onClick={() => sendReply(ticket)} disabled={!replyDraft[ticket._id]?.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity">
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      Send via Email
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ── ParticipantsModal ─────────────────────────────────────────────────────────
function ParticipantsModal({ event, onClose }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/events/${event._id}/participants`)
      .then((r) => setParticipants(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError('Failed to load participants.'))
      .finally(() => setLoading(false));
  }, [event._id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 24 }} transition={{ duration: 0.2 }}
        className="relative bg-surface-container-low rounded-2xl p-6 w-full max-w-lg shadow-2xl ring-1 ring-outline-variant/20 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Registered Participants</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-outline hover:text-white transition-colors p-1"><span className="material-symbols-outlined">close</span></button>
        </div>
        {loading ? <div className="space-y-3 flex-1">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 rounded-lg skeleton-shimmer" />)}</div>
          : error ? <div className="text-red-400 text-sm text-center py-8">{error}</div>
          : !participants.length ? <div className="text-center py-12 text-on-surface-variant"><span className="material-symbols-outlined text-4xl text-outline mb-3 block">group</span><p>No registrations yet.</p></div>
          : (
            <div className="flex-1 overflow-y-auto space-y-px">
              <div className="text-[10px] font-mono text-outline uppercase tracking-widest mb-3">{participants.length} registered</div>
              {participants.map((p, i) => (
                <div key={p._id ?? i} className="flex items-center gap-3 py-2.5 border-b border-outline-variant/10 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-on-surface-variant text-xs truncate">{p.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {p.usn && <p className="font-mono text-[10px] text-outline bg-surface-container-high px-2 py-0.5 rounded">{p.usn}</p>}
                    {p.section && <p className="text-[10px] text-primary mt-0.5">Sec {p.section}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
      </motion.div>
    </div>
  );
}

// ── Placements Admin Panel ────────────────────────────────────────────────────
function PlacementsPanel({ showToast }) {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ company: '', package: '', eligibility: '', deadline: '', location: 'Campus', openings: '', status: 'upcoming' });

  const fetchPlacements = () => {
    setLoading(true);
    api.get('/api/events')
      .then(r => setPlacements((Array.isArray(r.data) ? r.data : []).filter(e => e.organizer === 'Placement Cell')))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlacements(); }, []);

  const openAdd = () => {
    setForm({ company: '', package: '', eligibility: '', deadline: '', location: 'Campus', openings: '', status: 'upcoming' });
    setModal({ mode: 'add' });
  };

  const openEdit = (p) => {
    const lines = (p.description || '').split('\n');
    const pkg = lines.find(l => l.startsWith('Package:'))?.replace('Package:', '').trim() || '';
    const elig = lines.find(l => l.startsWith('Eligibility:'))?.replace('Eligibility:', '').trim() || '';
    setForm({
      company: p.title || '',
      package: pkg,
      eligibility: elig,
      deadline: p.date ? new Date(p.date).toISOString().split('T')[0] : '',
      location: p.location || 'Campus',
      openings: p.capacity || '',
      status: p.status || 'upcoming',
    });
    setModal({ mode: 'edit', item: p });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.company,
        description: [`Package: ${form.package}`, `Eligibility: ${form.eligibility}`].filter(Boolean).join('\n'),
        date: form.deadline,
        organizer: 'Placement Cell',
        category: 'networking',
        location: form.location,
        capacity: form.openings ? Number(form.openings) : undefined,
        status: form.status,
      };
      if (modal.mode === 'add') {
        const r = await api.post('/api/events', payload);
        setPlacements(p => [r.data, ...p]);
        showToast('Placement drive added.');
      } else {
        const r = await api.put(`/api/events/${modal.item._id}`, payload);
        setPlacements(p => p.map(x => x._id === r.data._id ? r.data : x));
        showToast('Updated.');
      }
      setModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed.', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this placement drive?')) return;
    setDeleting(id);
    try { await api.delete(`/api/events/${id}`); setPlacements(p => p.filter(x => x._id !== id)); showToast('Deleted.'); }
    catch { showToast('Delete failed.', 'error'); } finally { setDeleting(null); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
        <div>
          <h2 className="text-base font-bold text-white">Placement Drives</h2>
          <p className="text-xs text-outline mt-0.5">{placements.length} active drives</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-sm">add</span>Add Drive
        </button>
      </div>

      {loading ? (
        <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-xl skeleton-shimmer" />)}</div>
      ) : !placements.length ? (
        <div className="py-20 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl text-outline mb-3 block">work</span>
          <p className="mb-4">No placement drives yet.</p>
          <button onClick={openAdd} className="text-primary hover:underline text-sm">+ Add the first drive</button>
        </div>
      ) : (
        <div className="divide-y divide-outline-variant/10">
          {placements.map(p => {
            const lines = (p.description || '').split('\n');
            const pkg = lines.find(l => l.startsWith('Package:'))?.replace('Package:', '').trim();
            const elig = lines.find(l => l.startsWith('Eligibility:'))?.replace('Eligibility:', '').trim();
            const deadline = p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
            const regs = p.attendees?.length ?? p.attendeeCount ?? 0;
            return (
              <div key={p._id} className="flex items-start gap-4 px-6 py-5 hover:bg-surface-container transition-colors group">
                <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-yellow-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-bold">{p.title}</p>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${p.status === 'upcoming' ? 'text-green-400 bg-green-500/10' : 'text-outline bg-surface-container-high'}`}>{p.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {pkg && <span className="text-sm text-primary font-semibold">{pkg}</span>}
                    {elig && <span className="text-xs text-on-surface-variant"><span className="material-symbols-outlined text-[12px] mr-1 align-middle">verified</span>{elig}</span>}
                    <span className="text-xs text-on-surface-variant"><span className="material-symbols-outlined text-[12px] mr-1 align-middle">calendar_today</span>Deadline: {deadline}</span>
                    <span className="text-xs text-on-surface-variant"><span className="material-symbols-outlined text-[12px] mr-1 align-middle">location_on</span>{p.location || 'Campus'}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-outline">{regs} registrations{p.capacity ? ` / ${p.capacity} openings` : ''}</span>
                    {p.capacity && regs > 0 && (
                      <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (regs / p.capacity) * 100)}%` }} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                  <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="p-2 rounded-lg hover:bg-red-500/10 text-on-surface-variant hover:text-red-400 transition-colors disabled:opacity-40">
                    {deleting === p._id ? <Spinner size={4} /> : <span className="material-symbols-outlined text-sm">delete</span>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Placement Form Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 24 }} transition={{ duration: 0.2 }}
              className="relative bg-surface-container-low rounded-2xl p-6 w-full max-w-md shadow-2xl ring-1 ring-outline-variant/20"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">{modal.mode === 'add' ? 'Add Placement Drive' : 'Edit Placement Drive'}</h3>
                <button onClick={() => setModal(null)} className="text-outline hover:text-white p-1"><span className="material-symbols-outlined">close</span></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                {[
                  { key: 'company',     label: 'Company Name',         required: true,  type: 'text', placeholder: 'e.g. TCS' },
                  { key: 'package',     label: 'Package',              required: true,  type: 'text', placeholder: 'e.g. 3.5 LPA' },
                  { key: 'eligibility', label: 'Eligibility Criteria', required: false, type: 'text', placeholder: 'e.g. CGPA ≥ 7.0, No active backlogs' },
                  { key: 'location',    label: 'Location / Mode',      required: false, type: 'text', placeholder: 'Campus / Online' },
                  { key: 'deadline',    label: 'Application Deadline', required: true,  type: 'date' },
                  { key: 'openings',    label: 'Openings',             required: false, type: 'number', placeholder: '50' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[11px] font-mono uppercase tracking-widest text-outline block mb-1.5">{f.label}{f.required && <span className="text-primary ml-0.5">*</span>}</label>
                    <input type={f.type} required={f.required} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                      className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm placeholder:text-outline/50 focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                ))}
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-widest text-outline block mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(v => ({ ...v, status: e.target.value }))}
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-1 focus:ring-primary outline-none">
                    {['upcoming', 'live', 'past', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 bg-primary text-on-primary font-bold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                    {saving ? <><Spinner />Saving…</> : 'Save Drive'}
                  </button>
                  <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-white text-sm">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Notifications Admin Panel ─────────────────────────────────────────────────
function NotificationsPanel({ showToast }) {
  const [form, setForm] = useState({ title: '', content: '', targetRoles: 'all', priority: 'medium', category: 'general', pinned: false });
  const [sending, setSending] = useState(false);
  const [recent, setRecent] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    api.get('/api/announcements?limit=6')
      .then(r => setRecent(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoadingRecent(false));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const payload = { ...form, targetRoles: form.targetRoles === 'all' ? ['all'] : [form.targetRoles] };
      const r = await api.post('/api/announcements', payload);
      setRecent(p => [r.data, ...p.slice(0, 5)]);
      setForm({ title: '', content: '', targetRoles: 'all', priority: 'medium', category: 'general', pinned: false });
      showToast(`Notification sent to: ${form.targetRoles}`);
    } catch (err) {
      showToast(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Send failed.', 'error');
    } finally { setSending(false); }
  };

  const AUDIENCES = [
    { value: 'all',     label: 'All Students & Faculty', icon: 'groups' },
    { value: 'student', label: 'Students Only',          icon: 'school' },
    { value: 'faculty', label: 'Faculty Only',           icon: 'person_pin' },
  ];

  const priorityColors = { low: 'text-outline', medium: 'text-secondary', high: 'text-primary', critical: 'text-red-400' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:divide-x divide-outline-variant/10">
      {/* Compose form */}
      <div className="lg:col-span-3 p-6">
        <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">notifications</span>
          Send Notification
        </h3>
        <form onSubmit={handleSend} className="space-y-5">
          {/* Audience selector */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-widest text-outline block mb-2">Target Audience</label>
            <div className="grid grid-cols-3 gap-2">
              {AUDIENCES.map(a => (
                <button key={a.value} type="button" onClick={() => setForm(v => ({ ...v, targetRoles: a.value }))}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all ${form.targetRoles === a.value ? 'bg-primary/10 border-primary/40 text-primary' : 'border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40 hover:text-white'}`}>
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                  <span className="text-[10px] font-semibold leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase tracking-widest text-outline block mb-1.5">Title <span className="text-primary">*</span></label>
            <input required type="text" placeholder="e.g. Holiday on 26th January" value={form.title} onChange={e => setForm(v => ({ ...v, title: e.target.value }))}
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm placeholder:text-outline/50 focus:ring-1 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-widest text-outline block mb-1.5">Message <span className="text-primary">*</span></label>
            <textarea required rows={4} placeholder="Write your notification…" value={form.content} onChange={e => setForm(v => ({ ...v, content: e.target.value }))}
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm placeholder:text-outline/50 focus:ring-1 focus:ring-primary outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-widest text-outline block mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(v => ({ ...v, priority: e.target.value }))}
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-1 focus:ring-primary outline-none">
                {['low', 'medium', 'high', 'critical'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-widest text-outline block mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(v => ({ ...v, category: e.target.value }))}
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-1 focus:ring-primary outline-none">
                {['general', 'academic', 'events', 'facilities', 'urgent'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-primary" checked={form.pinned} onChange={e => setForm(v => ({ ...v, pinned: e.target.checked }))} />
            <span className="text-sm text-on-surface-variant">Pin this notification to the top</span>
          </label>

          <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity">
            {sending ? <><Spinner />Sending…</> : <><span className="material-symbols-outlined text-[18px]">send</span>Send Notification</>}
          </button>
        </form>
      </div>

      {/* Recent sent */}
      <div className="lg:col-span-2 p-6">
        <h3 className="text-base font-bold text-white mb-4">Recently Sent</h3>
        {loadingRecent ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 skeleton-shimmer rounded-lg" />)}</div>
        ) : !recent.length ? (
          <p className="text-outline text-sm">No notifications sent yet.</p>
        ) : (
          <div className="space-y-3">
            {recent.map(a => (
              <div key={a._id} className="bg-surface-container rounded-xl p-3.5 border border-outline-variant/10">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white text-sm font-semibold leading-snug">{a.title}</p>
                  {a.pinned && <span className="text-primary text-xs shrink-0">📌</span>}
                </div>
                <p className="text-on-surface-variant text-xs mt-1 line-clamp-2">{a.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-mono uppercase ${priorityColors[a.priority] || 'text-outline'}`}>{a.priority}</span>
                  <span className="text-outline text-[10px]">·</span>
                  <span className="text-outline text-[10px]">{a.targetRoles?.join(', ')}</span>
                  <span className="text-outline text-[10px] ml-auto">{a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard Overview Panel ──────────────────────────────────────────────────
function DashboardPanel({ onTabChangeWithAction, showToast }) {
  const [data, setData] = useState({ students: 0, faculty: 0, pending: 0, upcomingEvents: 0, announcements: 0, placements: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, supportRes, eventsRes, annRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/support'),
          api.get('/api/events?sort=-createdAt&limit=20'),
          api.get('/api/announcements?limit=5'),
        ]);
        const users     = Array.isArray(usersRes.data)   ? usersRes.data   : [];
        const tickets   = Array.isArray(supportRes.data) ? supportRes.data : [];
        const events    = Array.isArray(eventsRes.data)  ? eventsRes.data  : [];
        const anns      = Array.isArray(annRes.data)     ? annRes.data     : [];
        const upcoming  = events.filter(e => e.status === 'upcoming');
        const placements = events.filter(e => e.organizer === 'Placement Cell');
        const openTickets = tickets.filter(t => t.status === 'open');

        setData({
          students: users.filter(u => u.role === 'student').length,
          faculty:  users.filter(u => u.role === 'faculty').length,
          pending:  openTickets.length,
          upcomingEvents: upcoming.length,
          announcements: anns.length,
          placements: placements.length,
        });

        const feed = [
          ...anns.slice(0, 2).map(a => ({ text: `Announcement posted: "${a.title}"`, time: a.createdAt, icon: 'campaign', color: 'text-primary' })),
          ...upcoming.slice(0, 2).map(e => ({ text: `Event scheduled: "${e.title}"`, time: e.createdAt, icon: 'event', color: 'text-green-400' })),
          ...openTickets.slice(0, 3).map(t => ({ text: `Support ticket from ${t.name}${t.usn ? ' (' + t.usn + ')' : ''}`, time: t.createdAt, icon: 'support_agent', color: 'text-orange-400' })),
          ...placements.slice(0, 1).map(p => ({ text: `Placement drive: ${p.title}`, time: p.createdAt, icon: 'work', color: 'text-yellow-400' })),
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);
        setActivity(feed);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const OVERVIEW = [
    { label: 'Students',      value: data.students,      icon: 'school',         color: 'text-blue-400',   bg: 'bg-blue-500/10',   tab: 'users' },
    { label: 'Faculty',       value: data.faculty,       icon: 'person_pin',     color: 'text-purple-400', bg: 'bg-purple-500/10', tab: 'users' },
    { label: 'Open Tickets',  value: data.pending,       icon: 'support_agent',  color: 'text-orange-400', bg: 'bg-orange-500/10', tab: 'support', alert: data.pending > 0 },
    { label: 'Announcements', value: data.announcements, icon: 'campaign',       color: 'text-primary',    bg: 'bg-primary/10',    tab: 'announcements' },
    { label: 'Upcoming Events',value: data.upcomingEvents,icon: 'event',         color: 'text-green-400',  bg: 'bg-green-500/10',  tab: 'events' },
    { label: 'Placement Drives',value: data.placements,  icon: 'work',           color: 'text-yellow-400', bg: 'bg-yellow-500/10', tab: 'placements' },
  ];

  const QUICK_ACTIONS = [
    { label: 'New Announcement', icon: 'campaign',       tab: 'announcements', action: 'add', color: 'text-primary',    bg: 'bg-primary/10' },
    { label: 'Add Event',        icon: 'event',          tab: 'events',        action: 'add', color: 'text-green-400',  bg: 'bg-green-500/10' },
    { label: 'Upload Timetable', icon: 'calendar_month', tab: 'timetables',    action: null,  color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Add Placement',    icon: 'work',           tab: 'placements',    action: null,  color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Resolve Ticket',   icon: 'support_agent',  tab: 'support',       action: null,  color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Send Notification',icon: 'notifications',  tab: 'notifications', action: null,  color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Overview cards */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-outline mb-3">Overview</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {OVERVIEW.map(card => (
            <button key={card.label} onClick={() => onTabChangeWithAction(card.tab)}
              className={`bg-surface-container-low rounded-xl p-4 border text-left hover:bg-surface-container transition-colors group ${card.alert ? 'border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/8' : 'border-outline-variant/10 hover:border-outline-variant/25'}`}>
              <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                <span className={`material-symbols-outlined text-[18px] ${card.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
              </div>
              <p className="text-2xl font-bold text-white">{loading ? '—' : card.value}</p>
              <p className="text-[10px] font-mono text-outline uppercase tracking-wider mt-0.5 leading-tight">{card.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Activity feed + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity - 2/3 */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Recent Activity</p>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-outline uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Live
            </span>
          </div>
          {loading ? (
            <div className="divide-y divide-outline-variant/10">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-3.5 flex gap-3">
                  <div className="w-8 h-8 rounded-lg skeleton-shimmer shrink-0" />
                  <div className="flex-1 space-y-2"><div className="h-3 skeleton-shimmer rounded w-3/4" /><div className="h-2.5 skeleton-shimmer rounded w-1/4" /></div>
                </div>
              ))}
            </div>
          ) : !activity.length ? (
            <p className="text-outline text-sm text-center py-12">No activity yet. Start by adding data.</p>
          ) : (
            <div className="divide-y divide-outline-variant/10">
              {activity.map((item, i) => (
                <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-surface-container transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className={`material-symbols-outlined text-[15px] ${item.color}`}>{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm leading-snug">{item.text}</p>
                    <p className="text-outline text-[10px] font-mono mt-0.5">
                      {item.time ? new Date(item.time).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions - 1/3 */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/10">
            <p className="text-sm font-semibold text-white">Quick Actions</p>
          </div>
          <div className="p-3 space-y-1">
            {QUICK_ACTIONS.map(action => (
              <button key={action.label} onClick={() => onTabChangeWithAction(action.tab, action.action)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container transition-colors group text-left">
                <div className={`w-8 h-8 ${action.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined text-[16px] ${action.color}`}>{action.icon}</span>
                </div>
                <span className="text-sm text-on-surface-variant group-hover:text-white transition-colors">{action.label}</span>
                <span className="material-symbols-outlined text-[14px] text-outline opacity-0 group-hover:opacity-100 transition-opacity ml-auto">arrow_forward</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, bg, onClick }) {
  return (
    <motion.button whileHover={{ y: -3 }} transition={{ duration: 0.2 }} onClick={onClick}
      className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 flex items-center gap-4 w-full text-left hover:bg-surface-container transition-colors">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <span className={`material-symbols-outlined ${color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        <p className="text-xs font-mono text-outline uppercase tracking-widest">{label}</p>
      </div>
    </motion.button>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [participantsModal, setParticipantsModal] = useState(null);

  const cfg = CONFIGS[activeTab];
  const isSpecial = cfg.isDashboard || cfg.isAttendance || cfg.isSupport || cfg.isTimetables || cfg.isPlacements || cfg.isNotifications;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) navigate('/login');
  }, [user, authLoading, navigate]);

  // Load tab badge counts
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    Promise.all(
      CONTENT_TABS.map((t) =>
        api.get(CONFIGS[t].endpoint)
          .then((r) => ({ [t]: Array.isArray(r.data) ? r.data.length : 0 }))
          .catch(() => ({ [t]: 0 }))
      )
    ).then((results) => setStats(Object.assign({}, ...results)));
  }, [user]);

  // Load items for CRUD tabs
  useEffect(() => {
    if (!user || user.role !== 'admin' || isSpecial || !cfg.endpoint) return;
    setLoadingItems(true);
    setError('');
    api.get(cfg.endpoint)
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError(`Failed to load ${cfg.label.toLowerCase()}.`))
      .finally(() => setLoadingItems(false));
  }, [activeTab, user, isSpecial]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const onTabChangeWithAction = (tab, action = null) => {
    setActiveTab(tab);
    setError('');
    setModal(null);
    if (action === 'add' && CONFIGS[tab]?.fields?.length) {
      setTimeout(() => setModal({ mode: 'add' }), 80);
    }
  };

  const handleSave = async (values) => {
    setSaving(true); setError('');
    try {
      if (modal.mode === 'add') {
        const r = await api.post(cfg.endpoint, values);
        setItems((p) => [r.data, ...p]);
        setStats((s) => ({ ...s, [activeTab]: (s[activeTab] || 0) + 1 }));
        showToast(`${cfg.label.slice(0, -1)} created.`);
      } else {
        const r = await api.put(`${cfg.endpoint}/${modal.item._id}`, values);
        setItems((p) => p.map((x) => (x._id === r.data._id ? r.data : x)));
        showToast(`${cfg.label.slice(0, -1)} updated.`);
      }
      setModal(null);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Save failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    setDeleting(id);
    try {
      await api.delete(`${cfg.endpoint}/${id}`);
      setItems((p) => p.filter((x) => x._id !== id));
      setStats((s) => ({ ...s, [activeTab]: Math.max(0, (s[activeTab] || 0) - 1) }));
      showToast('Deleted.');
    } catch { showToast('Delete failed.', 'error'); } finally { setDeleting(null); }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!user || user.role !== 'admin') return null;

  // Tab groups for visual separation
  const TAB_GROUPS = [
    { tabs: ['dashboard'], label: null },
    { tabs: ['announcements', 'events', 'users', 'courses'], label: null },
    { tabs: ['facilities', 'resources', 'transport', 'grades'], label: null },
    { tabs: ['attendance', 'timetables'], label: null },
    { tabs: ['support', 'placements', 'notifications'], label: null },
  ];

  return (
    <motion.main {...pageTransition} className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-satoshi">Admin Control Center</h1>
              <p className="text-xs text-outline mt-0.5">
                {user.name} <span className="text-outline/50 mx-1">·</span> <span className="font-mono">{user.email}</span> <span className="text-outline/50 mx-1">·</span> CBIT Kolar
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-outline font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />Admin
          </div>
        </div>
      </motion.div>

      {/* Tab bar */}
      <div className="mb-6 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-1 bg-surface-container-low rounded-xl p-1 w-max border border-outline-variant/10">
          {TAB_GROUPS.map((group, gi) => (
            <div key={gi} className={`flex items-center gap-1 ${gi > 0 ? 'pl-1 border-l border-outline-variant/15' : ''}`}>
              {group.tabs.map(tab => {
                const tc = CONFIGS[tab];
                const active = activeTab === tab;
                return (
                  <button key={tab} onClick={() => onTabChangeWithAction(tab)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${active ? 'bg-primary text-on-primary shadow-sm shadow-primary/20' : 'text-on-surface-variant hover:text-white hover:bg-surface-container'}`}>
                    <span className="material-symbols-outlined text-[17px]" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{tc.icon}</span>
                    <span className="hidden sm:inline">{tc.label}</span>
                    {!isSpecial && stats[tab] !== undefined && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-surface-container-high'}`}>{stats[tab]}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>{error}
            <button onClick={() => setError('')} className="ml-auto text-outline hover:text-white"><span className="material-symbols-outlined text-sm">close</span></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content panel */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">

          {/* Special panels */}
          {cfg.isDashboard ? (
            <DashboardPanel onTabChangeWithAction={onTabChangeWithAction} showToast={showToast} />
          ) : cfg.isAttendance ? (
            <>
              <PanelHeader icon={cfg.icon} color={cfg.color} title="Attendance" badge="per-course view" hint="Tap Add Class to record a class held" />
              <AttendanceAdminPanel showToast={showToast} />
            </>
          ) : cfg.isTimetables ? (
            <>
              <PanelHeader icon={cfg.icon} color={cfg.color} title="Timetables" badge="matrix editor" hint="Visual editor" />
              <TimetableAdminPanel showToast={showToast} />
            </>
          ) : cfg.isSupport ? (
            <>
              <PanelHeader icon={cfg.icon} color={cfg.color} title="Support Tickets" badge="issue tracker" hint="Search, filter, and resolve tickets" />
              <SupportAdminPanel showToast={showToast} />
            </>
          ) : cfg.isPlacements ? (
            <PlacementsPanel showToast={showToast} />
          ) : cfg.isNotifications ? (
            <NotificationsPanel showToast={showToast} />
          ) : loadingItems ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-xl skeleton-shimmer" />)}</div>
          ) : (
            /* CRUD panel */
            <>
              <PanelHeader icon={cfg.icon} color={cfg.color} title={cfg.label} count={items.length}
                onAdd={() => { setError(''); setModal({ mode: 'add' }); }} />
              {items.length === 0 ? (
                <div className="py-20 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl text-outline mb-3 block">{cfg.icon}</span>
                  <p>No {cfg.label.toLowerCase()} yet.</p>
                  <button onClick={() => setModal({ mode: 'add' })} className="mt-4 text-primary hover:underline text-sm">+ Add the first one</button>
                </div>
              ) : (
                <ul className="divide-y divide-outline-variant/10">
                  {items.map((item) => {
                    const d = cfg.display(item);
                    const badgeColor = STATUS_COLOR[item.status] || STATUS_COLOR[item.priority] || 'text-outline';
                    return (
                      <li key={item._id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container transition-colors group">
                        {d.flag && <span className="text-base flex-shrink-0">{d.flag}</span>}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{d.title}</p>
                          <p className="text-on-surface-variant text-xs truncate mt-0.5">{d.sub}</p>
                        </div>
                        {d.badge && <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded flex-shrink-0 bg-surface-container-high ${badgeColor}`}>{d.badge}</span>}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {activeTab === 'events' && (
                            <button onClick={() => setParticipantsModal(item)} className="p-2 rounded-lg hover:bg-secondary/10 text-on-surface-variant hover:text-secondary transition-colors" title="Participants">
                              <span className="material-symbols-outlined text-sm">group</span>
                            </button>
                          )}
                          <button onClick={() => { setError(''); setModal({ mode: 'edit', item }); }} className="p-2 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="p-2 rounded-lg hover:bg-red-500/10 text-on-surface-variant hover:text-red-400 transition-colors disabled:opacity-40" title="Delete">
                            {deleting === item._id ? <Spinner size={4} /> : <span className="material-symbols-outlined text-sm">delete</span>}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal && cfg.fields?.length > 0 && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 24 }} transition={{ duration: 0.2 }}
              className="relative bg-surface-container-low rounded-2xl p-6 w-full max-w-lg shadow-2xl ring-1 ring-outline-variant/20 max-h-[88vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${cfg.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                  <h3 className="text-lg font-bold text-white">{modal.mode === 'add' ? `New ${cfg.label.slice(0, -1)}` : `Edit ${cfg.label.slice(0, -1)}`}</h3>
                </div>
                <button onClick={() => setModal(null)} className="text-outline hover:text-white transition-colors p-1"><span className="material-symbols-outlined">close</span></button>
              </div>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
              <ItemForm fields={cfg.fields} initial={modal.item} onSave={handleSave} onCancel={() => setModal(null)} saving={saving} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Participants Modal */}
      <AnimatePresence>
        {participantsModal && <ParticipantsModal event={participantsModal} onClose={() => setParticipantsModal(null)} />}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast.msg && (
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }}
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 z-[200] border ${toast.type === 'error' ? 'bg-surface-container-high border-red-500/30 text-red-400' : 'bg-surface-container-high border-outline-variant/20 text-white'}`}>
            <span className={`material-symbols-outlined text-sm ${toast.type === 'error' ? 'text-red-400' : 'text-primary'}`}>{toast.type === 'error' ? 'error' : 'check_circle'}</span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

// ── Panel Header (shared) ─────────────────────────────────────────────────────
function PanelHeader({ icon, color, title, badge, count, hint, onAdd }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
      <div className="flex items-center gap-3">
        <span className={`material-symbols-outlined ${color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        <h2 className="text-base font-bold text-white">{title}</h2>
        {(count !== undefined || badge) && (
          <span className="text-xs font-mono text-outline bg-surface-container-high px-2 py-0.5 rounded-full">{count !== undefined ? count : badge}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {hint && <p className="text-xs text-on-surface-variant font-mono hidden sm:block">{hint}</p>}
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span>Add New
          </button>
        )}
      </div>
    </div>
  );
}

export default Admin;
