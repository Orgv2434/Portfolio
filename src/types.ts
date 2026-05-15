export interface ProjectDetails {
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

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  emoji: string
  colors: string[]
  category?: string
  isLarge?: boolean
  videoPath?: string
  coverPath?: string
  details?: ProjectDetails
  skills?: string[]
  topics?: string[]
}
