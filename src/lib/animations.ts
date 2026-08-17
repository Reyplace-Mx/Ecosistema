import { Variants } from 'motion/react';

export const cardEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } 
  },
};

export const cardLayoutTransition = { 
  type: 'spring', 
  stiffness: 250, 
  damping: 30 
};
