# Feature List · Technical Architecture · Deployment Instructions (react-prototype)

This document is organized based on the source code of the `react-prototype/` repository (Vite + React) for review/handover purposes.

## I. Feature List (Prototype Level)

### 1. Global and Layout

- Responsive layout: Header (Logo/Search/Import/Create New), sidebar navigation (Projects/Board/Progress/Alerts), mobile automatically collapses to bottom navigation.
- Global search input (placeholder): Supports filtering by keywords (project page logic can be extended).
- White background card-style UI: Each module presented as cards, unified rounded corners and shadows.

### 2. Projects Page (`/`)

- Metric cards: Project count, task count, completion rate (with progress bar), blocked count.
- Filter toolbar: Department/status dropdown, keyword input, export CSV button (placeholder).
- Simplified board: Four columns (not started/in progress/blocked/completed), each column with several task cards.
  - Task card elements: Title, Owner tag, progress percentage, status coloring.

### 3. Board Page (`/board`)

- Chart card area:
  - Pie chart (status distribution), bar chart (task count per column), line chart (recent 7-day completion), all lightweight SVG implementation.
- Board columns: Same as projects page, sample data.

### 4. Progress Page (`/timeline`)

- Timeline (SVG) illustration: Multiple task bars, length represents duration, different colors represent categories; includes grid baseline.

### 5. Alerts Page (`/alerts`)

- Alert list: With level color indicators (high/medium/info), text, related objects, "Notify" button (placeholder).

## II. Technical Architecture

### 1. Framework and Tools

- Build/Development: Vite 7
- View: React 19
- Routing: react-router-dom 7 (`BrowserRouter` + `Routes`/`Route` + `NavLink`)
- Language: ESM (`type: module`), native CSS global styles (`src/index.css`)
- Lint: ESLint 9 (including React Hooks/Refresh plugins)

### 2. Code Structure

```
src/
  ├─ main.jsx        // Entry, StrictMode + BrowserRouter wrapping App
  ├─ App.jsx         // Layout (Shell) + route pages + lightweight chart components (Pie/Bar/Line)
  ├─ index.css       // Global styles: white background card style, responsive, board/chart styles
  └─ assets/         // Static resources (react.svg)
```

- Shell layout: `header` (Logo/Search/Import/Create New), `aside.sidebar` (navigation), `main` (route content).
- Page components: `Projects`, `Board`, `Timeline`, `Alerts` all implemented in `App.jsx`, sample data built into component functions.
- Chart components: `PieChart`, `BarChart`, `LineChart` use SVG native tags for drawing, no third-party dependencies.

### 3. State and Data

- Currently prototype: Data is local constants/temporary generation (`Math.random`), not connected to backend.
- Filter/search: Projects page can filter by input (can be extended to global).

### 4. Extensibility Points (Suggestions)

- State management: Zustand/Redux (cross-page shared filtering, user info, task list).
- Board drag-and-drop: `@dnd-kit/core` or `react-beautiful-dnd`.
- Task details: Right drawer (form fields, comments, attachments), linked with route parameters.
- Timeline: Planned/actual comparison, dependency connections, critical path highlighting.
- Charts: Abstract Chart utility layer, support unified theme and data adaptation.
- API layer: API encapsulation + type definitions based on `fetch`/`axios` (suggest TypeScript).

## III. Deployment Instructions

### 1. Development Run

```bash
cd /Users/lihengrui/工作/2025/src/HA1/react-prototype
npm install
npm run dev
# Browser access http://localhost:5173
```

### 2. Build Artifacts

```bash
npm run build
# Artifacts output to dist/, pure static resources, can be placed on any static server
```

### 3. Preview Build

```bash
npm run preview
# Local static service preview dist/ (default port 4173)
```

### 4. Common Deployment Methods

- Nginx/Apache: Point `dist/` to site root directory; enable gzip/brotli; `try_files` support single-page routing (`location / { try_files $uri /index.html; }`).
- Static hosting: Netlify / Vercel / GitHub Pages (choose React/Vite template or custom build command `npm run build`).

## IV. Environment and Scripts

- Node ≥ 18, npm ≥ 9
- `package.json`:
  - `dev`: Vite development server
  - `build`: Vite build
  - `preview`: Preview packaged artifacts
  - `lint`: ESLint code check

## V. Boundaries and Known Limitations

- All data is sample/placeholder, no authentication, permissions or real interfaces.
- Not implemented: drag-and-drop, task details, dependencies/milestones and other advanced capabilities.
- Styles are global CSS, no componentized style isolation (can introduce CSS Modules/Tailwind).

—— End ——
