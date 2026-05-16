import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  FolderOpen,
  Star,
  PenTool,
  Palette,
  Brain,
  Github as GithubIcon,
  Mail,
  Linkedin,
  type LucideIcon
} from 'lucide-react'
import data from '../projects.json'
import { ProjectDetail } from './pages/ProjectDetail'
const WaterDroplets = lazy(() => import('./components/WaterDroplets').then(m => ({ default: m.WaterDroplets })))
import { SparklingWater } from './components/SparklingWater'
import { DepthIndicator } from './components/DepthIndicator'
import { ScrollHint } from './components/ScrollHint'
import { BentoCard } from './components/BentoCard'
import { SkeletonCard } from './components/SkeletonCard'
import { SkillGrid } from './components/SkillGrid'
import { SECTION_PALETTES, SECTION_IDS, type SectionType } from './sectionPalettes'
import type { Project } from './types'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const SECTION_ICONS: Record<SectionType, LucideIcon> = {
  home: Home,
  info: FolderOpen,
  featured: Star,
  planning: PenTool,
  ta: Palette,
  ai: Brain,
}

const SECTION_LABELS: Record<SectionType, string> = {
  home: '首页',
  info: '信息页',
  featured: '项目视频',
  planning: '策划能力',
  ta: 'TA & 美术',
  ai: 'AI 应用',
}

const navItems = SECTION_IDS.map((id) => ({
  id,
  icon: SECTION_ICONS[id],
  label: SECTION_LABELS[id],
}))

