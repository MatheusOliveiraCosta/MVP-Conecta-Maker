import { PageHeader } from '../components/ui.jsx'

const SECTIONS = [
  ['Por que existimos', 'O ConectaMaker nasceu para democratizar o acesso à cultura maker: conectar pessoas, conhecimento, projetos e espaços para que qualquer pessoa, onde estiver e com os recursos que tiver, possa aprender, criar e resolver necessidades reais.'],
  ['Como funciona', 'Projetos abertos, trilhas, competências, mentores e laboratórios se encontram em uma só plataforma. Não é marketplace: quem traz uma necessidade participa da solução; quem compartilha conhecimento também aprende.'],
  ['Nossa missão', 'Conectar pessoas e espaços maker para transformar conhecimento em oportunidade e necessidades em projetos colaborativos de impacto social.'],
]

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Sobre o ConectaMaker" title="Aprender, criar e resolver em comunidade" subtitle="Uma rede para aproximar pessoas, conhecimento e espaços maker em torno de necessidades reais." />
      <div className="grid grid-3 about">
        {SECTIONS.map(([title, description]) => (
          <article className="card pad" key={title}>
            <h3>{title}</h3>
            <p className="muted">{description}</p>
          </article>
        ))}
      </div>
    </>
  )
}
