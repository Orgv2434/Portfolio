# 作品集网站整体开发 Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **遵守规范：** 执行本计划的所有任务前，必须先阅读项目根目录的 `AGENTS.md`，其中的规则高于本计划的任何描述。

**Goal：** 将作品集网站从"开发中"状态推进到可上线、可维护的生产就绪状态。

**Architecture：** 6 个独立子代理分别从架构、耦合、交互、Bug、维护性、部署 6 个视角完成审阅后，综合输出本 Roadmap。计划分为 5 个阶段（A→E），每阶段独立可交付、不破坏现有运行功能。

**Tech Stack：** React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Three.js · lucide-react

---

## 整合审阅摘要（6视角共识）

| 来源 | 最高优先级问题 |
|------|----------------|
| 架构合理性 | App.tsx 688行上帝组件；react-router-dom 安装未用；双 projects.json |
| 代码耦合 | 转场锁链竞态；returnToSectionRef 类型 hack；window 污染；SECTION_IDS 隐式契约 |
| 交互体验 | home section 内容为空；1.5s 硬编码加载；移动端无适配 |
| Bug 隐患 | BentoCard 视频元素内存泄漏；卸载后 setState；isReturningRef 竞态 |
| 后期维护 | ta section 显示错误数据；个人信息硬编码在两处；technology 手动索引 |
| 上线部署 | **本地视频文件未入 git（阻断上线）**；Three.js 160KB gzip；缺 OG meta tags |

---

## 文件变更地图

### Phase A 涉及文件
- `projects.json` — 修改：新增 ta 项目数组、coverImage 字段、个人详细信息
- `public/projects.json` — 删除（解决二义性）
- `src/App.tsx` — 修改：读取 profile 个人信息、ta section 用正确数据、返回逻辑修复
- `src/components/BentoCard.tsx` — 修改：视频内存泄漏修复，用 coverImage 替代截帧
- `src/components/ProjectDetail/VideoPlayer.tsx` — 修改：window 污染修复

### Phase B 涉及文件
- `src/App.tsx` — 修改：home section 填充内容、loading 延迟优化
- `src/index.css` — 可能修改：home section 文字样式
- `src/components/ProjectDetail/VideoPlayer.tsx` — 修改：bilibili iframe 嵌入

### Phase C 涉及文件
- `src/App.tsx` — 修改：键盘导航、侧边栏移动端适配
- `src/components/ScrollHint.tsx` — 修改：补充引导文字
- `src/components/WaterDroplets.tsx` — 修改：Three.js lazy import

### Phase D 涉及文件
- `src/App.tsx` — 修改：isReturningRef 解锁机制、isReturnPendingRef 替代类型 hack
- `src/sectionPalettes.ts` — 修改：getTargetPaletteFromScroll 边界保护
- `src/constants/sectionConfig.ts` — 新建：navItems 从 SECTION_IDS 派生

### Phase E 涉及文件
- `index.html` — 修改：OG meta tags
- `vercel.json` — 新建：部署配置
- `package.json` — 修改：移除 react-router-dom

---

## Phase A — 基础整改（阻断上线的问题优先）

> **目标：** 解决数据错误、内存泄漏、类型 hack，消除上线阻断问题。每个 task 独立提交。

---

### Task A1：将本地视频路径替换为外部链接（阻断上线）

**背景：** 本地 MP4 文件未被 git 追踪，部署到 Vercel/Netlify 后视频完全缺失。tassos 项目已有外链先例（`"videoPath": "https://b23.tv/KhSZjHl"`），其他项目应同步改为外链。

**Files:**
- Modify: `projects.json`

- [ ] **Step 1：** 在 projects.json 中，将所有使用本地路径（`/videos/xxx.mp4`）的 `videoPath` 字段，替换为对应视频在 bilibili/YouTube 的外链 URL。若尚未上传，先将对应字段设为 `null` 或删除该字段，避免 VideoPlayer 渲染失败。

