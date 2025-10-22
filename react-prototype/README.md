# Project Task Management Prototype (React + Vite)

Frontend prototype project based on PRD, using React + Vite, dark tech style, responsive support for PC/mobile. Built-in routing and basic pages: Projects, Board, Progress (timeline illustration), Alerts.

## Tech Stack

- React 18
- Vite 5 (development/build)
- react-router-dom (routing)
- Native CSS (custom dark tech style)

## Environment Requirements

- Node.js ≥ 18
- npm ≥ 9

## Installation and Startup

```bash
# Enter project directory
cd /Users/lihengrui/工作/2025/src/HA1/react-prototype

# Install dependencies (can skip if already executed)
npm install

# Start development server (default port 5173)
npm run dev
# Browser access
# http://localhost:5173
```

## Common Commands

```bash
# Build artifacts to dist/
npm run build

# Local preview of build artifacts (static server)
npm run preview
```

## Routes and Pages

- `/` Projects: Overview metric cards, filter toolbar, simplified board
- `/board` Board: Display tasks by status columns (sample data)
- `/timeline` Progress: SVG timeline (Gantt chart illustration)
- `/alerts` Alerts: Risk/reminder list (sample data)

## Directory Structure

```
react-prototype/
  ├─ index.html              # Entry HTML
  ├─ vite.config.js          # Vite configuration
  ├─ package.json
  ├─ src/
  │  ├─ main.jsx             # Startup and routing container (BrowserRouter)
  │  ├─ App.jsx              # Layout and route pages
  │  ├─ index.css            # Global styles (dark tech style + responsive)
  │  └─ assets/              # Static resources
  └─ public/
     └─ vite.svg
```

## Features (Prototype Level)

- Responsive layout: Sidebar navigation becomes bottom on mobile, grid/board adaptive
- Tech style: Dark gradients, fluorescent accents, frosted glass, grid shadows
- Basic interactions: Search input box, buttons, placeholder data and metric cards

## Future Extensions

- Board drag-and-drop, task detail popup, filter/search linkage
- Timeline (day/week/month granularity switching, critical path marking)
- Connect to real APIs and state management (like Zustand/Redux)
- TypeScript conversion and component abstraction

## Common Issues

- Startup successful but blank page: Confirm accessing `http://localhost:5173`, or check terminal for errors
- Port occupied: `npm run dev -- --port 5174`
