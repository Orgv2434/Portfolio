import { motion } from 'framer-motion';

interface DepthIndicatorProps {
  depth: number;
  currentSection: string;
}

export const DepthIndicator = ({ depth, currentSection }: DepthIndicatorProps) => {
  return (
    <motion.div
      className="fixed top-4 right-4 z-50 glass rounded-2xl p-4 text-white"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: depth > 100 ? 1 : 0, x: depth > 100 ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-sm text-white/70 mb-1">深度</div>
      <div className="text-2xl font-bold" style={{ color: '#00d4ff' }}>
        {depth.toFixed(0)} m
      </div>
      <div className="text-xs text-white/60 mt-2">
        当前区域: {currentSection}
      </div>
    </motion.div>
  );
};
