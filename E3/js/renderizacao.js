// js/renderizacao.js
//
// Responsabilidade única: transformar um array de tarefas em elementos
// dentro das colunas do quadro. Não sabe de onde as tarefas vieram
// (dados.js estático, fetch, o que for) e não decide QUANDO renderizar
// — isso é papel de js/estados.js. Por isso este arquivo não muda entre
// a E2 e a E3: trocar a origem dos dados não deveria exigir mexer aqui.

const mapaColunas = {
  "a-fazer": document.querySelector("#coluna-a-fazer ul"),
  "em-andamento": document.querySelector("#coluna-em-andamento ul"),
  "em-revisao": document.querySelector("#coluna-em-revisao ul"),
  concluida: document.querySelector("#coluna-concluida ul"),
};

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
