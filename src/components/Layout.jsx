import { useEffect, useState } from 'react'
import { LuBookOpen, LuFileText, LuHeart, LuHouse, LuInfo, LuLayoutGrid, LuMenu, LuNetwork, LuSearch, LuWrench, LuX } from 'react-icons/lu'
import { Link, useRouter } from '../router.jsx'
import { useStore } from '../store.jsx'
import { Avatar } from './ui.jsx'

const NAV = [
  { to: '/', label: 'Início', icon: LuHouse, exact: true },
  { to: '/projetos', label: 'Projetos', icon: LuLayoutGrid },
  { to: '/aprender', label: 'Aprender', icon: LuBookOpen },
  { to: '/cursos', label: 'Cursos gratuitos', icon: LuFileText },
  { to: '/colaborar', label: 'Colaborar', icon: LuHeart },
  { to: '/rede', label: 'Rede Maker', icon: LuNetwork },
  { to: '/ferramentas', label: 'Ferramentas', icon: LuWrench },
  { to: '/sobre', label: 'Sobre', icon: LuInfo },
]

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="ConectaMaker — página inicial">
      <img src="./logo.svg" alt="" width="40" height="40" />
      <span>Conecta<b>Maker</b></span>
    </Link>
  )
}

export default function Layout({ children }) {
  const { path, navigate } = useRouter()
  const { state, toast, notify, resetDemo } = useStore()
  const [menu, setMenu] = useState(false)
  const [q, setQ] = useState('')
  useEffect(() => setMenu(false), [path])

  const search = (e) => { e.preventDefault(); navigate(`/projetos${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`) }
  const isActive = (n) => (n.exact ? path === n.to : path === n.to || path.startsWith(n.to + '/'))

  return (
    <div className="app">
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="topbar">
        <button className="icon-btn menu-btn" onClick={() => setMenu(!menu)} aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menu}>{menu ? <LuX /> : <LuMenu />}</button>
        <Logo />
        <form className="search" onSubmit={search} role="search">
          <LuSearch aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar projetos, cursos, pessoas, laboratórios" aria-label="Buscar" />
        </form>
        <div className="user">
          <Avatar name={state.user} size={36} /><span className="user-name">{state.user}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => notify('Sessão demonstrativa: não há login real neste MVP.')}>Sair</button>
        </div>
      </header>

      <div className="shell">
        <nav className={`sidebar ${menu ? 'open' : ''}`} aria-label="Principal">
          <p className="side-title">Explorar</p>
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className={`nav-link ${isActive(n) ? 'active' : ''}`} aria-current={isActive(n) ? 'page' : undefined}>
                  <span className="nav-ico"><n.icon /></span>{n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mvp-box">
            <strong>MVP demonstrativo</strong>
            <p>Suas alterações ficam apenas neste navegador. Use dados fictícios.</p>
            <button className="link-btn" onClick={() => { resetDemo(); notify('Dados de demonstração restaurados.') }}>Restaurar dados</button>
          </div>
        </nav>
        {menu && <div className="scrim" onClick={() => setMenu(false)} />}
        <main id="conteudo" className="main" tabIndex={-1}>
          <div className="page" key={path}>{children}</div>
          <footer className="footer">ConectaMaker · MVP demonstrativo para apresentação · Os cadastros e alterações ficam somente neste navegador.</footer>
        </main>
      </div>
      {toast && <div className="toast" role="status" key={toast.id}>{toast.message}</div>}
    </div>
  )
}
