import { ReactNode } from 'react';

import ListaAcoesMestre from './paginasMenu/menuPrincipalParaMestre/page.tsx';
import { ChaveMenuLayout } from './chavesMenu';

export const registrosMenu: Record<ChaveMenuLayout, { componente: ReactNode; proporcaoMenu: number; }> = {
    menuPrincipalParaMestre: { componente: <ListaAcoesMestre />, proporcaoMenu: 0.17 },
};