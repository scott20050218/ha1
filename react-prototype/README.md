# 项目任务管理原型（React + Vite）

基于 PRD 的前端原型工程，采用 React + Vite，暗色科技风样式，自适应支持 PC / 手机端。内置路由与基础页面：项目、看板、进度（时间轴示意）、预警。

## 技术栈

- React 18
- Vite 5（开发/构建）
- react-router-dom（路由）
- 原生 CSS（自定义暗色科技风样式）

## 环境要求

- Node.js ≥ 18
- npm ≥ 9

## 安装与启动

```bash
# 进入工程目录
cd /Users/lihengrui/工作/2025/src/HA1/react-prototype

# 安装依赖（已执行过可跳过）
npm install

# 启动开发服务器（默认 5173 端口）
npm run dev
# 浏览器访问
# http://localhost:5173
```

## 常用命令

```bash
# 构建产物到 dist/
npm run build

# 本地预览构建产物（静态服务器）
npm run preview
```

## 路由与页面

- `/` 项目：概览指标卡、筛选工具栏、简化看板
- `/board` 看板：按状态分栏展示任务（示例数据）
- `/timeline` 进度：SVG 时间轴（甘特图示意）
- `/alerts` 预警：风险/提醒列表（示例数据）

## 目录结构

```
react-prototype/
  ├─ index.html              # 入口 HTML
  ├─ vite.config.js          # Vite 配置
  ├─ package.json
  ├─ src/
  │  ├─ main.jsx             # 启动与路由容器（BrowserRouter）
  │  ├─ App.jsx              # 布局与路由页面
  │  ├─ index.css            # 全局样式（暗色科技风 + 响应式）
  │  └─ assets/              # 静态资源
  └─ public/
     └─ vite.svg
```

## 功能特性（原型级）

- 响应式布局：侧边导航在移动端底部化，网格/看板自适应
- 科技风样式：暗色渐变、荧光强调、毛玻璃、网格阴影
- 基础交互：搜索输入框、按钮、占位数据与统计卡片

## 后续可扩展

- 看板拖拽、任务详情弹窗、筛选/搜索联动
- 时间轴（日/周/月粒度切换、关键路径标记）
- 接入真实接口与状态管理（如 Zustand/Redux）
- TypeScript 化与组件抽象

## 常见问题

- 启动成功但页面空白：确认访问 `http://localhost:5173`，或查看终端是否报错
- 端口被占用：`npm run dev -- --port 5174`
