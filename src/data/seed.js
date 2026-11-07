// Dados fictícios do MVP (baseados nas telas do site hospedado).
// Cada projeto pode ter `parentId`: é assim que a Árvore de adaptações é montada.

const image = (name) => `${import.meta.env.BASE_URL}images/${name}`
const rotinaAnalogicaCover = image('projeto-rotina-analogica.png')
const rotinaEletronicaCover = image('projeto-rotina-eletronica.png')
const tabuadaCover = image('projeto-tabuada-interativa.png')
const tabuadaScratchCover = image('projeto-jogo-tabuada-scratch.png')
const portasLogicasCover = image('projeto-portas-logicas.png')
const hortaCover = image('projeto-horta-automatizada.png')
const semaforoCover = image('projeto-semaforo-arduino.png')
const matematicaScratchCover = image('projeto-jogo-matematica-scratch.png')
const portaCoposCover = image('projeto-porta-copos-3d.png')
const portaCoposRecicladoCover = image('projeto-porta-copos-reciclado.png')
const portaCoposTatilCover = image('projeto-porta-copos-tatil.png')
const luminariaCover = image('projeto-luminaria-cristo-cornelio.png')
const trilhaFabricacaoCover = image('trilha-fabricacao-digital.png')
const trilhaCorteCover = image('trilha-maquina-de-corte.png')
const trilhaNoCodeCover = image('trilha-desenvolvimento-no-code.webp')
const trilhaEletronicaCover = image('trilha-eletronica-basica.png')
const trilhaProgramacaoCover = image('trilha-introducao-programacao.png')
const trilhaCulturaMakerCover = image('trilha-cultura-maker.png')
const trilhaArduinoCover = image('trilha-arduino-iniciantes.png')
const trilhaModelagemCover = image('trilha-modelagem-3d.png')
const trilhaAcessibilidadeCover = image('trilha-acessibilidade.png')
const cursoScratchCover = image('curso-programacao-scratch.png')
const cursoModelagemCover = image('curso-modelagem-impressao-3d.png')
const cursoRoboticaCover = image('curso-robotica-seguidor-linha.png')
export const CATEGORIES = ['Acessibilidade', 'Eletrônica', 'Matemática', 'Sustentabilidade', 'Robótica', 'Programação', 'Arte e Design', 'Educação']
export const LEVELS = ['Iniciante', 'Intermediário', 'Avançado']

// Tipos de adaptação usados na árvore (cor = ponto no nó e chip)
export const ADAPTATION_TYPES = [
  { id: 'Materiais', color: '#d9822b' },
  { id: 'Custo', color: '#3a9a6b' },
  { id: 'Acessibilidade', color: '#2f7fd1' },
  { id: 'Idioma', color: '#8a63d2' },
  { id: 'Faixa etária', color: '#d2538a' },
  { id: 'Fabricação digital', color: '#17909c' },
]

