import { easeInOut } from 'framer-motion';

export const CARD_ANIMATION_CONFIG = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, scale: 0.8, y: 10 },
  transition: { duration: 0.3, ease: easeInOut },
};

export const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easeInOut },
  },
};

export const STAGGER_CONTAINER_CONFIG = {
  initial: 'hidden',
  animate: 'visible',
  variants: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};
