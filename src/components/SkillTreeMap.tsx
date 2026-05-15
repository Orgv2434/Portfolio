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
  const svgWidth = 1200;
  const svgHeight = 800;
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 中心点
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // 计算分类的位置（围绕中心分布）
  const categoryPositions = categories.map((_, idx) => {
    const angle = (idx / categories.length) * Math.PI * 2;
    const radius = 200;
    return {
      x: centerX + Math.cos(angle - Math.PI / 2) * radius,
      y: centerY + Math.sin(angle - Math.PI / 2) * radius
    };
  });

  // 计算选中分类的技能节点位置（围绕分类节点分布）
  const getSkillPositions = (categoryIdx: number) => {
    const catPos = categoryPositions[categoryIdx];
    const skills = categories[categoryIdx].skills;
    const skillCount = skills.length;

    return skills.map((_, skillIdx) => {
      const angle = (skillIdx / skillCount) * Math.PI * 2;
      const radius = 70;
      return {
        x: catPos.x + Math.cos(angle) * radius,
        y: catPos.y + Math.sin(angle) * radius
      };
    });
  };

  return (
    <div className="glass rounded-3xl p-8 backdrop-blur-md border border-white/10 w-full">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-2">🌳 技能体系树</h3>
        <p className="text-white/60 text-sm">点击分类节点查看对应的技能子树</p>
      </div>

      {/* SVG Canvas for tree connections */}
      <svg
        width="100%"
        height={svgHeight}
        className="mx-auto"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ maxHeight: '800px', border: '2px solid rgba(100, 200, 255, 0.2)', borderRadius: '12px' }}
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
          r="35"
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
          y={centerY + 10}
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
          <motion.g key={`cat-node-${idx}`} style={{ cursor: 'pointer' }}>
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r="32"
              fill={`${categories[idx].color}20`}
              stroke={categories[idx].color}
              strokeWidth="2"
              filter="url(#glow-tree)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + idx * 0.2, duration: 0.6 }}
              onClick={() => setSelectedCategory(selectedCategory === idx ? null : idx)}
              whileHover={{ scale: 1.15 }}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
            <motion.text
              x={pos.x}
              y={pos.y + 6}
              textAnchor="middle"
              fill={categories[idx].color}
              fontSize="18"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + idx * 0.2, duration: 0.5 }}
              onClick={() => setSelectedCategory(selectedCategory === idx ? null : idx)}
              style={{ cursor: 'pointer', pointerEvents: 'auto', userSelect: 'none' }}
            >
              {categories[idx].icon}
            </motion.text>
          </motion.g>
        ))}

        {/* Skill nodes for selected category */}
        <AnimatePresence>
          {selectedCategory !== null && (
            <>
              {/* Branches from category to skills */}
              {getSkillPositions(selectedCategory).map((skillPos, skillIdx) => (
                <motion.line
                  key={`skill-branch-${skillIdx}`}
                  x1={categoryPositions[selectedCategory].x}
                  y1={categoryPositions[selectedCategory].y}
                  x2={skillPos.x}
                  y2={skillPos.y}
                  stroke={categories[selectedCategory].color}
                  strokeWidth="2"
                  opacity="0.5"
                  filter="url(#glow-tree)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: skillIdx * 0.1 }}
                  exit={{ pathLength: 0, transition: { duration: 0.3 } }}
                />
              ))}

              {/* Skill nodes */}
              {getSkillPositions(selectedCategory).map((skillPos, skillIdx) => (
                <motion.g
                  key={`skill-node-${skillIdx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: skillIdx * 0.1 + 0.3,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  <motion.circle
                    cx={skillPos.x}
                    cy={skillPos.y}
                    r="24"
                    fill={`${categories[selectedCategory].color}30`}
                    stroke={categories[selectedCategory].color}
                    strokeWidth="2"
                    filter="url(#glow-tree)"
                    whileHover={{ scale: 1.2, r: 28 }}
                  />
                  <motion.text
                    x={skillPos.x}
                    y={skillPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={categories[selectedCategory].color}
                    fontSize="12"
                    fontWeight="bold"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {skillIdx + 1}
                  </motion.text>
                </motion.g>
              ))}

              {/* Skill labels below SVG */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                {categories[selectedCategory].skills.map((skill, idx) => {
                  const labelY = svgHeight - 80 + (idx % 2) * 35;
                  const labelX = 100 + (idx % 2) * (svgWidth - 200);
                  return (
                    <text
                      key={`label-${idx}`}
                      x={labelX}
                      y={labelY}
                      fill={categories[selectedCategory].color}
                      fontSize="14"
                      fontWeight="600"
                      style={{ pointerEvents: 'none' }}
                    >
                      {idx + 1}. {skill}
                    </text>
                  );
                })}
              </motion.g>
            </>
          )}
        </AnimatePresence>
      </svg>

      {/* Category cards - simplified view */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, idx) => (
          <motion.div
            key={`card-${idx}`}
            className={`p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
              selectedCategory === idx ? 'scale-105' : 'hover:scale-105'
            }`}
            style={{
              background: `${category.color}15`,
              borderColor: selectedCategory === idx ? category.color : `${category.color}40`,
              borderWidth: selectedCategory === idx ? '2px' : '1px',
            }}
            onClick={() => setSelectedCategory(selectedCategory === idx ? null : idx)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{category.icon}</span>
              <h4 className="font-bold text-white text-sm">{category.name}</h4>
            </div>
            <p className="text-white/60 text-xs">{category.skills.length} 项技能</p>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        className="mt-8 pt-8 border-t border-white/10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <p className="text-white/60 text-sm">
          🌳 点击分类节点展开对应的技能子树，技能节点会像树枝一样从分类节点挂出
        </p>
      </motion.div>
    </div>
  );
};
