import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

const ICONS = {
  success: { icon: 'check_circle', color: 'text-green-400', bar: 'bg-green-500', border: 'border-green-500/30' },
  error:   { icon: 'error',        color: 'text-red-400',   bar: 'bg-red-500',   border: 'border-red-500/30'   },
  info:    { icon: 'info',         color: 'text-blue-400',  bar: 'bg-blue-500',  border: 'border-blue-500/30'  },
};

function ToastItem({ toast, onDismiss }) {
  const cfg = ICONS[toast.type] ?? ICONS.info;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-start gap-3 w-80 bg-surface-container-high border ${cfg.border} rounded-xl shadow-2xl px-4 py-3.5 overflow-hidden`}
    >
      <span className={`material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0 ${cfg.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
        {cfg.icon}
      </span>
      <p className="text-sm text-white leading-snug flex-1 pr-2">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="text-outline hover:text-white transition-colors flex-shrink-0"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-outline-variant/20">
        <div
          className={`h-full ${cfg.bar} origin-left`}
          style={{ animation: 'toast-shrink 3s linear forwards' }}
        />
      </div>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ message, type = 'info' }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), 3200);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="sync">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