export const projects = [
  {
    id: 'rotina-analogica', cover: rotinaAnalogicaCover, title: 'Rotina Diária Analógica — TEA', category: 'Acessibilidade', level: 'Iniciante', duration: '3 horas',
    summary: 'Painel tátil de tarefas para apoiar a organização da rotina de estudantes.',
    author: 'Espaço Maker UENP', likes: 12, tags: ['TEA', 'Rotina', 'Educação inclusiva'], audience: 'Professores',
    materials: ['MDF', 'Marcadores coloridos', 'Peças móveis'], tools: ['Máquina de corte', 'Inkscape'],
    steps: ['Desenhe a sequência de tarefas com ícones simples.', 'Corte o painel e as peças em MDF.', 'Monte os indicadores móveis e teste a leitura com o público.'],
    resources: [
      { type: 'svg', title: 'Arquivo de corte do quadro analógico', description: 'Desenho vetorial com painel, laterais, números, meses e ícones das tarefas.', url: '/arquivos/projetos/rotina-analogica/quadro-tarefas-analogico-corte.svg', previewUrl: '/arquivos/projetos/rotina-analogica/quadro-tarefas-analogico-corte-preview.png', download: 'quadro-tarefas-analogico-corte.svg', alt: 'Prévia do arquivo de corte do quadro analógico' },
      { type: 'stl', title: 'Pino do slider · STL', description: 'Prévia 3D do pino para impressão.', url: '/arquivos/projetos/rotina-analogica/quadro-analogico-pino-slider-tea.stl', download: 'pino-slider-TEA.stl' },
      { type: 'stl', title: 'Metade do slider · STL', description: 'Prévia 3D da metade do slider para impressão.', url: '/arquivos/projetos/rotina-analogica/quadro-analogico-metade-slider-tea.stl', download: 'metade-slider-TEA.stl' },
    ],
    needsEquipment: true, createdAt: '2026-09-02',
  },
  {
    id: 'rotina-eletronica', cover: rotinaEletronicaCover, parentId: 'rotina-analogica', title: 'Rotina Diária Eletrônica — TEA', category: 'Acessibilidade', level: 'Intermediário', duration: '6 horas',
    summary: 'Quadro com indicadores luminosos para acompanhar atividades do dia.',
    author: 'Espaço Maker UENP', likes: 9, tags: ['TEA', 'LEDs'], audience: 'Professores',
    materials: ['MDF', 'LEDs', 'Arduino'], tools: ['Máquina de corte', 'Ferro de solda'],
    adaptation: { types: ['Materiais', 'Fabricação digital'], changed: 'Troca os marcadores móveis por LEDs indicadores controlados por Arduino.' },
    steps: ['Reaproveite o painel de MDF do projeto original.', 'Monte os LEDs e botões em protoboard.', 'Programe a sequência de tarefas.'],
    resources: [
      { type: 'svg', title: 'Arquivo de corte do quadro eletrônico', description: 'Desenho vetorial para preparar as peças do quadro.', url: '/arquivos/projetos/rotina-eletronica/quadro-tarefas-eletronico-corte.svg', previewUrl: '/arquivos/projetos/rotina-eletronica/quadro-tarefas-eletronico-corte-preview.png', download: 'quadro-tarefas-eletronico-corte.svg', alt: 'Prévia do arquivo de corte do quadro eletrônico' },
      { type: 'image', title: 'Prévia do esquema elétrico', url: '/arquivos/projetos/rotina-eletronica/quadro-tarefas-eletronico-esquema.png', alt: 'Esquema elétrico do quadro de tarefas eletrônico' },
      { type: 'file', title: 'Esquema elétrico completo · PDF', description: 'Abra o diagrama completo em uma nova aba.', url: '/arquivos/projetos/rotina-eletronica/quadro-tarefas-eletronico-esquema.pdf', externalUrl: '/arquivos/projetos/rotina-eletronica/quadro-tarefas-eletronico-esquema.pdf', externalLabel: 'Abrir PDF' },
      { type: 'embed', title: 'Projeto do quadro no Tinkercad', description: 'Explore a montagem eletrônica e abra uma cópia editável no Tinkercad.', url: 'https://www.tinkercad.com/embed/7hnQ0S9FHCI?editbtn=1', externalUrl: 'https://www.tinkercad.com/embed/7hnQ0S9FHCI?editbtn=1', externalLabel: 'Abrir no Tinkercad' },
    ], createdAt: '2026-09-20',
  },
  {
    id: 'tabuada', cover: tabuadaCover, title: 'Tabuada Interativa', category: 'Matemática', level: 'Iniciante', duration: '4 horas',
    summary: 'Recurso manipulável que torna a multiplicação visível e explorável.',
    author: 'Espaço Maker UENP', likes: 17, tags: ['Multiplicação', 'Manipulável'], audience: 'Estudantes do ensino fundamental',
    materials: ['MDF', 'Ímãs', 'Papel adesivo'], tools: ['Máquina de corte'],
    steps: ['Corte a grade 10×10.', 'Imprima os números e cole nas peças.', 'Proponha desafios de multiplicação em duplas.'], createdAt: '2026-08-14',
  },
  {
    id: 'tabuada-scratch', cover: tabuadaScratchCover, parentId: 'tabuada', title: 'Jogo da Tabuada — Scratch 2.0', category: 'Matemática', level: 'Iniciante', duration: 'A definir',
    summary: 'Jogo educativo de tabuada em Scratch com tutorial, projeto jogável e material original do ACT/LIAG da Unicamp.',
    author: 'ACT — Aprendizado, Criatividade e Tecnologia / LIAG — Unicamp', likes: 0, tags: ['Scratch', 'Jogos'], audience: 'Estudantes',
    materials: ['Computador'], tools: ['Scratch'],
    adaptation: { types: ['Fabricação digital', 'Faixa etária'], changed: 'Leva a tabuada física para o computador, com fases e pontuação.' },
    steps: ['Abra o projeto no Scratch.', 'Personalize os personagens.', 'Teste com a turma.'],
    resources: [
      { type: 'embed', title: 'Jogue o projeto no Scratch', url: 'https://scratch.mit.edu/projects/698699212/embed', externalUrl: 'https://scratch.mit.edu/projects/698699212/', externalLabel: 'Abrir no Scratch' },
      { type: 'embed', title: 'Tutorial em vídeo do ACT', url: 'https://www.youtube.com/embed/uPZc5Cifl1o', externalUrl: 'https://www.youtube.com/watch?v=uPZc5Cifl1o', externalLabel: 'Abrir no YouTube' },
      { type: 'link', title: 'Material original do ACT/LIAG', description: 'Tutorial, glossário e explicação pedagógica do projeto.', url: 'https://liag.ft.unicamp.br/act/2022/06/10/jogo-da-tabuada-scratch-2-0/' },
    ], createdAt: '2026-10-05',
  },
  {
    id: 'portas-logicas', cover: portasLogicasCover, title: 'Portas Lógicas', category: 'Eletrônica', level: 'Intermediário', duration: '5 horas',
    summary: 'Painel físico para experimentar as operações E, OU e NÃO.',
    author: 'Espaço Maker UENP', likes: 14, tags: ['Lógica', 'Circuitos'], audience: 'Ensino médio',
    materials: ['MDF', 'Chaves', 'LEDs'], tools: ['Máquina de corte', 'Multímetro'],
    steps: ['Corte a base de MDF.', 'Monte as chaves e LEDs.', 'Verifique a tabela-verdade de cada porta.'], createdAt: '2026-08-30',
  },
  {
    id: 'horta', cover: hortaCover, title: 'Horta Automatizada', category: 'Sustentabilidade', level: 'Intermediário', duration: '7 horas',
    summary: 'Protótipo didático que mede a umidade e aciona a irrigação.',
    author: 'Comunidade ConectaMaker', likes: 8, tags: ['IoT', 'Irrigação'], audience: 'Escolas',
    materials: ['Sensor de umidade', 'Bomba d’água', 'Arduino'], tools: ['Ferro de solda'],
    steps: ['Monte o circuito do sensor.', 'Programe o limite de umidade.', 'Instale a bomba e teste.'], createdAt: '2026-07-11',
  },
  {
    id: 'semaforo', cover: semaforoCover, title: 'Semáforo com Arduino', category: 'Robótica', level: 'Iniciante', duration: '2 horas',
    summary: 'Aprenda saídas digitais e temporização construindo um semáforo.',
    author: 'Comunidade ConectaMaker', likes: 11, tags: ['Arduino', 'LEDs'], audience: 'Iniciantes',
    materials: ['Arduino UNO', '3 LEDs', 'Resistores'], tools: ['Protoboard'],
    steps: ['Ligue os LEDs ao Arduino.', 'Programe a sequência de cores.', 'Ajuste os tempos.'],
    resources: [
      { type: 'file', title: 'Semáforo com display · versão incremental', description: 'Código Arduino para LEDs e display de sete segmentos.', url: '/arquivos/projetos/semaforo/exemplo-display-7-seg-incrementado.ino', download: 'exemplo-display-7-seg-incrementado.ino' },
      { type: 'file', title: 'Semáforo com display · versão simplificada', description: 'Variação do exemplo de semáforo com LEDs e display.', url: '/arquivos/projetos/semaforo/exemplo-display-7-seg-simplificado.ino', download: 'exemplo-display-7-seg-simplificado.ino' },
      { type: 'file', title: 'Sensor de luminosidade LDR', description: 'Leitura analógica de luz e controle de um LED.', url: '/arquivos/projetos/semaforo/ldr-sensor-decisao-composta.ino', download: 'ldr-sensor-decisao-composta.ino' },
    ], createdAt: '2026-07-28',
  },
  {
    id: 'jogo-matematica', cover: matematicaScratchCover, title: 'Jogo de matemática com Scratch', category: 'Programação', level: 'Iniciante', duration: '2 horas',
    summary: 'Crie um jogo de perguntas para praticar operações matemáticas.',
    author: 'Comunidade ConectaMaker', likes: 7, tags: ['Scratch', 'Jogos'], audience: 'Estudantes',
    materials: ['Computador'], tools: ['Scratch'],
    steps: ['Crie as perguntas.', 'Programe a pontuação.', 'Compartilhe com a turma.'], createdAt: '2026-08-02',
  },
  {
    id: 'porta-copos', cover: portaCoposCover, title: 'Porta-copos impresso em 3D', category: 'Arte e Design', level: 'Iniciante', duration: '3 horas',
    summary: 'Peça simples para começar a modelar e imprimir objetos úteis.',
    author: 'Comunidade ConectaMaker', likes: 6, tags: ['Impressão 3D', 'Modelagem'], audience: 'Iniciantes',
    materials: ['Filamento PLA'], tools: ['Impressora 3D', 'TinkerCAD'],
    steps: ['Modele um disco no TinkerCAD.', 'Exporte o STL e fatie.', 'Imprima e finalize.'], createdAt: '2026-06-18',
  },
  {
    id: 'porta-copos-reciclado', cover: portaCoposRecicladoCover, parentId: 'porta-copos', title: 'Porta-copos com material reciclado', category: 'Sustentabilidade', level: 'Iniciante', duration: '2 horas',
    summary: 'Adaptação que substitui a impressão por materiais reaproveitados.',
    author: 'Marina Costa', likes: 3, tags: ['Reciclagem'], audience: 'Iniciantes',
    materials: ['Papelão', 'Tampinhas', 'Cola'], tools: ['Tesoura'],
    adaptation: { types: ['Materiais', 'Custo'], changed: 'Troca a impressão 3D por papelão e tampinhas, reduzindo o custo a quase zero.' },
    steps: ['Recorte discos de papelão.', 'Cole em camadas.', 'Decore com tampinhas.'], createdAt: '2026-09-10',
  },
  {
    id: 'porta-copos-tatil', cover: portaCoposTatilCover, parentId: 'porta-copos', title: 'Porta-copos com marcação tátil', category: 'Acessibilidade', level: 'Intermediário', duration: '4 horas',
    summary: 'Adaptação com referências em relevo para identificar a posição da peça.',
    author: 'Ana Souza', likes: 4, tags: ['Tátil', 'Inclusão'], audience: 'Pessoas com baixa visão',
    materials: ['Filamento PLA'], tools: ['Impressora 3D'],
    adaptation: { types: ['Acessibilidade'], changed: 'Adiciona pontos em relevo para orientar a posição do copo sem depender da visão.' },
    steps: ['Abra o modelo original.', 'Adicione os pontos em relevo.', 'Imprima e valide com o público.'], createdAt: '2026-09-26',
  },
  {
    id: 'luminaria', cover: luminariaCover, title: 'Luminária Cristo de Cornélio Procópio', category: 'Arte e Design', level: 'Intermediário', duration: 'A definir',
    summary: 'Luminária com a silhueta do Cristo e identidade visual do Espaço Maker UENP, apresentada como protótipo de fabricação digital.',
    author: 'Espaço Maker UENP — Cornélio Procópio', likes: 0, tags: ['Corte a laser', 'Acrílico'], audience: 'Público geral',
    materials: ['Acrílico', 'LED'], tools: ['Cortadora a laser'],
    steps: ['Vetorize a silhueta.', 'Corte o acrílico.', 'Monte a base com LED.'],
    resources: [
      { type: 'svg', title: 'Arquivo de corte da base', description: 'Desenho vetorial original da base da luminária.', url: '/arquivos/projetos/luminaria/luminaria-cristo-base-corte.svg', previewUrl: '/arquivos/projetos/luminaria/luminaria-cristo-base-corte-preview.png', download: 'luminaria-cristo-base-corte.svg', alt: 'Prévia do arquivo de corte da base da luminária' },
    ], createdAt: '2026-10-12',
  },
]

