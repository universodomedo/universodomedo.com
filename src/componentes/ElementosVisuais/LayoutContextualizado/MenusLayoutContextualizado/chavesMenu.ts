export const ListaMenusLayoutContextualizado = {
    menuTeste: 'menuTeste',
} as const;

export type ChaveMenuLayout = typeof ListaMenusLayoutContextualizado[keyof typeof ListaMenusLayoutContextualizado];