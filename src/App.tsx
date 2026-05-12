import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  FolderOpen, 
  Star,
  PenTool, 
  Code, 
  Palette, 
  Brain, 
  BookOpen, 
  ExternalLink,
  Github as GithubIcon,
  Mail,
  Linkedin
} from 'lucide-react'
import data from '../projects.json'
import { ProjectDetail } from './pages/ProjectDetail'
import { WaterDroplets } from './components/WaterDroplets'
import { SparklingWater } from './components/SparklingWater'
import { DepthIndicator } from './components/DepthIndicator'
import { ScrollHint } from './components/ScrollHint'
import { BentoCard } from './components/BentoCard'
import { SkeletonCard } from './components/SkeletonCard'
import { Section } from './components/Section'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

type SectionType = 'home' | 'info' | 'featured' | 'planning' | 'technology' | 'ta' | 'ai'

const sectionDepthMap: Record<SectionType, number> = {
  home: 0,
  info: 500,
  featured: 1500,
  planning: 2500,
  technology: 3500,
  ta: 4500,
  ai: 6000
}

const navItems = [
  { id: 'home' as SectionType, icon: Home, label: '首页' },
  { id: 'info' as SectionType, icon: FolderOpen, label: '信息页' },
  { id: 'featured' as SectionType, icon: Star, label: '明星项目' },
  { id: 'planning' as SectionType, icon: PenTool, label: '策划能力' },
  { id: 'technology' as SectionType, icon: Code, label: '技术开发' },
  { id: 'ta' as SectionType, icon: Palette, label: 'TA & 美术' },
  { id: 'ai' as SectionType, icon: Brain, label: 'AI 应用' },
]

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  emoji: string;
  colors: string[];
  category?: string;
  isLarge?: boolean;
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
  skills?: string[];
  topics?: string[];
}

