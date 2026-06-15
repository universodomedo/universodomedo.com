import type { AtributoCompletaDto, ClasseDto, EstatisticaDanificavelCompletaDto, FichaEmClient, PatentePericiaCompletaDto, PericiaCompletaDto } from 'types-nora-api';

export const VALOR_PADRAO_ATRIBUTO = 1;
export const ID_PATENTE_PADRAO = 1;
export const VALOR_PADRAO_ESTATISTICA = 0;

export type ReferenciaFichaSer = {
    atributos: readonly AtributoCompletaDto[];
    pericias: readonly PericiaCompletaDto[];
    patentes: readonly PatentePericiaCompletaDto[];
    estatisticas: readonly EstatisticaDanificavelCompletaDto[];
};

export type ValoresFichaSer = {
    valoresAtributos: Record<number, number>;
    patentesPericias: Record<number, number>;
    valoresEstatisticas: Record<number, number>;
};

export function montaFichaEmClientDoSer(referencia: ReferenciaFichaSer, valores: ValoresFichaSer, classeSer: ClasseDto): FichaEmClient {
    const atributos = referencia.atributos.map(atributo => { const valor = valores.valoresAtributos[atributo.id] ?? VALOR_PADRAO_ATRIBUTO; return { atributo, valor, valorTotal: valor, detalhesValor: [] }; });
    const valorMaxAtributo = atributos.reduce((maximo, atributoFicha) => Math.max(maximo, atributoFicha.valor), 0);

    return {
        atributos,
        pericias: referencia.pericias.map(pericia => ({ pericia, patentePericia: obtemPatente(referencia.patentes, valores.patentesPericias[pericia.id] ?? ID_PATENTE_PADRAO), valorEfeito: 0, valorTotal: 0, detalhesValor: [] })),
        estatisticasDanificaveis: referencia.estatisticas.map(estatistica => ({ estatisticaDanificavel: estatistica, valorMaximo: valores.valoresEstatisticas[estatistica.id] ?? VALOR_PADRAO_ESTATISTICA })),
        detalhe: { valorMaxAtributo, pontosDeHabilidadeEspecial: 0, pontosDeHabilidadeParanormal: 0, pontosDeHabilidadeElemental: 0 },
        classe: classeSer,
        detalhesUsoEvolucaoPericiasLivres: [],
    };
};

function obtemPatente(patentes: readonly PatentePericiaCompletaDto[], idPatente: number): PatentePericiaCompletaDto {
    return patentes.find(patente => patente.id === idPatente) ?? patentes[0];
};
