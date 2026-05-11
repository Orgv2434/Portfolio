# 游戏专业作品集网站 - 项目文档

---

## 1. 项目概述

### 1.1 项目简介

这是一个游戏专业学生的个人作品集网站，采用现代化的海洋主题设计，展示个人技能、项目经验和知识储备。网站使用 **React 18 + TypeScript + Vite** 技术栈构建，配合 **TailwindCSS** 实现响应式样式，**Framer Motion** 实现流畅动画效果，**Three.js** 实现水滴背景特效。

### 1.2 核心功能

| 功能模块 | 描述 |
|---------|------|
| 沉浸式首页 | 海洋主题设计，带深度指示器 |
| 项目展示 | Bento 卡片布局展示各类项目 |
| 项目详情 | 视频播放器 + 详细项目信息 |
| 平滑滚动 | 流畅的页面导航与过渡动画 |
| 加载动画 | 骨架屏 + 加载指示器 |
| 响应式设计 | 支持桌面和移动端 |

### 1.3 技术栈

| 技术 | 版本 | 用途 |
|-----|------|------|
| React | 18.3.1 | 前端框架 |
| TypeScript | 5.3.3 | 类型安全 |
| Vite | 5.3.1 | 构建工具 |
| TailwindCSS | 3.4.1 | CSS框架 |
| Framer Motion | 11.0.3 | 动画库 |
| Three.js | 0.184.0 | 3D渲染 |
| Lucide React | 0.408.0 | 图标库 |

---

## 2. 项目架构

```
网站/
├── public/                    # 静态资源目录
│   └── videos/               # 视频文件
│       └── trailer.mp4       # 项目演示视频
├── src/                      # 源代码目录
│   ├── components/           # 通用组件
│   │   ├── ProjectDetail/    # 项目详情页组件
│   │   │   ├── VideoPlayer.tsx    # 视频播放器
│   │   │   └── ProjectInfo.tsx    # 项目信息展示
│   │   ├── BentoCard.tsx          # 卡片组件
│   │   ├── DepthIndicator.tsx     # 深度指示器
│   │   ├── ScrollHint.tsx         # 滚动提示
│   │   ├── Section.tsx            # 区域组件
│   │   ├── SkeletonCard.tsx       # 骨架屏卡片
│   │   └── WaterDroplets.tsx      # 水滴背景效果
│   ├── pages/                # 页面组件
│   │   └── ProjectDetail.tsx      # 项目详情页
│   ├── App.tsx               # 主应用组件
│   ├── main.tsx              # 应用入口
│   └── index.css             # 全局样式
├── projects.json             # 项目数据配置
├── package.json              # 依赖配置
├── tailwind.config.js        # TailwindCSS 配置
├── postcss.config.js         # PostCSS 配置
├── tsconfig.json             # TypeScript 配置
└── vite.config.ts            # Vite 配置
```

---

## 3. 文件功能详解

### 3.1 配置文件

#### package.json
- **用途**: 项目依赖管理与脚本配置
- **核心脚本**:
  - `npm run dev` - 启动开发服务器
  - `npm run build` - 构建生产版本
  - `npm run preview` - 预览构建结果
  - `npm run lint` - 代码检查

#### vite.config.ts
- **用途**: Vite 构建工具配置
- **关键配置**: React 插件、路径别名、开发服务器端口

#### tailwind.config.js
- **用途**: TailwindCSS 配置
- **关键配置**: 自定义主题颜色、字体、屏幕断点

#### tsconfig.json
- **用途**: TypeScript 配置
- **关键配置**: 路径别名、严格模式、JSX支持

---

### 3.2 入口文件

#### main.tsx
- **用途**: 应用入口点
- **职责**: 创建 React 根节点，渲染 App 组件

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

### 3.3 主应用组件

#### App.tsx
- **用途**: 主应用组件，包含完整的页面结构和状态管理
- **核心功能**:
  - 滚动监听与深度计算
  - 侧边导航栏
  - 多区域页面切换
  - Toast 消息提示系统
  - 项目详情页路由

#### 状态管理

