import React from 'react';
import { motion } from 'motion/react';
import { cardEntranceVariants, cardLayoutTransition } from '../lib/animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  key?: string | number;
}

export function AnimatedCard({ children, className = '', id }: AnimatedCardProps) {
  return (
    <motion.div
      id={id}
      variants={cardEntranceVariants}
      initial="hidden"
      animate="visible"
      layout
      transition={cardLayoutTransition}
      className={`cyber-depth-field ${className}`}
    >
      {children}
    </motion.div>
  );
}
