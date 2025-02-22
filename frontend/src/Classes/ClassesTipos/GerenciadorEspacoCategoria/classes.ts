// export class GerenciadorEspacoCategoria {
//     public espacosCategoria: EspacoCategoria[] = [];

//     constructor() { }

//     maximoItensCategoria(valorCategoria: number): number { return (valorCategoria > 0 ? this.espacosCategoria.find(categoria => categoria.valorCategoria === valorCategoria)!.maximoEspacosCategoria : 999); }
// }

// export class EspacoCategoria {
//     constructor(
//         public valorCategoria: number,
//         public maximoEspacosCategoria: number,
//     ) { }

//     get nomeCategoria(): string { return `Categoria ${this.valorCategoria}`; }
// }

export type TipoCategoriaModelo = {
    id: number;
    valorCategoria: number;
};

export type TipoCategoria = TipoCategoriaModelo & {
    readonly nomeCategoria: string;
};

export type EspacoCategoria = {
    maximoDeItensDessaCategoria: number;
    readonly refTipoCategoria: TipoCategoria;
};