export const trails = [
  { id: 'fabricacao', title: 'Fabricação digital', summary: 'Do desenho ao protótipo em equipamentos maker.', level: 'Intermediário', modules: 3, icon: 'cut', cover: trilhaFabricacaoCover,
    lessons: [['Planejamento e segurança', 'Explore conceitos e observe exemplos.'], ['Máquina de corte', 'Experimente na prática com um pequeno desafio.'], ['Prepare uma peça para fabricar', 'Aplique e registre o que aprendeu.']] },
  { id: 'arduino', title: 'Arduino para iniciantes', summary: 'Simule, programe e teste circuitos simples.', level: 'Iniciante', modules: 3, icon: 'chip', cover: trilhaArduinoCover,
    lessons: [['Placa e componentes', 'Conheça o Arduino UNO.'], ['Entradas e saídas', 'Acenda LEDs e leia botões.'], ['Semáforo com LEDs', 'Monte seu primeiro projeto.']] },
  { id: 'modelagem', title: 'Modelagem 3D', summary: 'Crie formas e prepare modelos para impressão.', level: 'Iniciante', modules: 3, icon: 'cube', cover: trilhaModelagemCover,
    lessons: [['Formas básicas', 'Combine sólidos no TinkerCAD.'], ['Medidas e tolerâncias', 'Ajuste o encaixe das peças.'], ['Exportar para impressão', 'Gere o STL e fatie.']] },
  { id: 'acessibilidade', title: 'Acessibilidade e tecnologia assistiva', summary: 'Cocrie recursos educacionais com foco nas pessoas.', level: 'Intermediário', modules: 3, icon: 'access', cover: trilhaAcessibilidadeCover,
    lessons: [['Escutar antes de criar', 'Mapeie necessidades reais.'], ['Prototipar com o público', 'Teste versões simples.'], ['Documentar e compartilhar', 'Registre para outras pessoas adaptarem.']] },
  { id: 'corte', title: 'Máquina de corte na prática', summary: 'Prepare arquivos, materiais e testes de corte com segurança.', level: 'Iniciante', modules: 4, icon: 'cut', cover: trilhaCorteCover,
    lessons: [['Segurança', 'Regras básicas de uso.'], ['Preparar o arquivo', 'Vetores e camadas.'], ['Testes de potência', 'Ajuste velocidade e potência.'], ['Primeira peça', 'Corte e monte.']] },
  { id: 'nocode', title: 'Minicurso de Desenvolvimento No-code', summary: 'Aprenda lógica de programação e acompanhe a criação de um MVP de gestão financeira no Bubble.', level: 'Iniciante', modules: 22, unit: 'aulas', icon: 'code', cover: trilhaNoCodeCover,
    lessons: [['Lógica de programação', 'Variáveis, condições e laços.'], ['Primeiros passos no Bubble', 'Interface e elementos.'], ['Banco de dados', 'Tipos de dados e relações.']] },
  { id: 'eletronica', title: 'Eletrônica básica', summary: 'Circuitos, componentes e experimentos seguros.', level: 'Iniciante', modules: 3, icon: 'chip', cover: trilhaEletronicaCover,
    lessons: [['Corrente e tensão', 'Conceitos essenciais.'], ['Componentes', 'Resistores, LEDs e botões.'], ['Experimento seguro', 'Monte um circuito simples.']] },
  { id: 'programacao', title: 'Introdução à programação', summary: 'Da lógica aos primeiros blocos de código.', level: 'Iniciante', modules: 3, icon: 'code', cover: trilhaProgramacaoCover,
    lessons: [['Pensamento computacional', 'Quebre problemas em passos.'], ['Blocos de código', 'Sequências e repetições.'], ['Seu primeiro jogo', 'Aplique no Scratch.']] },
  { id: 'cultura-maker', title: 'Cultura maker na sala de aula', summary: 'Planeje atividades abertas com sua turma.', level: 'Iniciante', modules: 3, icon: 'idea', cover: trilhaCulturaMakerCover,
    lessons: [['O que é cultura maker', 'Princípios e exemplos.'], ['Planejar a atividade', 'Objetivos e materiais.'], ['Avaliar processos', 'Registros e portfólio.']] },
  { id: 'rotina-eletronica', title: 'Rotina visual com eletrônica', summary: 'Monte indicadores luminosos para apoiar a organização das tarefas diárias.', level: 'Intermediário', modules: 3, icon: 'access', cover: rotinaEletronicaCover,
    lessons: [['Planejar a rotina visual', 'Organize as atividades e escolha sinais visuais claros.'], ['Montar os indicadores', 'Use LEDs e botões para representar cada etapa.'], ['Programar e testar', 'Programe a sequência e valide com os estudantes.']] },
  { id: 'tabuada-maker', title: 'Tabuada interativa', summary: 'Construa recursos manipuláveis e jogos para praticar multiplicação.', level: 'Iniciante', modules: 3, icon: 'idea', cover: tabuadaCover,
    lessons: [['Representar a multiplicação', 'Explore grades e combinações com materiais simples.'], ['Construir o recurso', 'Prepare peças móveis e organize os resultados.'], ['Criar desafios', 'Use o material em atividades colaborativas.']] },
  { id: 'jogos-matematicos', title: 'Jogos matemáticos com Scratch', summary: 'Transforme desafios de matemática em jogos com programação em blocos.', level: 'Iniciante', modules: 3, icon: 'code', cover: tabuadaScratchCover,
    lessons: [['Planejar perguntas e fases', 'Defina operações, níveis e regras do jogo.'], ['Programar no Scratch', 'Crie perguntas, respostas e pontuação.'], ['Testar com a turma', 'Ajuste o jogo a partir das tentativas dos estudantes.']] },
  { id: 'horta-automatizada', title: 'Horta automatizada', summary: 'Monitore a umidade do solo e automatize a irrigação de uma horta.', level: 'Intermediário', modules: 3, icon: 'chip', cover: hortaCover,
    lessons: [['Conhecer o circuito', 'Identifique sensor de umidade, placa e bomba.'], ['Programar a irrigação', 'Defina quando o sistema deve acionar a água.'], ['Testar e economizar', 'Observe leituras e ajuste o limite de umidade.']] },
  { id: 'porta-copos-reciclado', title: 'Design sustentável: porta-copos', summary: 'Explore modelagem, materiais reaproveitados e adaptações táteis.', level: 'Iniciante', modules: 3, icon: 'cube', cover: portaCoposRecicladoCover,
    lessons: [['Desenhar uma peça útil', 'Defina formato, tamanho e uso do porta-copos.'], ['Escolher materiais', 'Compare impressão 3D e materiais reciclados.'], ['Adaptar e validar', 'Adicione marcações táteis e teste a peça.']] },
]

