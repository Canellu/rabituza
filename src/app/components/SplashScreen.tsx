'use client';

import { easeInOut, easeOut, motion } from 'framer-motion';
import { Rabbit } from 'lucide-react';
import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 1, ease: easeOut }}
      className="fixed inset-0 flex items-center justify-center bg-stone-50 dark:bg-stone-900 min-h-[100dvh] z-[999]"
    >
      <div className="flex flex-col items-center justify-center pb-52">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: easeInOut }}
        >
          <div className="size-24 rounded-2xl bg-gradient-to-b from-emerald-300 via-primary to-emerald-700 flex items-center justify-center">
            <Rabbit className="text-stone-900 size-12" />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: easeInOut }}
          className="mt-5 text-3xl font-bold text-stone-800 dark:text-stone-300"
        >
          Rabituza
        </motion.h1>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
