// #region Imports

// #endregion

export class CaracteristicaArma {
    constructor(
        public nome: string,
        public basesArmaPermitidas: ComposicaoBaseArma[]
    ) { }
}

type TipoArma = { id: number, nome: string, }
type ClassificacaoArma = { id: number; idTipoArma: number; idsPatentesArma: number[]; nome: string; }
type PatenteArma = { id: number; nome: string; pontosCaracteristica: number; }
type ComposicaoBaseArma = { idTipo: number; idClassificacao: number; idPatente: number; }
type BaseArma = { id: number; composicaoBaseArma: ComposicaoBaseArma; peso: number; categoria: number; danoMin: number, danoMax: number, numeroExtremidadesUtilizadas: number, idAtributoUtilizado: number, idPericiaUtilizada: number, }

export const tiposArma: TipoArma[] = [
    { id: 1, nome: 'Arma Corpo-a-Corpo' },
    // { id: 2, nome: 'Arma de Disparo' },
    // { id: 3, nome: 'Arma de Arremesso' },
    // { id: 4, nome: 'Arma de Fogo' },
];

export const patentesArma: PatenteArma[] = [
    { id: 1, nome: 'Simples', pontosCaracteristica: 1, },
    // { id: 2, nome: 'Complexa', pontosCaracteristica: 2, },
    // { id: 3, nome: 'Especial', pontosCaracteristica: 4, },
];

export const classificacoesArma: ClassificacaoArma[] = [
    { id: 1, idTipoArma: 1, idsPatentesArma: [1, 2, 3], nome: 'Leve' },
    { id: 2, idTipoArma: 1, idsPatentesArma: [1, 2, 3], nome: 'de Uma Mão' },
    { id: 3, idTipoArma: 1, idsPatentesArma: [1, 2, 3], nome: 'de Duas Mãos' },
    // { id: 4, idTipoArma: 2, idsPatentesArma: [1, 2, 3], nome: 'Disparador de Pressão' },
    // { id: 5, idTipoArma: 2, idsPatentesArma: [3], nome: 'Disparador Automático' },
    // { id: 6, idTipoArma: 3, idsPatentesArma: [1, 2, 3], nome: 'Arremessável Leve' },
    // { id: 7, idTipoArma: 3, idsPatentesArma: [2, 3], nome: 'Arremessável Pesado' },
    // { id: 8, idTipoArma: 3, idsPatentesArma: [2, 3], nome: 'Arremessável Tático' },
    // { id: 9, idTipoArma: 4, idsPatentesArma: [1, 2, 3], nome: 'Arma de Fogo de Calibre Baixo' },
    // { id: 10, idTipoArma: 4, idsPatentesArma: [1, 2, 3], nome: 'Arma de Fogo de Calibre Médio' },
    // { id: 11, idTipoArma: 4, idsPatentesArma: [2, 3], nome: 'Arma de Fogo de Calibre Alto' },
    // { id: 12, idTipoArma: 4, idsPatentesArma: [3], nome: 'Arma de Fogo de Destruição' },
];

