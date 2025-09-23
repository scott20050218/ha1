import { NavLink, Route, Routes } from 'react-router-dom'
import './index.css'

function Shell({ children }) {
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <div className="logo-badge" /> 项目任务管理
        </div>
        <div className="search">
          <span className="search-icon">🔎</span>
          <input placeholder="搜索项目/任务/成员…" />
        </div>
        <div className="header-actions">
          <button className="btn" onClick={() => alert('导入')}>导入</button>
          <button className="btn primary">新建项目</button>
        </div>
      </header>
      <aside className="sidebar">
        <div className="nav-group">导航</div>
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>📁</span>
          <span className="label">项目</span>
        </NavLink>
        <NavLink to="/board" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>🧩</span>
          <span className="label">看板</span>
        </NavLink>
        <NavLink to="/timeline" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>📅</span>
          <span className="label">进度</span>
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>⚡</span>
          <span className="label">预警</span>
        </NavLink>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}

function Cards() {
  return (
    <div className="cards">
      <div className="card">
        <h4>项目数</h4>
        <strong>3</strong>
      </div>
      <div className="card">
        <h4>任务数</h4>
        <strong>24</strong>
      </div>
      <div className="card">
        <h4>完成率</h4>
        <strong>62%</strong>
        <div className="progress"><span style={{ width: '62%' }} /></div>
      </div>
      <div className="card">
        <h4>阻塞数</h4>
        <strong>2</strong>
      </div>
    </div>
  )
}

