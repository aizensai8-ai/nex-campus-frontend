import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DEFAULT_SUGGESTIONS = [
  { id: 'tt', icon: 'calendar_month', title: 'My Timetable', hint: 'Classes & schedule', action: '/portal?tab=timetable' },
  { id: 'bus', icon: 'directions_bus', title: 'Live Commute', hint: 'Find my bus route', action: '/portal?tab=commute' },
  { id: 'acad', icon: 'military_tech', title: 'Internal Grades', hint: 'CIE Marks', action: '/portal?tab=academics' },
  { id: 'lib', icon: 'library_books', title: 'Digital Library', hint: 'Notes & Syllabus', action: '/portal?tab=library' },
  { id: 'map', icon: 'explore', title: 'Campus Map', hint: 'Interactive map', action: '/map' }
];

const NexBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [botReply, setBotReply] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setBotReply(null);
    }
  }, [isOpen]);

  const executeAction = (url, message) => {
    setBotReply(message || 'Executing...');
    setTimeout(() => {
      navigate(url);
      setIsOpen(false);
    }, 400);
  };

  const handleCommand = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const input = query.toLowerCase();
    
    if (/(timetable|schedule|class|calendar)/i.test(input)) {
        executeAction('/portal?tab=timetable', 'Opening Timetable...');
    } else if (/(bus|commute|transport|home|route)/i.test(input)) {
        executeAction('/portal?tab=commute', 'Finding Route...');
    } else if (/(grade|mark|academic|cie|result)/i.test(input)) {
        executeAction('/portal?tab=academics', 'Checking Marks...');
    } else if (/(library|resource|note|syllabus|pyq)/i.test(input)) {
        executeAction('/portal?tab=library', 'Accessing Library...');
    } else if (/(map|where|navigate|building|block)/i.test(input)) {
        executeAction('/map', 'Launching Map...');
    } else if (/(admin|manage|dashboard)/i.test(input)) {
        executeAction('/admin', 'Admin Control...');
    } else if (/(login|sign in|auth)/i.test(input)) {
        executeAction('/login', 'Authenticating...');
    } else if (/(attendance|present)/i.test(input)) {
        executeAction('/portal?tab=attendance', 'Checking Attendance...');
    } 
    // ── Static FAQs ──
    else if (/(wifi|internet|password)/i.test(input)) {
        setBotReply("Guest Wi-Fi: 'Nex_Guest' / Password: 'nex@123'");
    } else if (/(fee|payment|pay)/i.test(input)) {
        setBotReply("Pay fees at Admin Block (Ground Floor), 10 AM - 3 PM, Mon-Fri.");
    } else if (/(hostel|curfew|mess|food)/i.test(input)) {
        setBotReply("Hostel curfew is 8:30 PM. Mess closes at 9:00 PM.");
    } else if (/(holiday|vacation)/i.test(input)) {
        setBotReply("Following VTU calendar. Next break after final CIEs!");
    } 
    // ── Emergency ──
    else if (/(emergency|ambulance|hospital|medical|security|help me|police|danger)/i.test(input)) {
        setBotReply("🚨 EMERGENCY: Security (+91-9876543210). Medical Room: Block A.");
    }
    // ── Easter Eggs ──
    else if (/(who made you|creator|real ai)/i.test(input)) {
        setBotReply("I am an offline logic matrix, built for Webtopia. ⚡");
    } else if (/(hello|hi|hey|sup|yo)/i.test(input)) {
        setBotReply("Hello! Ask me to find your schedule, grades, or bus route.");
    } else if (/(joke|funny)/i.test(input)) {
        setBotReply("Why do programmers prefer dark mode? Light attracts bugs. 😂");
    } else {
        setBotReply("Couldn't find that. Try searching for 'timetable' or 'grades'.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />

            {/* Command Palette Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-2xl bg-surface-container-low/80 backdrop-blur-2xl border border-outline-variant/30 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Input Header */}
              <form onSubmit={handleCommand} className="relative flex items-center px-6 py-5 border-b border-outline-variant/10">
                <span className="material-symbols-outlined text-outline text-2xl mr-4">search</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask Nexbot or search commands..."
                  value={query}
                  onChange={(e) => {
                      setQuery(e.target.value);
                      setBotReply(null); // Clear reply on type
                  }}
                  className="w-full bg-transparent border-none outline-none text-2xl text-white placeholder:text-outline-variant font-satoshi font-medium"
                />
                <div className="flex items-center gap-1.5 ml-4">
                  <kbd className="bg-surface-container px-2 py-1 flex items-center justify-center rounded text-[10px] text-outline border border-outline-variant/20 font-mono">esc</kbd>
                </div>
              </form>

              {/* Dynamic Content Region */}
              <div className="relative min-h-[160px] max-h-[400px] overflow-y-auto hide-scrollbar bg-surface-container-lowest/50 p-3">
                 <AnimatePresence mode="popLayout">
                    {botReply ? (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="flex items-center justify-center h-full min-h-[160px] p-6 text-center"
                       >
                          <div>
                             <span className="material-symbols-outlined text-4xl text-primary/40 mb-3 animate-pulse">auto_awesome</span>
                             <p className="text-xl text-white font-medium">{botReply}</p>
                          </div>
                       </motion.div>
                    ) : (
                       <motion.div
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                       >
                          <div className="px-3 pt-2 pb-1">
                             <p className="text-[10px] font-mono tracking-widest uppercase text-outline">Suggested Actions</p>
                          </div>
                          <div className="mt-2 space-y-1">
                            {DEFAULT_SUGGESTIONS.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.hint.toLowerCase().includes(query.toLowerCase())).map((item) => (
                              <button
                                key={item.id}
                                onClick={() => executeAction(item.action, `Opening ${item.title}...`)}
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
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-[10px] text-outline font-mono uppercase tracking-widest">NexBot Active</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1 text-[11px] text-outline">
                      <kbd className="bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/20 font-mono">↵</kbd>
                      <span>to execute</span>
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
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
            
            {/* Subtle light sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default NexBot;
