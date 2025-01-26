import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import useMeasure from 'react-use-measure';

interface AnimateHeightProps {
  isOpen: boolean;
  children: ReactNode;
  openDuration?: number; // Optional custom duration for opening
  closeDuration?: number; // Optional custom duration for closing
}

const AnimateHeight = ({
  isOpen,
  children,
  openDuration = 0.5,
  closeDuration = 0.3,
}: AnimateHeightProps) => {
  const [ref, bounds] = useMeasure();

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{
        height: isOpen ? bounds.height : 0,
      }}
      transition={{
        duration: isOpen ? openDuration : closeDuration,
        ease: 'easeInOut',
      }}
      className="overflow-hidden w-full"
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
};

export default AnimateHeight;
