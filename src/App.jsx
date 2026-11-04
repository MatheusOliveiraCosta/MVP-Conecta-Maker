import Layout from './components/Layout.jsx'
import { match, useRouter } from './router.jsx'
import Home from './pages/Home.jsx'
import { NewProject, ProjectDetail, Projects } from './pages/Projects.jsx'
import { CourseDetail, Courses, Learn, TrailDetail } from './pages/Learn.jsx'
import { Collaborate, Network, SpaceDetail, Tools } from './pages/Community.jsx'

const ROUTES = [
  ['/', () => <Home />], ['/projetos', () => <Projects />], ['/projetos/novo', () => <NewProject />],
  ['/projetos/:id', (p) => <ProjectDetail id={p.id} />], ['/aprender', () => <Learn />], ['/aprender/:id', (p) => <TrailDetail id={p.id} />],
  ['/cursos', () => <Courses />], ['/cursos/:id', (p) => <CourseDetail id={p.id} />], ['/colaborar', () => <Collaborate />],
  ['/rede', () => <Network />], ['/rede/:id', (p) => <SpaceDetail id={p.id} />], ['/ferramentas', () => <Tools />],
]

export default function App() {
  const { path } = useRouter()
  let view = <div className="empty"><h1>Página não encontrada</h1><a className="btn btn-secondary" href="#/">Voltar ao início</a></div>
  for (const [pattern, render] of ROUTES) { const m = match(pattern, path); if (m) { view = render(m); break } }
  return <Layout>{view}</Layout>
}
