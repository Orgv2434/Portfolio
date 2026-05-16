import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { Project } from '../types'

interface BentoCardProps {
  project: Project
  isLarge?: boolean
  section?: string
  onClick: (project: Project, section?: string) => void
}

export const BentoCard = ({ project, isLarge, section, onClick }: BentoCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // 有静态封面图时直接使用，无需截帧
    if (project.coverImage) return
    if (!project.videoPath || project.videoPath.startsWith('http')) return

    let cancelled = false
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = project.videoPath

    const extractThumbnail = () => {
      if (cancelled) return
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          setThumbnailUrl(canvas.toDataURL('image/jpeg', 0.8))
        }
      } catch (error) {
        console.error('Failed to extract thumbnail:', error)
      }
    }

    video.addEventListener('loadeddata', extractThumbnail, { once: true })
    video.load()

    return () => {
      cancelled = true
      video.removeEventListener('loadeddata', extractThumbnail)
      video.src = ''
    }
  }, [project.videoPath, project.coverImage])

  return (
    <motion.div
      className={`glass bento-item ${isLarge ? 'large' : ''} focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none`}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(project, section)}
      tabIndex={0}
      role="button"
      aria-label={`打开项目：${project.title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(project, section) }}
      style={{ padding: '1.5rem' }}
    >
      <div
        className={`bento-image ${isLarge ? 'bento-image-large' : 'bento-image-normal'} relative overflow-hidden`}
        style={{
          background: project.coverImage
            ? `url(${project.coverImage}) center / cover`
            : thumbnailUrl
            ? `url(${thumbnailUrl}) center / cover`
            : `linear-gradient(135deg, ${project.colors[0]}, ${project.colors[1]})`,
        }}
      >
        {!project.coverImage && !thumbnailUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            {project.emoji}
          </div>
        )}
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
