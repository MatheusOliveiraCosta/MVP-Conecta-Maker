import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { projects as seedProjects, needs as seedNeeds } from './data/seed.js'

const KEY = 'conectamaker-react-v1'
const initial = { extraProjects: [], extraNeeds: [], saved: [], comments: {}, interest: {}, done: {}, enrolled: {}, user: 'joao' }

function load() {
  try { return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return initial }
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [toast, setToast] = useState(null)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* modo privado */ } }, [state])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t) }, [toast])

  const notify = useCallback((message) => setToast({ message, id: Date.now() }), [])
  const patch = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), [])

  const projects = useMemo(() => [...state.extraProjects, ...seedProjects].filter((project) => project.cover), [state.extraProjects])
  const needs = useMemo(() => [...state.extraNeeds, ...seedNeeds], [state.extraNeeds])

  const api = useMemo(() => ({
    state, projects, needs, toast, notify,
    getProject: (id) => projects.find((p) => p.id === id),
    addProject: (p) => patch((s) => ({ extraProjects: [p, ...s.extraProjects] })),
    toggleSaved: (id) => patch((s) => ({ saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] })),
    addComment: (pid, text) => patch((s) => ({ comments: { ...s.comments, [pid]: [...(s.comments[pid] || []), { id: Date.now(), author: s.user, text }] } })),
    toggleInterest: (nid) => patch((s) => ({ interest: { ...s.interest, [nid]: !s.interest[nid] } })),
    addNeed: (n) => patch((s) => ({ extraNeeds: [n, ...s.extraNeeds] })),
    toggleLesson: (tid, i) => patch((s) => { const cur = s.done[tid] || []; return { done: { ...s.done, [tid]: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] } } }),
    toggleEnroll: (cid) => patch((s) => ({ enrolled: { ...s.enrolled, [cid]: !s.enrolled[cid] } })),
    resetDemo: () => { setState(initial) },
  }), [state, projects, needs, toast, notify, patch])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
