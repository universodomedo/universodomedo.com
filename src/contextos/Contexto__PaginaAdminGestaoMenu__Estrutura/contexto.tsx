'use client';

import { useContexto__PaginaAdminGestaoMenu } from '../Contexto__PaginaAdminGestaoMenu/contexto';
import SPA__PaginaAdminGestaoMenu from 'Conteineres/PaginaAdminGestaoMenu/paginas/SPA__PaginaAdminGestaoMenu/SPA__PaginaAdminGestaoMenu';

// Subfluxo Estrutura: a VISTA CUSTOM da árvore de menus e RAIZ da página "Menus". NÃO configura layout — o título vem da PAGINA; os subfluxos ConteudoForm (novo/editar nó/menu) setam o seu subtítulo/fecharProps e limpam no unmount.
export const Contexto__PaginaAdminGestaoMenu__Estrutura__Provider = () => {
    const { navegacao, erro, irParaNovoNo, irParaEdicaoNo, irParaNovoMenu, irParaEdicaoMenu, reordenar, reparentar } = useContexto__PaginaAdminGestaoMenu();

    return <SPA__PaginaAdminGestaoMenu navegacao={navegacao} erro={erro} irParaNovoNo={irParaNovoNo} irParaEdicaoNo={irParaEdicaoNo} irParaNovoMenu={irParaNovoMenu} irParaEdicaoMenu={irParaEdicaoMenu} reordenar={reordenar} reparentar={reparentar} />;
};
