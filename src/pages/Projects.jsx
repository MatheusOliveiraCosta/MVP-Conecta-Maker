import { useEffect, useMemo, useState } from 'react'
import { LuArrowRight, LuGitBranch, LuHeart, LuPlus, LuDownload, LuArrowLeft } from 'react-icons/lu'
import AdaptationTree from '../components/AdaptationTree.jsx'
import VariantModal from '../components/VariantModal.jsx'
import { Chip, Cover, Notice, PageHeader, Avatar } from '../components/ui.jsx'
import { CATEGORIES, LEVELS } from '../data/seed.js'
import { Link, useRouter } from '../router.jsx'
import { useStore } from '../store.jsx'

export function ProjectCard({ p, parent }) {
  const { state } = useStore()
  return (
    <article className="card project-card">
      <Link to={`/projetos/${p.id}`} className="card-cover-link" tabIndex={-1} aria-hidden="true"><Cover category={p.category} /></Link>
      <div className="card-body">
        <div className="tag-row"><Chip>{p.category}</Chip>{parent && <Chip tone="type" style={{ '--dot': '#17909c' }}><LuGitBranch /> Variante</Chip>}</div>
        <h3><Link to={`/projetos/${p.id}`}>{p.title}</Link></h3>
        <p className="muted">{p.summary}</p>
        <div className="tag-row"><Chip tone="plain">{p.level}</Chip><Chip tone="plain">{p.duration}</Chip></div>
      </div>
      <div className="card-foot">
        <span className="muted small">{p.author} · <LuHeart className="inline" /> {p.likes + (state.saved.includes(p.id) ? 1 : 0)}</span>
        <Link to={`/projetos/${p.id}`} className="btn btn-secondary btn-sm">Explorar <LuArrowRight /></Link>
      </div>
    </article>
  )
}

export function Projects() {
  const { projects } = useStore()
  const { query } = useRouter()
  const [q, setQ] = useState(query.get('q') || '')
  const [cat, setCat] = useState('Todos')
  const [level, setLevel] = useState('Todos')
  const [sort, setSort] = useState('Relevância')
  useEffect(() => setQ(query.get('q') || ''), [query])

  const list = useMemo(() => {
    const t = q.trim().toLocaleLowerCase('pt-BR')
    const out = projects.filter((p) => (cat === 'Todos' || p.category === cat) && (level === 'Todos' || p.level === level) &&
      (!t || [p.title, p.summary, p.category, p.author, ...(p.tags || [])].join(' ').toLocaleLowerCase('pt-BR').includes(t)))
    if (sort === 'Mais curtidos') out.sort((a, b) => b.likes - a.likes)
    if (sort === 'Mais recentes') out.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return out
  }, [projects, q, cat, level, sort])

  return (
    <>
      <PageHeader eyebrow="Biblioteca aberta" title="Projetos maker" subtitle="Descubra, adapte e documente projetos para diferentes contextos educacionais." />
      <div className="filters">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pelo título" aria-label="Buscar pelo título" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Categoria"><option>Todos</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Dificuldade"><option>Todos</option>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar"><option>Relevância</option><option>Mais curtidos</option><option>Mais recentes</option></select>
        <Link to="/projetos/novo" className="btn btn-secondary"><LuPlus /> Novo projeto</Link>
      </div>
      <p className="muted small" aria-live="polite">{list.length} projeto(s) encontrado(s)</p>
      {list.length ? <div className="grid grid-2 stagger">{list.map((p, i) => <div key={p.id} style={{ '--i': i }}><ProjectCard p={p} parent={p.parentId} /></div>)}</div>
        : <div className="empty"><p>Nenhum projeto encontrado. Tente outro termo ou filtro.</p></div>}
    </>
  )
}

