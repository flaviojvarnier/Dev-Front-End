# Quadro de tarefas acadêmicas — E4

Gerenciador de tarefas com estado único, busca, filtros por status e
prioridade, ordenação por prazo e feedback acessível de carregamento,
erro, origem vazia e resultado vazio.

## Aplicação publicada

<!-- Substitua pelo link real depois de publicar no GitHub Pages -->
🔗 **URL pública:** https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/

## Como publicar no GitHub Pages

1. Suba este projeto para um repositório no GitHub (branch padrão, ex. `main`).
2. Em **Settings → Pages**, escolha a branch padrão e a pasta raiz (`/`).
3. Aguarde o deploy e copie a URL gerada para a linha acima.
4. Abra a URL numa janela anônima e confira, em DevTools:
   - **Network**: `dados.json`, `css/styles.css` e todos os arquivos de
     `js/` retornam 200 (nenhum 404).
   - **Console**: nenhum erro ao carregar, buscar, filtrar, ordenar e
     limpar filtros.

## Arquitetura

- `js/api.js` — busca `dados.json`. Não conhece o DOM.
- `js/estado.js` — objeto de estado único (fonte de verdade) e a
  única função que o altera.
- `js/derivacao.js` — função pura que recebe o estado e devolve a
  lista visível (busca + filtros + ordenação), sem mutar nada.
- `js/renderizacao.js` — desenha a lista derivada nas colunas do
  quadro e mantém o listener delegado dos cartões.
- `js/estados.js` — decide a mensagem da região `role="status"`
  (carregando, erro, origem vazia, resultado vazio, contagem).
- `js/script.js` — ponto de entrada: liga os controles ao estado e
  chama o mesmo ciclo de renderização a cada mudança.

A regra central: **o estado é a fonte; a tela é uma projeção.** Nenhum
módulo além de `estado.js` guarda uma segunda cópia das tarefas
filtradas.
