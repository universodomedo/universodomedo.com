// #region Imports
import { FiltroProps, FiltroPropsItems, OpcoesFiltro, PaletaCores, EmbrulhoComportamentoRitual, DadosComportamentosRitual, IAcao } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';
// #endregion

export type RitualModelo = {
    nome: string;
    svg: string;
    // acoes: IAcao[];
}

export type DadosRitualModelo = Omit<RitualModelo, 'acoes'> & {
    // dadosAcaoModelo: [],
}

export type Ritual = {

};

export interface IRitual {
    // dados: DadosGenericosRitual;
    comportamentos: EmbrulhoComportamentoRitual;
    svg: string;
    acoes: IAcao[];
}

export interface IRitualServico extends IRitual {
    readonly nomeExibicao: string;
}

export type ElementoModelo = {
    id: number;
    nome: string;
    cores: PaletaCores;  
};

export type Elemento = ElementoModelo;

export type NivelRitualModelo = {
    id: number;
    nome: string;
};

export type NivelRitual = NivelRitualModelo;

export type CirculoRitualModelo = {
    id: number;
    nome: string;
};

export type CirculoRitual = CirculoRitualModelo;

export type CirculoNivelRitualModelo = {
    id: number;
    idCirculo: number;
    idNivel: number;
    valorPSSacrificado: number;
};

export type CirculoNivelRitual = CirculoNivelRitualModelo & {
    readonly nome: string;
    readonly refCirculo: CirculoRitualModelo;
    readonly refNivelRitual: NivelRitualModelo;
}

export type NivelComponenteModelo = {
    id: number;
    nome: string;
};

export type NivelComponente = NivelComponenteModelo;






// export class Ritual {
//     public acoes: IAcaoService[] = [];

//     public svg = `PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Zz4KICAgIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICAgIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgeD0iMzQxIiB5PSIyOTEiIGlkPSJzdmdfMiIgc3Ryb2tlLXdpZHRoPSIwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPlRlc3RlIDE8L3RleHQ+CiAgICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgeD0iNjMiIHk9IjExMCIgaWQ9InN2Z18zIiBmb250LXNpemU9IjE0MCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5SPC90ZXh0PgogIDwvZz4KPC9zdmc+`;

//     constructor({ dadosGenericosRitual, dadosComportamentos }: { dadosGenericosRitual: ConstructorParameters<typeof DadosGenericosRitual>[0], dadosComportamentos: DadosComportamentosRitual }) {
//     }

//     get nomeExibicao(): string { return '' };

//     adicionarAcoes(acoes: { props: ConstructorParameters<typeof Acao>[0], config: (acao: Acao) => void }[]): this { return (adicionarAcoesUtil(this, this.acoes, acoes), this); }
// }

// export class CirculoNivelRitualModelo {
//     constructor(
//         public id: number,
//         public idCirculo: number,
//         public idNivel: number,
//         public psSacrificados: number,
//     ) { }

//     get nome(): string {
//         return `${SingletonHelper.getInstance().circulos_ritual.find(circulo_ritual => circulo_ritual.id === this.idCirculo)!.nome}º Círculo ${SingletonHelper.getInstance().niveis_ritual.find(nivel_ritual => nivel_ritual.id === this.idNivel)!.nome}`;
//     }
// }