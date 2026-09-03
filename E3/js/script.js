// js/script.js
//
// Ponto de entrada. Orquestra as chamadas: pede os dados a api.js,
// decide o estado e manda estados.js desenhar a tela certa. Nenhum
// await de nível superior — tudo roda dentro de iniciar().

import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";

async function iniciar() {
  renderizarEstado("carregando");

  try {
    const tarefas = await carregarTarefas();

    if (tarefas.length === 0) {
      renderizarEstado("vazio");
    } else {
      renderizarEstado("sucesso", tarefas);
    }
  } catch (erro) {
    let tipo = "desconhecido";

    if (erro.name === "TypeError") {
      tipo = "rede";
    } else if (erro.name === "SyntaxError") {
      tipo = "formato";
    } else if (erro.name === "ErroProtocolo") {
      tipo = "protocolo";
    }

    renderizarEstado("erro", { tipo, mensagem: erro.message });
  }
}

iniciar();
