'use client';

import { obtemListagemPaginas } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao/contexto';
import { Contexto__PaginaAdminGestaoMenu__Provider } from 'Contextos/Contexto__PaginaAdminGestaoMenu/contexto';

// Página "Menus" (Admin › Navegação › Menus): o fluxo de gestão de menus (GestaoMenu) promovido de subfluxo a página própria.
// Carrega a MESMA listagem de páginas da página "Páginas" (pro seletor de destino de itens) e renderiza o fluxo, que tem seu próprio resolveSaida interno (estrutura / novo-nó / edição-nó / novo-menu / edição-menu).
export function Conteiner__PaginaAdminGestaoMenu() {
    const listagemPaginas = obtemListagemPaginas();
    return <Contexto__PaginaAdminGestaoMenu__Provider listagemPaginas={listagemPaginas} />;
};