function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('home')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [depth, setDepth] = useState(0)
  const [showScrollHint, setShowScrollHint] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  
  // 滚动状态管理
  const [isAtTop, setIsAtTop] = useState(true)           // 是否在顶部
  const [showSparkling, setShowSparkling] = useState(false)    // 是否显示SparklingWater动效
  const [isReversed, setIsReversed] = useState(false)          // 动效是否翻转
  
  // 上一次滚动位置，用于判断滚动方向
  const lastScrollY = useCallback(() => {
    let value = window.scrollY
    return {
      get: () => value,
      set: (newVal: number) => { value = newVal }
    }
  }, [])()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const newDepth = scrollY * 3
      setDepth(newDepth)
      
      // 判断是否在顶部（滚动距离小于50px认为在顶部）
      const currentAtTop = scrollY < 50
      const wasAtTop = isAtTop
      
      // 判断滚动方向
      const isScrollingDown = scrollY > lastScrollY.get()
      const isScrollingUp = scrollY < lastScrollY.get()
      
      // 更新上一次滚动位置
      lastScrollY.set(scrollY)
      
      // 更新顶部状态
      setIsAtTop(currentAtTop)
      
      // 滚动提示和侧边栏显示逻辑
      if (newDepth > 100) {
        setShowScrollHint(false)
        setShowSidebar(true)
      } else {
        setShowScrollHint(true)
        setShowSidebar(false)
      }

      // 禁止通过上滑手势返回到首页
      // 当用户不在首页且向上滚动时，阻止滚动到首页区域
      if (activeSection !== 'home' && isScrollingUp && newDepth < sectionDepthMap.info) {
        // 限制滚动位置，禁止回到首页
        window.scrollTo({ top: sectionDepthMap.info, behavior: 'auto' })
        return
      }

      const sections: SectionType[] = ['home', 'info', 'featured', 'planning', 'technology', 'ta', 'ai']
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 200) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAtTop])

  const getCurrentSectionName = useCallback(() => {
    const names: Record<SectionType, string> = {
      home: '海面',
      info: '浅海',
      featured: '珊瑚礁',
      planning: '深海平原',
      technology: '热泉喷口',
      ta: '深渊',
      ai: '海沟'
    }
    return names[activeSection]
  }, [activeSection])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const handleProjectClick = (project: Project) => {
    showToast(`已打开项目: ${project.title}`, 'info')
    setSelectedProject(project)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setSelectedProject(null)
  }

  // 如果选中了项目，显示项目详情页
  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onBack={handleBack} 
      />
    )
  }

  return (
    <div className="app-container">
      {/* 简约渐变背景 - 始终显示 */}
      <div 
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(to bottom, #0a1628 0%, #0d2137 30%, #134b6e 60%, #1a6f9a 100%)',
          zIndex: -1
        }}
      />
      
      {/* WaterDroplets泡泡背景 - 仅在顶部显示 */}
      <AnimatePresence>
        {isAtTop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WaterDroplets 
              title="Nanako's Profile"
              subtitle=""
              colors={["#0a1628", "#0d2137", "#134b6e", "#1a6f9a"]}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* SparklingWater转场动效 - 点击首页时显示 */}
      <AnimatePresence>
      
        {showSparkling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50"
          >
            <SparklingWater 
              reversed={isReversed} 
              visible={showSparkling}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 深度指示器 */}
      <DepthIndicator depth={depth} currentSection={getCurrentSectionName()} />
      
      {/* 滚动提示 */}
      <ScrollHint visible={showScrollHint} />
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            ></motion.div>
            <p className="absolute bottom-1/4 text-gray-500">加载中...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside 
        className="sidebar"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: showSidebar ? 1 : 0, x: showSidebar ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: showSidebar ? 'auto' : 'none' }}
      >
        <div className="sidebar-header">
          <h1 className="sidebar-title">游戏专业</h1>
          <p className="sidebar-subtitle">{data.profile.title}</p>
        </div>

        <div className="sidebar-info">
          <p>{data.profile.subtitle}</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {data.profile.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(item.id)
                
                // 点击首页时触发转场动效
                if (item.id === 'home') {
                  setIsReversed(true)
                  setShowSparkling(true)
                  setTimeout(() => setShowSparkling(false), 1200)
                }
                
                window.scrollTo({ top: 0, behavior: 'auto' })
                showToast(`切换到${item.label}`, 'info')
              }}
            >
              <item.icon className="nav-icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4">
          <div className="flex justify-center gap-4">
            <a href={data.social.github} target="_blank" rel="noopener noreferrer" className="social-link">
              <GithubIcon size={20} />
            </a>
            <a href={`mailto:${data.social.email}`} className="social-link">
              <Mail size={20} />
            </a>
            <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </motion.aside>

      <main className="main">
        {/* 全屏欢迎区域 */}
        <motion.div
          className="hero-section"
          initial={{ opacity: 1 }}
          animate={{ opacity: depth > 500 ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-content">
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div
              key="home"
              id="home"
              className="waterfall-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: depth > 200 ? 1 : 0, y: depth > 200 ? 0 : 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>🌊 海面 - 首页</h2>
              
              <h2 className="text-2xl font-bold mb-6 text-white/90" style={{ textShadow: '0 0 10px rgba(0, 212, 255, 0.3)' }}>🌟 明星项目预览</h2>
              <div className="bento-grid">
                {isLoading ? (
                  <>
                    <SkeletonCard isLarge />
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : (
                  data.projects.featured.slice(0, 3).map((project) => (
                    <BentoCard onClick={handleProjectClick} key={project.id} project={project} isLarge={project.isLarge} />
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'info' && (
            <motion.div
              key="info"
              id="info"
              className="waterfall-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>🐠 浅海 - 信息页</h2>
              
              {/* 个人简介 */}
              <div className="glass rounded-3xl p-8 mb-8 backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-white/90">关于我</h3>
                <p className="text-white/80 leading-relaxed text-lg">
                  我是一名游戏专业学生，具备策划、技术、TA 的全面能力。
                  求职意向优先级：技术策划 → UE 客户端程序 → Unity 客户端程序。
                  拥有多个完整项目经验，从策划到技术实现全流程参与。
                </p>
              </div>

              {/* 核心能力 */}
              <div className="glass rounded-3xl p-8 mb-8 backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-white/90">核心能力</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[...data.skills.planning, ...data.skills.programming, ...data.skills.ta].slice(0, 6).map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-white/10 text-white rounded-full text-sm backdrop-blur-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 个人信息 */}
              <div className="glass rounded-3xl p-8 mb-8 backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-white/90">个人信息</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-white/80 leading-relaxed">
                      姓名：Nanako
                    </p>
                    <p className="text-white/80 leading-relaxed mt-2">
                      专业：游戏设计与开发
                    </p>
                    <p className="text-white/80 leading-relaxed mt-2">
                      学历：本科
                    </p>
                  </div>
                  <div>
                    <p className="text-white/80 leading-relaxed">
                      邮箱：nanako@example.com
                    </p>
                    <p className="text-white/80 leading-relaxed mt-2">
                      电话：123-4567-8900
                    </p>
                    <p className="text-white/80 leading-relaxed mt-2">
                      所在地：北京
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'featured' && (
            <motion.div
              key="featured"
              id="featured"
              className="waterfall-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>⭐ 明星项目</h2>
              <div className="bento-grid">
                {isLoading ? (
                  <>
                    <SkeletonCard isLarge />
                    <SkeletonCard isLarge />
                    <SkeletonCard isLarge />
                  </>
                ) : (
                  data.projects.featured.map((project) => (
                    <BentoCard onClick={handleProjectClick} key={project.id} project={project} isLarge={project.isLarge} />
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'planning' && (
            <motion.div
              key="planning"
              id="planning"
              className="waterfall-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>🪸 珊瑚礁 - 策划能力</h2>
              <div className="bento-grid">
                {isLoading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : (
                  data.projects.planning.map((project) => (
                    <BentoCard onClick={handleProjectClick} key={project.id} project={project} />
                  ))
                )}
              </div>
              <div className="glass rounded-3xl p-8 mt-8 backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-white/90">策划技能</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.skills.planning.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      <span className="text-2xl">📋</span>
                      <span className="font-medium text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'technology' && (
            <motion.div
              key="technology"
              id="technology"
              className="waterfall-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>🦑 深海平原 - 技术开发</h2>
              <div className="bento-grid">
                {isLoading ? (
                  <>
                    <SkeletonCard isLarge />
                    <SkeletonCard />
                  </>
                ) : (
                  <>
                    <BentoCard onClick={handleProjectClick} key="client-dev" project={data.projects.technology[0]} isLarge />
                    <BentoCard onClick={handleProjectClick} key="tech-other" project={data.projects.technology[1]} />
                  </>
                )}
              </div>
              <div className="glass rounded-3xl p-8 mt-8 backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-white/90">编程技能</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.skills.programming.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      <span className="text-2xl">💻</span>
                      <span className="font-medium text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'ta' && (
            <motion.div
              key="ta"
              id="ta"
              className="waterfall-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>🌋 热泉喷口 - TA & 美术技术</h2>
              <div className="bento-grid">
                {isLoading ? (
                  <SkeletonCard isLarge />
                ) : (
                  <BentoCard onClick={handleProjectClick} key="visual-effects" project={data.projects.technology[1]} isLarge />
                )}
              </div>
              <div className="glass rounded-3xl p-8 mt-8 backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-white/90">TA 技能</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.skills.ta.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      <span className="text-2xl">🎨</span>
                      <span className="font-medium text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'ai' && (
            <motion.div
              key="ai"
              id="ai"
              className="waterfall-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>👾 深渊 - AI 应用</h2>
              <div className="bento-grid">
                {isLoading ? (
                  <SkeletonCard isLarge />
                ) : (
                  <BentoCard onClick={handleProjectClick} key="ai-integration" project={data.projects.ai[0]} isLarge />
                )}
              </div>
              <div className="glass rounded-3xl p-8 mt-8 backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-white/90">AI 技能</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.skills.ai.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      <span className="text-2xl">🧠</span>
                      <span className="font-medium text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <footer className="footer mt-16">
          <div className="glass rounded-2xl p-6 backdrop-blur-md">
            <div className="footer-main text-white">🌊 Nanako's Profile</div>
            <div className="footer-sub text-white/60">© 2024 | 高复合型游戏人才</div>
          </div>
        </footer>
      </main>

      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`toast ${toast.type}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App