// js/estados.js
//
// Responsabilidade única: decidir o texto da região viva
// (role="status", aria-live="polite") a partir do que já aconteceu em
// outro lugar. Não faz requisição, não filtra tarefas, não toca nas
// colunas — só descreve em palavras carregamento, erro, origem vazia
// e resultado vazio, que são quatro situações diferentes e não podem
// compartilhar mensagem.
//
// "Origem vazia" (a API devolveu zero tarefas) e "resultado vazio"
// (a busca/filtro não encontrou nada dentro de tarefas que existem)
// são distinguidas por quem chama, passando os dois totais — este
// módulo não entra em estado.tarefas diretamente para não duplicar a
// regra de onde vem cada número.

const regiaoStatus = document.getElementById("status-tarefas");

const mensagensErro = {
  rede: "Não foi possível conectar à rede. Verifique sua conexão e tente novamente.",
  protocolo: "O servidor não conseguiu entregar as tarefas.",
  formato: "Os dados recebidos vieram em um formato inválido.",
  desconhecido: "Ocorreu um erro inesperado ao carregar as tarefas.",
};

export function mostrarCarregando() {
  regiaoStatus.textContent = "Carregando tarefas...";
}

export function mostrarErro(erro) {
  const tipo = erro?.tipo ?? "desconhecido";
  const base = mensagensErro[tipo] ?? mensagensErro.desconhecido;

  regiaoStatus.textContent =
    tipo === "protocolo" && erro?.mensagem ? `${base} (${erro.mensagem})` : base;
}

// visiveis: tamanho da lista derivada (após busca/filtros/ordenação)
// total: tamanho de estado.tarefas (o que a API devolveu, sem filtro)
export function mostrarResultado(visiveis, total) {
  if (total === 0) {
    regiaoStatus.textContent = "Nenhuma tarefa encontrada no momento.";
    return;
  }

  if (visiveis === 0) {
    regiaoStatus.textContent =
      "Nenhuma tarefa corresponde aos critérios atuais. Ajuste ou limpe os filtros.";
    return;
  }

  regiaoStatus.textContent = `${visiveis} de ${total} tarefa${total === 1 ? "" : "s"}.`;
}
