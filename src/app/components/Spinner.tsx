import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react"; // Import the loader icon from lucide-react
// Import the motion component from framer-motion
const Spinner = ({
  className,
  size = "size-8",
}: {
  className?: string;
  size: string;
}) => {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LoaderCircle className={cn("animate-spin text-stone-300", size)} />
    </motion.div>
  );
};

export default Spinner;
