import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillCategory {
  name: string;
  icon: string;
  color: string;
  skills: string[];
}

interface SkillTreeMapProps {
  categories: SkillCategory[];
}

export const SkillTreeMap = ({ categories }: SkillTreeMapProps) => {
  const svgWidth = 1000;
  const svgHeight = 600;
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 中心点
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // 计算分类的位置（围绕中心分布）
  const categoryPositions = categories.map((_, idx) => {
    const angle = (idx / categories.length) * Math.PI * 2;
    const radius = 180;
    return {
      x: centerX + Math.cos(angle - Math.PI / 2) * radius,
      y: centerY + Math.sin(angle - Math.PI / 2) * radius
    };
  });

  return (
    <div className="glass rounded-3xl p-8 backdrop-blur-md border border-white/10 w-full">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-2">🌳 技能体系树</h3>
        <p className="text-white/60 text-sm">点击分类节点查看对应的技能</p>
      </div>

      {/* SVG Canvas for tree connections */}
      <svg
        width="100%"
        height={svgHeight}
        className="mx-auto pointer-events-none mb-8"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ maxHeight: '600px' }}
      >
        <defs>
          <filter id="glow-tree">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Draw connections from center to categories */}
        {categoryPositions.map((pos, idx) => (
          <motion.line
            key={`branch-${idx}`}
            x1={centerX}
            y1={centerY}
            x2={pos.x}
            y2={pos.y}
            stroke={categories[idx].color}
            strokeWidth="3"
            opacity="0.4"
            filter="url(#glow-tree)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: idx * 0.2 }}
          />
        ))}

        {/* Center node */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="30"
          fill="rgba(100, 200, 255, 0.2)"
          stroke="#64C8FF"
          strokeWidth="2"
          filter="url(#glow-tree)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.text
          x={centerX}
          y={centerY + 8}
          textAnchor="middle"
          fill="#64C8FF"
          fontSize="20"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          技能
        </motion.text>

        {/* Category nodes */}
        {categoryPositions.map((pos, idx) => (
          <motion.g key={`cat-node-${idx}`} style={{ pointerEvents: 'auto' }}>
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r="28"
              fill={`${categories[idx].color}20`}
              stroke={categories[idx].color}
              strokeWidth="2"
              filter="url(#glow-tree)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + idx * 0.2, duration: 0.6 }}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedCategory(selectedCategory === idx ? null : idx)}
              whileHover={{ scale: 1.1 }}
            />
            <motion.text
              x={pos.x}
              y={pos.y + 5}
              textAnchor="middle"
              fill={categories[idx].color}
              fontSize="16"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + idx * 0.2, duration: 0.5 }}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              onClick={() => setSelectedCategory(selectedCategory === idx ? null : idx)}
            >
              {categories[idx].icon}
            </motion.text>
          </motion.g>
        ))}
      </svg>

      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {categories.map((category, idx) => (
          <motion.div
            key={`card-${idx}`}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.5 }}
            onClick={() => setSelectedCategory(selectedCategory === idx ? null : idx)}
          >
            <div
              className={`rounded-2xl p-6 backdrop-blur-sm border-2 transition-all duration-300 ${
                selectedCategory === idx ? 'scale-105 border-opacity-100' : 'hover:scale-105 border-opacity-60'
              }`}
              style={{
                background: `${category.color}15`,
                borderColor: selectedCategory === idx ? category.color : `${category.color}60`,
              }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm"
                  style={{ background: `${category.color}30`, border: `2px solid ${category.color}` }}
                >
                  {category.icon}
                </div>
                <h4 className="text-lg font-bold text-white">{category.name}</h4>
              </div>

              {/* Skills tree within category */}
              <div className="space-y-2">
                {category.skills.map((skill, skillIdx) => (
                  <motion.div
                    key={`skill-${skillIdx}`}
                    className="flex items-center gap-2 group/skill"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (idx * 0.15) + (skillIdx * 0.05), duration: 0.4 }}
                  >
                    {/* Branch connector */}
                    <div
                      className="w-6 h-0.5 group-hover/skill:w-8 transition-all duration-300"
                      style={{ background: `linear-gradient(to right, ${category.color}60, ${category.color}20)` }}
                    />

                    {/* Skill node */}
                    <div
                      className="flex-1 px-3 py-2 rounded-lg text-sm text-white transition-all duration-300 group-hover/skill:scale-105 group-hover/skill:shadow-lg"
                      style={{
                        background: `${category.color}25`,
                        borderLeft: `3px solid ${category.color}`,
                        boxShadow: `inset 0 0 10px ${category.color}10`,
                      }}
                    >
                      {skill}
                    </div>

                    {/* Leaf icon */}
                    <span className="text-sm opacity-0 group-hover/skill:opacity-100 transition-opacity">🍃</span>
                  </motion.div>
                ))}
              </div>

              {/* Count indicator */}
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/60">
                <span>{category.skills.length} 项技能</span>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity }}
                  className="text-lg"
                >
                  ◉
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected category details - Popup view */}
      <AnimatePresence>
        {selectedCategory !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-3xl p-8 backdrop-blur-md border border-white/10 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl backdrop-blur-sm"
                style={{
                  background: `${categories[selectedCategory].color}30`,
                  border: `2px solid ${categories[selectedCategory].color}`
                }}
              >
                {categories[selectedCategory].icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{categories[selectedCategory].name}</h3>
                <p className="text-white/60">共 {categories[selectedCategory].skills.length} 项技能</p>
              </div>
            </div>

            {/* Detailed skills grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories[selectedCategory].skills.map((skill, idx) => (
                <motion.div
                  key={`detail-skill-${idx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  className="p-4 rounded-xl text-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: `${categories[selectedCategory].color}25`,
                    border: `2px solid ${categories[selectedCategory].color}40`,
                  }}
                >
                  <p className="text-white font-semibold text-sm break-words">{skill}</p>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-6 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all duration-300"
            >
              关闭
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        className="mt-8 pt-8 border-t border-white/10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-white/60 text-sm">
          🌳 技能树由根部（中心）分支出各个分类，每个分类又细分为具体的技能节点
        </p>
      </motion.div>
    </div>
  );
};