| 状态 | 类型 | 说明 |
|-----|------|------|
| `activeSection` | SectionType | 当前激活区域 |
| `toasts` | Toast[] | 消息提示列表 |
| `isLoading` | boolean | 加载状态 |
| `selectedProject` | Project \| null | 当前选中项目 |
| `depth` | number | 滚动深度 |
| `showScrollHint` | boolean | 显示滚动提示 |
| `showSidebar` | boolean | 显示侧边栏 |

#### 区域映射

| 区域ID | 名称 | 深度阈值 | 主题描述 |
|-------|------|---------|---------|
| `home` | 海面 | 0 | 个人简介 |
| `featured` | 浅海 | 500 | 明星项目 |
| `planning` | 珊瑚礁 | 1500 | 策划能力 |
| `technology` | 深海平原 | 2500 | 技术开发 |
| `ta` | 热泉喷口 | 3500 | TA & 美术 |
| `ai` | 深渊 | 5000 | AI 应用 |
| `knowledge` | 海沟 | 6000 | 知识储备 |

---

### 3.4 页面组件

#### ProjectDetail.tsx
- **用途**: 项目详情页
- **职责**: 展示项目视频、详细信息、成就等内容
- **Props**:
  - `project`: Project - 项目数据
  - `onBack`: () => void - 返回回调

---

### 3.5 通用组件

#### BentoCard.tsx
- **用途**: 项目卡片组件
- **职责**: 展示项目缩略信息，支持大/小两种尺寸
- **Props**:
  - `project`: Project - 项目数据
  - `isLarge`: boolean - 是否大卡片
  - `onClick`: (project: Project) => void - 点击回调

#### DepthIndicator.tsx
- **用途**: 深度指示器组件
- **职责**: 显示当前滚动深度和所在区域
- **Props**:
  - `depth`: number - 深度值
  - `currentSection`: string - 当前区域名称

#### ScrollHint.tsx
- **用途**: 滚动提示组件
- **职责**: 引导用户滚动页面
- **Props**:
  - `visible`: boolean - 是否显示

#### Section.tsx
- **用途**: 页面区域包装组件
- **职责**: 提供统一的区域动画效果
- **Props**:
  - `id`: SectionType - 区域ID
  - `title`: string - 区域标题
  - `children`: ReactNode - 子内容

#### SkeletonCard.tsx
- **用途**: 骨架屏卡片组件
- **职责**: 加载状态展示
- **Props**:
  - `isLarge`: boolean - 是否大卡片

---

### 3.6 项目详情组件

#### VideoPlayer.tsx
- **用途**: 视频播放器组件
- **职责**: 自定义视频播放控制
- **Props**:
  - `videoPath`: string - 视频路径
  - `colors`: string[] - 主题颜色
  - `title`: string - 视频标题

#### ProjectInfo.tsx
- **用途**: 项目信息展示组件
- **职责**: 展示项目的详细信息，包括故事、特性、技术实现等
- **Props**:
  - `title`: string - 项目标题
  - `description`: string - 项目描述
  - `category`: string - 项目分类
  - `tags`: string[] - 标签列表
  - `emoji`: string - 图标表情
  - `colors`: string[] - 主题颜色
  - `details`: ProjectDetails - 详细信息

---

### 3.7 特效组件

#### WaterDroplets.tsx
- **用途**: 水滴背景效果组件
- **职责**: 使用 Three.js 实现动态水滴粒子效果
- **核心功能**:
  - WebGL 渲染器初始化
  - 水滴物理模拟（飘动、合并、分裂）
  - 鼠标交互（吸引效果）
  - 着色器渲染玻璃折射效果
  - 响应式尺寸调整

---

### 3.8 数据文件

#### projects.json
- **用途**: 项目数据配置文件
- **结构**:
  - `profile`: 个人信息
  - `projects`: 项目列表（featured/planning/technology/ai/knowledge）
  - `skills`: 技能分类
  - `experience`: 经验亮点
  - `social`: 社交链接

---

## 4. 接口文档

### 4.1 数据结构

#### Project 接口

```typescript
interface Project {
  id: string;                    // 项目唯一标识
  title: string;                 // 项目标题
  description: string;           // 项目描述
  tags: string[];                // 标签列表
  emoji: string;                 // 图标表情
  colors: string[];              // 主题颜色 [主色, 次色]
  category?: string;             // 项目分类
  isLarge?: boolean;             // 是否大卡片
  videoPath?: string;            // 视频路径
  details?: ProjectDetails;      // 详细信息
  skills?: string[];             // 技能列表
  topics?: string[];             // 知识主题
}
```

