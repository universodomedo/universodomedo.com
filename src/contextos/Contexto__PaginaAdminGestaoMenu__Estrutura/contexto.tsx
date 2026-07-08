'use client';

import { useContexto__PaginaAdminGestaoMenu } from '../Contexto__PaginaAdminGestaoMenu/contexto';
import SPA__PaginaAdminGestaoMenu__Estrutura from 'Conteineres/PaginaAdminGestaoMenu/paginas/SPA__PaginaAdminGestaoMenu__Estrutura/SPA__PaginaAdminGestaoMenu__Estrutura';

// Subfluxo Estrutura: a árvore de UM menu (escolhido na listagem) como conteúdo nobre. A identidade do menu mora no subtítulo (dono: Controlador de Fluxo), não no corpo.
export const Contexto__PaginaAdminGestaoMenu__Estrutura__Provider = () => {
    const { menuSelecionado, erro, irParaNovoNo, irParaEdicaoNo, irParaEdicaoMenu, reordenar, reparentar, moverParaPosicao } = useContexto__PaginaAdminGestaoMenu();

    if (!menuSelecionado) return null;

    return (
        <SPA__PaginaAdminGestaoMenu__Estrutura
            menu={menuSelecionado}
            erro={erro}
            irParaNovoNo={irParaNovoNo}
            irParaEdicaoNo={irParaEdicaoNo}
            irParaEdicaoMenu={irParaEdicaoMenu}
            reordenar={reordenar}
            reparentar={reparentar}
            moverParaPosicao={moverParaPosicao}
        />
    );
};