- [ ] **Step 2：** 启动 `npm run dev`，检查所有有视频的 BentoCard 在悬停时不报错，VideoPlayer 打开后显示"点击打开视频"按钮（外链模式）而非空白。

- [ ] **Step 3：** 提交
```bash
git add projects.json
git commit -m "fix: 将本地视频路径替换为外部链接，解决部署后视频缺失问题"
```

---

### Task A2：删除 public/projects.json，统一数据源

**背景：** 根目录 `projects.json` 是编译期 import 的 source of truth，`public/projects.json` 是游离副本，两者异步是维护陷阱。

**Files:**
- Delete: `public/projects.json`

- [ ] **Step 1：** 确认 `src/App.tsx` 使用 `import data from '../projects.json'` 而非 `fetch('/projects.json')`（当前确实如此）。

- [ ] **Step 2：** 删除 `public/projects.json`。

- [ ] **Step 3：** 运行 `npm run build` 确认编译无报错。

- [ ] **Step 4：** 提交
```bash
git add -A
git commit -m "chore: 删除 public/projects.json，统一数据源为根目录 projects.json"
```

---

### Task A3：修复 ta section 显示错误项目数据

**背景：** `App.tsx` 第634行 `data.projects.technology[1]` 被复用到 ta section，TA 项目卡片显示的是技术项目。

**Files:**
- Modify: `projects.json`
- Modify: `src/App.tsx`

- [ ] **Step 1：** 在 `projects.json` 的 `projects` 对象中，新增 `ta` 数组，添加至少一个 TA 相关项目。结构与其他项目相同：

```json
"ta": [
  {
    "id": "ta-visual-effects",
    "title": "TA & 视觉效果",
    "description": "Shader 开发、视觉效果实现，展示 TA 工作流",
    "tags": ["UE5", "Shader", "VFX", "Niagara"],
    "emoji": "🎨",
    "colors": ["#12081c", "#4a1a6e"],
    "isLarge": true,
    "category": "TA & 美术技术",
    "details": {
      "role": "技术美术",
      "engine": "Unreal Engine 5",
      "tools": ["Shader Graph", "Niagara", "Houdini"],
      "overview": "负责项目的视觉效果实现，包括自定义 Shader 和粒子系统"
    }
  }
]
```

- [ ] **Step 2：** 在 `src/App.tsx` 找到 ta section（搜索 `id="ta"`），将：
```tsx
<BentoCard onClick={handleProjectClick} key="visual-effects" project={data.projects.technology[1]} isLarge section="ta" />
```
改为：
```tsx
{data.projects.ta.map((project) => (
  <BentoCard onClick={handleProjectClick} key={project.id} project={project} isLarge section="ta" />
))}
```

- [ ] **Step 3：** 浏览器验证 ta section 显示正确内容，technology section 不受影响。

- [ ] **Step 4：** 提交
```bash
git add projects.json src/App.tsx
git commit -m "fix: ta section 从 projects.json 读取正确数据，不再复用 technology 项目"
```

---

### Task A4：将个人信息统一到 projects.json

**背景：** 姓名/手机/邮件/所在地硬编码在 `App.tsx` 第524-542行，而社交链接从 JSON 读。两套数据源必然漏改。

**Files:**
- Modify: `projects.json`
- Modify: `src/App.tsx`

- [ ] **Step 1：** 在 `projects.json` 的 `profile` 对象中，新增个人信息字段（用真实信息替换示例值）：
```json
"profile": {
  "name": "Nanako",
  "title": "游戏专业学生",
  "subtitle": "技术策划 | UE客户端 | Unity客户端",
  "phone": "你的真实手机号",
  "location": "你的城市",
  "education": "本科",
  "major": "游戏设计与开发",
  "email": "你的真实邮箱",
  "tags": [...]
}
```

- [ ] **Step 2：** 在 `src/App.tsx` 中，找到硬编码的个人信息区块（约第520-545行），替换为读取 `data.profile.*`。

- [ ] **Step 3：** 浏览器确认信息页显示正确，无多余硬编码文字。

