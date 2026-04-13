import { useScroll, useSpring, motion } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9998] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
      }}
    />
  );
};

export default ScrollProgress;
