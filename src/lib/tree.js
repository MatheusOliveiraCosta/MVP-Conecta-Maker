// Utilitários da Árvore de adaptações.

/** Sobe pelos parentId até a raiz (projeto original). */
export function findRoot(projects, id) {
  const byId = new Map(projects.map((p) => [p.id, p]))
  let cur = byId.get(id), guard = 0
  while (cur?.parentId && byId.has(cur.parentId) && guard++ < 100) cur = byId.get(cur.parentId)
  return cur
}

/** Caminho do nó até a raiz (inclui ambos). */
export function pathToRoot(projects, id) {
  const byId = new Map(projects.map((p) => [p.id, p]))
  const out = []
  let cur = byId.get(id), guard = 0
  while (cur && guard++ < 100) { out.push(cur.id); cur = cur.parentId ? byId.get(cur.parentId) : null }
  return out
}

/** Todos os descendentes de um nó (usado para impedir ciclos). */
export function descendants(projects, id) {
  const kids = new Map()
  projects.forEach((p) => { if (p.parentId) kids.set(p.parentId, [...(kids.get(p.parentId) || []), p.id]) })
  const out = new Set(), stack = [id]
  while (stack.length) for (const k of kids.get(stack.pop()) || []) if (!out.has(k)) { out.add(k); stack.push(k) }
  return out
}

/**
 * Layout em árvore da esquerda para a direita.
 * Retorna nós com (x, y) em px, arestas e o tamanho do desenho.
 */
export function layoutTree(projects, rootId, { dx = 250, dy = 118 } = {}) {
  const kids = new Map()
  projects.forEach((p) => { if (p.parentId) kids.set(p.parentId, [...(kids.get(p.parentId) || []), p]) })
  const byId = new Map(projects.map((p) => [p.id, p]))
  const nodes = [], edges = []
  let leaf = 0, maxDepth = 0

  const walk = (p, depth) => {
    maxDepth = Math.max(maxDepth, depth)
    const children = (kids.get(p.id) || []).sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''))
    let y
    if (!children.length) y = leaf++ * dy
    else {
      const ys = children.map((c) => { const n = walk(c, depth + 1); edges.push({ from: p.id, to: c.id }); return n })
      y = (Math.min(...ys) + Math.max(...ys)) / 2
    }
    nodes.push({ id: p.id, project: p, depth, x: depth * dx, y })
    return y
  }
  walk(byId.get(rootId), 0)
  const height = Math.max(0, (leaf - 1) * dy)
  return { nodes, edges, width: maxDepth * dx, height }
}
