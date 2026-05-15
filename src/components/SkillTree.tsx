import { motion } from 'framer-motion';

interface SkillNode {
  name: string;
  level: 'basic' | 'intermediate' | 'advanced';
  x: number;
  y: number;
}

interface SkillTreeProps {
  category: string;
  color: string;
  nodes: SkillNode[];
  connections?: [number, number][];
}

const levelColors = {
  basic: 'rgba(255, 165, 0, 0.15)',
  intermediate: 'rgba(100, 200, 255, 0.15)',
  advanced: 'rgba(255, 100, 200, 0.15)'
};

const levelBorders = {
  basic: '#FFA500',
  intermediate: '#64C8FF',
  advanced: '#FF64C8'
};

const levelBg = {
  basic: 'rgba(255, 165, 0, 0.25)',
  intermediate: 'rgba(100, 200, 255, 0.25)',
  advanced: 'rgba(255, 100, 200, 0.25)'
};

export const SkillTree = ({ category, color, nodes, connections = [] }: SkillTreeProps) => {
  const svgWidth = 320;
  const svgHeight = 500;

  return (
    <div className="glass rounded-3xl p-8 backdrop-blur-md overflow-hidden border border-white/10">
      {/* Category Title with glow */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
        />
        <h4 className="text-xl font-bold text-white">{category}</h4>
      </div>

      {/* SVG Canvas for connections */}
      <svg
        width="100%"
        height={svgHeight}
        className="absolute left-0 top-24 pointer-events-none"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <defs>
          <linearGradient id={`gradient-${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.1 }} />
          </linearGradient>
          <filter id={`glow-${category}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Draw connections */}
        {connections.map((connection, idx) => {
          const [fromIdx, toIdx] = connection;
          const from = nodes[fromIdx];
          const to = nodes[toIdx];
          if (!from || !to) return null;

          return (
            <motion.path
              key={`connection-${idx}`}
              d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${(from.y + to.y) / 2} ${to.x} ${to.y}`}
              stroke={`url(#gradient-${category})`}
              strokeWidth="3"
              fill="none"
              filter={`url(#glow-${category})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Skill nodes */}
      <div className="relative" style={{ height: svgHeight }}>
        {nodes.map((node, idx) => (
          <motion.div
            key={`node-${idx}`}
            className="absolute flex flex-col items-center group"
            style={{
              left: `${(node.x / svgWidth) * 100}%`,
              top: `${(node.y / svgHeight) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.12, duration: 0.6, ease: 'easeOut' }}
          >
            {/* Large glow background */}
            <motion.div
              className="absolute rounded-full blur-2xl"
              style={{
                background: color,
                width: '80px',
                height: '80px',
                left: '-40px',
                top: '-40px',
                zIndex: -1
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: idx * 0.2
              }}
            />

            {/* Node circle */}
            <motion.div
              className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all duration-300 backdrop-blur-sm"
              style={{
                background: levelBg[node.level],
                borderColor: levelBorders[node.level],
                boxShadow: `0 0 20px ${levelBorders[node.level]}60, inset 0 0 20px ${color}20`
              }}
              whileHover={{
                scale: 1.2,
                boxShadow: `0 0 30px ${levelBorders[node.level]}ff, inset 0 0 20px ${color}40`
              }}
            >
              {/* Inner circle */}
              <div
                className="absolute w-12 h-12 rounded-full border-2"
                style={{
                  borderColor: levelBorders[node.level],
                  background: `radial-gradient(circle, ${levelBorders[node.level]}30, transparent)`,
                  boxShadow: `inset 0 0 10px ${levelBorders[node.level]}40`
                }}
              />

              {/* Skill name inside node */}
              <div className="absolute text-center z-20 px-2">
                <div className="text-white font-bold text-xs leading-tight">{node.name}</div>
              </div>
            </motion.div>

            {/* Stars below node */}
            <motion.div
              className="mt-3 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.12 + 0.3 }}
            >
              {node.level === 'basic' && '⭐'}
              {node.level === 'intermediate' && '⭐⭐'}
              {node.level === 'advanced' && '⭐⭐⭐'}
            </motion.div>

            {/* Level label tooltip on hover */}
            <motion.div
              className="absolute -bottom-8 text-white text-xs font-semibold whitespace-nowrap"
              initial={{ opacity: 0, y: -5 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                color: levelBorders[node.level]
              }}
            >
              {node.level === 'basic' && '基础技能'}
              {node.level === 'intermediate' && '进阶技能'}
              {node.level === 'advanced' && '高级技能'}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-2 pt-6 border-t border-white/10">
        <div className="text-xs text-white/60 mb-3 font-semibold">技能等级</div>
        <div className="flex gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border-2"
              style={{ borderColor: levelBorders.basic, background: levelBg.basic }}
            />
            <span className="text-white/70">基础技能</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border-2"
              style={{ borderColor: levelBorders.intermediate, background: levelBg.intermediate }}
            />
            <span className="text-white/70">进阶技能</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border-2"
              style={{ borderColor: levelBorders.advanced, background: levelBg.advanced }}
            />
            <span className="text-white/70">高级技能</span>
          </div>
        </div>
      </div>
    </div>
  );
};
