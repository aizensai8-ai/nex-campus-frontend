import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Portal', path: '/portal' },
  { label: 'Events', path: '/events' },
  { label: 'Courses', path: '/courses' },
  { label: 'Faculty', path: '/faculty' },
  { label: 'Placements', path: '/placements' },
  { label: 'Lost & Found', path: '/lost-found' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Campus Map', path: '/campus-map' },
  { label: 'Support', path: '/support' },
];

const TYPE_ICON = {
  announcement: 'campaign',
  event: 'event',
  placement: 'work',
  attendance: 'warning',
  support: 'support_agent',
};

const NotificationBell = () => {
  const { notifications, unreadCount, readIds, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleClick = (n) => {
    markRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        className="relative w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors">
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: unreadCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-80 bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10">
              <span className="text-sm font-bold text-white">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
              )}
            </div>

            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <span className="material-symbols-outlined text-3xl text-outline/30 block mb-2">notifications_off</span>
                  <p className="text-xs text-on-surface-variant">No notifications yet</p>
                </div>
              ) : notifications.map(n => {
                const unread = !readIds.has(n.id);
                return (
                  <button key={n.id} onClick={() => handleClick(n)}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-surface-container transition-colors text-left border-b border-outline-variant/5 last:border-0 ${unread ? 'bg-primary/[0.07]' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${n.urgent ? 'bg-yellow-400/10' : 'bg-surface-container'}`}>
                      <span className={`material-symbols-outlined text-sm ${n.urgent ? 'text-yellow-400' : 'text-outline'}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}>
                        {TYPE_ICON[n.type] || 'circle'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-snug ${unread ? 'text-white' : 'text-on-surface-variant'}`}>{n.title}</p>
                      <p className="text-[11px] text-outline line-clamp-1 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-outline/60 mt-1">{n.time}</p>
                    </div>
                    {unread && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // NotificationBell is its own component with internal state

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const lastScrollY = useRef(0);
  
  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (Math.abs(delta) < 5) return;
      if (currentY < 100) {
        setNavHidden(false);
      } else if (delta > 0) {
        setNavHidden(true);
        setDropdownOpen(false);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <>
    <motion.header
      animate={{ y: navHidden ? '-100%' : '0%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0d1322]/80">
      <nav className="flex justify-between items-center w-full px-6 py-3 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter text-white font-satoshi hover:opacity-90 transition-opacity">
            Nex Campus
          </Link>

          <div className="hidden md:flex gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "nav-link transition-colors font-satoshi tracking-tight font-semibold relative py-1 text-sm",
                    isActive ? "text-primary" : "text-[#c2c6d6] hover:text-white"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 350, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors"
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Search */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                key="searchbar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSearchSubmit}
                className="overflow-hidden"
              >
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  placeholder="Search courses..."
                  className="w-full bg-surface-container-high text-on-surface text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary placeholder:text-outline/60"
                />
              </motion.form>
            ) : (
              <button
                key="searchicon"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="material-symbols-outlined hidden lg:block text-on-surface-variant hover:text-white transition-all duration-200 p-2 rounded-lg hover:scale-[1.05] active:scale-95"
              >
                search
              </button>
            )}
          </AnimatePresence>

          {/* Notification bell */}
          <NotificationBell />

          {/* Auth button */}
          {!user && (
            <Link
              to="/login"
              className="bg-[#242a3a] text-primary px-4 py-1.5 text-sm font-semibold rounded hover:bg-[#2f3445] transition-all duration-200 active:opacity-80 flex items-center gap-2 hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-sm hidden md:inline">sensors</span>
              Portal Live
            </Link>
          )}

          {/* Avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label={dropdownOpen ? 'Close account menu' : 'Open account menu'}
              aria-expanded={dropdownOpen}
              className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/15 hover:ring-2 hover:ring-primary/30 transition-all duration-200 cursor-pointer flex items-center justify-center"
            >
              {user ? (
                <span className="material-symbols-outlined text-primary text-lg">person</span>
              ) : (
                <span className="material-symbols-outlined text-on-surface-variant text-lg">account_circle</span>
              )}
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 w-48 bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-outline-variant/10">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-outline text-xs truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/portal"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">dashboard</span>
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">manage_accounts</span>
                        Edit Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                          Admin Panel
                        </Link>
                      )}
                      {deferredPrompt && (
                        <button
                          onClick={handleInstallClick}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#adc6ff] hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          Install App
                        </button>
                      )}
                      <div className="border-t border-outline-variant/10">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">logout</span>
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">login</span>
                        Log In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-surface-container-high transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        Sign Up
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </motion.header>

    {/* ── Mobile slide-out menu ─────────────────────────────────── */}
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <motion.div
            key="mobile-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0d1322] border-r border-white/5 flex flex-col md:hidden"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <span className="text-xl font-bold tracking-tighter text-white font-satoshi">Nex Campus</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl font-satoshi font-semibold text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-white'
                    )}
                  >
                    {item.label}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom user section */}
            <div className="px-3 py-4 border-t border-white/5">
              {user ? (
                <>
                  <div className="px-4 py-3 mb-2">
                    <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-outline text-xs truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">manage_accounts</span>
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">login</span>
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-primary hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