- [ ] **Step 4：** 提交
```bash
git add projects.json src/App.tsx
git commit -m "fix: 个人信息统一从 projects.json 读取，消除硬编码"
```

---

### Task A5：修复 BentoCard 视频元素内存泄漏

**背景：** `BentoCard.tsx` 创建的隐藏 `video` 元素从不释放，长期使用内存持续上升；组件卸载后 `setThumbnailUrl` 仍可能被调用。

**Files:**
- Modify: `src/components/BentoCard.tsx`

- [ ] **Step 1：** 将 BentoCard.tsx 中现有的缩略图提取 useEffect 替换为以下版本（含 cleanup + cancelled 标志）：

```typescript
useEffect(() => {
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
}, [project.videoPath])
```

注意新增了 `project.videoPath.startsWith('http')` 判断：外链视频跳过截帧（CORS 会失败）。

- [ ] **Step 2：** 浏览器验证现有本地视频卡片缩略图仍正常显示（若已替换为外链则跳过），卡片反复挂载/卸载时无报错。

- [ ] **Step 3：** 提交
```bash
git add src/components/BentoCard.tsx
git commit -m "fix: BentoCard 视频缩略图提取添加 cleanup，解决内存泄漏和卸载后 setState"
```

---

### Task A6：修复 VideoPlayer window 对象污染

**背景：** `VideoPlayer.tsx` 将 timer ID 存储在 `window.videoControlTimer`，多实例时互相覆盖。

**Files:**
- Modify: `src/components/ProjectDetail/VideoPlayer.tsx`

- [ ] **Step 1：** 在 `VideoPlayer` 组件顶部添加 ref：
```typescript
const controlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
```

- [ ] **Step 2：** 将 `handleMouseMove` 函数中所有 `window.videoControlTimer` 替换为 `controlTimerRef.current`：
```typescript
const handleMouseMove = () => {
  setShowControls(true)
  if (controlTimerRef.current) clearTimeout(controlTimerRef.current)
  controlTimerRef.current = setTimeout(() => setShowControls(false), 3000)
}
```

- [ ] **Step 3：** 将 `useEffect`（第27-30行，依赖 `[isPlaying]` 的那个）也改用 ref：
```typescript
useEffect(() => {
  if (controlTimerRef.current) clearTimeout(controlTimerRef.current)
  controlTimerRef.current = setTimeout(() => setShowControls(false), 3000)
  return () => {
    if (controlTimerRef.current) clearTimeout(controlTimerRef.current)
  }
}, [isPlaying])
```

- [ ] **Step 4：** 删除组件中所有 `(window as unknown as { videoControlTimer?: number })` 相关代码，确认无遗留。

- [ ] **Step 5：** 浏览器验证视频播放控制栏正常显示/隐藏。

- [ ] **Step 6：** 提交
```bash
git add src/components/ProjectDetail/VideoPlayer.tsx
git commit -m "fix: VideoPlayer timer 改用组件内 ref，消除 window 对象污染"
```

---

### Task A7：修复 returnToSectionRef 类型 hack

**背景：** `handleBack` 中 `returnToSectionRef.current = true as any` 将 boolean 写入 `SectionType | null` 类型的 ref，语义混乱。

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1：** 在 `App.tsx` 现有 ref 声明区（约第78-82行）新增一个专用布尔 ref：
```typescript
const isReturnPendingRef = useRef(false)
```

- [ ] **Step 2：** 在 `handleBack` 函数中，将 `returnToSectionRef.current = true as any` 替换为：
```typescript
isReturnPendingRef.current = true
```

- [ ] **Step 3：** 在监听 `selectedProject` 的 `useEffect` 中（约第94-118行），将判断条件从：
```typescript
if (selectedProject === null && returnToSectionRef.current) {
  returnToSectionRef.current = false
```
改为：
```typescript
if (selectedProject === null && isReturnPendingRef.current) {
  isReturnPendingRef.current = false
```

