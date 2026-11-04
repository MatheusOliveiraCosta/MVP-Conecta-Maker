import { useMemo, useState } from 'react'
import { LuArrowLeft, LuExternalLink, LuMapPin, LuPlus, LuWrench } from 'react-icons/lu'
import { Chip, Modal, Notice, PageHeader, Avatar } from '../components/ui.jsx'
import { CATEGORIES, cityPos, people, peopleByCity, spaces, tools } from '../data/seed.js'
import { Link } from '../router.jsx'
import { useStore } from '../store.jsx'
import { ProjectCard } from './Projects.jsx'

export function Collaborate() {
  const { needs, state, toggleInterest, addNeed, notify } = useStore()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('Todos')
  const [modal, setModal] = useState(false)
  const [f, setF] = useState({ title: '', description: '', category: 'Robótica' })
  const list = needs.filter((n) => (status === 'Todos' || n.status === status) && (n.title + n.description).toLocaleLowerCase('pt-BR').includes(q.toLocaleLowerCase('pt-BR')))

  const publish = (e) => {
    e.preventDefault()
    if (f.title.trim().length < 3 || f.description.trim().length < 10) return notify('Preencha o título e descreva a necessidade.')
    addNeed({ id: 'n' + Date.now(), title: f.title.trim(), description: f.description.trim(), category: f.category, status: 'Aberta', author: state.user, base: 0 })
    setModal(false); setF({ title: '', description: '', category: 'Robótica' }); notify('Necessidade publicada.')
  }

  return (
    <>
      <PageHeader eyebrow="Cocriação" title="Colaborar" subtitle="Necessidades reais encontram pessoas dispostas a aprender e construir juntas." />
      <Notice title="Necessidades ↔ Competências">Este banco promove cocriação e aprendizagem. Não é marketplace nem prestação de serviços: participantes desenvolvem soluções abertas em conjunto.</Notice>
      <button className="btn btn-primary" onClick={() => setModal(true)}><LuPlus /> Publicar necessidade</button>
      <div className="filters two"><input placeholder="Buscar necessidades" aria-label="Buscar necessidades" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Situação"><option>Todos</option><option>Aberta</option><option>Em desenvolvimento</option></select></div>
      <div className="grid grid-2 stagger">
        {list.map((n, i) => {
          const on = !!state.interest[n.id]
          return (
            <article className="card pad" key={n.id} style={{ '--i': i }}>
              <div className="between"><Chip tone="outline">{n.category}</Chip><Chip tone={n.status === 'Aberta' ? 'ok' : 'warn'}>{n.status}</Chip></div>
              <h3>{n.title}</h3><p className="muted">{n.description}</p>
              <p className="muted small">{n.author} · {n.base + (on ? 1 : 0)} {n.base + (on ? 1 : 0) === 1 ? 'pessoa colaborando' : 'pessoas colaborando'}</p>
              <button className={`btn btn-secondary btn-sm ${on ? 'is-on' : ''}`} onClick={() => { toggleInterest(n.id); notify(on ? 'Interesse retirado.' : 'Obrigado! Seu interesse foi registrado.') }}>{on ? 'Retirar interesse' : 'Quero colaborar'}</button>
            </article>
          )
        })}
      </div>
      {!list.length && <div className="empty"><p>Nenhuma necessidade encontrada.</p></div>}
      <h2>Banco de Competências</h2>
      <div className="grid grid-2">{[...people, { name: state.user, role: 'Colaborador', city: 'Bandeirantes', skills: ['Meus interesses'] }].map((p) => (
        <article className="card pad" key={p.name}><h3>{p.name}</h3><p className="muted">{p.role} · {p.city}</p><div className="tag-row">{p.skills.map((s) => <Chip key={s}>{s}</Chip>)}</div></article>
      ))}</div>
      {modal && (
        <Modal title="Publicar necessidade" onClose={() => setModal(false)}>
          <form onSubmit={publish} noValidate className="variant-form">
            <h2>Publicar necessidade</h2><p className="muted">Conte o contexto do desafio para convidar pessoas à cocriação.</p>
            <label htmlFor="nt">Título</label><input id="nt" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
            <label htmlFor="nd">Descreva a necessidade</label><textarea id="nd" rows={4} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
            <label htmlFor="nc">Categoria</label><select id="nc" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
            <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button><button className="btn btn-primary">Publicar necessidade</button></div>
          </form>
        </Modal>
      )}
    </>
  )
}

// Contorno ilustrativo do Brasil (apenas decorativo)
const BR = '34,8 44,6 52,10 60,12 70,18 80,24 88,30 93,38 92,46 86,56 80,66 72,76 66,86 58,92 50,86 46,76 42,68 34,64 26,60 18,52 14,42 18,34 24,24 30,14'

