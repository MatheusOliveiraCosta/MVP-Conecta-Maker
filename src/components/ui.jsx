import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { LuAccessibility, LuBot, LuBox, LuCalculator, LuCode, LuCpu, LuLeaf, LuLightbulb, LuPalette, LuScissors, LuX } from 'react-icons/lu'

const CATEGORY_STYLE = {
  Acessibilidade: { icon: LuAccessibility, from: '#2c8c93', to: '#5fc3b4' },
  Eletrônica: { icon: LuCpu, from: '#265f8f', to: '#5b9fd0' },
  Matemática: { icon: LuCalculator, from: '#b9772a', to: '#efb866' },
  Sustentabilidade: { icon: LuLeaf, from: '#2f7d55', to: '#7cc68d' },
  Robótica: { icon: LuBot, from: '#a8552f', to: '#e59a6d' },
  Programação: { icon: LuCode, from: '#5b4fa8', to: '#9a8be0' },
  'Arte e Design': { icon: LuPalette, from: '#a54370', to: '#e08aae' },
  Educação: { icon: LuLightbulb, from: '#3d7a8c', to: '#86c3d1' },
}
export const ICONS = { cut: LuScissors, chip: LuCpu, cube: LuBox, access: LuAccessibility, code: LuCode, idea: LuLightbulb, robot: LuBot }

/** Capa ilustrativa (o MVP não tem fotos reais): gradiente + ícone da categoria. */
export function Cover({ category, icon, image, shape = 'rect', className = '' }) {
  const s = CATEGORY_STYLE[category] || CATEGORY_STYLE.Educação
  const Icon = icon || s.icon
  return (
    <div className={`cover cover-${shape} ${image ? 'has-image' : ''} ${className}`} style={{ '--c1': s.from, '--c2': s.to }} aria-hidden="true">
      {image ? <img className="cover-image" src={image} alt="" /> : <><i className="cover-dots" /><Icon className="cover-icon" /></>}
    </div>
  )
}

export const Chip = ({ children, tone = 'soft', ...p }) => <span className={`chip chip-${tone}`} {...p}>{children}</span>

export function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <header className="page-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {subtitle && <p className="lead">{subtitle}</p>}
      {children}
    </header>
  )
}

export function Notice({ title, children }) {
  return <aside className="notice"><strong>{title}</strong><p>{children}</p></aside>
}

export function Avatar({ name, size = 28 }) {
  return <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">{(name || '?')[0].toUpperCase()}</span>
}

/** Modal acessível: Esc fecha, foco entra e volta, rolagem do fundo travada. */
export function Modal({ title, onClose, children, wide = false }) {
  const ref = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    const first = ref.current?.querySelector('input, textarea, select, button')
    first?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') { // prende o foco dentro do modal
        const f = [...ref.current.querySelectorAll('a[href], button:not([disabled]), input, textarea, select')]
        if (!f.length) return
        const a = f[0], z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; prev?.focus?.() }
  }, [onClose])
  return createPortal((
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Fechar"><LuX /></button>
        {children}
      </div>
    </div>
  ), document.body)
}

export const formatDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '')