- [ ] **Step 4：** `returnToSectionRef` 声明改为更准确的类型（若已无其他用途可直接删除，仅保留 `returnToScrollYRef`）：
```typescript
// 删除：const returnToSectionRef = useRef<SectionType | null>(null)
// returnToScrollYRef 保留，仍用于记录滚动位置
```

- [ ] **Step 5：** 运行 `npm run build` 确认无 TypeScript 错误。

- [ ] **Step 6：** 浏览器验证：打开项目详情 → 返回，确认滚动位置精确恢复。

- [ ] **Step 7：** 提交
```bash
git add src/App.tsx
git commit -m "fix: 用 isReturnPendingRef 替代 returnToSectionRef 类型 hack"
```

---

## Phase B — 功能完善

> **目标：** 补全内容缺失，让作品集在内容层面完整可呈现。

---

### Task B1：填充 home section 内容

**背景：** `id="home"` 的 `motion.div` JSX 体完全为空，首屏除背景动效外无任何信息。这是第一印象区，对 HR 至关重要。

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1：** 在 `App.tsx` 找到 `key="home"` 的 `motion.div`（约第479行），在其内部添加：

```tsx
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
    transition={{ duration: 1, delay: 0.5 }}
  >
    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4"
      style={{ textShadow: '0 0 40px rgba(0,212,255,0.8)' }}>
      {data.profile.name}
    </h1>
    <p className="text-xl text-white/70 mb-8">{data.profile.title}</p>
    <div className="flex flex-wrap gap-3 justify-center">
      {data.profile.tags.slice(0, 4).map((tag, idx) => (
        <span key={idx}
          className="px-4 py-2 rounded-full text-sm text-white/80 border border-white/20"
          style={{ background: 'rgba(0,212,255,0.1)' }}>
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
</motion.div>
```

- [ ] **Step 2：** 浏览器验证首页显示姓名和标签，背景动效（WaterDroplets）不受影响。

- [ ] **Step 3：** 提交
```bash
git add src/App.tsx
git commit -m "feat: home section 填充姓名和定位标签内容"
```

---

### Task B2：优化加载延迟（1.5s → 实际就绪）

**背景：** `projects.json` 是静态 import，数据加载是同步的，没有理由等待 1500ms。硬编码延迟影响跳出率。

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1：** 在 `App.tsx` 找到（约第87-91行）：
```typescript
const timer = setTimeout(() => setIsLoading(false), 1500)
return () => clearTimeout(timer)
```
替换为：
```typescript
// 等一帧确保 DOM 已绘制，保留入场动效
requestAnimationFrame(() => {
  requestAnimationFrame(() => setIsLoading(false))
})
```

- [ ] **Step 2：** 浏览器验证加载动画仍然播放（不是直接跳过），但持续时间大幅缩短至 <200ms。

- [ ] **Step 3：** 提交
```bash
git add src/App.tsx
git commit -m "fix: 加载等待改为 rAF 实际就绪检测，移除 1.5s 硬编码延迟"
```

---

### Task B3：bilibili 视频 iframe 嵌入

**背景：** 外链视频目前只显示"点击打开视频"按钮，用户体验中断。bilibili 支持 `player.bilibili.com/player.html?bvid=BVxxx` 嵌入。

**Files:**
- Modify: `src/components/ProjectDetail/VideoPlayer.tsx`

- [ ] **Step 1：** 在 `VideoPlayer.tsx` 的 `isExternalLink` 判断分支中，添加 bilibili BV 号提取工具函数：

```typescript
function extractBvid(url: string): string | null {
  const match = url.match(/(?:BV|bv)([a-zA-Z0-9]+)/) 
    ?? url.match(/b23\.tv\/([a-zA-Z0-9]+)/)
  return match ? match[0] : null
}
```

- [ ] **Step 2：** 将外链分支的渲染逻辑改为：

