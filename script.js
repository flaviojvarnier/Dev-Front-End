// js/script.js
//
// Ponto de entrada e único lugar que decide QUANDO renderizar. Cada
// ouvinte de evento faz exatamente duas coisas: altera o estado
// (via estado.js) e chama renderizar(). Nenhum ouvinte toca num
// cartão específico, percorre a lista para esconder itens, ou mantém
// sua própria cópia de "o que está filtrado agora" — a lista visível
// é sempre recalculada do zero a partir do estado por derivacao.js.
//
// Nenhum await de nível superior — tudo roda dentro de iniciar().

import { carregarTarefas } from "./api.js";
import { obterEstado, atualizarEstado, restaurarFiltros } from "./estado.js";
import { derivarTarefasVisiveis } from "./derivacao.js";
import { renderizarTarefas, iniciarEventosDelegados } from "./renderizacao.js";
import { mostrarCarregando, mostrarErro, mostrarResultado } from "./estados.js";

const formulario = document.querySelector("form");
const campoBusca = document.getElementById("busca-titulo");
const radiosStatus = document.querySelectorAll('input[name="filtro-status"]');
const radiosPrioridade = document.querySelectorAll(
  'input[name="filtro-prioridade"]',
);
const seletorOrdenacao = document.getElementById("ordenar-prazo");
const botaoLimpar = document.getElementById("limpar-filtros");

// Ciclo único de atualização: toda mudança de estado passa por aqui.
// A lista visível é derivada uma vez por chamada e alimenta cartões e
// contagem ao mesmo tempo, então eles nunca podem ficar dessincronizados.
function renderizar() {
  const estado = obterEstado();

  if (estado.carregando) {
    mostrarCarregando();
    return;
  }

  if (estado.erro) {
    mostrarErro(estado.erro);
    return;
  }

  const visiveis = derivarTarefasVisiveis(estado);
  renderizarTarefas(visiveis);
  mostrarResultado(visiveis.length, estado.tarefas.length);
}

function onBusca(evento) {
  atualizarEstado({ busca: evento.target.value });
  renderizar();
}

function onFiltroStatus(evento) {
  atualizarEstado({ status: evento.target.value });
  renderizar();
}

function onFiltroPrioridade(evento) {
  atualizarEstado({ prioridade: evento.target.value });
  renderizar();
}

function onOrdenacao(evento) {
  atualizarEstado({ ordenacao: evento.target.value });
  renderizar();
}

function onLimpar() {
  restaurarFiltros();

  // Os controles são a projeção; sincronizamos os elementos aqui
  // porque o navegador não reflete radio/select automaticamente a
  // partir do nosso objeto de estado — mas o valor que manda continua
  // sendo o que restaurarFiltros() acabou de gravar.
  campoBusca.value = "";
  document.getElementById("filtro-status-todos").checked = true;
  document.getElementById("filtro-prioridade-todas").checked = true;
  seletorOrdenacao.value = "nenhuma";

  renderizar();
}

function registrarOuvintes() {
  // Evita que o Enter na busca recarregue a página.
  formulario.addEventListener("submit", (evento) => evento.preventDefault());

  campoBusca.addEventListener("input", onBusca);
  radiosStatus.forEach((radio) =>
    radio.addEventListener("change", onFiltroStatus),
  );
  radiosPrioridade.forEach((radio) =>
    radio.addEventListener("change", onFiltroPrioridade),
  );
  seletorOrdenacao.addEventListener("change", onOrdenacao);
  botaoLimpar.addEventListener("click", onLimpar);

  // Uma única vez: o listener delegado não precisa ser reinstalado a
  // cada renderização, porque o container dos cartões nunca muda.
  iniciarEventosDelegados();
}

async function iniciar() {
  registrarOuvintes();
  renderizar(); // mostra "Carregando..." imediatamente

  try {
    const tarefas = await carregarTarefas();
    atualizarEstado({ tarefas, carregando: false, erro: null });
  } catch (erro) {
    let tipo = "desconhecido";

    if (erro.name === "TypeError") {
      tipo = "rede";
    } else if (erro.name === "SyntaxError") {
      tipo = "formato";
    } else if (erro.name === "ErroProtocolo") {
      tipo = "protocolo";
    }

    atualizarEstado({ carregando: false, erro: { tipo, mensagem: erro.message } });
  }

  renderizar();
}

iniciar();
