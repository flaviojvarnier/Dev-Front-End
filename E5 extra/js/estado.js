// js/estado.js
//
// Responsabilidade única: guardar o objeto de estado único da
// aplicação e oferecer a única forma de alterá-lo. Este módulo não
// sabe de DOM e não decide o que renderizar — ele só garante que
// exista uma fonte de verdade e que ela só mude de um jeito (merge
// raso via atualizarEstado). Nenhum outro módulo deve manter uma
// cópia paralela de "tarefas filtradas" ou de qualquer parte disso.

function estadoInicial() {
  return {
    tarefas: [], // array cru vindo de carregarTarefas(), nunca reordenado aqui
    busca: "",
    status: "todos",
    prioridade: "todas",
    ordenacao: "nenhuma", // "nenhuma" | "prazo-asc" | "prazo-desc"
    carregando: true,
    erro: null, // { tipo, mensagem } | null
  };
}

let estado = estadoInicial();

export function obterEstado() {
  return estado;
}

export function atualizarEstado(mudancas) {
  estado = { ...estado, ...mudancas };
  return estado;
}

// Usado pelo botão "Limpar filtros": zera busca/status/prioridade/
// ordenação, mas preserva tarefas/carregando/erro — limpar filtros
// não deveria refazer a requisição.
export function restaurarFiltros() {
  const { busca, status, prioridade, ordenacao } = estadoInicial();
  estado = { ...estado, busca, status, prioridade, ordenacao };
  return estado;
}