function Projects() {
  return (
    <>
      <Cards />
      <div className="card">
        <div className="toolbar">
          <select className="select" defaultValue="全部部门">
            <option>全部部门</option>
            <option>产品</option>
            <option>设计</option>
            <option>研发</option>
            <option>测试</option>
          </select>
          <select className="select" defaultValue="全部状态">
            <option>全部状态</option>
            <option>未开始</option>
            <option>进行中</option>
            <option>阻塞</option>
            <option>已完成</option>
          </select>
          <input className="input" placeholder="筛选关键字" />
          <button className="btn">导出 CSV</button>
        </div>
      </div>
      <div className="kanban">
        {[['未开始', 3], ['进行中', 5], ['阻塞', 2], ['已完成', 14]].map(([title, n]) => (
          <div className="col" key={title}>
            <h5>{title}</h5>
            {Array.from({ length: n }).map((_, i) => (
              <div className="task" key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{title} - 任务 {i + 1}</div>
                  <span className="tag">Owner</span>
                </div>
                <div className="meta">
                  <span>进度 {Math.round(Math.random() * 100)}%</span>
                  <span style={{ color: title === '已完成' ? 'var(--ok)' : title === '阻塞' ? 'var(--danger)' : 'var(--muted)' }}>{title}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

function PieChart({ values, colors }) {
  const total = values.reduce((a, b) => a + b, 0)
  let acc = 0
  const cx = 90, cy = 90, r = 70
  return (
    <svg className="chart" viewBox="0 0 180 180">
      {values.map((v, i) => {
        const start = (acc / total) * 2 * Math.PI
        acc += v
        const end = (acc / total) * 2 * Math.PI
        const x1 = cx + r * Math.cos(start)
        const y1 = cy + r * Math.sin(start)
        const x2 = cx + r * Math.cos(end)
        const y2 = cy + r * Math.sin(end)
        const large = end - start > Math.PI ? 1 : 0
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
        return <path key={i} d={d} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="1" />
      })}
      <circle cx={cx} cy={cy} r={40} fill="#fff" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#111" fontSize="14">分布</text>
    </svg>
  )
}

function BarChart({ values, color = '#0ea5e9' }) {
  const max = Math.max(...values, 1)
  return (
    <svg className="chart" viewBox="0 0 300 180">
      {values.map((v, i) => {
        const h = (v / max) * 140
        const x = 20 + i * 40
        const y = 160 - h
        return <rect key={i} x={x} y={y} width={28} height={h} rx={6} fill={color} />
      })}
      <line x1="10" y1="160" x2="290" y2="160" stroke="#e5e7eb" />
    </svg>
  )
}

function LineChart({ values, color = '#7c3aed' }) {
  const max = Math.max(...values, 1)
  const points = values.map((v, i) => {
    const x = 20 + (i * 260) / (values.length - 1)
    const y = 160 - (v / max) * 140
    return `${x},${y}`
  }).join(' ')
  return (
    <svg className="chart" viewBox="0 0 300 180">
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" />
      {values.map((v, i) => {
        const x = 20 + (i * 260) / (values.length - 1)
        const y = 160 - (v / max) * 140
        return <circle key={i} cx={x} cy={y} r={3.5} fill={color} />
      })}
      <line x1="10" y1="160" x2="290" y2="160" stroke="#e5e7eb" />
    </svg>
  )
}

function Board() {
  return (
    <>
      <div className="charts">
        <div className="chart-card">
          <h4>状态分布（饼图）</h4>
          <PieChart values={[4, 7, 2, 9]} colors={["#e2e8f0", "#0ea5e9", "#fca5a5", "#86efac"]} />
        </div>
        <div className="chart-card">
          <h4>每列任务数（柱状图）</h4>
          <BarChart values={[2, 4, 1, 6]} />
        </div>
        <div className="chart-card">
          <h4>近7日完成量（折线图）</h4>
          <LineChart values={[1, 2, 1, 3, 4, 2, 5]} />
        </div>
      </div>

      <div className="kanban">
        {[['未开始', 2], ['进行中', 4], ['阻塞', 1], ['已完成', 6]].map(([title, n]) => (
          <div className="col" key={title}>
            <h5>{title}</h5>
            {Array.from({ length: n }).map((_, i) => (
              <div className="task" key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{title} - 任务 {i + 1}</div>
                  <span className="tag">Owner</span>
                </div>
                <div className="meta">
                  <span>进度 {Math.round(Math.random() * 100)}%</span>
                  <span style={{ color: title === '已完成' ? 'var(--ok)' : title === '阻塞' ? 'var(--danger)' : 'var(--muted)' }}>{title}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

function Timeline() {
  const rows = 6
  const total = 12
  return (
    <div className="timeline card">
      <h4>时间轴（示意）</h4>
      <svg viewBox={`0 0 1000 ${rows * 36 + 30}`} preserveAspectRatio="none">
        {[...Array(total + 1)].map((_, i) => (
          <line key={i} x1={(i/total)*1000} y1={0} x2={(i/total)*1000} y2={rows*36+20} stroke="rgba(148,163,184,0.4)" strokeWidth="1" />
        ))}
        {Array.from({ length: rows }).map((_, idx) => {
          const start = Math.floor(Math.random() * (total - 3))
          const end = start + Math.floor(2 + Math.random() * 4)
          const x = (start/total) * 1000
          const w = ((end - start)/total) * 1000
          const y = 20 + idx*36
          const color = idx % 3 === 0 ? '#86efac' : idx % 3 === 1 ? '#fca5a5' : '#7dd3fc'
          return (
            <g key={idx}>
              <text x="8" y={y - 6} fill="var(--muted)" fontSize="12">任务 {idx + 1}</text>
              <rect x={x} y={y} rx="6" ry="6" width={w} height="16" fill={color} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function Alerts() {
  const items = [
    { id: 'a1', level: 'high', text: '接口联调存在阻塞，前置依赖未完成', target: '接口联调' },
    { id: 'a2', level: 'medium', text: 'UI 设计进度滞后 10%', target: 'UI 设计' },
    { id: 'a3', level: 'info', text: '需求评审将于明日到期', target: '需求评审' },
  ]
  const color = (lvl) => lvl === 'high' ? 'var(--danger)' : lvl === 'medium' ? 'var(--warn)' : 'var(--accent)'
  return (
    <div className="alerts">
      {items.map(it => (
        <div key={it.id} className="alert">
          <span className="dot" style={{ background: color(it.level) }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{it.text}</div>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>关联：{it.target}</div>
          </div>
          <button className="btn">通知</button>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/board" element={<Board />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </Shell>
  )
}