export const basesArma: BaseArma[] = [
    { id: 1, composicaoBaseArma: { idTipo: 1, idPatente: 1, idClassificacao: 1 }, peso: 2, categoria: 0, danoMin: 1, danoMax: 4, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 8, },
    { id: 2, composicaoBaseArma: { idTipo: 1, idPatente: 1, idClassificacao: 2 }, peso: 3, categoria: 0, danoMin: 1, danoMax: 5, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 2, idPericiaUtilizada: 8, },
    { id: 3, composicaoBaseArma: { idTipo: 1, idPatente: 1, idClassificacao: 3 }, peso: 5, categoria: 0, danoMin: 1, danoMax: 5, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 2, idPericiaUtilizada: 8, },
    { id: 4, composicaoBaseArma: { idTipo: 2, idPatente: 1, idClassificacao: 4 }, peso: 4, categoria: 0, danoMin: 2, danoMax: 4, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    { id: 5, composicaoBaseArma: { idTipo: 3, idPatente: 1, idClassificacao: 6 }, peso: 4, categoria: 0, danoMin: 2, danoMax: 4, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    { id: 6, composicaoBaseArma: { idTipo: 4, idPatente: 1, idClassificacao: 9 }, peso: 3, categoria: 1, danoMin: 1, danoMax: 6, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    { id: 7, composicaoBaseArma: { idTipo: 4, idPatente: 1, idClassificacao: 10 }, peso: 5, categoria: 1, danoMin: 1, danoMax: 8, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },

    // { id: 8, composicaoBaseArma: { idTipo: 1, idPatente: 2, idClassificacao: 1 }, peso: 4, categoria: 1, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 8, },
    // { id: 9, composicaoBaseArma: { idTipo: 1, idPatente: 2, idClassificacao: 2 }, peso: 5, categoria: 1, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 2, idPericiaUtilizada: 8, },
    // { id: 10, composicaoBaseArma: { idTipo: 1, idPatente: 2, idClassificacao: 3 }, peso: 8, categoria: 1, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 2, idPericiaUtilizada: 8, },
    // { id: 11, composicaoBaseArma: { idTipo: 2, idPatente: 2, idClassificacao: 4 }, peso: 7, categoria: 1, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 12, composicaoBaseArma: { idTipo: 3, idPatente: 2, idClassificacao: 6 }, peso: 6, categoria: 1, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 13, composicaoBaseArma: { idTipo: 3, idPatente: 2, idClassificacao: 7 }, peso: 9, categoria: 1, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 14, composicaoBaseArma: { idTipo: 3, idPatente: 2, idClassificacao: 8 }, peso: 6, categoria: 2, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 15, composicaoBaseArma: { idTipo: 4, idPatente: 2, idClassificacao: 9 }, peso: 5, categoria: 2, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 16, composicaoBaseArma: { idTipo: 4, idPatente: 2, idClassificacao: 10 }, peso: 8, categoria: 2, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 17, composicaoBaseArma: { idTipo: 4, idPatente: 2, idClassificacao: 11 }, peso: 10, categoria: 3, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },

    // { id: 18, composicaoBaseArma: { idTipo: 1, idPatente: 3, idClassificacao: 1 }, peso: 5, categoria: 2, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 8, },
    // { id: 19, composicaoBaseArma: { idTipo: 1, idPatente: 3, idClassificacao: 2 }, peso: 7, categoria: 2, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 2, idPericiaUtilizada: 8, },
    // { id: 20, composicaoBaseArma: { idTipo: 1, idPatente: 3, idClassificacao: 3 }, peso: 11, categoria: 2, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 2, idPericiaUtilizada: 8, },
    // { id: 21, composicaoBaseArma: { idTipo: 2, idPatente: 3, idClassificacao: 4 }, peso: 10, categoria: 2, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 22, composicaoBaseArma: { idTipo: 2, idPatente: 3, idClassificacao: 5 }, peso: 6, categoria: 2, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 23, composicaoBaseArma: { idTipo: 3, idPatente: 3, idClassificacao: 6 }, peso: 7, categoria: 2, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 24, composicaoBaseArma: { idTipo: 3, idPatente: 3, idClassificacao: 7 }, peso: 13, categoria: 2, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 25, composicaoBaseArma: { idTipo: 3, idPatente: 3, idClassificacao: 8 }, peso: 9, categoria: 3, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 26, composicaoBaseArma: { idTipo: 4, idPatente: 3, idClassificacao: 9 }, peso: 6, categoria: 3, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 27, composicaoBaseArma: { idTipo: 4, idPatente: 3, idClassificacao: 10 }, peso: 9, categoria: 3, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 28, composicaoBaseArma: { idTipo: 4, idPatente: 3, idClassificacao: 11 }, peso: 12, categoria: 4, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
    // { id: 29, composicaoBaseArma: { idTipo: 4, idPatente: 3, idClassificacao: 12 }, peso: 15, categoria: 4, danoMin: 1, danoMax: 2, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 1, idPericiaUtilizada: 5, },
];

///////////////////

export const caracteristicasArmas = [
    new CaracteristicaArma('Ineficaz', [{ idTipo: 1, idClassificacao: 1, idPatente: 1 }, { idTipo: 1, idClassificacao: 2, idPatente: 1 }, { idTipo: 1, idClassificacao: 3, idPatente: 1 }])
];