export const spaces = [
  { id: 'uenp', name: 'Espaço Maker UENP — exemplo demonstrativo', city: 'Cornélio Procópio', uf: 'PR', kind: 'Universidade', short: 'Perfil demonstrativo inspirado nos projetos apresentados no ecossistema maker da UENP.', equipment: ['Impressoras 3D', 'Máquina de corte', 'Eletrônica'], hours: 'Seg–sex, 9h–18h (exemplo)', skills: 'Fabricação digital, Eletrônica' },
  { id: 'horizonte', name: 'Laboratório Escola Horizonte (fictício)', city: 'Londrina', uf: 'PR', kind: 'Escola', short: 'Espaço fictício para testar a jornada de aprendizagem.', equipment: ['Kits Arduino', 'Computadores'], hours: 'Seg–sex, 8h–17h (exemplo)', skills: 'Programação, Robótica' },
  { id: 'fablab', name: 'Fab Lab Vale Criativo (fictício)', city: 'Curitiba', uf: 'PR', kind: 'Fab lab', short: 'Espaço fictício de prototipagem e criação aberta.', equipment: ['Impressoras 3D', 'Máquina de corte'], hours: 'Seg–sex, 9h–18h (exemplo)', skills: 'Modelagem 3D' },
  { id: 'norte', name: 'Núcleo Maker Campus Norte (fictício)', city: 'São Paulo', uf: 'SP', kind: 'Instituto federal', short: 'Ambiente fictício de experimentação educacional.', equipment: ['Eletrônica', 'Bancada de ferramentas'], hours: 'Seg–sex, 9h–17h (exemplo)', skills: 'Eletrônica' },
  { id: 'oficina', name: 'Oficina Aberta do Bairro (fictício)', city: 'Belo Horizonte', uf: 'MG', kind: 'Espaço comunitário', short: 'Exemplo de laboratório comunitário para colaboração.', equipment: ['Computadores', 'Ferramentas manuais'], hours: 'Sáb, 9h–13h (exemplo)', skills: 'Marcenaria básica' },
  { id: 'gajac', name: 'Laboratórios Maker GaJac — IFPR Jacarezinho', city: 'Jacarezinho', uf: 'PR', kind: 'Instituto federal', short: 'Garagem dos Jacarezinhos: dois espaços de cultura maker para desenvolvimento de protótipos, projetos 3D, fabricação digital, eletrônica e robótica.', equipment: ['Impressoras 3D', 'Scanner 3D', 'Corte a laser CNC', 'Computadores'], hours: 'Seg–sex, 8h–18h (exemplo)', skills: 'Fabricação digital, Robótica' },
]