export function Network() {
  const [city, setCity] = useState(null)
  const [kind, setKind] = useState('Todos')
  const cities = useMemo(() => [...new Set(spaces.map((s) => s.city))].sort(), [])
  const list = spaces.filter((s) => (!city || s.city === city) && (kind === 'Todos' || s.kind === kind))
  return (
    <>
      <PageHeader eyebrow="Conexões locais" title="Rede Maker" subtitle="Descubra laboratórios, instituições e pessoas conectadas à cultura maker." />
      <section className="map-panel">
        <div className="map-head"><div><p className="eyebrow light">Conexões por localidade</p><h2>Pessoas e espaços na rede</h2><p>Escolha uma cidade para filtrar. Selecione-a novamente para voltar a ver todos.</p></div>
          <ul className="map-legend"><li><i className="dot-space" />Espaços</li><li><i className="dot-people" />Pessoas</li></ul></div>
        <div className="map-body">
          <div className="map" role="img" aria-label="Mapa ilustrativo do Brasil com as localidades cadastradas">
            <svg viewBox="0 0 100 100" aria-hidden="true"><polygon points={BR} />
              {Object.entries(cityPos).map(([c, [x, y]]) => (
                <g key={c} className={`pin ${city === c ? 'on' : ''}`} onClick={() => setCity(city === c ? null : c)} transform={`translate(${x} ${y})`}>
                  <circle r="4.2" className="halo" /><circle r="2" className={peopleByCity[c] ? 'p' : 's'} />
                  {city === c && <text y="-6.5" textAnchor="middle">{c}</text>}
                </g>
              ))}</svg>
          </div>
          <div className="city-grid">
            <button className={`city all ${!city ? 'on' : ''}`} onClick={() => setCity(null)}><LuMapPin /><span><b>Todos os lugares</b><small>Limpar seleção</small></span></button>
            {cities.map((c) => {
              const sp = spaces.filter((s) => s.city === c).length, pe = peopleByCity[c] || 0, uf = spaces.find((s) => s.city === c).uf
              return <button key={c} className={`city ${city === c ? 'on' : ''}`} onClick={() => setCity(city === c ? null : c)} aria-pressed={city === c}><LuMapPin /><span><b>{c}</b><small>{uf}</small><small>{sp} espaço · {pe} {pe === 1 ? 'pessoa' : 'pessoas'}</small></span></button>
            })}
          </div>
        </div>
        <p className="map-note">Mapa ilustrativo dos cadastros demonstrativos. Pontos posicionados de modo aproximado; não há geolocalização em tempo real.</p>
      </section>
      <Notice title="Cadastros demonstrativos">Parte dos espaços é fictícia para ilustrar a experiência. Consulte cada instituição para confirmar acesso e funcionamento.</Notice>
      <div className="filters two">
        <select value={city || 'Todos'} onChange={(e) => setCity(e.target.value === 'Todos' ? null : e.target.value)} aria-label="Cidade"><option>Todos</option>{cities.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Tipo"><option>Todos</option>{[...new Set(spaces.map((s) => s.kind))].map((k) => <option key={k}>{k}</option>)}</select>
      </div>
      <div className="grid grid-2 stagger">{list.map((s, i) => <SpaceCard key={s.id} s={s} i={i} />)}</div>
    </>
  )
}

export function SpaceCard({ s, i = 0 }) {
  return (
    <article className="card pad space-card" style={{ '--i': i }}>
      <p className="loc"><LuMapPin /> {s.city} · {s.uf}</p>
      <h3>{s.name}</h3><p className="muted">{s.short}</p>
      <div className="tag-row">{s.equipment.map((e) => <Chip key={e}>{e}</Chip>)}</div>
      <div className="card-foot flat"><span className="muted small">{s.kind}</span><Link to={`/rede/${s.id}`} className="btn btn-secondary btn-sm">Conhecer espaço</Link></div>
    </article>
  )
}

export function SpaceDetail({ id }) {
  const { projects } = useStore()
  const s = spaces.find((x) => x.id === id)
  if (!s) return <div className="empty"><p>Espaço não encontrado.</p></div>
  const related = projects.filter((p) => p.author.includes(s.name.split(' — ')[0].replace(' (fictício)', '')) || (s.id === 'uenp' && p.author.includes('UENP'))).slice(0, 2)
  return (
    <>
      <Link to="/rede" className="btn btn-secondary btn-sm back"><LuArrowLeft /> Rede Maker</Link>
      <article className="panel detail">
        <p className="eyebrow">{s.kind} · {s.city} / {s.uf}</p><h1>{s.name}</h1><p className="lead">{s.short}</p>
        <dl className="info-grid">{[['Funcionamento', s.hours], ['Situação', 'Cadastro demonstrativo'], ['Equipamentos', s.equipment.join(', ')], ['Competências', s.skills]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <h2>Cursos gratuitos</h2>
        <div className="row-card"><strong>Veja a lista de cursos demonstrativos</strong><Link to="/cursos" className="btn btn-secondary btn-sm">Ver cursos</Link></div>
        {related.length > 0 && <><h2>Projetos associados no ConectaMaker</h2><div className="grid grid-2">{related.map((p) => <ProjectCard key={p.id} p={p} parent={p.parentId} />)}</div></>}
        <h2>Mentores e formas de colaborar</h2>
        <p className="muted">Voluntários maker. Participe de projetos, compartilhe conhecimento ou publique uma necessidade para cocriar.</p>
        <Link to="/colaborar" className="btn btn-secondary">Explorar necessidades</Link>
      </article>
    </>
  )
}

export function Tools() {
  return (
    <>
      <PageHeader eyebrow="Recursos digitais" title="Ferramentas" subtitle="Escolha uma ferramenta para desenhar, simular, programar e fabricar." />
      <div className="grid grid-2 stagger">{tools.map((t, i) => (
        <article className="card pad" key={t.name} style={{ '--i': i }}>
          <span className="tool-ico"><LuWrench /></span><Chip tone="outline">{t.cat}</Chip>
          <h3>{t.name}</h3><p className="muted">{t.desc}</p>
          <div className="tag-row">{t.tags.map((g) => <Chip key={g}>{g}</Chip>)}</div><p className="muted small">{t.meta}</p>
          <a className="btn btn-secondary btn-sm" href={t.url} target="_blank" rel="noreferrer">Abrir ferramenta <LuExternalLink /></a>
        </article>))}
      </div>
      <Notice title="Primeiro contato com o fatiamento 3D">Modele e exporte um STL; abra-o no OrcaSlicer, escolha a impressora e o material, ajuste suportes e preenchimento, visualize as camadas e só então exporte o arquivo de impressão. Confirme os parâmetros da sua máquina com o laboratório.</Notice>
    </>
  )
}
