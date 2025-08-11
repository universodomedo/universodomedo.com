export const ListaMenusLayoutContextualizado = {
    menuPrincipalParaMestre: 'menuPrincipalParaMestre',
} as const;

export type ChaveMenuLayout = typeof ListaMenusLayoutContextualizado[keyof typeof ListaMenusLayoutContextualizado];