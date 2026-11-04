# ConectaMaker — MVP em React

MVP **demonstrativo** (dados fictícios, tudo salvo no `localStorage`) recriado em React a partir das telas do site hospedado, com a nova funcionalidade **Árvore de adaptações**.

## Como rodar
```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (base relativa: serve em qualquer hospedagem estática)
```
Sem Node? Abra `preview/index.html` direto no navegador (versão já compilada).

## Nova funcionalidade: Árvore de adaptações
Na página de qualquer projeto (ex.: *Rotina Diária Analógica — TEA*, *Porta-copos impresso em 3D*):
- **Grafo** com o projeto original na raiz e variantes ramificadas (qualquer profundidade).
- **Hover / foco de teclado** num nó → prévia com capa, autor, data, tipo de adaptação, *o que mudou* e botão *Ver projeto*. O caminho até a original fica destacado e os demais nós esmaecem.
- **Celular**: toque no nó abre a mesma prévia como *bottom sheet*.
- **Criar variante** (botão da seção, "Criar remix" ou "Variante daqui" na prévia): formulário validado, com pré-visualização ao vivo; o novo nó aparece na árvore com destaque.
- Arrastar para mover, zoom (botões, pinça ou Ctrl + rolagem) e *Centralizar*.

Modelo de dados: cada projeto tem `parentId` (opcional). `adaptation = { types, changed, credit }` descreve a variante. Layout e utilitários em `src/lib/tree.js`.

## Estrutura
```
src/
  data/seed.js            dados fictícios (projetos, trilhas, cursos, espaços...)
  store.jsx               estado global + localStorage
  router.jsx              roteador por hash (#/projetos/...)
  lib/tree.js             raiz, caminho, layout em árvore
  components/             AdaptationTree, VariantModal, Layout, ui
  pages/                  Home, Projects, Learn, Community
  styles.css              identidade visual, responsivo, animações
```
Dependências: apenas `react`, `react-dom` e `react-icons`. As animações são em CSS e respeitam `prefers-reduced-motion`.

## Observações
- Sem fotos reais: as capas são ilustrações geradas (gradiente + ícone por categoria). Troque `Cover` por `<img>` quando tiver imagens.
- Downloads de SVG/STL são demonstrativos (mostram um aviso).
