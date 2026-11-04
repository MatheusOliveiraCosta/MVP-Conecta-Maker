const projects = [
  {id:1,title:"Estação meteorológica escolar",category:"Eletrônica",description:"Protótipo de baixo custo para observar temperatura, umidade e condições do ambiente.",level:"Iniciante",tech:"Arduino · Sensores",symbol:"☼",visual:"visual-purple"},
  {id:2,title:"Robô seguidor de linha",category:"Robótica",description:"Aprendizagem de lógica e automação por meio de um robô autônomo.",level:"Intermediário",tech:"Robótica · Programação",symbol:"◉",visual:"visual-orange"},
  {id:3,title:"Horta inteligente",category:"Sustentabilidade",description:"Monitoramento de umidade do solo para apoiar o cuidado de uma horta escolar.",level:"Iniciante",tech:"IoT · Sustentabilidade",symbol:"♧",visual:"visual-green"},
  {id:4,title:"Laboratório de ideias",category:"Educação",description:"Atividades mão na massa para integrar criatividade, ciência e tecnologia.",level:"Iniciante",tech:"Educação · Prototipagem",symbol:"✳",visual:"visual-blue"},
  {id:5,title:"Luminária paramétrica",category:"Eletrônica",description:"Criação de uma luminária com componentes simples e peças modeladas em 3D.",level:"Intermediário",tech:"Eletrônica · Impressão 3D",symbol:"◌",visual:"visual-purple"},
  {id:6,title:"Coleta seletiva interativa",category:"Sustentabilidade",description:"Solução educativa para incentivar a separação correta de resíduos.",level:"Iniciante",tech:"Design · Educação",symbol:"♻",visual:"visual-green"}
];

const STORAGE_KEY = "conectamaker-mvp-v1";
const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"favorites":[],"filter":"Todos"}');
const grid = document.querySelector("#projectGrid");
const toast = document.querySelector("#toast");
let toastTimer;

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function notify(message){
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove("show"),2600);
}
function renderProjects(query=""){
  const term = query.trim().toLocaleLowerCase("pt-BR");
  const visible = projects.filter(p => (state.filter==="Todos" || p.category===state.filter) &&
    [p.title,p.category,p.description,p.tech].join(" ").toLocaleLowerCase("pt-BR").includes(term));
  grid.innerHTML = visible.length ? visible.map(p=>`
    <article class="project-card">
      <div class="project-visual ${p.visual}"><span aria-hidden="true">${p.symbol}</span></div>
      <div class="project-body">
        <span class="project-category">${p.category.toUpperCase()}</span>
        <h3>${p.title}</h3><p>${p.description}</p>
        <div class="project-meta"><span>${p.level}</span><span>${p.tech}</span></div>
        <div class="project-actions"><button class="mini-button" data-details="${p.id}">Conhecer projeto ↗</button>
        <button class="save-button ${state.favorites.includes(p.id)?"saved":""}" aria-label="Favoritar ${p.title}" data-favorite="${p.id}">${state.favorites.includes(p.id)?"♥":"♡"}</button></div>
      </div>
    </article>`).join("") : `<p class="muted">Nenhum projeto encontrado. Tente outro termo ou filtro.</p>`;
}
function openDialog(content){
  document.querySelector("#dialogContent").innerHTML = content;
  document.querySelector("#infoDialog").showModal();
}
document.querySelector("#projectFilters").addEventListener("click", e=>{
  const btn=e.target.closest("[data-filter]"); if(!btn)return;
  state.filter=btn.dataset.filter; saveState();
  document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===btn));
  renderProjects(document.querySelector("#globalSearch").value);
});
grid.addEventListener("click",e=>{
  const fav=e.target.closest("[data-favorite]");
  if(fav){
    const id=Number(fav.dataset.favorite);
    state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];
    saveState(); renderProjects(document.querySelector("#globalSearch").value);
    notify(state.favorites.includes(id)?"Projeto salvo nos favoritos.":"Projeto removido dos favoritos."); return;
  }
  const detail=e.target.closest("[data-details]");
  if(detail){
    const p=projects.find(x=>x.id===Number(detail.dataset.details));
    openDialog(`<span class="eyebrow">${p.category.toUpperCase()}</span><h2>${p.title}</h2><p>${p.description}</p><p><b>Nível:</b> ${p.level}<br><b>Competências:</b> ${p.tech}</p><p>Este é um projeto demonstrativo. No ambiente completo, você poderá conhecer os participantes, compartilhar ramificações e colaborar com a iniciativa.</p><button class="button button-primary" onclick="document.querySelector('#infoDialog').close();document.querySelector('#joinBtn').click()">Quero colaborar ↗</button>`);
  }
});
document.querySelector("#globalSearch").addEventListener("input",e=>renderProjects(e.target.value));
document.querySelector("#searchForm").addEventListener("submit",e=>{e.preventDefault();document.querySelector("#explorar").scrollIntoView();});
document.querySelector("#loginBtn").addEventListener("click",()=>{
  openDialog(`<h2>Boas-vindas à ConectaMaker</h2><p>Entre no ambiente demonstrativo para conhecer a experiência da comunidade.</p><label for="demoEmail">E-mail</label><input id="demoEmail" type="email" value="ana@exemplo.test"><label for="demoPass">Senha</label><input id="demoPass" type="password" value="demo123"><p class="muted">Acesso fictício para demonstração. Não há autenticação ou conta real.</p><button class="button button-primary" id="demoLogin">Entrar na demonstração</button>`);
  document.querySelector("#demoLogin").addEventListener("click",()=>{document.querySelector("#infoDialog").close();notify("Acesso demonstrativo iniciado.");});
});
document.querySelector("#joinBtn").addEventListener("click",()=>{
  openDialog(`<h2>Vamos construir juntos?</h2><p>O ConectaMaker é um MVP demonstrativo. Nesta versão, o cadastro não envia informações para um servidor.</p><label for="joinName">Como podemos chamar você?</label><input id="joinName" placeholder="Seu nome"><label for="joinInterest">O que você gostaria de fazer?</label><input id="joinInterest" placeholder="Ex.: compartilhar um projeto"><button class="button button-primary" id="joinSubmit">Registrar interesse</button>`);
  document.querySelector("#joinSubmit").addEventListener("click",()=>{
    const name=document.querySelector("#joinName").value.trim();
    if(!name){notify("Informe seu nome para continuar.");return;}
    const interests=JSON.parse(localStorage.getItem("conectamaker-interesses")||"[]");
    interests.push({name,interest:document.querySelector("#joinInterest").value.trim(),date:new Date().toISOString()});
    localStorage.setItem("conectamaker-interesses",JSON.stringify(interests));
    document.querySelector("#infoDialog").close();notify("Interesse registrado neste navegador. Obrigado!");
  });
});
document.querySelector("#closeDialog").addEventListener("click",()=>document.querySelector("#infoDialog").close());
document.querySelector("#menuToggle").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
renderProjects();
