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
  basic: 'rgba(255, 165, 0, 0.6)',
  intermediate: 'rgba(100, 200, 255, 0.6)',
  advanced: 'rgba(255, 100, 200, 0.6)'
};

const levelBorders = {
  basic: '#FFA500',
  intermediate: '#64C8FF',
  advanced: '#FF64C8'
};

export const SkillTree = ({ category, color, nodes, connections = [] }: SkillTreeProps) => {
  const svgWidth = 300;
  const svgHeight = 400;

  return (
    <div className="glass rounded-2xl p-6 backdrop-blur-md overflow-hidden">
      <h4 className="text-lg font-bold mb-4 text-white" style={{ color }}>{category}</h4>

      {/* SVG Canvas for connections */}
      <svg
        width="100%"
        height={svgHeight}
        className="absolute left-0 top-12 pointer-events-none"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <defs>
          <linearGradient id={`gradient-${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.2 }} />
          </linearGradient>
          <filter id={`glow-${category}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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
              d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${(from.y + to.y) / 2 - 20} ${to.x} ${to.y}`}
              stroke={`url(#gradient-${category})`}
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              filter={`url(#glow-${category})`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          );
        })}
      </svg>

      {/* Skill nodes */}
      <div className="relative" style={{ height: svgHeight }}>
        {nodes.map((node, idx) => (
          <motion.div
            key={`node-${idx}`}
            className="absolute flex flex-col items-center cursor-pointer group"
            style={{
              left: `${(node.x / svgWidth) * 100}%`,
              top: `${(node.y / svgHeight) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.15 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-lg"
              style={{
                background: color,
                width: '60px',
                height: '60px',
                left: '-30px',
                top: '-30px',
                opacity: 0.3
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: idx * 0.2
              }}
            />

            {/* Node */}
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 transition-all duration-300"
              style={{
                background: levelColors[node.level],
                borderColor: levelBorders[node.level],
                boxShadow: `0 0 15px ${levelBorders[node.level]}80`
              }}
              whileHover={{
                boxShadow: `0 0 25px ${levelBorders[node.level]}ff`
              }}
            >
              {idx + 1}
            </motion.div>

            {/* Skill name tooltip */}
            <motion.div
              className="absolute top-16 bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none border border-white/20"
              initial={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-semibold text-center">{node.name}</div>
              <div className="text-white/60 text-xs mt-1">
                {node.level === 'basic' && '基础'}
                {node.level === 'intermediate' && '进阶'}
                {node.level === 'advanced' && '高级'}
              </div>
            </motion.div>

            {/* Level indicator */}
            <div className="mt-2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {node.level === 'basic' && '⭐'}
              {node.level === 'intermediate' && '⭐⭐'}
              {node.level === 'advanced' && '⭐⭐⭐'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-white/10 flex gap-3 text-xs justify-center flex-wrap">
        <div className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full border"
            style={{ background: levelColors.basic, borderColor: levelBorders.basic }}
          />
          <span className="text-white/70">基础</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full border"
            style={{ background: levelColors.intermediate, borderColor: levelBorders.intermediate }}
          />
          <span className="text-white/70">进阶</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full border"
            style={{ background: levelColors.advanced, borderColor: levelBorders.advanced }}
          />
          <span className="text-white/70">高级</span>
        </div>
      </div>
    </div>
  );
};
