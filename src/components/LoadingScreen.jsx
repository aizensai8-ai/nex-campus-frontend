import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111827]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Outer pulse ring */}
        <motion.div
          className="absolute w-28 h-28 rounded-3xl border border-[#10b981]/20"
          animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Inner pulse ring */}
        <motion.div
          className="absolute w-22 h-22 rounded-3xl border border-[#10b981]/30"
          animate={{ scale: [1, 1.25, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
        />
        {/* Logo box */}
        <div className="w-20 h-20 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/25 flex items-center justify-center">
          <motion.span
            className="text-4xl font-bold text-[#10b981] select-none"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            N
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
