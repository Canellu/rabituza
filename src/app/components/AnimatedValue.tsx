'use client';

import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedValue = ({ value }: { value: number | string }) => {
  const [displayValue, setDisplayValue] = useState(value);

  const spring = useSpring(typeof value === 'number' ? value : 0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });
  const displayNumber = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (typeof value === 'number') {
      spring.set(value);
    }
    setDisplayValue(value);
  }, [spring, value]);

  return (
    <AnimatePresence mode="wait">
      {typeof displayValue === 'number' ? (
        <motion.span
          key="number"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {displayNumber}
        </motion.span>
      ) : (
        <motion.span
          key="string"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {displayValue}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default AnimatedValue;
