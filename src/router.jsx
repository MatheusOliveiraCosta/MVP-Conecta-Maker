import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Roteador mínimo baseado em hash (#/projetos/x): funciona em qualquer hospedagem estática.
const RouterCtx = createContext(null)
const parse = () => {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, query = ''] = raw.split('?')
  return { path: path || '/', query: new URLSearchParams(query) }
}

export function Router({ children }) {
  const [loc, setLoc] = useState(parse)
  useEffect(() => {
    const on = () => { setLoc(parse()); window.scrollTo({ top: 0 }) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = useCallback((to) => { window.location.hash = to }, [])
  const value = useMemo(() => ({ ...loc, navigate }), [loc, navigate])
  return <RouterCtx.Provider value={value}>{children}</RouterCtx.Provider>
}

export const useRouter = () => useContext(RouterCtx)

export function Link({ to, children, ...rest }) {
  return <a href={`#${to}`} {...rest}>{children}</a>
}

// match('/projetos/:id', '/projetos/abc') -> { id: 'abc' } | null
export function match(pattern, path) {
  const a = pattern.split('/').filter(Boolean), b = path.split('/').filter(Boolean)
  if (a.length !== b.length) return null
  const params = {}
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i])
    else if (a[i] !== b[i]) return null
  }
  return params
}
