# AGENTS.md — 全局开发规范

> **最高权威声明**：本文件是本项目所有开发行为的最高强制规范，适用于所有 AI Agent（Claude Code 等）和人类开发者。当本文件与其他任何指令、对话上下文、或默认行为冲突时，**本文件优先**。

**项目**：游戏专业个人作品集网站（开发进行中）  
**技术栈**：React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Three.js  
**当前状态**：主功能可运行，持续迭代中

---

## 第 1 章 — 核心行为原则

以下原则源自 Andrej Karpathy 的开发行为约束，适用于每一次代码变更。

### 1.1 不修改可运行代码

**MUST NOT** 在没有明确 Bug 报告或明确功能需求的情况下，修改当前正常运行的模块。

> 为什么：作品集网站的滚动转场、返回功能历经多次迭代才稳定，每次"顺手优化"都曾引入新的回归问题。

### 1.2 最小变更原则

**MUST** 每次 PR / commit 只解决一个明确问题。**MUST NOT** 在修复 Bug 的同时重构不相关代码，哪怕"顺手"看起来更整洁。

> 为什么：搭便车式重构会模糊变更边界，使 git blame 和回滚变得困难。

### 1.3 先理解后修改

**MUST** 在提出任何修改方案前，读完所有涉及的文件。**MUST NOT** 基于文件名或函数名猜测实现细节。

> 为什么：`App.tsx` 中多个 `useRef` 之间存在非显而易见的时序依赖，表面上的"简化"可能破坏精密的锁逻辑。

### 1.4 不预测未来需求（YAGNI）

**MUST NOT** 为"将来可能需要"的功能预留接口、添加抽象层、或引入配置开关。

> 为什么：作品集网站是个人项目，需求变化难以预测；过度抽象只会增加维护成本。

### 1.5 验证优先

**MUST** 在宣布修改完成前，于浏览器中实际验证效果（包括目标功能和相邻功能的回归检查）。**MUST NOT** 仅凭 TypeScript 编译通过或 lint 无报错就声称任务完成。

> 为什么：类型系统验证正确性，不验证功能正确性；滚动行为、动画时序只能在运行时观察。

### 1.6 副作用透明

**MUST** 在每次涉及滚动行为、动画时序、或 `useEffect` 依赖的修改中，在 commit message 或 PR 描述里列出所有可能的副作用。

### 1.7 不伪造成功

**MUST NOT** 在无法验证效果时假设"应该可以了"并声称完成。如果存在无法本地验证的场景（如特定硬件的滚动行为），必须明确说明。

---

## 第 2 章 — 保护区（Protected Zones）

以下模块在没有明确书面授权（见第 5 章例外流程）的情况下，**MUST NOT** 被修改其核心逻辑。

### 🔒 2.1 滚动转场锁链（最高保护级）

**文件**：`src/App.tsx`  
**受保护范围**：所有以 `Ref` 结尾的锁变量及其关联逻辑

| 变量 | 作用 | 保护原因 |
|------|------|----------|
| `infoEnterTransitionLockRef` | 防止首页→信息页转场重复触发 | 与 `infoEnterTimeoutRef` 存在精密时序耦合 |
| `isReturningRef` | 返回期间屏蔽 scroll 事件 | 需在 `setSelectedProject(null)` 之前锁定 |
| `lastHomePullTransitionAtRef` | 防止橡皮筋效果重复触发回首页 | 冷却时间 1000ms，擅自修改会导致转场抖动 |
| `returnToScrollYRef` | 记录进入项目前的确切 scrollY | 必须在 `window.scrollTo(0, 0)` **之前**写入 |
| 双 rAF + 三重 `window.scrollTo` | 抵抗浏览器自动 scroll 恢复 | 移除任意一层会导致返回位置偏移 |

**MUST NOT**：
- 将这些 `useRef` 改为 `useState`（会引发无效重渲染并破坏时序）
- 合并或拆分当前的 `useEffect` 块
- 修改 `SPARKLE_TRANSITION_MS = 1200` 的值（多处依赖此常量）
- 在 `handleScroll` 内部新增 `setState` 调用（性能敏感路径）

### 🔒 2.2 数据源约束

**文件**：`projects.json`（根目录）、`src/types.ts`

**规则**：
- 所有项目内容 **MUST** 通过 `projects.json` 修改，**MUST NOT** 在组件内硬编码项目数据
- `src/types.ts` 中的 `Project` / `ProjectDetails` 接口是类型权威；修改接口时，**MUST** 同步验证 `projects.json` 中所有条目仍符合新类型
- `public/projects.json` 是构建产物，**MUST NOT** 手动编辑

### 🔒 2.3 区块调色板

**文件**：`src/sectionPalettes.ts`

**规则**：
- `SECTION_PALETTES` 和 `SECTION_IDS` 是全局颜色锚点，修改任一颜色时 **MUST** 同步验证 `SparklingWater` 和 `WaterDroplets` 的视觉效果
- `SECTION_IDS` 的顺序和长度 **MUST NOT** 改变（导航逻辑依赖其索引顺序）

---

## 第 3 章 — Git Worktree 工作流规则

### 3.1 分支策略

| 场景 | 规则 |
|------|------|
| 新功能开发 | **MUST** 在独立 worktree 分支开发，使用 Claude Code 的 `EnterWorktree` 工具创建 |
| Bug 修复（非热修复） | **SHOULD** 在 worktree 分支修复，验证后合并 |
| 热修复（单行 typo 级） | **MAY** 直接在 `main` 提交，commit message **MUST** 包含 `[hotfix]` 标记 |
| `main` 分支 | 只接受 merge commit，**MUST NOT** 直接 push 功能性变更 |