```typescript
if (isExternalLink) {
  const bvid = extractBvid(videoPath)
  const embedUrl = bvid
    ? `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&autoplay=0`
    : null

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: `linear-gradient(135deg, ${colors[0]}80, ${colors[1]}80)` }}
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allow="fullscreen"
          title={title}
        />
      ) : (
        // 原有按钮 UI 保留为后备
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center px-4">{title}</h1>
          <a href={videoPath} target="_blank" rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition">
            点击打开视频
          </a>
        </div>
      )}
    </motion.div>
  )
}
```

- [ ] **Step 3：** 用 tassos 项目（已有 b23.tv 链接）测试，确认视频内嵌播放而非跳转。

- [ ] **Step 4：** 提交
```bash
git add src/components/ProjectDetail/VideoPlayer.tsx
git commit -m "feat: bilibili 外链改用 iframe 嵌入播放，保留非 B 站链接的按钮后备"
```

---

### Task B4：technology section 改用 map 渲染

**背景：** `App.tsx` 中 technology section 手动使用 `[0]`/`[1]` 索引，新增项目时必须改代码。

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1：** 在 `App.tsx` 找到 technology section（约第612-618行），将手动索引：
```tsx
<BentoCard ... project={data.projects.technology[0]} isLarge ... />
<BentoCard ... project={data.projects.technology[1]} ... />
```
替换为：
```tsx
{data.projects.technology.map((project, idx) => (
  <BentoCard
    onClick={handleProjectClick}
    key={project.id}
    project={project}
    isLarge={idx === 0}
    section="technology"
  />
))}
```

- [ ] **Step 2：** 浏览器验证 technology section 渲染项目数量与 JSON 一致，第一个项目仍为大卡片。

- [ ] **Step 3：** 提交
```bash
git add src/App.tsx
git commit -m "refactor: technology section 改用 map 渲染，新增项目无需改代码"
```

---

## Phase C — 交互动效优化

> **目标：** 提升使用细节，完善移动端和键盘支持。

---

### Task C1：移动端侧边栏响应式适配

**背景：** 侧边栏固定宽度在移动端覆盖主内容，无法关闭，HR 用手机查看时体验损坏。

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1：** 在 App 组件 state 中添加移动端侧边栏开关：
```typescript
const [showMobileSidebar, setShowMobileSidebar] = useState(false)
```

- [ ] **Step 2：** 侧边栏的 `motion.aside` 添加移动端类名。将固定 `left-0` 改为：
```tsx
<motion.aside
  className={`sidebar fixed top-0 z-40 h-full transition-transform
    md:left-0 md:translate-x-0
    ${showMobileSidebar ? 'left-0 translate-x-0' : '-left-full'}`}
  ...
>
```

- [ ] **Step 3：** 在主内容区添加移动端汉堡按钮（只在 `showSidebar && !showMobileSidebar` 时显示）：
```tsx
{showSidebar && (
  <button
    className="fixed bottom-6 right-6 z-50 md:hidden w-12 h-12 glass rounded-full
      flex items-center justify-center text-white shadow-lg"
    onClick={() => setShowMobileSidebar(v => !v)}
    aria-label="打开导航"
  >
    ☰
  </button>
)}
```

- [ ] **Step 4：** 点击遮罩关闭侧边栏：
```tsx
{showMobileSidebar && (
  <div
    className="fixed inset-0 z-30 bg-black/40 md:hidden"
    onClick={() => setShowMobileSidebar(false)}
  />
)}
```

- [ ] **Step 5：** 在移动设备模拟（Chrome DevTools）中验证：侧边栏默认隐藏，点击汉堡按钮展开，点击遮罩关闭，导航项点击后自动关闭侧边栏（在每个导航按钮的 `onClick` 末尾加 `setShowMobileSidebar(false)`）。

- [ ] **Step 6：** 提交
```bash
git add src/App.tsx
git commit -m "feat: 侧边栏移动端适配，添加汉堡按钮和遮罩关闭"
```

---

### Task C2：键盘导航支持

