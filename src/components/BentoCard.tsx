import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  emoji: string
  colors: string[]
  category?: string
  isLarge?: boolean
  videoPath?: string
  details?: {
    role?: string
    engine?: string
    tools?: string[]
    achievements?: string[]
    demoUrl?: string
    githubUrl?: string
    documentUrl?: string
    overview?: string
    story?: string
    features?: string[]
    techDetails?: string[]
  }
  skills?: string[]
  topics?: string[]
}

interface BentoCardProps {
  project: Project
  isLarge?: boolean
  onClick: (project: Project) => void
}

export const BentoCard = ({ project, isLarge, onClick }: BentoCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`glass bento-item ${isLarge ? 'large' : ''}`}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(project)}
      style={{ padding: '1.5rem' }}
    >
      <div
        className={`bento-image ${isLarge ? 'bento-image-large' : 'bento-image-normal'}`}
        style={{
          background: `linear-gradient(135deg, ${project.colors[0]}, ${project.colors[1]})`,
        }}
      >
        {project.emoji}
      </div>
      <h3 className="bento-title">{project.title}</h3>
      <p className="bento-description">{project.description}</p>
      <div className="bento-tags">
        {project.tags.map((tag, idx) => (
          <span key={idx} className="bento-tag">{tag}</span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="flex items-center gap-1 mt-2 text-blue-500 text-sm"
      >
        <span>了解更多</span>
        <ExternalLink size={14} />
      </motion.div>
    </motion.div>
  )
}