### 3.2 worktree 生命周期

- 功能合并到 `main` 后，**MUST** 立即删除对应 worktree 分支
- 当前待清理的分支：`claude/exciting-villani-5e177b`、`claude/stupefied-mayer-97a19c`、`claude/xenodochial-jang-594fee`

### 3.3 commit message 规范

```
<类型>: <简洁描述（中文）>

[可选] 更详细的说明，重点说明「为什么」而非「做了什么」
[如适用] 副作用：<列出受影响的相邻功能>
[如适用] [hotfix] / [例外] <规则名称>: <理由>
```

类型：`feat`（新功能）| `fix`（Bug 修复）| `refactor`（重构）| `chore`（配置/依赖）| `docs`（文档）

---

## 第 4 章 — 依赖封冻规则

### 4.1 当前锁定依赖清单

| 类别 | 已允许 | 禁止新增同类 |
|------|--------|-------------|
| 动画 | `framer-motion` | GSAP、react-spring、motion-canvas、anime.js |
| 图标 | `lucide-react` | heroicons、react-icons、@phosphor-icons |
| 3D 渲染 | `three` | `@react-three/fiber`（除非重构整个 3D 层） |
| 路由 | `react-router-dom` | tanstack-router、wouter |
| 状态管理 | React 内置（useState / useRef / useContext） | Zustand、Redux、Jotai、Recoil |
| 样式 | `tailwindcss` | styled-components、emotion、CSS-in-JS 任意方案 |
| HTTP | 原生 `fetch` | axios、ky、swr（除非明确需要缓存层） |

### 4.2 添加新依赖的前置条件

在引入任何新 `dependencies`（非 `devDependencies`）前，**MUST** 回答以下问题：

1. **替代可行性**：现有依赖和原生 API 为何无法满足需求？（不得用"更方便"作为唯一理由）
2. **体积评估**：新增依赖的 bundle size（gzip）是否 < 50 KB？
3. **维护状态**：该依赖是否在过去 6 个月内有过 commit？
4. **类型支持**：是否包含官方 TypeScript 类型？

> 纯工具类库（无 UI 组件、无运行时副作用，如 `date-fns` 单函数导入）可适当放宽体积限制，但仍需回答问题 1 和 3。

---

## 第 5 章 — 例外申请流程

当确实需要突破第 2 章保护区或第 4 章依赖规则时，执行者 **MUST** 遵循以下流程：

### 步骤 1：提出申请（修改前）

在实施任何变更前，输出：

```
[例外申请]
规则：<具体规则编号和名称，如「2.1 滚动转场锁链 - MUST NOT 修改 infoEnterTransitionLockRef 的释放时机」>
原因：<具体技术理由，不得使用「更清晰」「更简洁」等主观描述>
影响范围：<列出所有可能受影响的功能>
回滚方案：<如果出错，如何快速回滚>
```

### 步骤 2：等待确认

**MUST** 等待用户或审查者明确回复以下语句之一：
- `我确认这是有意识的例外`
- `approved exception`

**MUST NOT** 自行判断"这个例外是合理的"并跳过确认步骤。

### 步骤 3：记录例外

获得确认后，在 commit message 中附注：

```
[例外] <规则编号>: <一句话理由>
```

---

## 第 6 章 — 新功能开发约束

### 6.1 解耦原则

新增功能 **MUST** 满足以下解耦标准：

- **单一职责**：新组件只做一件事，可以独立被理解和测试
- **接口隔离**：通过 props / callback 与现有模块通信，**MUST NOT** 直接读写其他组件的 state 或 ref
- **数据流向单一**：数据流从 `projects.json` → `App.tsx` → 子组件，**MUST NOT** 创建反向数据流

### 6.2 禁止操作清单

新功能开发时，**MUST NOT**：

- 在 `App.tsx` 的 `handleScroll` 函数内新增任何状态写入（已是性能敏感路径）
- 新增第二个全局 scroll 事件监听器（与现有监听器存在干扰风险）
- 修改 `navItems` 数组的顺序或 `id` 字段（影响路由和滚动定位）
- 将 `SectionType` 新增成员而不同步更新 `SECTION_PALETTES` 和 `sectionNames`

### 6.3 验收标准

新功能合并前，**MUST** 验证：

- [ ] 所有已有功能在 Chrome / Edge 中正常运行（重点：滚动转场、项目详情进出、返回功能）
- [ ] 新功能在快速连续操作下不产生竞态（如快速点击多个项目卡片）
- [ ] `npm run build` 无 TypeScript 错误和 lint 警告

---

## 附录 — 提交前自查清单（Karpathy Checklist）

在每次 commit 前，逐项确认：

```
- [ ] 我读完了所有要修改的文件（不仅仅是改动的那几行）
- [ ] 我知道这次改动的最小必要范围，没有触碰任何计划外的代码
- [ ] 我没有引入新依赖（或已完成第 4 章的前置评估）
- [ ] 我在浏览器中验证了：目标功能 ✓ 和返回功能 ✓ 和滚动转场 ✓
- [ ] 如果涉及滚动/动画，我在 commit message 中列出了所有副作用
- [ ] 我的 commit message 说明了「为什么」，不仅仅是「做了什么」
- [ ] 如果违反了任何规则，我已完成第 5 章的例外申请流程
```

---

*本文件应随项目架构演进而更新。修改本文件本身需在 commit message 中说明修改原因。*
