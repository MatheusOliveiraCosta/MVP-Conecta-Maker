import { LuArrowLeft, LuBookOpen, LuCheck, LuFileText } from 'react-icons/lu'
import { Chip, Cover, ICONS, Notice, PageHeader } from '../components/ui.jsx'
import { courses, trails } from '../data/seed.js'
import { Link } from '../router.jsx'
import { useStore } from '../store.jsx'

const trailCategory = { cut: 'Arte e Design', chip: 'Eletrônica', cube: 'Arte e Design', access: 'Acessibilidade', code: 'Programação', idea: 'Educação', robot: 'Robótica' }

export function TrailCard({ t }) {
  const { state } = useStore()
  const done = (state.done[t.id] || []).length
  const pct = Math.round((done / t.lessons.length) * 100)
  return (
    <article className="card">
      <Cover category={trailCategory[t.icon]} icon={ICONS[t.icon]} image={t.cover} />
      <div className="card-body">
        <h3><Link to={`/aprender/${t.id}`}>{t.title}</Link></h3>
        <p className="muted">{t.summary}</p>
        <div className="tag-row"><Chip tone="plain">{t.level}</Chip><Chip tone="plain">{t.modules} {t.unit || 'módulos'}</Chip></div>
        <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso"><i style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="card-foot"><span className="muted small">{pct}% concluído</span><Link to={`/aprender/${t.id}`} className="btn btn-secondary btn-sm">Continuar trilha</Link></div>
    </article>
  )
}

export function Learn() {
  return (
    <>
      <PageHeader eyebrow="Aprendizagem guiada" title="Aprender" subtitle="Trilhas curtas e práticas para transformar curiosidade em protótipos." />
      <Notice title="Recomendadas para colaborador">As trilhas mais alinhadas ao seu perfil aparecem primeiro.</Notice>
      <div className="grid grid-2 stagger">{trails.map((t, i) => <div key={t.id} style={{ '--i': i }}><TrailCard t={t} /></div>)}</div>
    </>
  )
}

export function TrailDetail({ id }) {
  const { state, toggleLesson, notify } = useStore()
  const t = trails.find((x) => x.id === id)
  if (!t) return <div className="empty"><p>Trilha não encontrada.</p></div>
  const done = state.done[t.id] || []
  const pct = Math.round((done.length / t.lessons.length) * 100)
  return (
    <>
      <Link to="/aprender" className="btn btn-secondary btn-sm back"><LuArrowLeft /> Todas as trilhas</Link>
      <article className="panel detail">
        <p className="eyebrow">{t.level} · {t.modules} {t.unit || 'módulos'}</p>
        <h1>{t.title}</h1><p className="lead">{t.summary}</p>
        <Cover category={trailCategory[t.icon]} icon={ICONS[t.icon]} image={t.cover} className="detail-cover" />
        <div className="progress big" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${pct}%` }} /></div>
        <p className="muted">{done.length} de {t.lessons.length} aulas concluídas · {pct}%</p>
        <h2>Aulas</h2>
        <ul className="lessons">
          {t.lessons.map(([title, desc], i) => {
            const ok = done.includes(i)
            return (
              <li key={title} className={ok ? 'ok' : ''}>
                <div><strong>{String(i + 1).padStart(2, '0')}. {title}</strong><p className="muted">{desc}</p></div>
                <button className={`btn btn-secondary ${ok ? 'is-on' : ''}`} onClick={() => { toggleLesson(t.id, i); if (!ok && done.length + 1 === t.lessons.length) notify('Parabéns! Você concluiu a trilha.') }}>{ok ? <><LuCheck /> Concluída</> : 'Marcar como concluída'}</button>
              </li>
            )
          })}
        </ul>
      </article>
    </>
  )
}

export function Courses() {
  return (
    <>
      <PageHeader eyebrow="Aprendizagem em rede" title="Cursos gratuitos" subtitle="Conheça os cursos que instituições cadastradas poderão oferecer à comunidade." />
      <Notice title="Catálogo demonstrativo">Os cursos abaixo ilustram futuras ofertas gratuitas. Datas, vagas e inscrições dependem de confirmação das instituições.</Notice>
      <div className="grid grid-2 stagger">
        {courses.map((c, i) => (
          <article className="card" key={c.id} style={{ '--i': i }}>
            <Cover category={trailCategory[c.icon]} icon={ICONS[c.icon]} />
            <div className="card-body">
              <p className="eyebrow">Gratuito · {c.mode}</p>
              <h3><Link to={`/cursos/${c.id}`}>{c.title}</Link></h3>
              <p className="muted">{c.summary}</p><p className="space-name">{c.space}</p>
              <div className="tag-row"><Chip tone="plain">{c.level}</Chip><Chip tone="plain">Agenda a confirmar</Chip></div>
            </div>
            <div className="card-foot"><span className="muted small">Oferta demonstrativa</span><Link to={`/cursos/${c.id}`} className="btn btn-secondary btn-sm">Conhecer curso</Link></div>
          </article>
        ))}
      </div>
    </>
  )
}

export function CourseDetail({ id }) {
  const { state, toggleEnroll, notify } = useStore()
  const c = courses.find((x) => x.id === id)
  if (!c) return <div className="empty"><p>Curso não encontrado.</p></div>
  const on = state.enrolled[c.id]
  return (
    <>
      <Link to="/cursos" className="btn btn-secondary btn-sm back"><LuArrowLeft /> Todos os cursos</Link>
      <article className="panel detail">
        <p className="eyebrow">Curso gratuito · {c.mode} · {c.level}</p>
        <h1>{c.title}</h1><p className="lead">{c.summary}</p>
        <Cover category={trailCategory[c.icon]} icon={ICONS[c.icon]} className="detail-cover" />
        <Notice title="Curso demonstrativo; agenda a confirmar">Esta página ilustra uma oferta de curso. Consulte a instituição para confirmar abertura, datas, vagas e forma de inscrição.</Notice>
        <h2>O que você vai aprender</h2>
        <ol className="steps">{c.learn.map((l) => <li key={l}>{l}</li>)}</ol>
        <h2>Instituição responsável</h2><p className="muted">{c.space} · exemplo demonstrativo</p>
        <div className="actions">
          <button className={`btn btn-primary ${on ? 'is-on' : ''}`} onClick={() => { toggleEnroll(c.id); notify(on ? 'Interesse removido.' : 'Interesse registrado. A instituição confirmará a agenda.') }}>{on ? 'Interesse registrado ✓' : 'Tenho interesse'}</button>
          <Link to={`/rede/${c.spaceId}`} className="btn btn-secondary">Conhecer instituição</Link>
          <Link to={`/aprender/${c.trailId}`} className="btn btn-secondary">Explorar trilha relacionada</Link>
        </div>
      </article>
    </>
  )
}
