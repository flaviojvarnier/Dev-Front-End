// js/estados.js
//
// Responsabilidade única: decidir qual das quatro telas (carregando,
// sucesso, erro, vazio) está valendo agora, e atualizar a região viva
// para quem usa leitor de tela. Nenhuma requisição acontece aqui —
// este módulo só recebe dados prontos e decide o que mostrar com eles.

import { renderizarTarefas } from "./renderizacao.js";

const regiaoStatus = document.getElementById("status-tarefas");

const mensagensErro = {
  rede: "Não foi possível conectar à rede. Verifique sua conexão e tente novamente.",
  protocolo: "O servidor não conseguiu entregar as tarefas.",
  formato: "Os dados recebidos vieram em um formato inválido.",
  desconhecido: "Ocorreu um erro inesperado ao carregar as tarefas.",
};

export function renderizarEstado(estado, dados) {
  switch (estado) {
    case "carregando":
      limparColunas();
      regiaoStatus.textContent = "Carregando tarefas...";
      break;

    case "sucesso":
      renderizarTarefas(dados);
      regiaoStatus.textContent = `${dados.length} tarefa${dados.length === 1 ? "" : "s"} carregada${dados.length === 1 ? "" : "s"}.`;
      break;

    case "vazio":
      limparColunas();
      regiaoStatus.textContent = "Nenhuma tarefa encontrada no momento.";
      break;

    case "erro":
      limparColunas();
      regiaoStatus.textContent = montarMensagemErro(dados);
      break;

    default:
      throw new Error(`Estado desconhecido: ${estado}`);
  }
}

function montarMensagemErro(detalhe) {
  const tipo = detalhe?.tipo ?? "desconhecido";
  const base = mensagensErro[tipo] ?? mensagensErro.desconhecido;

  if (tipo === "protocolo" && detalhe?.mensagem) {
    return `${base} (${detalhe.mensagem})`;
  }

  return base;
}

function limparColunas() {
  document.querySelectorAll("#colunas-tarefas ul").forEach((ul) => {
    ul.textContent = "";
  });
}
