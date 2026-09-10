// js/derivacao.js
//
// Responsabilidade única: a partir do estado, calcular a lista de
// tarefas que deve aparecer na tela. Função pura — não toca no DOM,
// não altera o estado recebido nem o array estado.tarefas. Sempre
// devolve um array novo, mesmo quando nenhum critério está ativo,
// para que quem chama nunca fique tentado a guardar essa referência
// como se fosse uma segunda fonte de verdade.

export function derivarTarefasVisiveis(estado) {
  const termo = estado.busca.trim().toLowerCase();

  const filtradas = estado.tarefas.filter((tarefa) => {
    const combinaBusca =
      termo === "" || tarefa.titulo.toLowerCase().includes(termo);
    const combinaStatus =
      estado.status === "todos" || tarefa.status === estado.status;
    const combinaPrioridade =
      estado.prioridade === "todas" || tarefa.prioridade === estado.prioridade;

    return combinaBusca && combinaStatus && combinaPrioridade;
  });

  return ordenarPorPrazo(filtradas, estado.ordenacao);
}

function ordenarPorPrazo(tarefas, ordenacao) {
  if (ordenacao === "nenhuma") return tarefas;

  const fator = ordenacao === "prazo-asc" ? 1 : -1;

  // "tarefas" aqui já é o resultado de filter() acima — ou seja, já é
  // um array novo. Ainda assim copiamos com [...] antes do sort() por
  // clareza: a regra é nunca ordenar em cima do que veio de fora desta
  // função, e não confiar que quem mantém este código lembrará que
  // filter() já criou uma cópia.
  return [...tarefas].sort((a, b) => comparaData(a.prazo, b.prazo) * fator);
}

function comparaData(prazoA, prazoB) {
  // Datas no formato ISO (AAAA-MM-DD) comparam corretamente como string.
  if (prazoA < prazoB) return -1;
  if (prazoA > prazoB) return 1;
  return 0;
}
