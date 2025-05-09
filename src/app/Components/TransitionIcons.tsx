'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const containerVariants = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 50, opacity: 0 },
};

const spinTransition = {
  repeat: Infinity,
  ease: 'linear',
  duration: 1.5,
};

export default function TransitionIcons() {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed bottom-4 right-4 z-50 flex space-x-3"
    >
      {['spade', 'heart', 'diamond', 'club'].map((type, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={spinTransition}
        >
          <Image
            src={`/assets/suit-${type}-fill.svg`}
            alt={type}
            width={32}
            height={32}
            className="invert"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