#### ProjectDetails 接口

```typescript
interface ProjectDetails {
  role?: string;                 // 担任角色
  engine?: string;               // 使用引擎
  tools?: string[];              // 使用工具
  achievements?: string[];       // 项目成就
  demoUrl?: string;              // 演示链接
  githubUrl?: string;            // GitHub链接
  documentUrl?: string;          // 文档链接
  overview?: string;             // 项目概述
  story?: string;                // 故事背景
  features?: string[];           // 核心特性
  techDetails?: string[];        // 技术实现
}
```

#### Toast 接口

```typescript
interface Toast {
  id: number;                    // 消息ID
  message: string;               // 消息内容
  type: 'success' | 'error' | 'info';  // 消息类型
}
```

---

## 5. 数据流与交互

### 5.1 页面导航流程

```
首页 (App.tsx)
    │
    ├─[点击项目卡片]─→ 项目详情页 (ProjectDetail.tsx)
    │                         │
    │                         └─[点击返回]─→ 首页
    │
    ├─[滚动页面]─→ 更新深度指示器
    │
    └─[点击导航]─→ 平滑滚动到对应区域
```

### 5.2 状态流转

```
初始化
    │
    ├─→ isLoading = true
    │     └─→ 1.5秒后 → isLoading = false
    │
    └─→ activeSection = 'home'
          └─→ 滚动监听 → 更新 activeSection
```

### 5.3 水滴效果交互

```
鼠标移动
    │
    ├─→ 更新 mouse.x, mouse.y
    │
    └─→ 水滴被吸引向鼠标位置

鼠标点击
    │
    └─→ 生成新水滴

鼠标离开
    │
    └─→ mouse.active = false → 水滴不再被吸引
```

---

## 6. 样式与主题

### 6.1 自定义样式类

| 类名 | 用途 |
|-----|------|
| `.glass` | 毛玻璃效果 |
| `.bento-grid` | 卡片网格布局 |
| `.bento-item` | 卡片项 |
| `.bento-image` | 卡片图片区域 |
| `.sidebar` | 侧边导航栏 |
| `.toast` | 消息提示 |
| `.waterfall-section` | 瀑布流区域 |

### 6.2 动画效果

| 动画 | 组件 | 描述 |
|-----|------|------|
| 淡入淡出 | 全局 | 页面切换过渡 |
| 缩放 | BentoCard | 卡片悬停效果 |
| 位移 | 导航栏 | 侧边栏滑入滑出 |
| 呼吸灯 | ScrollHint | 提示文字闪烁 |
| 深度变化 | DepthIndicator | 深度值变化动画 |

---

## 7. 开发与部署

### 7.1 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问地址: http://localhost:5173
```

### 7.2 生产构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 7.3 代码检查

```bash
npm run lint
```

---

## 8. 浏览器兼容性

| 浏览器 | 支持版本 | 说明 |
|-------|---------|------|
| Chrome | 90+ | 完全支持 |
| Firefox | 88+ | 完全支持 |
| Safari | 14+ | 完全支持 |
| Edge | 90+ | 完全支持 |

---

## 9. 性能优化

### 9.1 已实现优化

1. **骨架屏加载** - 减少感知加载时间
2. **React.memo** - 组件记忆化
3. **虚拟列表** - 大列表优化（待实现）
4. **懒加载** - 图片和视频延迟加载
5. **WebGL 渲染** - 高性能动画

### 9.2 建议优化

1. 实现图片懒加载
2. 添加 Service Worker 缓存
3. 优化 Three.js 渲染性能
4. 实现代码分割

---

## 10. 安全注意事项

1. **XSS 防护**: 使用 React 自动转义
2. **链接安全**: 外部链接添加 `rel="noopener noreferrer"`
3. **视频安全**: 仅允许可信视频源
4. **数据验证**: 对外部数据进行类型检查

---

**文档版本**: v1.0  
**生成日期**: 2024年  
**作者**: Nanako