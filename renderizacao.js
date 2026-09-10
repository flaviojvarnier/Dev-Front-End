// js/renderizacao.js
//
// Responsabilidade única: transformar uma lista de tarefas — já
// filtrada e ordenada por js/derivacao.js — em elementos dentro das
// colunas do quadro. Não sabe de onde as tarefas vieram nem por que
// aquela é a lista certa; isso é papel de script.js e derivacao.js.
//
// Este módulo também é o único lugar que registra interação nos
// cartões, e faz isso por delegação: o listener fica no container
// #colunas-tarefas, que nunca é recriado. Os <ul> internos são
// esvaziados e recheados a cada renderização, mas o container
// permanece o mesmo elemento do início ao fim — por isso o listener
// sobrevive a renderizações repetidas sem duplicar nem se perder.

const mapaColunas = {
  "a-fazer": document.querySelector("#coluna-a-fazer ul"),
  "em-andamento": document.querySelector("#coluna-em-andamento ul"),
  "em-revisao": document.querySelector("#coluna-em-revisao ul"),
  concluida: document.querySelector("#coluna-concluida ul"),
};

const containerColunas = document.getElementById("colunas-tarefas");

export function renderizarTarefas(tarefas) {
  Object.values(mapaColunas).forEach((ul) => {
    if (ul) ul.textContent = "";
  });

  tarefas.forEach((tarefa) => {
    const coluna = mapaColunas[tarefa.status];
    if (!coluna) return;

    coluna.appendChild(criarCartao(tarefa));
  });
}

// Chamar uma única vez, na inicialização. Não chamar de novo a cada
// renderização — o container não muda, então o listener não precisa
// ser reinstalado.
export function iniciarEventosDelegados() {
  containerColunas.addEventListener("click", (evento) => {
    const cartao = evento.target.closest("article");
    if (!cartao) return;

    cartao.classList.toggle("selecionado");
  });
}

function criarCartao(tarefa) {
  const li = document.createElement("li");
  const article = document.createElement("article");

  const titulo = document.createElement("h4");
  titulo.textContent = tarefa.titulo;
  article.appendChild(titulo);

  if (tarefa.projeto) {
    article.appendChild(criarParagrafo(`Projeto: ${tarefa.projeto}`));
  }

  if (tarefa.responsavel) {
    article.appendChild(criarParagrafo(`Responsável: ${tarefa.responsavel}`));
  }

  article.appendChild(criarParagrafo(`Prazo: ${formatarData(tarefa.prazo)}`));
  article.appendChild(
    criarParagrafo(`Prioridade: ${capitalizar(tarefa.prioridade)}`),
  );

  li.appendChild(article);
  return li;
}

function criarParagrafo(texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  return p;
}

function capitalizar(texto) {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatarData(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  if (!ano || !mes || !dia) return dataISO;
  return `${dia}/${mes}/${ano}`;
}
