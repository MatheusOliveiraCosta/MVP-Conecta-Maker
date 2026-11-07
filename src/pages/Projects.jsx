import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { LuArrowRight, LuGitBranch, LuHeart, LuPlus, LuDownload, LuArrowLeft, LuExternalLink, LuTrash2 } from 'react-icons/lu'
import AdaptationTree from '../components/AdaptationTree.jsx'
import VariantModal from '../components/VariantModal.jsx'
import { Chip, Cover, Notice, PageHeader, Avatar } from '../components/ui.jsx'
import { CATEGORIES, LEVELS } from '../data/seed.js'
import { Link, useRouter } from '../router.jsx'
import { useStore } from '../store.jsx'

const MAX_IMAGE_SIZE = 3 * 1024 * 1024
const MAX_FILE_SIZE = 8 * 1024 * 1024
const EMBED_HOSTS = ['tinkercad.com', 'youtube.com', 'youtu.be', 'sketchfab.com', 'vimeo.com']

// Arquivos em `public/` precisam acompanhar a base definida pelo Vite.
// Usar o caminho absoluto original (`/arquivos/...`) quebra quando o build é
// servido em um subcaminho, algo comum em deploys estáticos e previews.
const resolveAssetUrl = (value) => {
  if (!value || /^(?:https?:|data:|blob:)/i.test(value)) return value
  return `${import.meta.env.BASE_URL}${value.replace(/^\/+/, '')}`
}

const readFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve({ name: file.name, type: file.type || 'application/octet-stream', size: file.size, data: reader.result })
  reader.onerror = reject
  reader.readAsDataURL(file)
})

const isAllowedEmbed = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && EMBED_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))
  } catch { return false }
}

