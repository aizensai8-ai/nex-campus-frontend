// Apple-style easing curve — smooth deceleration
const APPLE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.65, ease: APPLE },
};

// For headings: blur reveals
export const fadeUpBlur = {
  initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: APPLE },
};

export const staggerContainer = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-100px' },
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  },
};

export const staggerItem = {
  variants: {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: APPLE },
    },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: APPLE } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2, ease: APPLE } },
};