// Pessoas por cidade (para o mapa da Rede Maker)
export const peopleByCity = { 'Cornélio Procópio': 1, Curitiba: 1, Londrina: 1 }
// Posições ajustadas à projeção do SVG do Brasil (viewBox 0–100).
// Referência aproximada: longitude/latitude reais de cada cidade.
export const cityPos = {
  'Belo Horizonte': [75.6, 64.0],
  'Cornélio Procópio': [59.5, 71.9],
  Curitiba: [62.8, 77.1],
  Jacarezinho: [61.1, 72.3],
  Londrina: [58.3, 72.3],
  'São Paulo': [69.1, 72.6],
}

export const courses = [
  { id: 'arduino-curso', title: 'Primeiros passos com Arduino', summary: 'Conheça a placa, programe saídas digitais e experimente um circuito simples.', space: 'Espaço Maker UENP — exemplo demonstrativo', spaceId: 'uenp', mode: 'Presencial', level: 'Iniciante', icon: 'chip', cover: semaforoCover,
    learn: ['Placa e componentes', 'Entradas e saídas', 'Semáforo com LEDs'], trailId: 'arduino' },
  { id: 'scratch-curso', title: 'Programação criativa com Scratch', summary: 'Crie pequenas histórias e jogos para aprender lógica de programação.', space: 'Laboratório Escola Horizonte (fictício)', spaceId: 'horizonte', mode: 'Presencial', level: 'Iniciante', icon: 'code', cover: cursoScratchCover,
    learn: ['Blocos e sequências', 'Personagens e eventos', 'Um jogo simples'], trailId: 'programacao' },
  { id: '3d-curso', title: 'Fundamentos em modelagem e impressão 3D', summary: 'Modele uma peça simples e prepare o arquivo para fabricação.', space: 'Fab Lab Vale Criativo (fictício)', spaceId: 'fablab', mode: 'Presencial', level: 'Iniciante', icon: 'cube', cover: cursoModelagemCover,
    learn: ['Formas básicas', 'Medidas e tolerâncias', 'Exportar e fatiar'], trailId: 'modelagem' },
  { id: 'robotica-curso', title: 'Robótica para projetos escolares', summary: 'Experimente componentes eletrônicos em desafios práticos de robótica.', space: 'Núcleo Maker Campus Norte (fictício)', spaceId: 'norte', mode: 'Presencial', level: 'Iniciante', icon: 'robot', cover: cursoRoboticaCover,
    learn: ['Motores e sensores', 'Montar o chassi', 'Desafio de percurso'], trailId: 'eletronica' },
]

