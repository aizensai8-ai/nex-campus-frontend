import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Portal', path: '/portal' },
  { label: 'Events', path: '/events' },
  { label: 'Courses', path: '/courses' },
  { label: 'Facilities', path: '/facilities' },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0d1322]/80">
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
          <button className="material-symbols-outlined hidden lg:block text-on-surface-variant hover:text-white transition-all duration-200 p-2 rounded-lg hover:scale-[1.05] active:scale-95">
            search
          </button>
          <Link
            to="/login"
            className="bg-[#242a3a] text-primary px-4 py-1.5 text-sm font-semibold rounded hover:bg-[#2f3445] transition-all duration-200 active:opacity-80 flex items-center gap-2 hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-sm hidden md:inline">sensors</span>
            Portal Live
          </Link>
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden ghost-border border border-outline-variant/15 hover:ring-2 hover:ring-primary/30 transition-all duration-200 cursor-pointer">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhkefLlaJbYp-NF2Uo26w_E6aO1Sh-K_LSL_P7faSs0q8usbHGqZvi7t2qdYmUvp6UexRhww3fpf257LFKy7-a62MG4EQZ_T8gAgjSs0dkwHlEAlukpIBtiNVf7sGuOVgnujlnDAG6CF3siPmuaPJhcdQ2d754WoNCm5HEh1SNI-GVPqaIi3XZoMSt0dUr_a0pwhg7avh4vpkYRaylXl7pN2Geo5Ze6XQZ8jVTR8lr1fVo0VXDKRsFsIiesyzm2Yj7WDdB7yDHL2M"
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
