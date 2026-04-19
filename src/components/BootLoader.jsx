import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_SEQUENCE = [
  "INITIALIZING NEX_CORE v2.0.4...",
  "ESTABLISHING MAINFRAME UPLINK...",
  "BYPASSING LOCAL PROXY [OK]",
  "LOADING SMART CAMPUS PROTOCOLS...",
  "DECRYPTING TIMETABLE CHUNKS...",
  "SYNCING ATTENDANCE LEDGER...",
  "SYSTEM ONLINE."
];

const BootLoader = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    // Check if we've already booted this session to avoid annoyance
    if (sessionStorage.getItem('nex_booted')) {
      onComplete();
      return;
    }

    if (currentIndex < BOOT_SEQUENCE.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, BOOT_SEQUENCE[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === BOOT_SEQUENCE.length - 1 ? 800 : Math.random() * 150 + 50); // fast but slightly randomized typing, pause on last
      
      return () => clearTimeout(timer);
    } else {
      // Boot complete!
      setTimeout(() => {
        setIsBooted(true);
        sessionStorage.setItem('nex_booted', 'true');
        setTimeout(() => onComplete(), 800); // Wait for exit animation
      }, 400);
    }
  }, [currentIndex, onComplete]);

  // If already booted in session, don't render anything
  if (sessionStorage.getItem('nex_booted') && lines.length === 0) return null;

  return (
    <AnimatePresence>
      {!isBooted && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed inset-0 z-[99999] bg-surface-lowest text-primary font-mono text-xs md:text-sm p-8 flex flex-col justify-end bg-black backdrop-blur-3xl"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
          <div className="max-w-3xl w-full mx-auto relative z-10 flex flex-col justify-end h-full">
            <div className="space-y-1">
              {lines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${idx === BOOT_SEQUENCE.length - 1 ? 'text-green-400 font-bold mt-4' : 'text-outline'} flex items-center gap-2`}
                >
                  <span className="opacity-50">&gt;</span> {line}
                </motion.div>
              ))}
              {currentIndex < BOOT_SEQUENCE.length && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-primary opacity-50">&gt;</span>
                  <span className="w-2.5 h-4 bg-primary animate-pulse"></span>
                </div>
              )}
            </div>
            
            {/* Loading Bar at bottom */}
            <div className="mt-8 h-[2px] bg-surface-container-highest w-full overflow-hidden">
                <motion.div 
                   className="h-full bg-primary"
                   initial={{ width: "0%" }}
                   animate={{ width: currentIndex === BOOT_SEQUENCE.length ? "100%" : `${(currentIndex / BOOT_SEQUENCE.length) * 100}%` }}
                   transition={{ duration: 0.2 }}
                />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootLoader;
