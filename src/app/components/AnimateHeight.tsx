import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
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
  const [overflow, setOverflow] = useState<'hidden' | 'visible'>('hidden');

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{
            height: 0,
            opacity: 0,
            marginTop: 0,
            marginBottom: 0,
          }}
          animate={{
            height: bounds.height,
            opacity: 1,
            marginBottom,
            marginTop: 6,
          }}
          exit={{
            height: 0,
            opacity: 0,
            marginTop: 0,
            marginBottom: 0,
          }}
          transition={{
            duration: isOpen ? openDuration : closeDuration,
            ease: 'easeInOut',
          }}
          onAnimationComplete={() => setOverflow(isOpen ? 'visible' : 'hidden')}
          style={{ overflow: overflow }}
          className={cn('w-full', className)}
        >
          <div ref={ref}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimateHeight;
