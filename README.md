# 游戏专业 个人作品集网站

一个现代化、专业的游戏专业学生个人作品展示平台。

## 🎯 特性

### 设计亮点
- **Aurora Gradient 背景** - 动态流动的渐变背景，展现朝气活力
- **Bento Grid 布局** - 便当盒风格的卡片布局，卡片大小对比合理
- **Glassmorphism 风格** - 高斯模糊浮窗 + 白色噪点纹理
- **Sticky Sidebar** - 侧边导航固定在视窗，滚动时保持可见
- **Skeleton Loading** - 智能骨架屏动画，避免空白闪烁
- **Toast Notification** - Vercel 风格的操作反馈提示

### 内容组织
- **精选项目** - 3个最得意的项目突出展示
  - Project-Time: UE GAS 战斗系统
  - 某天头上长出对话框: UE 对话系统全栈
  - Eat Your Fish: Unity 游戏全栈

- **策划板块** - 任务系统、玩法设计、文案策划
- **技术板块** - C#/C++/蓝图、TA 视觉效果、UI 系统
- **AI 应用** - AI 接入项目展示
- **知识库** - 学习笔记和最佳实践

## 🚀 快速开始

### 方式一：直接打开 HTML
```bash
# 在浏览器中打开 portfolio.html 即可查看
# 支持所有现代浏览器（Chrome、Firefox、Safari、Edge）
```

### 方式二：启动开发服务器（推荐）
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📁 项目结构

```
网站/
├── portfolio.html          # 完整的单文件 HTML 版本
├── index.html              # Vite 入口文件
├── package.json            # 项目依赖配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── tailwind.config.js      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
└── src/                    # 源代码目录
    ├── main.tsx            # 入口文件
    ├── App.tsx             # 主应用组件
    ├── index.css           # 全局样式
    ├── components/         # 可复用组件
    ├── pages/              # 页面组件
    ├── contexts/           # React Context
    └── types/              # TypeScript 类型定义
```

## 🎨 设计细节

### Aurora Gradient 背景
- 使用 4 种充满朝气的颜色：红、黄、绿、蓝
- 缓慢流动的 15 秒循环动画
- 营造沉浸式的视觉体验

### Glassmorphism 浮窗
- 30% 透明度的白色背景
- 20px 高斯模糊效果
- 重复的 45° 条纹噪点纹理

### Bento Grid
- 自适应网格布局，最小宽度 250px
- 精选项目卡片 2x2 尺寸，其他卡片正常
- 1.5rem 间距，24px 圆角

### 交互反馈
- 鼠标悬停时卡片上升 8px
- 点击操作触发 Toast 通知
- 黑底白字设计，符合 Vercel 风格
- 自动消失或手动关闭

## 🔧 自定义指南

### 修改个人信息
在 `portfolio.html` 中找到 Portfolio 组件，修改：
```javascript
<h1>你的名字</h1>
<p>你的职位或标签</p>
```

### 添加新项目
在 `projects` 数组中添加新对象：
```javascript
{
    title: '项目名称',
    description: '项目描述',
    tags: ['标签1', '标签2'],
    image: { emoji: '🎮', color1: '#ff6b6b', color2: '#ee5a6f' },
    isLarge: true // 可选，设置为大卡片
}
```

### 修改背景颜色
编辑 `.aurora-bg` 的 `background` 属性：
```css
background: linear-gradient(-45deg, #新颜色1, #新颜色2, #新颜色3, #新颜色4);
```

### 调整动画速度
修改相应的 `animation` 属性：
```css
animation: aurora 15s ease infinite; /* 15s 改为你想要的时间 */
```

## 📱 响应式设计

- **桌面版** - 侧边栏 + 网格布局
- **平板版** - Bento Grid 自适应调整
- **手机版** - 单列布局，导航改为固定头部或抽屉菜单

## 🎯 优化建议

1. **添加项目详情页面** - 点击卡片跳转到项目详情
2. **集成图片加载** - 使用真实项目截图而非纯色背景
3. **黑暗模式** - 添加深色主题切换
4. **多语言支持** - 支持英文版本
5. **SEO 优化** - 添加 Meta 标签和结构化数据
6. **动画库集成** - 使用 Framer Motion 实现更复杂动画

## 💡 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型检查
- **Tailwind CSS** - 样式框架
- **Vite** - 构建工具
- **Framer Motion** - 动画库（可选）

## 📝 许可证

MIT License

---

**提示**：
- 在浏览器中直接打开 `portfolio.html` 即可查看完整效果
- 如需本地开发，使用 `npm run dev` 启动开发服务器
- 所有动画和效果都已优化，不会影响性能
