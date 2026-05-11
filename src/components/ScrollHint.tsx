import { motion } from 'framer-motion';

interface ScrollHintProps {
  visible: boolean;
}

export const ScrollHint = ({ visible }: ScrollHintProps) => {
  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-8 left-0 right-0 z-50 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <motion.p
        className="text-white/60 text-sm font-medium tracking-wider"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        滚动鼠标来和我一起下潜 🌊
      </motion.p>
      <motion.div
        className="flex justify-center mt-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          className="w-6 h-6 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};
