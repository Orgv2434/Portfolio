import { motion } from 'framer-motion'

type SectionType = 'home' | 'info' | 'featured' | 'planning' | 'technology' | 'ta' | 'ai'

interface SectionProps {
  id: SectionType
  title: string
  children: React.ReactNode
}

export const Section = ({ id, title, children }: SectionProps) => (
  <motion.div
    id={id}
    className="content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
    {children}
  </motion.div>
)
