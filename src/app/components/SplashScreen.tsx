'use client';

import { motion } from 'framer-motion';
import { Rabbit } from 'lucide-react';
import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950 min-h-[100dvh]"
    >
      <div className="flex flex-col items-center justify-center pb-52">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="size-24 rounded-2xl bg-gradient-to-b from-lime-300 via-primary to-lime-700 flex items-center justify-center">
            <Rabbit className="text-stone-900 size-12" />
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 text-3xl font-bold text-stone-200"
        >
          Rabituza
        </motion.h1>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