**背景：** 方向键无法切换区块，BentoCard 无法键盘激活。

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/BentoCard.tsx`

- [ ] **Step 1：** 在 `App.tsx` 的主 `useEffect` 区或新建一个 `useEffect`，添加全局 keydown 监听：
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const sections: SectionType[] = ['home', 'info', 'featured', 'planning', 'technology', 'ta', 'ai']
    const currentIdx = sections.indexOf(activeSection)
    if (e.key === 'ArrowDown' && currentIdx < sections.length - 1) {
      document.getElementById(sections[currentIdx + 1])?.scrollIntoView({ behavior: 'smooth' })
    } else if (e.key === 'ArrowUp' && currentIdx > 0) {
      document.getElementById(sections[currentIdx - 1])?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [activeSection])
```

- [ ] **Step 2：** 在 `BentoCard.tsx` 的 `motion.div` 添加键盘可访问性：
```tsx
<motion.div
  ...
  tabIndex={0}
  role="button"
  aria-label={`打开项目：${project.title}`}
  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(project, section) }}
>
```

- [ ] **Step 3：** 确认 Tab 键可在侧边栏导航按钮之间移动，每个按钮有 `focus-visible:ring-2 focus-visible:ring-cyan-400` 样式（在对应 CSS 或 Tailwind 类中添加）。

- [ ] **Step 4：** 提交
```bash
git add src/App.tsx src/components/BentoCard.tsx
git commit -m "feat: 添加方向键区块导航和 BentoCard 键盘激活支持"
```

---

### Task C3：ScrollHint 补充引导文字

**Background:** ScrollHint 当前只有箭头，缺乏对海洋主题的语境说明。

**Files:**
- Modify: `src/components/ScrollHint.tsx`

- [ ] **Step 1：** 读取 `src/components/ScrollHint.tsx` 现有实现。

- [ ] **Step 2：** 在箭头下方或旁边添加文字，如"向下探索深海"，使用 Tailwind `text-white/60 text-sm` 样式。

- [ ] **Step 3：** 浏览器首页验证 ScrollHint 可见且文字清晰。

- [ ] **Step 4：** 提交
```bash
git add src/components/ScrollHint.tsx
git commit -m "feat: ScrollHint 补充探索引导文字，强化海洋主题"
```

---

### Task C4：Three.js 懒加载

**背景：** `WaterDroplets.tsx` 全量 import Three.js，首屏 bundle 增加约 160KB（gzip）。该组件只在 `isAtTop` 时显示，可懒加载。

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1：** 在 `App.tsx` 顶部，将 `WaterDroplets` 的直接 import 改为懒加载：
```typescript
import { lazy, Suspense } from 'react'
const WaterDroplets = lazy(() => import('./components/WaterDroplets'))
```
删除原有的 `import { WaterDroplets } from './components/WaterDroplets'`。

- [ ] **Step 2：** 用 `<Suspense fallback={null}>` 包裹 `WaterDroplets` 的使用处：
```tsx
<Suspense fallback={null}>
  <WaterDroplets ... />
</Suspense>
```

- [ ] **Step 3：** 运行 `npm run build`，在构建产物中确认 Three.js 被拆分到单独 chunk（Vite 会自动代码分割）。

- [ ] **Step 4：** 浏览器验证水滴背景动效仍正常，首次加载时可能有短暂延迟（可接受）。

- [ ] **Step 5：** 提交
```bash
git add src/App.tsx
git commit -m "perf: WaterDroplets 改为懒加载，Three.js 从首屏 bundle 中分离"
```

---

## Phase D — 全局 Bug 修复

> **目标：** 系统性清除残余隐患，加固架构脆弱点。

---

### Task D1：优化 isReturningRef 解锁时机

