import { useMemo, useState } from 'react'
import { LuGitBranch, LuCheck } from 'react-icons/lu'
import { ADAPTATION_TYPES, LEVELS } from '../data/seed.js'
import { useStore } from '../store.jsx'
import { Avatar, Chip, Cover, Modal } from './ui.jsx'

const MAX = 140
const CREDITS = ['Crédito ao autor original (padrão)', 'CC BY — atribuição', 'CC BY-SA — atribuição e compartilhamento igual']
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Formulário "Criar variante": o novo projeto nasce com parentId apontando para o projeto de origem. */
export default function VariantModal({ parent, onClose, onPublished }) {
  const { state, addProject, projects, notify } = useStore()
  const [title, setTitle] = useState('')
  const [types, setTypes] = useState([])
  const [changed, setChanged] = useState('')
  const [materials, setMaterials] = useState(parent.materials?.join(', ') || '')
  const [level, setLevel] = useState(parent.level)
  const [credit, setCredit] = useState(CREDITS[0])
  const [touched, setTouched] = useState(false)

  const errors = useMemo(() => ({
    title: title.trim().length < 3 ? 'Dê um título com pelo menos 3 letras.' : '',
    types: types.length ? '' : 'Escolha ao menos um tipo de adaptação.',
    changed: changed.trim().length < 10 ? 'Conte em poucas palavras o que você mudou.' : '',
  }), [title, types, changed])
  const valid = !errors.title && !errors.types && !errors.changed

  const toggle = (t) => setTypes((a) => (a.includes(t) ? a.filter((x) => x !== t) : [...a, t]))

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    let id = slug(title) || 'variante'
    while (projects.some((p) => p.id === id)) id += '-2'
    addProject({
      id, parentId: parent.id, title: title.trim(), category: parent.category, level, duration: parent.duration,
      summary: changed.trim(), author: state.user, likes: 0, tags: [...types], audience: parent.audience,
      materials: materials.split(',').map((m) => m.trim()).filter(Boolean), tools: parent.tools || [],
      adaptation: { types, changed: changed.trim(), credit }, steps: parent.steps || [], createdAt: new Date().toISOString().slice(0, 10),
    })
    notify('Variante publicada! Ela já aparece na árvore de adaptações.')
    onPublished(id)
  }

  const showErr = (k) => touched && errors[k] && <p className="field-error" role="alert">{errors[k]}</p>

  return (
    <Modal title="Criar variante" onClose={onClose} wide>
      <div className="variant-grid">
        <form onSubmit={submit} noValidate className="variant-form">
          <p className="eyebrow">Remix com crédito</p>
          <h2>Criar variante</h2>
          <p className="based-on"><LuGitBranch /> Baseado em: <b>{parent.title}</b>, por {parent.author}</p>

          <label htmlFor="v-title">Título da variante</label>
          <input id="v-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`Ex.: ${parent.title} em Libras`} aria-invalid={touched && !!errors.title} />
          {showErr('title')}

          <fieldset>
            <legend>Tipo de adaptação</legend>
            <div className="chip-picker">
              {ADAPTATION_TYPES.map((t) => (
                <button type="button" key={t.id} className={`pick ${types.includes(t.id) ? 'on' : ''}`} onClick={() => toggle(t.id)} aria-pressed={types.includes(t.id)} style={{ '--dot': t.color }}>
                  {types.includes(t.id) ? <LuCheck /> : <i />}{t.id}
                </button>
              ))}
            </div>
            {showErr('types')}
          </fieldset>

          <label htmlFor="v-changed">O que você mudou? <span className={`counter ${changed.length > MAX - 15 ? 'warn' : ''}`}>{changed.length}/{MAX}</span></label>
          <textarea id="v-changed" rows={3} maxLength={MAX} value={changed} onChange={(e) => setChanged(e.target.value)} placeholder="Ex.: Troca a impressão 3D por papelão para reduzir o custo." aria-invalid={touched && !!errors.changed} />
          {showErr('changed')}

          <div className="two-col">
            <div><label htmlFor="v-level">Dificuldade</label>
              <select id="v-level" value={level} onChange={(e) => setLevel(e.target.value)}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select></div>
            <div><label htmlFor="v-credit">Crédito e licença</label>
              <select id="v-credit" value={credit} onChange={(e) => setCredit(e.target.value)}>{CREDITS.map((c) => <option key={c}>{c}</option>)}</select></div>
          </div>

          <label htmlFor="v-mat">Materiais (separados por vírgula)</label>
          <input id="v-mat" value={materials} onChange={(e) => setMaterials(e.target.value)} />

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Publicar variante</button>
          </div>
        </form>

        <aside className="variant-preview" aria-label="Pré-visualização na árvore">
          <p className="eyebrow">Pré-visualização</p>
          <div className="mini-tree">
            <div className="mini-node"><Cover category={parent.category} shape="circle" /><span>{parent.title}</span></div>
            <svg viewBox="0 0 60 20" aria-hidden="true"><path d="M2 10 H52" /><path d="M46 4 L54 10 L46 16z" /></svg>
            <div className="mini-node is-new"><Cover category={parent.category} shape="circle" /><span>{title || 'Sua variante'}</span></div>
          </div>
          <article className="tree-card static">
            <Cover category={parent.category} className="tree-card-cover" />
            <div className="tree-card-body">
              <div className="tree-card-tags">{types.length ? types.map((t) => <Chip key={t} tone="type" style={{ '--dot': ADAPTATION_TYPES.find((x) => x.id === t).color }}>{t}</Chip>) : <Chip>Tipo de adaptação</Chip>}</div>
              <h3>{title || 'Título da variante'}</h3>
              <p className="by"><Avatar name={state.user} size={22} /> {state.user} · hoje</p>
              <p className="changed"><b>O que mudou:</b> {changed || 'Descreva sua adaptação…'}</p>
              <p className="from">Derivado de <b>{parent.title}</b></p>
            </div>
          </article>
        </aside>
      </div>
    </Modal>
  )
}
