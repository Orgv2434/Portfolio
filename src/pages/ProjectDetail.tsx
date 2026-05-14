import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { VideoPlayer } from '../components/ProjectDetail/VideoPlayer';
import { ProjectInfo } from '../components/ProjectDetail/ProjectInfo';
import { WaterDroplets } from '../components/WaterDroplets';
import type { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail = ({ project, onBack }: ProjectDetailProps) => {
  return (
    <motion.div
      className="min-h-screen relative z-10 px-4 md:px-8 py-8"
      style={{ background: 'linear-gradient(to bottom, #0a1628 0%, #0d2137 40%, #134b6e 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 水滴效果背景 */}
      <WaterDroplets
        title={project.title}
        subtitle={project.description}
        colors={project.colors}
      />

      {/* 返回按钮 */}
      <motion.button
        className="fixed top-4 left-4 md:left-8 z-50 flex items-center gap-2 px-4 py-2 glass rounded-full text-white/80 hover:text-white transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ArrowLeft size={18} />
        <span>返回首页</span>
      </motion.button>

      {/* 主要内容区域 */}
      <div className="max-w-5xl mx-auto">
        {project.videoPath && (
          <motion.div
            className="my-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <VideoPlayer
              videoPath={project.videoPath}
              colors={project.colors}
              title={project.title}
            />
          </motion.div>
        )}

        <ProjectInfo
          title={project.title}
          description={project.description}
          category={project.category}
          tags={project.tags}
          emoji={project.emoji}
          colors={project.colors}
          details={project.details}
        />
      </div>

      <footer className="py-8 text-center text-white/40 text-sm mt-12">
        <p>© 2024 游戏专业作品集</p>
      </footer>
    </motion.div>
  );
};