**背景：** 当前用 `setTimeout(600ms)` 解锁，存在定时不精确的竞态风险。改为在最后一个 rAF 回调中解锁，确保时序精确。

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1：** 找到 `selectedProject` 变化的 `useEffect`（约94-118行），将末尾的 `setTimeout` 解锁：
```typescript
setTimeout(() => {
  isReturningRef.current = false
}, 600)
```
移入最后一个 `rAF` 回调内：
```typescript
requestAnimationFrame(() => {
  window.scrollTo(0, targetY)
  requestAnimationFrame(() => {
    window.scrollTo(0, targetY)
    requestAnimationFrame(() => {
      window.scrollTo(0, targetY)
      isReturningRef.current = false  // 在最后一帧渲染后解锁
    })
  })
})
```
删除原有的 `setTimeout(..., 600)` 行。

- [ ] **Step 2：** 浏览器测试：打开项目详情，返回，快速再次点击项目，确认无竞态（返回动画完整，不会出现二次跳转异常）。

- [ ] **Step 3：** 提交
```bash
git add src/App.tsx
git commit -m "fix: isReturningRef 解锁改为 rAF 时序，消除 600ms 竞态风险"
```

---

### Task D2：getTargetPaletteFromScroll 边界保护

**Background:** 当某个 section DOM 不存在时 `tops[i] = 0`，导致颜色插值定位错误。

**Files:**
- Modify: `src/sectionPalettes.ts`

- [ ] **Step 1：** 在 `getTargetPaletteFromScroll` 函数开头修改 tops 计算，添加 null 降级：
```typescript
export function getTargetPaletteFromScroll(scrollY: number): string[] {
  const rawTops = SECTION_IDS.map((id) => document.getElementById(id)?.offsetTop ?? null)
  // 若任何 section 不存在，降级返回 home 调色板
  if (rawTops.some((t) => t === null)) return [...SECTION_PALETTES.home]
  const tops = rawTops as number[]
  // ... 原有逻辑，将 tops 替换为 tops（变量名已统一）
```

- [ ] **Step 2：** 运行 `npm run build` 确认 TypeScript 无报错。

- [ ] **Step 3：** 提交
```bash
git add src/sectionPalettes.ts
git commit -m "fix: getTargetPaletteFromScroll 添加 DOM 缺失时的降级保护"
```

---

### Task D3：navItems 从 SECTION_IDS 派生，消除隐式契约

**背景：** `SECTION_IDS` 和 `navItems` 是两套独立声明，增减区块时必须同步更新两处，否则静默失效。

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1：** 在 `App.tsx` 中，在 `navItems` 声明旁新增区块配置映射：
```typescript
import { SECTION_IDS } from './sectionPalettes'

const SECTION_ICONS: Record<SectionType, React.ComponentType<{ className?: string }>> = {
  home: Home,
  info: FolderOpen,
  featured: Star,
  planning: PenTool,
  technology: Code,
  ta: Palette,
  ai: Brain,
}

const SECTION_LABELS: Record<SectionType, string> = {
  home: '首页',
  info: '信息页',
  featured: '项目视频',
  planning: '策划能力',
  technology: '技术开发',
  ta: 'TA & 美术',
  ai: 'AI 应用',
}

const navItems = SECTION_IDS.map((id) => ({
  id,
  icon: SECTION_ICONS[id],
  label: SECTION_LABELS[id],
}))
```

- [ ] **Step 2：** 删除原有手动声明的 `navItems` 数组。

- [ ] **Step 3：** 运行 `npm run build`，确认 TypeScript 编译 `Record<SectionType, ...>` 会在 `SECTION_IDS` 新增成员时强制要求两个 Record 也同步添加。

- [ ] **Step 4：** 浏览器验证侧边栏导航项顺序和图标不变。

- [ ] **Step 5：** 提交
```bash
git add src/App.tsx
git commit -m "refactor: navItems 从 SECTION_IDS 派生，增删区块只需更新一处"
```

---

## Phase E — 上线验收

> **目标：** 完成上线前的最后检查，确保生产环境可用。

---

### Task E1：添加 OG meta tags

**Files:**
- Modify: `index.html`

