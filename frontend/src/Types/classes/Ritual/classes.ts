// #region Imports
import { adicionarAcoesUtil, Acao, CorTooltip, FiltroProps, FiltroPropsItems, OpcoesFiltro, PaletaCores, ComportamentoGeral } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class Ritual {
    private static nextId = 1;
    public id: number;
    public acoes: Acao[] = [];
    public comportamentoGeral: ComportamentoGeral;

    constructor(
        public nome: string,
        private _idCirculoNivel: number,
        private _idElemento: number,
        public svg: string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Zz4KICAgIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICAgIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgeD0iMzQxIiB5PSIyOTEiIGlkPSJzdmdfMiIgc3Ryb2tlLXdpZHRoPSIwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPlRlc3RlIDE8L3RleHQ+CiAgICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgeD0iNjMiIHk9IjExMCIgaWQ9InN2Z18zIiBmb250LXNpemU9IjE0MCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5SPC90ZXh0PgogIDwvZz4KPC9zdmc+',
    ) {
        this.id = Ritual.nextId++;
        this.comportamentoGeral = new ComportamentoGeral();
    }

    get nomeExibicao(): string { return this.nome };
    get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!; }
    get refCirculoNivelRitual(): CirculoNivelRitual { return SingletonHelper.getInstance().circulos_niveis_ritual.find(circulo_nivel_ritual => circulo_nivel_ritual.id === this._idCirculoNivel)!; }
    get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this.refCirculoNivelRitual.idCirculo)! }

    adicionarAcoes(acaoParams: [new (...args: any[]) => Acao, any[], (acao: Acao) => void][]): this { return (adicionarAcoesUtil(this, this.acoes, acaoParams), this) }

    static get filtroProps(): FiltroProps<Ritual> {
        return new FiltroProps<Ritual>(
            "Rituais",
            [
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.nome,
                    'Nome do Ritual',
                    'Procure pelo Ritual',
                    'text',
                    true
                ),
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.refElemento.id,
                    'Elemento',
                    'Selecione o Elemento do Ritual',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().elementos.map(elemento => ({ id: elemento.id, nome: elemento.nome }))),
                ),
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.refCirculoNivelRitual.id,
                    'Círculo',
                    'Selecione o Círculo do Ritual',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().circulos_niveis_ritual.map(circulo_nivel => ({ id: circulo_nivel.id, nome: circulo_nivel.nome }))),
                ),
            ]
        )
    }
}

export class Elemento {
    constructor(
        public id: number,
        public nome: string,
        public cores: PaletaCores,
    ) { }
}

export class Circulo {
    // export class Circulo implements MDL_CirculoRitual {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}

export class NivelRitual {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class CirculoRitual {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class CirculoNivelRitual {
    constructor(
        public id: number,
        public idCirculo: number,
        public idNivel: number,
        public psSacrificados: number,
    ) { }

    get nome(): string {
        return `${SingletonHelper.getInstance().circulos_ritual.find(circulo_ritual => circulo_ritual.id === this.idCirculo)!.nome}º Círculo ${SingletonHelper.getInstance().niveis_ritual.find(nivel_ritual => nivel_ritual.id === this.idNivel)!.nome}`;
    }
}

export class NivelComponente {
    constructor(
        public id: number,
        public nome: string
    ) { }
}