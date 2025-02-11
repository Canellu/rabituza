import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import useMeasure from 'react-use-measure';

interface AnimateHeightProps {
  isOpen: boolean;
  children: ReactNode;
  openDuration?: number;
  closeDuration?: number;
  className?: string;
  marginBottom?: number;
}

const AnimateHeight = ({
  isOpen,
  children,
  openDuration = 0.4,
  closeDuration = 0.3,
  className = '',
  marginBottom = 0,
}: AnimateHeightProps) => {
  const [ref, bounds] = useMeasure();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
          animate={{
            height: bounds.height,
            opacity: 1,
            marginBottom,
          }}
          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
          transition={{
            duration: isOpen ? openDuration : closeDuration,
            ease: 'easeInOut',
          }}
          className={cn('overflow-hidden w-full', className)}
        >
          <div ref={ref}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimateHeight;
