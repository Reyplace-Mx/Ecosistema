import React from 'react';
import { motion } from 'motion/react';
import { cardEntranceVariants, cardLayoutTransition } from '../lib/animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
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
      className={className}
    >
      {children}
    </motion.div>
  );
}
