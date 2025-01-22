// #region Imports
// #endregion

export class FiltroProps<T> {
    constructor(
        public items: FiltroPropsItems<T>[]
    ) { }
}

export class FiltroPropsItems<T> {
    constructor(
        public key: keyof T | ((item: T) => any),
        public label: string,
        public placeholder: string,
        public filterType: 'text' | 'select' | 'number',
        public sortEnabled: boolean,
        private _options?: OpcoesFiltro | OpcoesFiltrosCategorizadas,
    ) { }

    temOpcoes(): boolean {
        return this._options !== undefined;
    }

    temCategorias(): boolean {
        return this._options instanceof OpcoesFiltrosCategorizadas;
    }

    get options(): OpcaoFormatada[] | CategoriaFormatada[] | undefined {
        if (this._options instanceof OpcoesFiltro) {
            return this._options.opcoes;
        }
        if (this._options instanceof OpcoesFiltrosCategorizadas) {
            return this._options.categorias;
        }
    }
}

export class OpcoesFiltrosCategorizadas {
    constructor(
        private _categorias: CategoriaFiltro
    ) { }

    get categorias(): CategoriaFormatada[] {
        return this._categorias.reduce((acc, categoria) => {
            acc.push({ label: categoria.categoria, options: categoria.opcoes.opcoes });

            return acc;
        }, [] as CategoriaFormatada[]);
    }
}

export class OpcoesFiltro {
    constructor(
        private _opcoes: OpcaoFiltro[]
    ) { }

    get opcoes(): OpcaoFormatada[] {
        return this._opcoes.reduce((acc, opcao) => {
            acc.push({ value: opcao.id.toString(), label: opcao.nome })

            return acc;
        }, [] as OpcaoFormatada[]);
    }
}

export type OpcaoFiltro = { id: number | string; nome: string; };
export type OpcaoFormatada = { value: string; label: string; };

export type CategoriaFiltro = { categoria: string; opcoes: OpcoesFiltro; }[];
export type CategoriaFormatada = { label: string; options: OpcaoFormatada[]; };