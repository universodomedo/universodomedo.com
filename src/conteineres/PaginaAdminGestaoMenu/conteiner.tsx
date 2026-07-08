'use client';

import { obtemListagemPaginas } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao/contexto';
import { Contexto__PaginaAdminGestaoMenu__Provider } from 'Contextos/Contexto__PaginaAdminGestaoMenu/contexto';

// Página "Menus" (Admin › Navegação › Menus): listagem em grade dos menus → estrutura (árvore) de UM menu → subfluxos de form (novo/editar nó/menu), decididos pelo resolveSaida interno do contexto.
// Carrega a MESMA listagem de páginas da página "Páginas" (pro seletor de destino de itens) e renderiza o fluxo.
export function Conteiner__PaginaAdminGestaoMenu() {
    const listagemPaginas = obtemListagemPaginas();
    return <Contexto__PaginaAdminGestaoMenu__Provider listagemPaginas={listagemPaginas} />;
};
