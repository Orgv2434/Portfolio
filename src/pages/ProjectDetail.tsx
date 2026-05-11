import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { VideoPlayer } from '../components/ProjectDetail/VideoPlayer';
import { ProjectInfo } from '../components/ProjectDetail/ProjectInfo';
import { WaterDroplets } from '../components/WaterDroplets';

interface Project {
  id: string;
  title: string;
  description: string;
  category?: string;
  tags: string[];
  emoji: string;
  colors: string[];
  videoPath?: string;
  details?: {
    role?: string;
    engine?: string;
    tools?: string[];
    achievements?: string[];
    demoUrl?: string;
    githubUrl?: string;
    documentUrl?: string;
    overview?: string;
    story?: string;
    features?: string[];
    techDetails?: string[];
  };
}

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail = ({ project, onBack }: ProjectDetailProps) => {
  return (
    <motion.div
      className="min-h-screen"
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
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 glass rounded-full text-gray-700 hover:text-gray-900 transition"
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

      {/* 视频播放器 */}
      {project.videoPath && (
        <VideoPlayer
          videoPath={project.videoPath}
          colors={project.colors}
          title={project.title}
        />
      )}

      {/* 项目信息 */}
      <ProjectInfo
        title={project.title}
        description={project.description}
        category={project.category}
        tags={project.tags}
        emoji={project.emoji}
        colors={project.colors}
        details={project.details}
      />

      {/* 页脚 */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© 2024 游戏专业作品集</p>
      </footer>
    </motion.div>
  );
};
