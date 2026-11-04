import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LuGitBranch, LuLocateFixed, LuMinus, LuPlus, LuArrowRight } from 'react-icons/lu'
import { ADAPTATION_TYPES } from '../data/seed.js'
import { findRoot, layoutTree, pathToRoot } from '../lib/tree.js'
import { Avatar, Chip, Cover, formatDate } from './ui.jsx'
import { Link } from '../router.jsx'

const typeColor = (t) => ADAPTATION_TYPES.find((x) => x.id === t)?.color || '#6b8590'
const NODE = 64, ROOT = 84, CARD_W = 304

/**
 * Árvore de adaptações: grafo da esquerda p/ direita.
 * - hover/foco no nó: prévia do projeto (autor, o que mudou...) e destaque do caminho até a original
 * - toque (celular): a mesma prévia abre como bottom sheet
 * - arrastar para mover, botões/pinça para zoom, "Centralizar" para recentrar
 */
export default function AdaptationTree({ projects, currentId, highlightId, onCreate }) {
  const root = useMemo(() => findRoot(projects, currentId), [projects, currentId])
  const layout = useMemo(() => layoutTree(projects, root.id), [projects, root.id])
  const hasVariants = layout.nodes.length > 1

  const wrapRef = useRef(null)
  const [size, setSize] = useState({ w: 800, h: 460 })
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })
  const [activeId, setActiveId] = useState(null)
  const timers = useRef({})
  const [dragging, setDragging] = useState(false)
  const [cardH, setCardH] = useState(330) // altura real da prévia, medida após renderizar

  const compact = size.w < 640
  const radius = (n) => (n.depth === 0 ? ROOT : NODE) / 2

  /** Ajusta zoom/posição para caber todo o grafo. */
  const fit = useCallback((w = size.w, h = size.h) => {
    const padX = 110, padY = 90
    const gw = layout.width + padX * 2, gh = layout.height + padY * 2
    const k = Math.min(1, w / gw, h / gh)
    setView({ k, x: (w - layout.width * k) / 2, y: (h - layout.height * k) / 2 })
  }, [layout, size.w, size.h])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [hasVariants])
  useEffect(() => { if (hasVariants) fit() }, [layout, size.w, size.h]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- zoom e arraste ----------
  const zoomAt = useCallback((factor, cx = size.w / 2, cy = size.h / 2) => {
    setView((v) => {
      const k = Math.min(2.2, Math.max(0.4, v.k * factor))
      const r = k / v.k
      return { k, x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r }
    })
  }, [size.w, size.h])

  const pointers = useRef(new Map())
  const drag = useRef(null)
  const pinch = useRef(0)
  const onPointerDown = (e) => {
    if (e.target.closest('.tree-node, .tree-card, .tree-controls, .tree-legend')) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) { drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; setDragging(true) }
    if (pointers.current.size === 2) { const [a, b] = [...pointers.current.values()]; pinch.current = Math.hypot(a.x - b.x, a.y - b.y) }
  }
  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      const rect = wrapRef.current.getBoundingClientRect()
      if (pinch.current) zoomAt(d / pinch.current, (a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top)
      pinch.current = d
    } else if (drag.current) {
      setView((v) => ({ ...v, x: drag.current.vx + e.clientX - drag.current.x, y: drag.current.vy + e.clientY - drag.current.y }))
    }
  }
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = 0
    if (!pointers.current.size) { drag.current = null; setDragging(false) }
  }
  const onWheel = (e) => {
    if (!(e.ctrlKey || e.metaKey)) return // não sequestra a rolagem da página
    e.preventDefault()
    const rect = wrapRef.current.getBoundingClientRect()
    zoomAt(e.deltaY < 0 ? 1.12 : 0.89, e.clientX - rect.left, e.clientY - rect.top)
  }
  useEffect(() => { // wheel precisa de listener não-passivo para poder usar preventDefault
    const el = wrapRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  })

  // ---------- hover / foco / toque ----------
  const open = (id, delay = 120) => { clearTimeout(timers.current.close); clearTimeout(timers.current.open); timers.current.open = setTimeout(() => setActiveId(id), delay) }
  const close = (delay = 200) => { clearTimeout(timers.current.open); clearTimeout(timers.current.close); timers.current.close = setTimeout(() => setActiveId(null), delay) }
  const keep = () => clearTimeout(timers.current.close)
  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])
  useEffect(() => { if (!hasVariants) setActiveId(null) }, [hasVariants])

  const activePath = useMemo(() => (activeId ? new Set(pathToRoot(projects, activeId)) : null), [projects, activeId])
  const activeNode = layout.nodes.find((n) => n.id === activeId)

  const cardPos = useMemo(() => {
    if (!activeNode || compact) return null
    const cx = view.x + activeNode.x * view.k, cy = view.y + activeNode.y * view.k, r = radius(activeNode) * view.k
    let left = cx + r + 14, side = 'left'
    if (left + CARD_W > size.w - 8) { left = cx - r - 14 - CARD_W; side = 'right' }
    left = Math.max(8, left)
    const top = Math.min(Math.max(8, cy - 70), Math.max(8, size.h - cardH - 8))
    return { left, top, side, arrow: Math.min(cardH - 28, Math.max(24, cy - top)) }
  }, [activeNode, view, size, compact, cardH]) // eslint-disable-line react-hooks/exhaustive-deps

  const edgePath = (e) => {
    const a = layout.nodes.find((n) => n.id === e.from), b = layout.nodes.find((n) => n.id === e.to)
    const x1 = a.x + radius(a), x2 = b.x - radius(b), mx = (x1 + x2) / 2
    return `M${x1} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`
  }

  return (
    <section className="tree-section" aria-labelledby="tree-title">
      <div className="section-head">
        <div>
          <h2 id="tree-title">Árvore de adaptações</h2>
          <p className="muted">Conheça projetos relacionados e versões que a comunidade modificou e compartilhou no site.</p>
        </div>
        {hasVariants && <button className="btn btn-primary" onClick={() => onCreate(projects.find((p) => p.id === currentId))}><LuPlus /> Criar variante</button>}
      </div>

      {!hasVariants ? (
        <div className="tree-empty">
          <span className="tree-empty-icon"><LuGitBranch /></span>
          <p>Ainda não há adaptações deste projeto.</p>
          <button className="btn btn-secondary" onClick={() => onCreate(projects.find((p) => p.id === currentId))}>Criar a primeira variante</button>
        </div>
      ) : (
        <div
          ref={wrapRef}
          className={`tree-canvas ${dragging ? 'is-dragging' : ''}`}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          onKeyDown={(e) => e.key === 'Escape' && setActiveId(null)}
          onClick={(e) => { if (e.target === e.currentTarget || e.target.classList.contains('tree-world')) setActiveId(null) }}
          role="group" aria-label={`Grafo com ${layout.nodes.length} projetos. Use Tab para percorrer os nós.`}
        >
          <div className="tree-world" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}>
            <svg className="tree-edges" width="1" height="1" aria-hidden="true">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 9 5 1 9z" fill="currentColor" /></marker>
              </defs>
              {layout.edges.map((e) => {
                const on = activePath && activePath.has(e.from) && activePath.has(e.to)
                return <path key={e.from + e.to} d={edgePath(e)} pathLength="1" className={`edge ${on ? 'on' : ''} ${activePath && !on ? 'dim' : ''}`} markerEnd="url(#arrow)" />
              })}
            </svg>
            {layout.nodes.map((n) => {
              const isRoot = n.depth === 0, d = isRoot ? ROOT : NODE
              const on = !activePath || activePath.has(n.id)
              const types = n.project.adaptation?.types || []
              return (
                <button
                  key={n.id}
                  className={`tree-node ${isRoot ? 'is-root' : ''} ${n.id === currentId ? 'is-current' : ''} ${n.id === activeId ? 'is-active' : ''} ${on ? '' : 'dim'} ${n.id === highlightId ? 'is-new' : ''}`}
                  style={{ left: n.x - d / 2, top: n.y - d / 2, width: d, height: d, '--delay': `${n.depth * 90}ms` }}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && open(n.id)}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && close()}
                  onFocus={() => open(n.id, 0)}
                  onBlur={() => close()}
                  onClick={() => setActiveId((a) => (a === n.id && compact ? null : n.id))}
                  aria-label={`${n.project.title}, por ${n.project.author}${isRoot ? ', projeto original' : ''}`}
                  aria-expanded={n.id === activeId}
                >
                  <Cover category={n.project.category} shape="circle" />
                  {types.slice(0, 3).map((t, i) => <i key={t} className="type-dot" style={{ background: typeColor(t), right: -3 + i * -0, top: 4 + i * 13 }} title={t} />)}
                  {isRoot && <span className="root-badge">Original</span>}
                  <span className="node-label">{n.id === currentId ? <b>Você está aqui</b> : null}{n.project.title}</span>
                </button>
              )
            })}
          </div>

          <div className="tree-controls" role="toolbar" aria-label="Controles do grafo">
            <button className="icon-btn" onClick={() => zoomAt(1.2)} aria-label="Aproximar"><LuPlus /></button>
            <button className="icon-btn" onClick={() => zoomAt(0.83)} aria-label="Afastar"><LuMinus /></button>
            <button className="icon-btn with-text" onClick={() => fit()}><LuLocateFixed /> <span>Centralizar</span></button>
          </div>
          <ul className="tree-legend" aria-label="Legenda dos tipos de adaptação">
            {ADAPTATION_TYPES.map((t) => <li key={t.id}><i style={{ background: t.color }} />{t.id}</li>)}
          </ul>
          <p className="tree-hint">{compact ? 'Toque em um nó para ver a prévia.' : 'Passe o mouse sobre um nó · arraste para mover · Ctrl + rolagem para zoom'}</p>

          {activeNode && (
            <PreviewCard
              node={activeNode} projects={projects} compact={compact} pos={cardPos} isCurrent={activeNode.id === currentId}
              onEnter={keep} onLeave={() => close()} onClose={() => setActiveId(null)} onCreate={onCreate} onMeasure={setCardH}
            />
          )}
        </div>
      )}
    </section>
  )
}