export function ProjectDetail({ id }) {
  const { getProject, projects, state, toggleSaved, addComment, notify } = useStore()
  const { navigate } = useRouter()
  const p = getProject(id)
  const [variantFor, setVariantFor] = useState(null)
  const [highlight, setHighlight] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => { document.title = p ? `${p.title} — ConectaMaker` : 'ConectaMaker'; return () => { document.title = 'ConectaMaker — Cultura maker para educação' } }, [p])
  if (!p) return <div className="empty"><p>Projeto não encontrado.</p><Link to="/projetos" className="btn btn-secondary">Voltar aos projetos</Link></div>

  const parent = p.parentId && getProject(p.parentId)
  const saved = state.saved.includes(p.id)
  const comments = state.comments[p.id] || []
  const info = [['Autoria', p.author], ['Público · duração', `${p.audience} · ${p.duration}`], ['Materiais', p.materials?.join(', ')], ['Ferramentas e equipamentos', p.tools?.join(', ')]]

  const published = (newId) => {
    setVariantFor(null); setHighlight(newId)
    setTimeout(() => document.getElementById('tree-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
    setTimeout(() => setHighlight(null), 4500)
  }

  return (
    <>
      <Link to="/projetos" className="btn btn-secondary btn-sm back"><LuArrowLeft /> Todos os projetos</Link>
      <article className="panel detail">
        <p className="eyebrow">{p.category} · {p.level}</p>
        <h1>{p.title}</h1>
        <p className="lead">{p.summary}</p>
        {parent && <p className="derived"><LuGitBranch /> Variante de <Link to={`/projetos/${parent.id}`}>{parent.title}</Link>{p.adaptation && <> — {p.adaptation.changed}</>}</p>}
        <Cover category={p.category} className="detail-cover" />
        <div className="tag-row">{p.tags?.map((t) => <Chip key={t}>{t}</Chip>)}</div>
        <dl className="info-grid">{info.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>

        <div className="actions">
          <button className={`btn btn-secondary ${saved ? 'is-on' : ''}`} onClick={() => { toggleSaved(p.id); notify(saved ? 'Projeto removido dos salvos.' : 'Projeto salvo!') }} aria-pressed={saved}><LuHeart /> {saved ? 'Projeto salvo' : 'Salvar projeto'}</button>
          <button className="btn btn-secondary" onClick={() => notify('Registramos seu interesse em aprender a fazer.')}>Quero aprender a fazer</button>
          <button className="btn btn-secondary" onClick={() => navigate('/colaborar')}>Tenho uma necessidade parecida</button>
          <button className="btn btn-secondary" onClick={() => setVariantFor(p)}><LuGitBranch /> Criar remix</button>
          <button className="btn btn-secondary" onClick={() => notify('Obrigado! Contribuições são registradas neste navegador.')}>Posso contribuir</button>
        </div>

        {p.needsEquipment && (
          <Notice title="Não tenho este equipamento">
            Explore espaços cadastrados para encontrar recursos de fabricação. <Link to="/rede" className="btn btn-secondary btn-sm">Encontrar laboratório →</Link>
          </Notice>
        )}

        <h2>Etapas de execução</h2>
        <ol className="steps">{p.steps?.map((s, i) => <li key={i}>{s}</li>)}</ol>

        {p.files && (
          <>
            <h2>Arquivo de corte do quadro analógico</h2>
            <p className="muted">Desenho vetorial original com painel, laterais, números, meses e ícones das tarefas. Confira medidas, material e parâmetros da máquina antes do corte.</p>
            <button className="btn btn-primary" onClick={() => notify('Download demonstrativo: no MVP não há arquivo real.')}>{p.files.svg} ↓</button>
            <h2>Peças para impressão 3D</h2>
            <p className="muted">Arquivos STL do pino e da metade do slider do quadro analógico. Prepare os modelos em um fatiador e confira as dimensões antes de imprimir.</p>
            <div className="actions">{p.files.stl.map((f) => <button key={f} className="btn btn-secondary btn-sm" onClick={() => notify('Download demonstrativo: no MVP não há arquivo real.')}>{f} <LuDownload /></button>)}</div>
          </>
        )}

        <AdaptationTree projects={projects} currentId={p.id} highlightId={highlight} onCreate={setVariantFor} />

        <h2>Comentários e aprendizados</h2>
        {comments.length ? <ul className="comments">{comments.map((c) => <li key={c.id}><strong>{c.author}</strong><p>{c.text}</p></li>)}</ul> : <p className="muted">Seja a primeira pessoa a compartilhar um aprendizado.</p>}
        <form onSubmit={(e) => { e.preventDefault(); if (!comment.trim()) return notify('Escreva um comentário antes de publicar.'); addComment(p.id, comment.trim()); setComment('') }}>
          <label htmlFor="comment">Compartilhe uma ideia ou adaptação</label>
          <textarea id="comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
          <button className="btn btn-primary" type="submit">Publicar comentário</button>
        </form>
      </article>
      {variantFor && <VariantModal parent={variantFor} onClose={() => setVariantFor(null)} onPublished={published} />}
    </>
  )
}

export function NewProject() {
  const { addProject, projects, state, notify } = useStore()
  const { navigate } = useRouter()
  const [f, setF] = useState({ title: '', description: '', category: 'Robótica', level: 'Iniciante', materials: '', tools: '', steps: '' })
  const [err, setErr] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const list = (s, sep) => s.split(sep).map((x) => x.trim()).filter(Boolean)

  const submit = (e) => {
    e.preventDefault()
    if (f.title.trim().length < 3 || f.description.trim().length < 10) return setErr(true)
    let id = f.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'projeto'
    while (projects.some((p) => p.id === id)) id += '-2'
    addProject({ id, title: f.title.trim(), category: f.category, level: f.level, duration: 'A definir', summary: f.description.trim(), author: state.user, likes: 0, tags: [f.category], audience: 'Comunidade', materials: list(f.materials, ','), tools: list(f.tools, ','), steps: list(f.steps, '\n'), createdAt: new Date().toISOString().slice(0, 10) })
    notify('Projeto publicado neste navegador.')
    navigate(`/projetos/${id}`)
  }

  return (
    <>
      <PageHeader eyebrow="Compartilhe uma ideia" title="Novo projeto" subtitle="Documente um protótipo para que outras pessoas possam aprender e adaptar." />
      <form className="panel form" onSubmit={submit} noValidate>
        <label htmlFor="t">Título</label><input id="t" value={f.title} onChange={set('title')} aria-invalid={err && f.title.trim().length < 3} />
        <label htmlFor="d">Descrição</label><textarea id="d" rows={4} value={f.description} onChange={set('description')} aria-invalid={err && f.description.trim().length < 10} />
        {err && <p className="field-error" role="alert">Preencha o título e uma descrição com pelo menos 10 caracteres.</p>}
        <div className="two-col">
          <div><label htmlFor="c">Categoria</label><select id="c" value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label htmlFor="l">Dificuldade</label><select id="l" value={f.level} onChange={set('level')}>{LEVELS.map((c) => <option key={c}>{c}</option>)}</select></div>
        </div>
        <label htmlFor="m">Materiais (separados por vírgula)</label><input id="m" value={f.materials} onChange={set('materials')} />
        <label htmlFor="f">Ferramentas (separadas por vírgula)</label><input id="f" value={f.tools} onChange={set('tools')} />
        <label htmlFor="s">Etapas (uma por linha)</label><textarea id="s" rows={4} value={f.steps} onChange={set('steps')} />
        <div><button className="btn btn-primary" type="submit">Publicar projeto</button></div>
      </form>
    </>
  )
}