- [ ] **Step 1：** 在 `index.html` 的 `<head>` 中添加：
```html
<meta name="description" content="Nanako 的游戏专业作品集 - 技术策划 / UE客户端 / Unity客户端" />
<meta property="og:title" content="Nanako's Game Portfolio" />
<meta property="og:description" content="游戏策划 | UE5客户端 | Unity | TA | AI应用" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://你的域名/covers/dialog-box.png" />
<meta name="twitter:card" content="summary_large_image" />
```
（部署后将 `og:image` URL 改为真实域名）

- [ ] **Step 2：** 提交
```bash
git add index.html
git commit -m "chore: 添加 OG meta tags 和社交分享卡片配置"
```

---

### Task E2：创建 vercel.json 部署配置

**Files:**
- Create: `vercel.json`

- [ ] **Step 1：** 在项目根目录创建 `vercel.json`：
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/covers/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

- [ ] **Step 2：** 提交
```bash
git add vercel.json
git commit -m "chore: 添加 vercel.json 部署配置和静态资产缓存策略"
```

---

### Task E3：移除未使用的 react-router-dom 依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1：** 运行：
```bash
npm uninstall react-router-dom
```

- [ ] **Step 2：** 运行 `npm run build` 确认无报错（搜索代码确认无任何 `react-router-dom` import）。

- [ ] **Step 3：** 提交
```bash
git add package.json package-lock.json
git commit -m "chore: 移除未使用的 react-router-dom 依赖，减小 bundle ~25KB"
```

---

### Task E4：生产构建验收清单

**Files:**（只读，不修改）

- [ ] **Step 1：** 运行 `npm run build`，确认：
  - TypeScript 编译零错误
  - 无 lint 警告
  - 输出 bundle 大小（运行 `npx vite-bundle-visualizer` 或查看 dist 目录）

- [ ] **Step 2：** 运行 `npm run preview`，在预览服务器中执行以下验证：
  - [ ] 首页加载 → WaterDroplets 背景显示
  - [ ] 向下滚动 → SparklingWater 气泡转场入信息区
  - [ ] 侧边栏出现后导航到各区块
  - [ ] 点击 BentoCard 项目卡片 → 进入 ProjectDetail
  - [ ] ProjectDetail 中视频播放（外链显示 iframe 或按钮）
  - [ ] 返回按钮 → 精确回到原卡片位置
  - [ ] 移动端视图（Chrome DevTools 375px）→ 侧边栏默认隐藏，汉堡按钮可用

- [ ] **Step 3：** 提交最终验收记录
```bash
git commit --allow-empty -m "chore: Phase E 上线验收通过，生产构建确认"
```

---

### Task E5：部署到 Vercel

- [ ] **Step 1：** 确认 GitHub 仓库已推送最新 main 分支。

- [ ] **Step 2：** 在 Vercel Dashboard 导入仓库，配置：
  - Framework Preset: `Vite`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

- [ ] **Step 3：** 等待部署完成，访问生产 URL，重复 Task E4 Step 2 的验收清单。

- [ ] **Step 4：** 更新 `index.html` 中 `og:image` 为真实生产域名并重新部署。

---

## 附录：各阶段里程碑

| 阶段 | 完成标志 | 预估时间 |
|------|----------|----------|
| A 基础整改 | npm run build 零错误，ta section 显示正确内容 | 3-4 小时 |
| B 功能完善 | home section 有内容，bilibili 视频可内嵌 | 2-3 小时 |
| C 交互动效 | 移动端可用，方向键可导航 | 2-3 小时 |
| D Bug 修复 | 无内存泄漏警告，无 TypeScript 类型错误 | 1-2 小时 |
| E 上线验收 | Vercel 部署成功，所有验收项通过 | 1 小时 |

**总预估：** 约 9-13 小时（分多次会话完成）

---

## 规范合规说明

本 Roadmap 所有任务均遵守 `AGENTS.md` 的以下规定：
- 每个 task 独立 commit，不搭便车
- 保护区（滚动转场锁链）未被修改，仅在 Task A7 中修复 ref 语义
- 无新增重型依赖（Task E3 反而移除了一个）
- 所有修改均在验证后提交
