export type Menu = {
    tituloMenu: string,
    itensMenu: ItemMenu[],
}

export type ItemMenu = {
    tituloItem: string,
    tipoItem: 'Item' | 'CheckboxItem' | 'Separator',
    checked: boolean,
    funcItem: () => void,
}