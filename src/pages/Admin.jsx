import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

// ── Field configs ────────────────────────────────────────────────────────────
const CONFIGS = {
  announcements: {
    label: 'Announcements',
    icon: 'campaign',
    endpoint: '/api/announcements',
    color: 'text-primary',
    bg: 'bg-primary/10',
    fields: [
      { name: 'title',      label: 'Title',      type: 'text',     required: true },
      { name: 'content',    label: 'Content',    type: 'textarea', required: true },
      { name: 'category',   label: 'Category',   type: 'select',   options: ['general', 'academic', 'events', 'facilities', 'urgent'] },
      { name: 'priority',   label: 'Priority',   type: 'select',   options: ['low', 'medium', 'high', 'critical'] },
      { name: 'pinned',     label: 'Pin to top', type: 'checkbox' },
    ],
    display: (i) => ({ title: i.title, sub: i.content?.slice(0, 90) + (i.content?.length > 90 ? '…' : ''), badge: i.category, flag: i.pinned ? '📌' : '' }),
  },
  courses: {
    label: 'Courses',
    icon: 'school',
    endpoint: '/api/courses',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    fields: [
      { name: 'code',         label: 'Course Code',   type: 'text',   required: true },
      { name: 'name',         label: 'Course Name',   type: 'text',   required: true },
      { name: 'description',  label: 'Description',   type: 'textarea' },
      { name: 'instructor',   label: 'Instructor',    type: 'text',   required: true },
      { name: 'schedule',     label: 'Schedule',      type: 'text',   placeholder: 'e.g. Mon 9:00–10:00 · Wed 11:00–12:00' },
      { name: 'credits',      label: 'Credits',       type: 'number', required: true },
      { name: 'section',      label: 'Section',       type: 'select', options: ['A', 'B', 'C', 'D', 'E'] },
      { name: 'totalClasses', label: 'Total Classes', type: 'number', placeholder: '0' },
      { name: 'department',   label: 'Department',    type: 'select', required: true, options: ['Computer Science', 'General'] },
      { name: 'difficulty',   label: 'Difficulty',    type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
      { name: 'status',       label: 'Status',        type: 'select', options: ['active', 'new', 'popular', 'archived'] },
      { name: 'capacity',     label: 'Capacity',      type: 'number' },
    ],
    display: (i) => ({
      title: `${i.code} — ${i.name}`,
      sub: `${i.instructor}  ·  ${i.section ? 'Sec ' + i.section + '  ·  ' : ''}${i.totalClasses || 0} classes`,
      badge: i.difficulty,
    }),
  },
  events: {
    label: 'Events',
    icon: 'event',
    endpoint: '/api/events',
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
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
    display: (i) => ({
      title: i.title,
      sub: `${i.date ? new Date(i.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}${i.location ? '  ·  ' + i.location : ''}`,
      badge: i.status,
      flag: i.featured ? '⭐' : '',
    }),
  },
  facilities: {
    label: 'Facilities',
    icon: 'domain',
    endpoint: '/api/facilities',
    color: 'text-on-surface-variant',
    bg: 'bg-surface-container-high',
    fields: [
      { name: 'name',             label: 'Name',              type: 'text',       required: true },
      { name: 'description',      label: 'Description',       type: 'textarea' },
      { name: 'location',         label: 'Location',          type: 'text' },
      { name: 'hours',            label: 'Hours',             type: 'text',       placeholder: '9:00 AM – 5:00 PM' },
      { name: 'capacity',         label: 'Capacity',          type: 'number' },
      { name: 'currentOccupancy', label: 'Current Occupancy', type: 'number' },
      { name: 'type',             label: 'Type',              type: 'select',     required: true, options: ['library', 'lab', 'gym', 'dining', 'auditorium', 'studio', 'center', 'canteen', 'sports', 'recreation', 'hostel', 'shop', 'other'] },
      { name: 'status',           label: 'Status',            type: 'select',     options: ['open', 'closed', 'reserved', 'maintenance', 'peak'] },
      { name: 'bookingRequired',  label: 'Booking Required',  type: 'checkbox' },
      { name: 'featured',         label: 'Featured',          type: 'checkbox' },
      { name: 'menuItems',        label: 'Menu Items',        type: 'menu-items' },
    ],
    display: (i) => ({
      title: i.name,
      sub: `${i.type}  ·  ${i.location || 'TBA'}  ·  ${i.hours || ''}`,
      badge: i.status,
      flag: i.type === 'canteen' && i.menuItems?.length ? `🍽️ ${i.menuItems.length}` : '',
    }),
  },
  attendance: {
    label: 'Attendance',
    icon: 'fact_check',
    endpoint: '/api/attendance/admin/summary',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    isAttendance: true,
    display: null,
    fields: [],
  },
  support: {
    label: 'Support',
    icon: 'support_agent',
    endpoint: '/api/support',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    isSupport: true,
    display: null,
    fields: [],
  },
};

const CONTENT_TABS = ['announcements', 'courses', 'events', 'facilities'];
const TABS = [...CONTENT_TABS, 'attendance', 'support'];

const PRIORITY_COLOR = { low: 'text-outline', medium: 'text-secondary', high: 'text-primary', critical: 'text-red-400' };
const STATUS_COLOR = {
  open: 'text-green-400', upcoming: 'text-primary', past: 'text-outline',
  active: 'text-green-400', new: 'text-secondary', popular: 'text-tertiary',
  archived: 'text-outline', closed: 'text-red-400', maintenance: 'text-secondary',
  live: 'text-green-400', cancelled: 'text-red-400', waitlist: 'text-secondary',
  reserved: 'text-secondary', peak: 'text-secondary',
};

// ── Menu Items Editor ─────────────────────────────────────────────────────────
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
            <button type="button" onClick={() => remove(idx)}
              className="text-outline hover:text-red-400 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">delete</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => update(idx, 'name', e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/20 rounded py-1.5 px-2.5 text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/50"
              />
            </div>
            <div>
              <input
                placeholder="₹ Price"
                type="number"
                value={item.price}
                onChange={(e) => update(idx, 'price', e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/20 rounded py-1.5 px-2.5 text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/50"
              />
            </div>
          </div>
          <input
            placeholder="Description (optional)"
            value={item.description}
            onChange={(e) => update(idx, 'description', e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/20 rounded py-1.5 px-2.5 text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/50"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-white transition-colors py-1"
      >
        <span className="material-symbols-outlined text-[15px]">add</span>
        Add menu item
      </button>
    </div>
  );
}

// ── Reusable Item Form ────────────────────────────────────────────────────────
function ItemForm({ fields, initial, onSave, onCancel, saving }) {
  const [values, setValues] = useState(() => {
    const d = {};
    fields.forEach((f) => {
      if (f.type === 'checkbox') d[f.name] = initial?.[f.name] ?? false;
      else if (f.type === 'date' && initial?.[f.name]) d[f.name] = new Date(initial[f.name]).toISOString().split('T')[0];
      else if (f.type === 'menu-items') d[f.name] = initial?.[f.name] ?? [];
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
            <textarea
              rows={3}
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm placeholder:text-outline/50 focus:ring-1 focus:ring-primary outline-none resize-none transition-all"
              value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}
              required={f.required} placeholder={f.placeholder}
            />
          ) : f.type === 'select' ? (
            <select
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
              value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}
              required={f.required}
            >
              <option value="">— select —</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : f.type === 'checkbox' ? (
            <label className="flex items-center gap-2.5 cursor-pointer w-fit">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-primary"
                checked={values[f.name]} onChange={(e) => set(f.name, e.target.checked)}
              />
              <span className="text-sm text-on-surface-variant">Yes</span>
            </label>
          ) : f.type === 'menu-items' ? (
            <MenuItemsEditor value={values[f.name]} onChange={(v) => set(f.name, v)} />
          ) : (
            <input
              type={f.type}
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2.5 px-3 text-on-surface text-sm placeholder:text-outline/50 focus:ring-1 focus:ring-primary outline-none transition-all"
              value={values[f.name]}
              onChange={(e) => set(f.name, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
              required={f.required} placeholder={f.placeholder}
            />
          )}
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex-1 bg-primary text-on-primary font-bold py-2.5 rounded-lg hover:bg-primary-fixed-dim transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
        >
          {saving
            ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
            : 'Save'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-white text-sm transition-colors"
        >Cancel</button>
      </div>
    </form>
  );
}

// ── Attendance Admin Panel ────────────────────────────────────────────────────
function AttendanceAdminPanel({ showToast }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/attendance/admin/summary')
      .then((r) => setCourses(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addClassHeld = async (courseId) => {
    setAdding(courseId);
    try {
      const r = await api.patch(`/api/attendance/admin/add-class/${courseId}`);
      setCourses((prev) =>
        prev.map((c) => c._id === courseId ? { ...c, totalClasses: r.data.totalClasses } : c)
      );
      showToast('Class added — attendance tracker updated.');
    } catch {
      showToast('Failed to add class.', 'error');
    } finally {
      setAdding(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-surface-container-high rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="py-20 text-center text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl text-outline mb-3 block">fact_check</span>
        <p>No courses found in the database.</p>
      </div>
    );
  }

  const totalClassesHeld = courses.reduce((a, c) => a + (c.totalClasses || 0), 0);
  const totalAbsences = courses.reduce((a, c) => a + (c.absentRecords || 0), 0);
  const trackedStudents = [...new Set(courses.flatMap(() => []))].length; // placeholder

  return (
    <>
      {/* Summary bar */}
      <div className="grid grid-cols-3 divide-x divide-outline-variant/10 border-b border-outline-variant/10">
        {[
          { label: 'Courses', value: courses.length },
          { label: 'Classes Held (total)', value: totalClassesHeld },
          { label: 'Absence Records', value: totalAbsences },
        ].map(({ label, value }) => (
          <div key={label} className="py-4 text-center">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-[10px] font-mono text-outline uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Course rows */}
      <ul className="divide-y divide-outline-variant/10">
        {courses.map((course) => {
          const isAdding = adding === course._id;
          return (
            <li
              key={course._id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container transition-colors duration-150 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[10px] text-outline uppercase tracking-wider">{course.code}</span>
                  {course.section && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono border border-primary/20">
                      §{course.section}
                    </span>
                  )}
                </div>
                <p className="text-white font-semibold text-sm">{course.name}</p>
                <div className="flex items-center gap-4 mt-1 flex-wrap">
                  <span className="text-xs text-on-surface-variant">
                    Classes held: <span className="text-white font-semibold">{course.totalClasses}</span>
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Students tracked: <span className="text-white font-semibold">{course.totalStudents}</span>
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Absences logged: <span className={`font-semibold ${course.absentRecords > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {course.absentRecords}
                    </span>
                  </span>
                </div>
              </div>

              {/* Class count badge */}
              <div className="text-center flex-shrink-0 hidden sm:block">
                <p className="text-2xl font-bold text-white">{course.totalClasses}</p>
                <p className="text-[9px] font-mono text-outline uppercase tracking-wider">classes</p>
              </div>

              {/* Add class button */}
              <button
                onClick={() => addClassHeld(course._id)}
                disabled={isAdding}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all text-xs font-semibold disabled:opacity-50"
              >
                {isAdding ? (
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span className="material-symbols-outlined text-[14px]">add</span>
                )}
                Add Class
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

// ── Support Admin Panel ───────────────────────────────────────────────────────
function SupportAdminPanel({ showToast }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/api/support')
      .then((r) => setTickets(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const resolve = async (id) => {
    setResolving(id);
    try {
      await api.patch(`/api/support/${id}/resolve`);
      setTickets((prev) => prev.map((t) => t._id === id ? { ...t, status: 'resolved' } : t));
      showToast('Ticket marked as resolved.');
    } catch {
      showToast('Failed to resolve ticket.', 'error');
    } finally {
      setResolving(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-surface-container-high rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.2 }} />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="py-20 text-center text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl text-outline mb-3 block">support_agent</span>
        <p>No support tickets yet.</p>
      </div>
    );
  }

  const open = tickets.filter((t) => t.status === 'open').length;

  return (
    <>
      <div className="grid grid-cols-3 divide-x divide-outline-variant/10 border-b border-outline-variant/10">
        {[
          { label: 'Total Tickets', value: tickets.length },
          { label: 'Open', value: open },
          { label: 'Resolved', value: tickets.length - open },
        ].map(({ label, value }) => (
          <div key={label} className="py-4 text-center">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-[10px] font-mono text-outline uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <ul className="divide-y divide-outline-variant/10">
        {tickets.map((ticket) => (
          <li key={ticket._id} className="flex items-start gap-4 px-6 py-4 hover:bg-surface-container transition-colors duration-150 group">
            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${ticket.status === 'open' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-white font-semibold text-sm">{ticket.name}</span>
                {ticket.usn && <span className="font-mono text-[10px] text-outline bg-surface-container-high px-1.5 py-0.5 rounded">{ticket.usn}</span>}
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${ticket.status === 'open' ? 'text-orange-400 bg-orange-500/10' : 'text-green-400 bg-green-500/10'}`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-on-surface-variant text-xs mb-1">{ticket.email}{ticket.phone ? ` · ${ticket.phone}` : ''}</p>
              <p className="text-on-surface text-sm leading-relaxed">{ticket.message}</p>
              <p className="text-outline text-[10px] font-mono mt-1">
                {new Date(ticket.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {ticket.status === 'open' && (
              <button
                onClick={() => resolve(ticket._id)}
                disabled={resolving === ticket._id}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all text-xs font-semibold disabled:opacity-50"
              >
                {resolving === ticket._id ? (
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : (
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                )}
                Resolve
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

// ── Participants Modal ────────────────────────────────────────────────────────
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
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative bg-surface-container-low rounded-2xl p-6 w-full max-w-lg shadow-2xl ring-1 ring-outline-variant/20 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Registered Participants</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-outline hover:text-white transition-colors p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-3 flex-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-surface-container-high rounded-lg animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm text-center py-8">{error}</div>
        ) : participants.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-outline mb-3 block">group</span>
            <p>No registrations yet.</p>
          </div>
        ) : (
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

// ── Stats Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, bg, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -3, boxShadow: '0 16px 32px rgba(0,0,0,0.25)' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 flex items-center gap-4 w-full text-left hover:bg-surface-container transition-colors"
    >
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

  const [activeTab, setActiveTab] = useState('announcements');
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [participantsModal, setParticipantsModal] = useState(null);

  const cfg = CONFIGS[activeTab];
  const isAttendanceTab = cfg.isAttendance;
  const isSupportTab = cfg.isSupport;

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) navigate('/login');
  }, [user, authLoading, navigate]);

  // Load counts for content tabs only (used in stat cards)
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

  // Load tab items (skip for attendance/support — they render their own panels)
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    if (isAttendanceTab || isSupportTab) return;
    setLoadingItems(true);
    setError('');
    api.get(cfg.endpoint)
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError(`Failed to load ${cfg.label.toLowerCase()}.`))
      .finally(() => setLoadingItems(false));
  }, [activeTab, user, isAttendanceTab, isSupportTab]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const handleSave = async (values) => {
    setSaving(true);
    setError('');
    try {
      if (modal.mode === 'add') {
        const r = await api.post(cfg.endpoint, values);
        setItems((p) => [r.data, ...p]);
        setStats((s) => ({ ...s, [activeTab]: (s[activeTab] || 0) + 1 }));
        showToast(`${cfg.label.slice(0, -1)} created successfully.`);
      } else {
        const r = await api.put(`${cfg.endpoint}/${modal.item._id}`, values);
        setItems((p) => p.map((x) => (x._id === r.data._id ? r.data : x)));
        showToast(`${cfg.label.slice(0, -1)} updated.`);
      }
      setModal(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Save failed.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.delete(`${cfg.endpoint}/${id}`);
      setItems((p) => p.filter((x) => x._id !== id));
      setStats((s) => ({ ...s, [activeTab]: Math.max(0, (s[activeTab] || 0) - 1) }));
      showToast('Deleted successfully.');
    } catch {
      showToast('Delete failed.', 'error');
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }
  if (!user || user.role !== 'admin') return null;

  return (
    <motion.main {...pageTransition} className="min-h-screen pt-24 pb-20 px-6 max-w-[1440px] mx-auto">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
          <h1 className="text-4xl font-bold tracking-tighter text-white font-satoshi">Admin Panel</h1>
        </div>
        <p className="text-on-surface-variant ml-10">
          Logged in as <span className="text-primary font-medium">{user.name}</span>
          <span className="text-outline mx-2">·</span>
          <span className="font-mono text-xs">{user.email}</span>
        </p>
      </motion.div>

      {/* ── Stats Grid (content tabs only) ── */}
      <motion.div {...staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {CONTENT_TABS.map((t) => {
          const c = CONFIGS[t];
          return (
            <motion.div key={t} {...staggerItem}>
              <StatCard
                icon={c.icon} label={c.label} value={stats[t]}
                color={c.color} bg={c.bg}
                onClick={() => setActiveTab(t)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-1 mb-6 bg-surface-container-low rounded-xl p-1 w-fit border border-outline-variant/10">
        {TABS.map((tab) => {
          const tc = CONFIGS[tab];
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setError(''); setModal(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'text-on-surface-variant hover:text-white hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{tc.icon}</span>
              <span className="hidden sm:inline">{tc.label}</span>
              {!tc.isAttendance && stats[tab] !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-surface-container-high'}`}>
                  {stats[tab]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Error Banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 p-4 rounded-xl bg-error/10 border border-error/30 text-red-400 text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
            <button onClick={() => setError('')} className="ml-auto text-outline hover:text-white">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content Panel ── */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">

        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined ${cfg.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
            <h2 className="text-lg font-bold text-white">{cfg.label}</h2>
            {!isAttendanceTab && !isSupportTab && !loadingItems && (
              <span className="text-xs font-mono text-outline bg-surface-container-high px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
            {isAttendanceTab && (
              <span className="text-xs font-mono text-outline bg-surface-container-high px-2 py-0.5 rounded-full">
                per-course view
              </span>
            )}
            {isSupportTab && (
              <span className="text-xs font-mono text-outline bg-surface-container-high px-2 py-0.5 rounded-full">
                ticket inbox
              </span>
            )}
          </div>
          {!isAttendanceTab && !isSupportTab && (
            <button
              onClick={() => { setError(''); setModal({ mode: 'add' }); }}
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-fixed-dim transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add New
            </button>
          )}
          {isAttendanceTab && (
            <p className="text-xs text-on-surface-variant font-mono">
              Tap <span className="text-green-400">Add Class</span> to record a class held for a course
            </p>
          )}
          {isSupportTab && (
            <p className="text-xs text-on-surface-variant font-mono">
              Read-only · Resolve tickets here
            </p>
          )}
        </div>

        {/* ── Attendance special panel ── */}
        {isAttendanceTab ? (
          <AttendanceAdminPanel showToast={showToast} />
        ) : isSupportTab ? (
          <SupportAdminPanel showToast={showToast} />
        ) : loadingItems ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-surface-container-high rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl text-outline mb-3 block">{cfg.icon}</span>
            <p>No {cfg.label.toLowerCase()} yet.</p>
            <button onClick={() => setModal({ mode: 'add' })} className="mt-4 text-primary hover:underline text-sm">
              + Add the first one
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant/10">
            {items.map((item) => {
              const d = cfg.display(item);
              const badgeColor = STATUS_COLOR[item.status] || STATUS_COLOR[item.priority] || 'text-outline';
              return (
                <li key={item._id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container transition-colors duration-150 group">
                  {d.flag && <span className="text-base flex-shrink-0">{d.flag}</span>}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{d.title}</p>
                    <p className="text-on-surface-variant text-xs truncate mt-0.5">{d.sub}</p>
                  </div>
                  {d.badge && (
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded flex-shrink-0 bg-surface-container-high ${badgeColor}`}>
                      {d.badge}
                    </span>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {activeTab === 'events' && (
                      <button
                        onClick={() => setParticipantsModal(item)}
                        className="p-2 rounded-lg hover:bg-secondary/10 text-on-surface-variant hover:text-secondary transition-colors"
                        title="View Participants"
                      >
                        <span className="material-symbols-outlined text-sm">group</span>
                      </button>
                    )}
                    <button
                      onClick={() => { setError(''); setModal({ mode: 'edit', item }); }}
                      className="p-2 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deleting === item._id}
                      className="p-2 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-red-400 transition-colors disabled:opacity-40"
                      title="Delete"
                    >
                      {deleting === item._id
                        ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        : <span className="material-symbols-outlined text-sm">delete</span>}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {modal && !isAttendanceTab && !isSupportTab && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setModal(null)}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative bg-surface-container-low rounded-2xl p-6 w-full max-w-lg shadow-2xl ring-1 ring-outline-variant/20 max-h-[88vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${cfg.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                  <h3 className="text-lg font-bold text-white">
                    {modal.mode === 'add' ? `New ${cfg.label.slice(0, -1)}` : `Edit ${cfg.label.slice(0, -1)}`}
                  </h3>
                </div>
                <button onClick={() => setModal(null)} className="text-outline hover:text-white transition-colors p-1">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/30 text-red-400 text-sm">{error}</div>
              )}
              <ItemForm
                fields={cfg.fields}
                initial={modal.item}
                onSave={handleSave}
                onCancel={() => setModal(null)}
                saving={saving}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Participants Modal ── */}
      <AnimatePresence>
        {participantsModal && (
          <ParticipantsModal
            event={participantsModal}
            onClose={() => setParticipantsModal(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast.msg && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 z-[200] border ${
              toast.type === 'error'
                ? 'bg-surface-container-high border-error/30 text-red-400'
                : 'bg-surface-container-high border-outline-variant/20 text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-sm ${toast.type === 'error' ? 'text-red-400' : 'text-primary'}`}>
              {toast.type === 'error' ? 'error' : 'check_circle'}
            </span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default Admin;
