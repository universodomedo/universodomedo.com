export type Menu = {
    tituloMenu: string,
    itensMenu: ItemMenu[]
}

export type ItemMenu = {
    tituloItem: string,
    funcItem: () => void
}