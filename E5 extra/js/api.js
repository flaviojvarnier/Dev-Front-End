// js/api.js
//
// Responsabilidade única: buscar as tarefas e devolver o array pronto
// para uso. Nada de DOM aqui — se esta função precisar saber que existe
// uma tela, o acoplamento voltou.
//
// Três formas de falhar, todas relevantes para quem consome esta função:
//   1. Rede indisponível  -> fetch rejeita sozinho com TypeError.
//   2. Resposta HTTP ruim -> response.ok é false; nós lançamos ErroProtocolo.
//   3. Corpo malformado   -> resposta.json() rejeita sozinho com SyntaxError,
//      OU o JSON é válido mas não tem o formato esperado, e nós lançamos
//      um SyntaxError manualmente para cair na mesma categoria de "formato".

export class ErroProtocolo extends Error {
  constructor(status) {
    super(`A requisição falhou com status ${status}`);
    this.name = "ErroProtocolo";
    this.status = status;
  }
}

export async function carregarTarefas() {
  const resposta = await fetch("dados.json");

  if (!resposta.ok) {
    throw new ErroProtocolo(resposta.status);
  }

  const dados = await resposta.json();

  if (!dados || !Array.isArray(dados.tarefas)) {
    throw new SyntaxError(
      'O JSON recebido não tem o formato esperado (faltando a chave "tarefas").',
    );
  }

  return dados.tarefas;
}
