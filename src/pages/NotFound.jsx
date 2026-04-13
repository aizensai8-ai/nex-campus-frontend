import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { pageTransition } from '../lib/animations';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.main
      {...pageTransition}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div className="text-center max-w-md">
        <p className="font-berkeley-mono text-primary text-sm uppercase tracking-widest mb-4">404</p>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white mb-4 font-satoshi">
          Page not found.
        </h1>
        <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
          This route doesn't exist in the Nex Campus OS. It may have moved or never existed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:brightness-110 hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 mx-auto"
        >
          <span className="material-symbols-outlined">home</span>
          Go Home
        </button>
      </div>
    </motion.main>
  );
};

export default NotFound;