export const needs = [
  { id: 'n1', title: 'Apoio para celulares em 3D', category: 'Arte e Design', status: 'Aberta', description: 'Nossa turma precisa de um suporte estável para registrar experimentos.', author: 'Ana Souza', base: 0 },
  { id: 'n2', title: 'Material acessível para ensinar frações', category: 'Acessibilidade', status: 'Aberta', description: 'Queremos cocriar peças táteis que apoiem a aprendizagem.', author: 'Ana Souza', base: 1 },
  { id: 'n3', title: 'Irrigação automática para a escola', category: 'Sustentabilidade', status: 'Em desenvolvimento', description: 'Estudantes querem medir umidade e reduzir desperdício de água.', author: 'Lucas Ribeiro', base: 1 },
  { id: 'n4', title: 'Jogo educativo de lógica', category: 'Programação', status: 'Aberta', description: 'Buscamos ideias para construir um jogo de programação em blocos.', author: 'Marina Costa', base: 0 },
  { id: 'n5', title: 'Mapa tátil do laboratório', category: 'Acessibilidade', status: 'Aberta', description: 'Precisamos explorar maneiras de representar a disposição dos equipamentos.', author: 'Marina Costa', base: 0 },
]

export const people = [
  { name: 'Ana Souza', role: 'Professor', city: 'Cornélio Procópio', skills: ['Robótica', 'inclusão'] },
  { name: 'Lucas Ribeiro', role: 'Aluno', city: 'Londrina', skills: ['Programação', 'eletrônica'] },
  { name: 'Marina Costa', role: 'Colaborador', city: 'Curitiba', skills: ['Fabricação digital', 'acessibilidade'] },
]

