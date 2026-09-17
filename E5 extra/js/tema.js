// js/tema.js
//
// Responsabilidade única: controlar o tema visual (dia / noite) da
// aplicação. Nada de lógica de tarefas aqui — este módulo só sabe
// de duas coisas: o atributo [data-tema] no <html> e a chave no
// localStorage que persiste a escolha entre sessões.
//
// A troca de tema funciona por atributo CSS ([data-tema="noite"]),
// então nenhuma regra existente precisa ser alterada — o bloco noturno
// do styles.css simplesmente sobrescreve as variáveis e os gradientes
// quando o atributo está presente.

const CHAVE_STORAGE = "tema-preferido";
const TEMA_NOITE    = "noite";
const TEMA_DIA      = "dia";

const LABELS = {
  [TEMA_DIA]:   { icone: "🌙", texto: "Noite" },
  [TEMA_NOITE]: { icone: "☀️",  texto: "Dia"   },
};

function temaAtual() {
  return document.documentElement.dataset.tema ?? TEMA_DIA;
}

function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  localStorage.setItem(CHAVE_STORAGE, tema);
  sincronizarBotao(tema);
}

function sincronizarBotao(tema) {
  const botao = document.getElementById("toggle-tema");
  if (!botao) return;
  const { icone, texto } = LABELS[tema];
  botao.querySelector(".icone-tema").textContent = icone;
  botao.querySelector(".label-tema").textContent = texto;
  botao.setAttribute(
    "aria-label",
    tema === TEMA_NOITE ? "Mudar para modo dia" : "Mudar para modo noite",
  );
}

function criarBotao() {
  const botao = document.createElement("button");
  botao.id = "toggle-tema";
  botao.type = "button";
  botao.setAttribute("aria-label", "Mudar para modo noite");

  const icone = document.createElement("span");
  icone.className = "icone-tema";
  icone.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.className = "label-tema";

  botao.appendChild(icone);
  botao.appendChild(label);

  botao.addEventListener("click", () => {
    aplicarTema(temaAtual() === TEMA_NOITE ? TEMA_DIA : TEMA_NOITE);
  });

  return botao;
}

// Ponto de entrada — chamado uma única vez em script.js
export function iniciarTema() {
  // Insere o botão no header antes de aplicar o tema, para que
  // sincronizarBotao() encontre o elemento já no DOM.
  const header = document.querySelector("header");
  if (header) header.appendChild(criarBotao());

  // Recupera preferência salva ou usa modo dia como padrão.
  const preferido = localStorage.getItem(CHAVE_STORAGE) ?? TEMA_DIA;
  aplicarTema(preferido);
}