function PreviewCard({ node, projects, compact, pos, isCurrent, onEnter, onLeave, onClose, onCreate, onMeasure }) {
  const ref = useRef(null)
  useEffect(() => { // informa a altura real para o posicionamento não cortar a prévia
    const el = ref.current
    if (!el || compact) return
    onMeasure(el.offsetHeight)
    const ro = new ResizeObserver(() => onMeasure(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [node.id, compact]) // eslint-disable-line react-hooks/exhaustive-deps
  const p = node.project
  const parent = projects.find((x) => x.id === p.parentId)
  const types = p.adaptation?.types || []
  const style = compact ? undefined : { left: pos.left, top: pos.top, width: CARD_W }
  return (
    <>
      {compact && <div className="sheet-scrim" onClick={onClose} />}
      <article
        ref={ref}
        className={`tree-card ${compact ? 'is-sheet' : ''}`} data-side={pos?.side} style={style}
        onPointerEnter={onEnter} onPointerLeave={onLeave} onFocus={onEnter} onBlur={onLeave}
        role="dialog" aria-label={`Prévia: ${p.title}`}
      >
        {!compact && <i className="card-arrow" style={{ top: pos.arrow }} />}
        <Cover category={p.category} className="tree-card-cover" />
        <div className="tree-card-body">
          <div className="tree-card-tags">
            {node.depth === 0 ? <Chip tone="solid">Projeto original</Chip> : types.map((t) => <Chip key={t} style={{ '--dot': typeColor(t) }} tone="type">{t}</Chip>)}
          </div>
          <h3>{p.title}</h3>
          <p className="by"><Avatar name={p.author} size={22} /> <span>{p.author}</span> · <time dateTime={p.createdAt}>{formatDate(p.createdAt)}</time></p>
          {p.adaptation
            ? <p className="changed"><b>O que mudou:</b> {p.adaptation.changed}</p>
            : <p className="changed">{p.summary}</p>}
          {parent && <p className="from">Derivado de <b>{parent.title}</b></p>}
          <div className="tree-card-actions">
            {isCurrent
              ? <span className="here">Você está neste projeto</span>
              : <Link to={`/projetos/${p.id}`} className="btn btn-secondary btn-sm">Ver projeto <LuArrowRight /></Link>}
            <button className="btn btn-ghost btn-sm" onClick={() => onCreate(p)}><LuGitBranch /> Variante daqui</button>
            {compact && <button className="btn btn-ghost btn-sm" onClick={onClose}>Fechar</button>}
          </div>
        </div>
      </article>
    </>
  )
}