export const tools = [
  { name: 'Wokwi', cat: 'Simulação', desc: 'Simule circuitos e código para Arduino no navegador.', tags: ['Arduino', 'Circuitos'], meta: 'Iniciante · Plano gratuito disponível', url: 'https://wokwi.com' },
  { name: 'Tinkercad', cat: 'Modelagem 3D', desc: 'Modele objetos em 3D e experimente circuitos.', tags: ['3D', 'Educação'], meta: 'Iniciante · Gratuita', url: 'https://www.tinkercad.com' },
  { name: 'Scratch', cat: 'Programação', desc: 'Crie histórias, animações e jogos com blocos.', tags: ['Jogos', 'Educação'], meta: 'Iniciante · Gratuita', url: 'https://scratch.mit.edu' },
  { name: 'OrcaSlicer', cat: 'Fabricação digital', desc: 'Prepare arquivos e parâmetros para impressão 3D.', tags: ['Fatiamento', 'Impressão 3D'], meta: 'Intermediário · Código aberto', url: 'https://github.com/SoftFever/OrcaSlicer' },
  { name: 'FreeCAD', cat: 'Modelagem 3D', desc: 'Modele objetos com desenho paramétrico.', tags: ['CAD', '3D'], meta: 'Intermediário · Código aberto', url: 'https://www.freecad.org' },
  { name: 'Inkscape', cat: 'Design', desc: 'Desenhe arquivos vetoriais para corte e comunicação.', tags: ['Vetores', 'Corte'], meta: 'Iniciante · Código aberto', url: 'https://inkscape.org' },
  { name: 'Arduino Project Hub', cat: 'Eletrônica', desc: 'Explore projetos documentados pela comunidade Arduino.', tags: ['Arduino', 'Projetos'], meta: 'Todos os níveis · Acesso gratuito', url: 'https://projecthub.arduino.cc' },
]
