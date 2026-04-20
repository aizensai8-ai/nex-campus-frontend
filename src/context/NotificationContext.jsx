import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const NotificationContext = createContext(null);
const STORAGE_KEY = 'nexcampus_notif_read';

const loadReadIds = () => {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
  catch { return new Set(); }
};

const saveReadIds = (set) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
};

const relativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(loadReadIds);

  const refresh = useCallback(async () => {
    try {
      const [annRes, evtRes] = await Promise.allSettled([
        api.get('/api/announcements?limit=8&sort=-createdAt'),
        api.get(`/api/events?from=${new Date(Date.now() - 86400000 * 3).toISOString()}&limit=6`),
      ]);

      const items = [];

      if (annRes.status === 'fulfilled') {
        const anns = Array.isArray(annRes.value.data) ? annRes.value.data : [];
        anns.forEach(a => items.push({
          id: `ann-${a._id}`,
          type: 'announcement',
          icon: a.pinned ? 'push_pin' : 'campaign',
          title: a.title,
          message: a.content?.slice(0, 80) + (a.content?.length > 80 ? '…' : ''),
          time: relativeTime(a.createdAt),
          createdAt: a.createdAt,
          link: '/portal',
          priority: a.priority,
        }));
      }

      if (evtRes.status === 'fulfilled') {
        const evts = Array.isArray(evtRes.value.data) ? evtRes.value.data : [];
        evts.forEach(e => {
          const isPlacement = e.organizer === 'Placement Cell' || e.category === 'networking';
          const daysLeft = Math.ceil((new Date(e.date) - Date.now()) / 86400000);
          if (daysLeft < 0) return;
          items.push({
            id: `evt-${e._id}`,
            type: isPlacement ? 'placement' : 'event',
            icon: isPlacement ? 'work' : 'event',
            title: isPlacement ? `Drive: ${e.title}` : e.title,
            message: daysLeft === 0 ? 'Happening today' : daysLeft === 1 ? 'Tomorrow' : `In ${daysLeft} days · ${e.location || ''}`,
            time: relativeTime(e.createdAt),
            createdAt: e.createdAt,
            link: isPlacement ? '/placements' : '/events',
            urgent: daysLeft <= 2,
          });
        });
      }

      // Sort by newest first
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(items);
    } catch {
      // Silently fail — notifications are non-critical
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5 * 60 * 1000);
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh]);

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const markRead = useCallback((id) => {
    setReadIds(prev => {
      const next = new Set([...prev, id]);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    const allIds = new Set(notifications.map(n => n.id));
    saveReadIds(allIds);
    setReadIds(allIds);
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, readIds, markRead, markAllRead, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