function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('home')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeProjectSection, setActiveProjectSection] = useState<SectionType>('home')
  const [depth, setDepth] = useState(0)
  const [showScrollHint, setShowScrollHint] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  
  // 滚动状态管理
  const [isAtTop, setIsAtTop] = useState(true)           // 是否在顶部
  const [showSparkling, setShowSparkling] = useState(false)    // 是否显示SparklingWater动效
  const [isReversed, setIsReversed] = useState(false)          // 动效是否翻转
  const [sparkleTransition, setSparkleTransition] = useState<{
    from: SectionType
    to: SectionType
  }>({ from: 'home', to: 'info' })
  
  // 上一次滚动位置，用于判断滚动方向（必须用 ref，避免每次 render 新建对象导致重复绑定 scroll）
  const lastScrollYRef = useRef(0)
  /** 从信息区上滑回首页的转场冷却，避免橡皮筋/多帧重复触发 */
  const lastHomePullTransitionAtRef = useRef(0)
  /** 首页下滑进入信息页的转场冷却与锁 */
  const lastInfoEnterTransitionAtRef = useRef(0)
  const infoEnterTransitionLockRef = useRef(false)
  const infoEnterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const SPARKLE_TRANSITION_MS = 1200
  const activeSectionRef = useRef<SectionType>(activeSection)
  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  // 返回触发标记（布尔信号，替代原 returnToSectionRef 的 true as any 类型 hack）
  const isReturnPendingRef = useRef(false)
  // 保存返回的具体 scrollY 位置（不仅是 section，还要记录确切位置）
  const returnToScrollYRef = useRef<number>(0)
  // 返回跳转冷却锁：跳转期间禁止 scroll 事件触发转场动画
  const isReturningRef = useRef(false)

  useEffect(() => {
    // 禁用浏览器自动恢复 scroll 位置，避免 DOM 切换时位置乱跳
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    // 等一帧确保 DOM 已绘制，保留入场动效但移除 1.5s 硬编码等待
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsLoading(false))
    })
    return () => {}
  }, [])

  // 监听项目详情页关闭，执行返回滚动（只依赖 selectedProject，避免 activeProjectSection 变化误触发）
  useEffect(() => {
    if (selectedProject === null && isReturnPendingRef.current) {
      isReturnPendingRef.current = false
      const targetY = returnToScrollYRef.current

      // 用双 rAF 确保 React DOM 已真正 paint 完毕再滚动
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 多次滚动确保浏览器自动恢复无法覆盖
          window.scrollTo(0, targetY)
          requestAnimationFrame(() => {
            window.scrollTo(0, targetY)
            requestAnimationFrame(() => {
              window.scrollTo(0, targetY)
            })
          })
          // scroll 事件是异步派发的，600ms 后解锁确保所有 scroll 事件已被锁屏蔽
          setTimeout(() => {
            isReturningRef.current = false
          }, 600)
        })
      })
    }
  }, [selectedProject])

  useEffect(() => {
    const handleScroll = () => {
      // 返回跳转期间，忽略 scroll 事件，防止误触转场动画
      // 但仍然更新 lastScrollYRef，避免之后方向判断错乱
      if (isReturningRef.current) {
        lastScrollYRef.current = window.scrollY
        return
      }

      const scrollY = window.scrollY
      const newDepth = scrollY * 3
      setDepth(newDepth)

      const prevScrollY = lastScrollYRef.current
      const isScrollingUp = scrollY < prevScrollY
      lastScrollYRef.current = scrollY

      const currentAtTop = scrollY < 50
      // 更新顶部状态
      setIsAtTop(currentAtTop)
      
      const infoEl = document.getElementById('info')
      const infoTop = infoEl?.offsetTop
      if (infoTop != null && infoTop > 0) {
        const showSidebarThresholdPx = infoTop - 80
        if (scrollY >= showSidebarThresholdPx) {
          setShowScrollHint(false)
          setShowSidebar(true)
        } else {
          setShowScrollHint(scrollY < infoTop - 150)
          setShowSidebar(false)
        }

        // 仅在「信息区顶缘附近」继续上滑时回到首页；避免在首页长屏中段上滑时误触 scrollTo(0)
        const now = Date.now()
        const pullCooldownOk = now - lastHomePullTransitionAtRef.current > 1000
        const prevNearInfoTop =
          prevScrollY >= infoTop - 48 && prevScrollY <= infoTop + 72
        const nowLeavingInfoBand =
          scrollY >= infoTop - 88 && scrollY < infoTop - 16
        const leavingInfoTowardHome =
          pullCooldownOk &&
          !infoEnterTransitionLockRef.current &&
          isScrollingUp &&
          prevNearInfoTop &&
          nowLeavingInfoBand
        if (leavingInfoTowardHome) {
          lastHomePullTransitionAtRef.current = now
          activeSectionRef.current = 'home'
          setActiveSection('home')
          setIsReversed(true)
          setSparkleTransition({ from: 'info', to: 'home' })
          setShowSparkling(true)
          setShowSidebar(false)
          setTimeout(() => setShowSparkling(false), SPARKLE_TRANSITION_MS)
          window.scrollTo({ top: 0, behavior: 'smooth' })
          lastScrollYRef.current = scrollY
          return
        }

        // 在首页区域（尚未进入信息区锚点）任意一次向下滚动即触发正向转场，不必滚到信息区门口
        const enterCooldownOk = now - lastInfoEnterTransitionAtRef.current > SPARKLE_TRANSITION_MS
        const stillBeforeInfoAnchor = scrollY < infoTop - 8
        const scrolledDownByWheel = scrollY > prevScrollY
        const homeToInfoDown =
          enterCooldownOk &&
          now - lastHomePullTransitionAtRef.current > 400 &&
          !infoEnterTransitionLockRef.current &&
          scrolledDownByWheel &&
          stillBeforeInfoAnchor
        if (homeToInfoDown) {
          infoEnterTransitionLockRef.current = true
          setIsReversed(false)
          setSparkleTransition({ from: 'home', to: 'info' })
          setShowSparkling(true)
          document.documentElement.style.overflow = 'hidden'
          if (infoEnterTimeoutRef.current) clearTimeout(infoEnterTimeoutRef.current)
          infoEnterTimeoutRef.current = window.setTimeout(() => {
            infoEnterTimeoutRef.current = null
            const info = document.getElementById('info')
            const top = info?.offsetTop ?? 0
            window.scrollTo({ top, behavior: 'auto' })
            setShowSparkling(false)
            activeSectionRef.current = 'info'
            setActiveSection('info')
            lastScrollYRef.current = top
            document.documentElement.style.overflow = ''
            infoEnterTransitionLockRef.current = false
            // 冷却从「落地」算起，避免 scrollTo 后同一帧/紧随其后的滚动再次触发第二次进信息页转场
            lastInfoEnterTransitionAtRef.current = Date.now()
          }, SPARKLE_TRANSITION_MS)
          lastScrollYRef.current = scrollY
          return
        }
      } else {
        setShowScrollHint(scrollY < 120)
        setShowSidebar(false)
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
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (infoEnterTimeoutRef.current) {
        clearTimeout(infoEnterTimeoutRef.current)
        infoEnterTimeoutRef.current = null
      }
      document.documentElement.style.overflow = ''
      infoEnterTransitionLockRef.current = false
    }
  }, [])

  // 键盘导航：方向键切换区块
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) return
      const sections = [...SECTION_IDS] as SectionType[]
      const currentIdx = sections.indexOf(activeSection)
      if (e.key === 'ArrowDown' && currentIdx < sections.length - 1) {
        document.getElementById(sections[currentIdx + 1])?.scrollIntoView({ behavior: 'smooth' })
      } else if (e.key === 'ArrowUp' && currentIdx > 0) {
        document.getElementById(sections[currentIdx - 1])?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSection, selectedProject])

  const getCurrentSectionName = useCallback(() => {
    const names: Record<SectionType, string> = {
      home: '海面',
      info: '浅海',
      featured: '珊瑚礁',
      planning: '深海平原',
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

  const handleProjectClick = (project: Project, section?: string) => {
    if (project.externalUrl) {
      window.open(project.externalUrl, '_blank', 'noopener,noreferrer')
      return
    }

    showToast(`已打开项目: ${project.title}`, 'info')

    // 如果传递了section参数，直接使用；否则用检测的值
    const targetSection = section ? (section as SectionType) : activeSectionRef.current

    // **务必在 scrollTo(0,0) 之前保存位置**
    const currentScrollY = window.scrollY
    returnToScrollYRef.current = currentScrollY

    setActiveProjectSection(targetSection)
    setSelectedProject(project)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    // 立即锁定，阻止 React 重渲染期间的 scroll 事件触发转场动画
    isReturningRef.current = true
    // 强制停止正在播放的转场动画
    setShowSparkling(false)
    if (infoEnterTimeoutRef.current) {
      clearTimeout(infoEnterTimeoutRef.current)
      infoEnterTimeoutRef.current = null
    }
    infoEnterTransitionLockRef.current = false
    document.documentElement.style.overflow = ''
    // 重置两个转场冷却，防止 scroll 解锁后立即误触转场动画
    lastInfoEnterTransitionAtRef.current = Date.now()
    lastHomePullTransitionAtRef.current = Date.now()
    // 不再依赖 activeProjectSection，直接用保存的 scrollY
    isReturnPendingRef.current = true
    setSelectedProject(null)
  }

  // 如果选中了项目，显示项目详情页
  if (selectedProject) {
    const sectionNames: Record<SectionType, string> = {
      home: '首页',
      info: '浅海',
      featured: '珊瑚礁',
      planning: '深海平原',
      ta: '深渊',
      ai: '海沟'
    }
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={handleBack}
        returnToSection={sectionNames[activeProjectSection]}
      />
    )
  }

  return (
    <div className="app-container">
      {/* 简约渐变背景 - 始终显示 */}
      <div 
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(to bottom, #87ceeb 0%, #5bb8e8 20%, #1565c0 60%, #0a1628 100%)',
          zIndex: -1
        }}
      />
      
      {/* WaterDroplets 背景：转场时关闭，避免与 SparklingWater 的入场/本层退场叠成「两段动效」 */}
      <AnimatePresence>
        {isAtTop && !showSparkling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={null}>
              <WaterDroplets
                title="Nanako's Profile"
                subtitle=""
                colors={["#87ceeb", "#5bb8e8", "#1565c0", "#0a1628"]}
              />
            </Suspense>
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
              paletteFrom={SECTION_PALETTES[sparkleTransition.from]}
              paletteTo={SECTION_PALETTES[sparkleTransition.to]}
              durationMs={SPARKLE_TRANSITION_MS}
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
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'linear-gradient(to bottom, #87ceeb 0%, #5bb8e8 30%, #1565c0 70%, #0a1628 100%)' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="absolute bottom-1/4 text-white/60">正在下潜...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 移动端侧边栏遮罩 */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* 移动端汉堡按钮 */}
      {showSidebar && (
        <button
          className="fixed bottom-6 right-6 z-50 md:hidden w-12 h-12 glass rounded-full flex items-center justify-center text-white shadow-lg text-xl"
          onClick={() => setShowMobileSidebar(v => !v)}
          aria-label="打开导航"
        >
          {showMobileSidebar ? '✕' : '☰'}
        </button>
      )}

      <motion.aside
        className={`sidebar md:translate-x-0 md:opacity-100 transition-transform ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
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
                const prevSec = activeSectionRef.current
                setActiveSection(item.id)

                if (item.id === 'home') {
                  // 与 scroll 里读取的 ref 同步，避免 smooth 滚顶过程中仍被视为「非首页」
                  activeSectionRef.current = 'home'
                  setIsReversed(true)
                  setSparkleTransition({ from: prevSec, to: 'home' })
                  setShowSparkling(true)
                  setShowSidebar(false)
                  setShowMobileSidebar(false)
                  setTimeout(() => setShowSparkling(false), SPARKLE_TRANSITION_MS)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                } else {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setShowMobileSidebar(false)
                }

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

        <>
          <motion.div
            key="home"
            id="home"
            className="waterfall-section waterfall-section--home flex flex-col items-center justify-center"
            initial={false}
            animate={{ opacity: depth > 200 ? 1 : 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-center px-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4"
                style={{ textShadow: '0 0 40px rgba(0,212,255,0.8)' }}>
                {data.profile.name}
              </h1>
              <p className="text-xl text-white/70 mb-8">{data.profile.title}</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {data.profile.tags.map((tag, idx) => (
                  <span key={idx}
                    className="px-4 py-2 rounded-full text-sm text-white/80 border border-white/20"
                    style={{ background: 'rgba(0,212,255,0.1)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            key="info"
            id="info"
            className="waterfall-section"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>🐠 浅海 - 信息页</h2>
            
            <div className="glass rounded-3xl p-8 mb-8 backdrop-blur-md">
              <h3 className="text-xl font-bold mb-6 text-white/90">关于我</h3>
              {data.profile.intro.split('\n').map((line, idx) => (
                <p key={idx} className="text-white/80 leading-relaxed text-lg mb-2 last:mb-0">{line}</p>
              ))}
            </div>

            <div className="glass rounded-3xl p-8 mb-8 backdrop-blur-md">
              <h3 className="text-xl font-bold mb-6 text-white/90">核心能力</h3>
              <div className="space-y-4">
                {data.profile.abilities.map((group, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-2">
                    <span className="text-white/50 text-sm w-24 shrink-0">{group.category}</span>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-8 mb-8 backdrop-blur-md">
              <h3 className="text-xl font-bold mb-6 text-white/90">个人信息</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-white/80 leading-relaxed">姓名：{data.profile.name}</p>
                  <p className="text-white/80 leading-relaxed mt-2">专业：{data.profile.major}</p>
                  <p className="text-white/80 leading-relaxed mt-2">学历：{data.profile.education}</p>
                </div>
                <div>
                  <p className="text-white/80 leading-relaxed">邮箱：{data.profile.email}</p>
                  {data.profile.phone && <p className="text-white/80 leading-relaxed mt-2">电话：{data.profile.phone}</p>}
                  <p className="text-white/80 leading-relaxed mt-2">所在地：{data.profile.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            key="featured"
            id="featured"
            className="waterfall-section"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>🪸 珊瑚礁 - 项目视频</h2>
            <div className="bento-grid">
              {isLoading ? (
                <>
                  <SkeletonCard isLarge />
                  <SkeletonCard isLarge />
                  <SkeletonCard isLarge />
                </>
              ) : (
                data.projects.featured.map((project) => (
                  <BentoCard onClick={handleProjectClick} key={project.id} project={project} isLarge={project.isLarge} section="featured" />
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            key="planning"
            id="planning"
            className="waterfall-section"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>🦑 深海平原 - 策划能力</h2>
            <div className="bento-grid">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                data.projects.planning.map((project) => (
                  <BentoCard onClick={handleProjectClick} key={project.id} project={project} section="planning" />
                ))
              )}
            </div>
            <SkillGrid skills={data.skills.planning} emoji="📋" />
          </motion.div>

          <motion.div
            key="ta"
            id="ta"
            className="waterfall-section"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>🕳️ 深渊 - TA & 美术技术</h2>
            <div className="bento-grid">
              {isLoading ? (
                <SkeletonCard isLarge />
              ) : (
                data.projects.ta.map((project) => (
                  <BentoCard onClick={handleProjectClick} key={project.id} project={project} isLarge section="ta" />
                ))
              )}
            </div>
            <SkillGrid skills={data.skills.ta} emoji="🎨" />
          </motion.div>

          <motion.div
            key="ai"
            id="ai"
            className="waterfall-section"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>🌀 海沟 - AI 应用</h2>
            <div className="bento-grid">
              {isLoading ? (
                <SkeletonCard isLarge />
              ) : (
                <BentoCard onClick={handleProjectClick} key="ai-integration" project={data.projects.ai[0]} isLarge section="ai" />
              )}
            </div>
            <SkillGrid skills={data.skills.ai} emoji="🧠" />
          </motion.div>
        </>

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