const formatSize = (size) => size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`

function SoftwareStlPreview({ url, title }) {
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const modelRef = useRef(null)
  const viewRef = useRef({ yaw: .55, pitch: .45, zoom: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const context = canvas.getContext('2d')
    if (!context) {
      setStatus('error')
      return undefined
    }
    let disposed = false
    let frame
    const controller = new AbortController()
    const loader = new STLLoader()

    const draw = () => {
      if (disposed || !modelRef.current) return
      const { triangles } = modelRef.current
      const { yaw, pitch, zoom } = viewRef.current
      const width = canvas.clientWidth || 280
      const height = canvas.clientHeight || 260
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.fillStyle = '#edf5f6'
      context.fillRect(0, 0, width, height)
      const cosY = Math.cos(yaw), sinY = Math.sin(yaw)
      const cosX = Math.cos(pitch), sinX = Math.sin(pitch)
      const scale = Math.min(width, height) * .34 * zoom
      const project = ([x, y, z]) => {
        const rotatedX = x * cosY - z * sinY
        const rotatedZ = x * sinY + z * cosY
        const rotatedY = y * cosX - rotatedZ * sinX
        const depth = y * sinX + rotatedZ * cosX + 4
        return [width / 2 + rotatedX * scale / depth, height / 2 - rotatedY * scale / depth, depth]
      }
      const projected = triangles.map((triangle) => triangle.map(project))
      projected.sort((a, b) => (a[0][2] + a[1][2] + a[2][2]) - (b[0][2] + b[1][2] + b[2][2]))
      for (const triangle of projected) {
        const [a, b, c] = triangle
        const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        const light = Math.max(.35, Math.min(1, .55 + Math.abs(cross) / (scale * scale * .08)))
        context.beginPath()
        context.moveTo(a[0], a[1])
        context.lineTo(b[0], b[1])
        context.lineTo(c[0], c[1])
        context.closePath()
        context.fillStyle = `rgb(${Math.round(49 * light)}, ${Math.round(137 * light)}, ${Math.round(149 * light)})`
        context.fill()
      }
    }
    const scheduleDraw = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    }
    const resizeObserver = new ResizeObserver(scheduleDraw)
    resizeObserver.observe(canvas)
    const onPointerDown = (event) => {
      canvas.setPointerCapture(event.pointerId)
      canvas.dataset.dragX = event.clientX
      canvas.dataset.dragY = event.clientY
    }
    const onPointerMove = (event) => {
      if (!canvas.hasPointerCapture(event.pointerId)) return
      const previousX = Number(canvas.dataset.dragX)
      const previousY = Number(canvas.dataset.dragY)
      viewRef.current.yaw += (event.clientX - previousX) * .01
      viewRef.current.pitch = Math.max(-1.4, Math.min(1.4, viewRef.current.pitch + (event.clientY - previousY) * .01))
      canvas.dataset.dragX = event.clientX
      canvas.dataset.dragY = event.clientY
      scheduleDraw()
    }
    const onWheel = (event) => {
      event.preventDefault()
      viewRef.current.zoom = Math.max(.45, Math.min(2.8, viewRef.current.zoom * (event.deltaY < 0 ? 1.1 : .9)))
      scheduleDraw()
    }
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    fetch(resolveAssetUrl(url), { signal: controller.signal, cache: 'no-cache' })
      .then((response) => {
        if (!response.ok) throw new Error(`STL indisponível (${response.status})`)
        return response.arrayBuffer()
      })
      .then((buffer) => {
        const geometry = loader.parse(buffer)
        geometry.center()
        geometry.computeBoundingSphere()
        geometry.scale(1.35 / (geometry.boundingSphere?.radius || 1), 1.35 / (geometry.boundingSphere?.radius || 1), 1.35 / (geometry.boundingSphere?.radius || 1))
        const positions = geometry.getAttribute('position').array
        const triangles = []
        for (let index = 0; index < positions.length; index += 9) {
          triangles.push([
            [positions[index], positions[index + 1], positions[index + 2]],
            [positions[index + 3], positions[index + 4], positions[index + 5]],
            [positions[index + 6], positions[index + 7], positions[index + 8]],
          ])
        }
        geometry.dispose()
        if (disposed) return
        modelRef.current = { triangles }
        setStatus('ready')
        scheduleDraw()
      })
      .catch((error) => {
        if (!disposed && error.name !== 'AbortError') setStatus('error')
      })

    return () => {
      disposed = true
      controller.abort()
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [url])

  return <div className="stl-viewer">
    {status === 'error' ? <div className="stl-fallback" role="img" aria-label={`Prévia 3D indisponível de ${title}`}><span aria-hidden="true">◇</span><p>Não foi possível renderizar este STL.</p><small>Use o botão “Baixar” para abrir o STL em um fatiador.</small></div> : <canvas className="stl-preview" ref={canvasRef} role="img" aria-label={`Prévia 3D de ${title}`} />}
    {status === 'ready' && <p className="stl-help">Arraste para girar · roda do mouse ou pinça para zoom</p>}
  </div>
}

function WebglStlPreview({ url, title }) {
  const mountRef = useRef(null)
  const [status, setStatus] = useState('loading')
  useEffect(() => {
    const container = mountRef.current
    if (!container) return undefined
    let disposed = false
    let active = false
    let frame
    let resizeObserver
    let visibilityObserver
    let mesh
    let renderer
    let controls
    const requestController = new AbortController()
    setStatus('loading')

    const fail = () => {
      if (!disposed) setStatus('error')
    }
    const requestTimeout = setTimeout(() => {
      requestController.abort()
      setStatus('software')
    }, 15000)

    const render = () => {
      if (disposed) return
      if (!active) {
        frame = undefined
        return
      }
      controls?.update()
      renderer?.render(scene, camera)
      frame = requestAnimationFrame(render)
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100)
    try {
      const probe = document.createElement('canvas')
      const webgl = probe.getContext('webgl') || probe.getContext('experimental-webgl')
      if (!webgl) throw new Error('WebGL indisponível')
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' })
    } catch {
      fail()
      return () => {
        disposed = true
        clearTimeout(requestTimeout)
        requestController.abort()
      }
    }
    scene.background = new THREE.Color('#edf5f6')
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.replaceChildren(renderer.domElement)
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = .08
    controls.enablePan = true
    controls.minDistance = .6
    controls.maxDistance = 8
    scene.add(new THREE.HemisphereLight(0xffffff, 0x7aaeb5, 2.2))
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
    keyLight.position.set(2, 3, 4)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0x8bd3d1, 1.2)
    fillLight.position.set(-3, 1, -2)
    scene.add(fillLight)
    const resize = () => {
      const width = Math.max(container.clientWidth, 280)
      const height = Math.max(container.clientHeight, 260)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()
    visibilityObserver = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting
      if (active && !frame) render()
    }, { rootMargin: '160px' })
    visibilityObserver.observe(container)
    const loader = new STLLoader()
    const loadModel = async () => {
      try {
        const response = await fetch(resolveAssetUrl(url), { signal: requestController.signal, cache: 'no-cache' })
        if (!response.ok) throw new Error(`STL indisponível (${response.status})`)
        const geometry = loader.parse(await response.arrayBuffer())
        if (disposed) {
          geometry.dispose()
          return
        }
        geometry.computeVertexNormals()
        geometry.center()
        geometry.computeBoundingSphere()
        const radius = geometry.boundingSphere?.radius || 1
        geometry.scale(1.35 / radius, 1.35 / radius, 1.35 / radius)
        mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x318995, roughness: .62, metalness: .08, side: THREE.DoubleSide }))
        scene.add(mesh)
        const distance = 3.2
        camera.position.set(distance, distance * .72, distance * 1.12)
        controls.target.set(0, 0, 0)
        controls.update()
        setStatus('ready')
        if (active && !frame) render()
      } catch (error) {
        if (!disposed && error.name !== 'AbortError') fail()
      } finally {
        clearTimeout(requestTimeout)
      }
    }
    loadModel()
    return () => {
      disposed = true
      requestController.abort()
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      visibilityObserver?.disconnect()
      controls.dispose()
      renderer.dispose()
      mesh?.geometry.dispose()
      mesh?.material.dispose()
      container.replaceChildren()
    }
  }, [url])
  if (status === 'software') return <SoftwareStlPreview url={url} title={title} />
  return <div className="stl-viewer">
    {status === 'error' ? <div className="stl-fallback" role="img" aria-label={`Prévia 3D indisponível de ${title}`}><span aria-hidden="true">◇</span><p>Prévia 3D indisponível neste dispositivo.</p><small>Use o botão “Baixar” para abrir o STL em um fatiador.</small></div> : <div className="stl-preview" ref={mountRef} role="img" aria-label={`Prévia 3D de ${title}`} />}
    {status === 'ready' && <p className="stl-help">Arraste para girar · roda do mouse ou pinça para zoom · botão direito para mover</p>}
  </div>
}

// O preview usa o renderizador por CPU como caminho único. Isso evita que
// diferenças de GPU, drivers ou políticas do navegador deixem o canvas vazio.
function StlPreview({ url, title }) {
  return <SoftwareStlPreview url={url} title={title} />
}

function ProjectResources({ resources = [] }) {
  if (!resources.length) return null
  return <section className="project-resources" aria-label="Arquivos e referências do projeto">
    <h2>Arquivos e referências</h2>
    <div className="resource-list">
      {resources.map((resource) => <article className={`resource-card resource-${resource.type}`} key={`${resource.type}-${resource.url}`}>
        <div className="resource-head">
          <div><h3>{resource.title}</h3>{resource.description && <p className="muted">{resource.description}</p>}</div>
          <div className="actions">
            {resource.download && <a className="btn btn-secondary btn-sm" href={resolveAssetUrl(resource.url)} download={resource.download}><LuDownload /> Baixar</a>}
            {resource.externalUrl && <a className="btn btn-secondary btn-sm" href={resolveAssetUrl(resource.externalUrl)} target="_blank" rel="noreferrer"><LuExternalLink /> {resource.externalLabel || 'Abrir'}</a>}
            {!resource.download && !resource.externalUrl && resource.type === 'link' && <a className="btn btn-secondary btn-sm" href={resolveAssetUrl(resource.url)} target="_blank" rel="noreferrer"><LuExternalLink /> Abrir</a>}
          </div>
        </div>
        {(resource.type === 'svg' || resource.type === 'image') && <a href={resolveAssetUrl(resource.previewUrl || resource.url)} target="_blank" rel="noreferrer"><img className="resource-image" src={resolveAssetUrl(resource.previewUrl || resource.url)} alt={resource.alt || resource.title} loading="lazy" /></a>}
        {resource.type === 'stl' && <StlPreview url={resource.url} title={resource.title} />}
        {resource.type === 'embed' && <iframe className="resource-embed" title={resource.title} src={resource.url} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
      </article>)}
    </div>
  </section>
}

export function ProjectCard({ p, parent }) {
  const { state } = useStore()
  return (
    <article className="card project-card">
      <Link to={`/projetos/${p.id}`} className="card-cover-link" tabIndex={-1} aria-hidden="true"><Cover category={p.category} image={p.cover} /></Link>
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
        <Cover category={p.category} image={p.cover} className="detail-cover" />
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

        {p.topics?.length ? <ProjectTopics topics={p.topics} /> : <><h2>Etapas de execução</h2><ol className="steps">{p.steps?.map((s, i) => <li key={i}>{s}</li>)}</ol></>}

        <ProjectResources resources={p.resources} />

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

function ProjectTopics({ topics }) {
  return <section className="project-topics" aria-label="Documentação do projeto">
    <h2>Documentação do projeto</h2>
    {topics.map((topic, i) => <article className="topic" key={topic.id || i}>
      <h3>{topic.title || `Tópico ${i + 1}`}</h3>
      {topic.description && <p className="muted">{topic.description}</p>}
      {!!topic.embeds?.length && <div className="topic-embeds">{topic.embeds.map((embed) => <div className="embed-card" key={embed.url}>
        <div className="between"><strong>{embed.title || embed.url}</strong><a href={embed.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">Abrir <LuExternalLink /></a></div>
        {isAllowedEmbed(embed.url) && <iframe title={embed.title || 'Conteúdo incorporado'} src={embed.url} loading="lazy" allowFullScreen />}
      </div>)}</div>}
      {!!topic.files?.length && <div className="topic-files"><strong>Arquivos</strong><div className="actions">{topic.files.map((file) => <a className="btn btn-secondary btn-sm" key={file.name} href={file.data} download={file.name}>{file.name} <span className="muted small">{formatSize(file.size)}</span><LuDownload /></a>)}</div></div>}
    </article>)}
  </section>
}

export function NewProject() {
  const { addProject, projects, state, notify } = useStore()
  const { navigate } = useRouter()
  const [f, setF] = useState({ title: '', description: '', category: 'Robótica', level: 'Iniciante', materials: '', tools: '', cover: '', topics: [{ id: 'topic-1', title: '', description: '', files: [], embeds: [], embedTitle: '', embedUrl: '' }] })
  const [err, setErr] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const list = (s, sep) => s.split(sep).map((x) => x.trim()).filter(Boolean)
  const updateTopic = (index, patch) => setF((current) => ({ ...current, topics: current.topics.map((topic, i) => i === index ? { ...topic, ...patch } : topic) }))
  const addTopic = () => setF((current) => ({ ...current, topics: [...current.topics, { id: `topic-${Date.now()}`, title: '', description: '', files: [], embeds: [], embedTitle: '', embedUrl: '' }] }))
  const removeTopic = (index) => setF((current) => ({ ...current, topics: current.topics.filter((_, i) => i !== index) }))
  const uploadCover = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > MAX_IMAGE_SIZE) return notify('Escolha uma imagem JPG, PNG ou WebP de até 3 MB.')
    readFile(file).then((result) => setF((current) => ({ ...current, cover: result.data })))
  }
  const uploadTopicFiles = (index, e) => {
    const files = [...(e.target.files || [])]
    if (files.some((file) => file.size > MAX_FILE_SIZE)) return notify('Cada arquivo pode ter no máximo 8 MB.')
    Promise.all(files.map(readFile)).then((results) => updateTopic(index, { files: [...f.topics[index].files, ...results] }))
  }
  const addEmbed = (index) => {
    const topic = f.topics[index]
    if (!topic.embedUrl.trim() || !isAllowedEmbed(topic.embedUrl.trim())) return notify('Use uma URL HTTPS de Tinkercad, YouTube, Sketchfab ou Vimeo.')
    updateTopic(index, { embeds: [...topic.embeds, { title: topic.embedTitle.trim(), url: topic.embedUrl.trim() }], embedTitle: '', embedUrl: '' })
  }

  const submit = (e) => {
    e.preventDefault()
    if (f.title.trim().length < 3 || f.description.trim().length < 10) return setErr(true)
    let id = f.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'projeto'
    while (projects.some((p) => p.id === id)) id += '-2'
    const topics = f.topics.map(({ embedTitle, embedUrl, ...topic }) => topic).filter((topic) => topic.title.trim() || topic.description.trim() || topic.files.length || topic.embeds.length)
    addProject({ id, title: f.title.trim(), category: f.category, level: f.level, duration: 'A definir', summary: f.description.trim(), author: state.user, likes: 0, tags: [f.category], audience: 'Comunidade', materials: list(f.materials, ','), tools: list(f.tools, ','), topics, steps: [], cover: f.cover, createdAt: new Date().toISOString().slice(0, 10) })
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
        <label htmlFor="cover">Imagem de capa</label>
        <input id="cover" type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadCover} />
        <p className="muted small">JPG, PNG ou WebP · até 3 MB. A imagem fica salva neste navegador no MVP.</p>
        {f.cover && <img className="cover-preview" src={f.cover} alt="Prévia da capa do projeto" />}
        <div className="between topic-heading"><h2>Tópicos do projeto</h2><button type="button" className="btn btn-secondary btn-sm" onClick={addTopic}><LuPlus /> Adicionar tópico</button></div>
        <p className="muted">Organize corte a laser, modelagem no Tinkercad, montagem e outros conteúdos em tópicos separados.</p>
        {f.topics.map((topic, index) => <fieldset className="topic-editor" key={topic.id}>
          <div className="between"><legend>Tópico {index + 1}</legend>{f.topics.length > 1 && <button type="button" className="icon-btn" onClick={() => removeTopic(index)} aria-label={`Remover tópico ${index + 1}`}><LuTrash2 /></button>}</div>
          <label htmlFor={`topic-title-${topic.id}`}>Título</label><input id={`topic-title-${topic.id}`} value={topic.title} onChange={(e) => updateTopic(index, { title: e.target.value })} placeholder="Ex.: Corte a laser" />
          <label htmlFor={`topic-description-${topic.id}`}>Descrição</label><textarea id={`topic-description-${topic.id}`} rows={3} value={topic.description} onChange={(e) => updateTopic(index, { description: e.target.value })} placeholder="Explique esta parte do projeto." />
          <label htmlFor={`topic-files-${topic.id}`}>Arquivos (STL, SVG, PDF, imagens...)</label><input id={`topic-files-${topic.id}`} type="file" multiple onChange={(e) => uploadTopicFiles(index, e)} />
          {topic.files.length > 0 && <ul className="file-list">{topic.files.map((file) => <li key={file.name}>{file.name} <span>{formatSize(file.size)}</span></li>)}</ul>}
          <label htmlFor={`topic-embed-title-${topic.id}`}>Título do conteúdo incorporado</label><input id={`topic-embed-title-${topic.id}`} value={topic.embedTitle} onChange={(e) => updateTopic(index, { embedTitle: e.target.value })} placeholder="Ex.: Modelo 3D no Tinkercad" />
          <label htmlFor={`topic-embed-url-${topic.id}`}>URL para incorporar</label>
          <div className="embed-input"><input id={`topic-embed-url-${topic.id}`} type="url" value={topic.embedUrl} onChange={(e) => updateTopic(index, { embedUrl: e.target.value })} placeholder="https://www.tinkercad.com/..." /><button type="button" className="btn btn-secondary btn-sm" onClick={() => addEmbed(index)}>Adicionar <LuExternalLink /></button></div>
          <p className="muted small">Embeds disponíveis: Tinkercad, YouTube, Sketchfab e Vimeo. Outras URLs podem ser adicionadas como links em uma próxima etapa.</p>
          {topic.embeds.length > 0 && <ul className="file-list">{topic.embeds.map((embed) => <li key={embed.url}>{embed.title || embed.url}</li>)}</ul>}
        </fieldset>)}
        <div><button className="btn btn-primary" type="submit">Publicar projeto</button></div>
      </form>
    </>
  )
}
