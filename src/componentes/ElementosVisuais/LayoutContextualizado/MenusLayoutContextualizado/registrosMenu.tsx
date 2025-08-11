import { ReactNode } from 'react';

import MenuTeste from './paginasMenu/teste';
import { ChaveMenuLayout } from './chavesMenu';

export const registrosMenu: Record<ChaveMenuLayout, ReactNode> = {
    menuTeste: <MenuTeste />,
};