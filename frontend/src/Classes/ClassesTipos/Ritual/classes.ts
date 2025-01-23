// #region Imports
import { adicionarAcoesUtil, Acao, FiltroProps, FiltroPropsItems, OpcoesFiltro, PaletaCores, EmbrulhoComportamentoRitual, DadosGenericosRitual, DadosComportamentosRitual } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';
// #endregion

export class Ritual {
    private static nextId = 1;
    public id: number;
    public acoes: Acao[] = [];

    public dados: DadosGenericosRitual;
    public comportamentos: EmbrulhoComportamentoRitual = new EmbrulhoComportamentoRitual();;

    public svg = `PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Zz4KICAgIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICAgIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgeD0iMzQxIiB5PSIyOTEiIGlkPSJzdmdfMiIgc3Ryb2tlLXdpZHRoPSIwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPlRlc3RlIDE8L3RleHQ+CiAgICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgeD0iNjMiIHk9IjExMCIgaWQ9InN2Z18zIiBmb250LXNpemU9IjE0MCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5SPC90ZXh0PgogIDwvZz4KPC9zdmc+`;

    constructor({ dadosGenericosRitual, dadosComportamentos }: { dadosGenericosRitual: ConstructorParameters<typeof DadosGenericosRitual>[0], dadosComportamentos: DadosComportamentosRitual }) {
        console.log('constructor de ritual');
        console.log('dadosGenericosRitual');
        console.log(dadosGenericosRitual);
        console.log('dadosComportamentos');
        console.log(dadosComportamentos);
        this.id = Ritual.nextId++;

        this.dados = new DadosGenericosRitual(dadosGenericosRitual);

        if (dadosComportamentos.dadosComportamentoRitual !== undefined) this.comportamentos.setComportamentoRitual(dadosComportamentos.dadosComportamentoRitual);
    }

    get nomeExibicao(): string { return this.dados.nome };

    adicionarAcoes(acoes: { props: ConstructorParameters<typeof Acao>[0], config: (acao: Acao) => void }[]): this { return (adicionarAcoesUtil(this, this.acoes, acoes), this); }

    static get filtroProps(): FiltroProps<Ritual> {
        return new FiltroProps<Ritual>(
            [
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.dados.nome,
                    'Nome do Ritual',
                    'Procure pelo Ritual',
                    'text',
                    true
                ),
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.comportamentos.comportamentoRitual.refElemento.id,
                    'Elemento',
                    'Selecione o Elemento do Ritual',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().elementos.map(elemento => ({ id: elemento.id, nome: elemento.nome }))),
                ),
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.comportamentos.comportamentoRitual.refCirculoNivelRitual.id,
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