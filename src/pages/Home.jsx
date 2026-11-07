import { LuArrowRight, LuBookOpen, LuHeart, LuLayoutGrid, LuNetwork } from 'react-icons/lu'
import { needs, courses, spaces, trails } from '../data/seed.js'
import { Link } from '../router.jsx'
import { useStore } from '../store.jsx'
import { Chip } from '../components/ui.jsx'
import { ProjectCard } from './Projects.jsx'
import { TrailCard } from './Learn.jsx'
import { SpaceCard } from './Community.jsx'

const Head = ({ title, to, label }) => <div className="section-head tight"><h2>{title}</h2><Link to={to} className="btn btn-secondary btn-sm">{label} <LuArrowRight /></Link></div>

export default function Home() {
  const { projects } = useStore()
  const bannerImage = `${import.meta.env.BASE_URL}images/trilha-cultura-maker.png`
  return (
    <>
      <section className="hero" style={{ '--hero-photo': `url("${bannerImage}")` }}>
        <p className="eyebrow light">Cultura maker para a educação</p>
        <h1>O que você quer aprender, criar ou resolver hoje?</h1>
        <p>Conectamos pessoas, conhecimento e espaços maker para transformar necessidades reais em aprendizagem e soluções abertas.</p>
        <div className="actions"><Link to="/projetos" className="btn btn-amber">Explorar projetos</Link><Link to="/sobre" className="btn btn-ghost-light">Conheça o ConectaMaker em 1 minuto</Link></div>
      </section>

      <h2>Comece por aqui</h2>
      <div className="grid grid-2 start">
        {[[LuBookOpen, 'Quero aprender', 'Encontre uma trilha e avance no seu ritmo.', '/aprender'], [LuLayoutGrid, 'Quero criar', 'Explore projetos e faça sua adaptação.', '/projetos'], [LuHeart, 'Tenho uma necessidade', 'Publique um desafio para cocriar.', '/colaborar'], [LuNetwork, 'Quero compartilhar o que sei', 'Contribua com uma solução da comunidade.', '/rede']].map(([I, t, d, to]) => (
          <Link to={to} className="card pad start-card" key={t}><span className="tool-ico"><I /></span><h3>{t}</h3><p className="muted">{d}</p></Link>
        ))}
      </div>

      <Head title="Projetos para explorar" to="/projetos" label="Ver todos" />
      <div className="grid grid-3 stagger">{projects.filter((p) => !p.parentId).slice(0, 3).map((p, i) => <div key={p.id} style={{ '--i': i }}><ProjectCard p={p} /></div>)}</div>
      <Head title="Trilhas recomendadas" to="/aprender" label="Ver trilhas" />
      <div className="grid grid-3 stagger">{trails.slice(0, 3).map((t, i) => <div key={t.id} style={{ '--i': i }}><TrailCard t={t} /></div>)}</div>
      <Head title="Cursos gratuitos de instituições" to="/cursos" label="Ver cursos" />
      <div className="grid grid-2">{courses.slice(0, 2).map((c) => (
        <article className="card pad" key={c.id}><p className="eyebrow">Gratuito · {c.mode}</p><h3>{c.title}</h3><p className="muted">{c.summary}</p><p className="space-name">{c.space}</p>
          <div className="card-foot flat"><span className="muted small">Oferta demonstrativa</span><Link to={`/cursos/${c.id}`} className="btn btn-secondary btn-sm">Conhecer curso</Link></div></article>))}</div>
      <Head title="Necessidades da comunidade" to="/colaborar" label="Ver banco" />
      <div className="grid grid-2">{needs.slice(0, 2).map((n) => (
        <article className="card pad" key={n.id}><div className="between"><Chip tone="outline">{n.category}</Chip><Chip tone="ok">{n.status}</Chip></div><h3>{n.title}</h3><p className="muted">{n.description}</p><Link to="/colaborar" className="btn btn-secondary btn-sm">Quero colaborar</Link></article>))}</div>
      <Head title="Espaços maker cadastrados" to="/rede" label="Ver rede" />
      <div className="grid grid-2">{spaces.slice(0, 2).map((s) => <SpaceCard key={s.id} s={s} />)}</div>
      <section className="cta-band"><p><b>Faça parte desta jornada</b><br />Salve projetos, registre adaptações e participe de necessidades da comunidade.</p><Link to="/projetos" className="btn btn-primary">Criar conta gratuita</Link></section>
    </>
  )
}
