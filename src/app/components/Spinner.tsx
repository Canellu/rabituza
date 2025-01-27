import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react'; // Import the loader icon from lucide-react
// Import the motion component from framer-motion
const Spinner = ({
  className,
  size = 'size-8',
  color = 'text-stone-400',
}: {
  className?: string;
  size?: string;
  color?: string;
}) => {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LoaderCircle className={cn('animate-spin', size, color)} />
    </motion.div>
  );
};

export default Spinner;
