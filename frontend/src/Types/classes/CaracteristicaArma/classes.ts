// #region Imports
import { DadosCaracteristicasArmas } from 'Types/classes/index.ts';
// #endregion

export type CaracteristicaArma = {
    id: number;
    nome: string;
    descricao: string;
    basesArma: BaseArmaComDados[];
};

type TipoArma = { id: number, nome: string, }
type ClassificacaoArma = { id: number, idTipoArma: number, idsPatentesArma: number[], nome: string, }
type PatenteArma = { id: number, nome: string, pontosCaracteristica: number, idPatentePericiaRequisito: number }
type ComposicaoBaseArma = { idTipo: number, idClassificacao: number, idPatente: number, }
type BaseArma = { id: number, composicaoBaseArma: ComposicaoBaseArma, peso: number, categoria: number, danoMin: number, danoMax: number, numeroExtremidadesUtilizadas: number, idAtributoUtilizado: number, idPericiaUtilizada: number, }
type BaseArmaComDados = { idBaseArma: number, dadosCaracteristicaNaBase: { custoCaracteristica: number; dadosCaracteristicasArmas: DadosCaracteristicasArmas; }, };

export const tiposArma: TipoArma[] = [
    { id: 1, nome: 'Arma Corpo-a-Corpo' },
    { id: 2, nome: 'Arma de Disparo' },
    { id: 3, nome: 'Arma de Arremesso' },
    { id: 4, nome: 'Arma de Fogo' },
];

export const patentesArma: PatenteArma[] = [
    { id: 1, nome: 'Simples', pontosCaracteristica: 1, idPatentePericiaRequisito: 2, },
    // { id: 2, nome: 'Complexa', pontosCaracteristica: 2, idPatentePericiaRequisito: 3, },
    // { id: 3, nome: 'Especial', pontosCaracteristica: 4, idPatentePericiaRequisito: 4, },
];

export const classificacoesArma: ClassificacaoArma[] = [
    { id: 1, idTipoArma: 1, idsPatentesArma: [1, 2, 3], nome: 'Leve' },
    { id: 2, idTipoArma: 1, idsPatentesArma: [1, 2, 3], nome: 'de Uma Mão' },
    { id: 3, idTipoArma: 1, idsPatentesArma: [1, 2, 3], nome: 'de Duas Mãos' },
    { id: 4, idTipoArma: 2, idsPatentesArma: [1, 2, 3], nome: 'Disparador de Pressão' },
    { id: 5, idTipoArma: 2, idsPatentesArma: [3], nome: 'Disparador Automático' },
    { id: 6, idTipoArma: 3, idsPatentesArma: [1, 2, 3], nome: 'Arremessável Leve' },
    { id: 7, idTipoArma: 3, idsPatentesArma: [2, 3], nome: 'Arremessável Pesado' },
    { id: 8, idTipoArma: 3, idsPatentesArma: [2, 3], nome: 'Arremessável Tático' },
    { id: 9, idTipoArma: 4, idsPatentesArma: [1, 2, 3], nome: 'Arma de Fogo de Calibre Baixo' },
    { id: 10, idTipoArma: 4, idsPatentesArma: [1, 2, 3], nome: 'Arma de Fogo de Calibre Médio' },
    { id: 11, idTipoArma: 4, idsPatentesArma: [2, 3], nome: 'Arma de Fogo de Calibre Alto' },
    { id: 12, idTipoArma: 4, idsPatentesArma: [3], nome: 'Arma de Fogo de Destruição' },
];

export const basesArma: BaseArma[] = [
    { id: 1, composicaoBaseArma: { idTipo: 1, idPatente: 1, idClassificacao: 1 }, peso: 2, categoria: 0, danoMin: 1, danoMax: 4, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 1, idPericiaUtilizada: 8, },
    { id: 2, composicaoBaseArma: { idTipo: 1, idPatente: 1, idClassificacao: 2 }, peso: 3, categoria: 0, danoMin: 1, danoMax: 5, numeroExtremidadesUtilizadas: 1, idAtributoUtilizado: 2, idPericiaUtilizada: 8, },
    { id: 3, composicaoBaseArma: { idTipo: 1, idPatente: 1, idClassificacao: 3 }, peso: 6, categoria: 0, danoMin: 1, danoMax: 5, numeroExtremidadesUtilizadas: 2, idAtributoUtilizado: 2, idPericiaUtilizada: 8, },
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

export const listaCaracteristicaArma: CaracteristicaArma[] = [
    {
        id: 1,
        nome: 'Simplificada',
        descricao: 'Retira o Requisito de ser Treinado na Perícia Base',
        basesArma: [
            { idBaseArma: 1, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { reducaoPatenteSimplificada: true } } },
            { idBaseArma: 2, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { reducaoPatenteSimplificada: true } } },
            { idBaseArma: 3, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { reducaoPatenteSimplificada: true } } },
            { idBaseArma: 4, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { reducaoPatenteSimplificada: true } } },
            { idBaseArma: 5, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { reducaoPatenteSimplificada: true } } },
            { idBaseArma: 6, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: { reducaoPatenteSimplificada: true } } },
            { idBaseArma: 7, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: { reducaoPatenteSimplificada: true } } },
        ],
    },
    {
        id: 2,
        nome: 'Refinada',
        descricao: 'Aumenta o Dano Máximo',
        basesArma: [
            { idBaseArma: 1, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { modificadorDanoMaximo: 2 } } },
            { idBaseArma: 2, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { modificadorDanoMaximo: 2 } } },
            { idBaseArma: 3, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { modificadorDanoMaximo: 2 } } },
            { idBaseArma: 4, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { modificadorDanoMaximo: 2 } } },
            { idBaseArma: 5, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { modificadorDanoMaximo: 2 } } },
        ],
    },
    {
        id: 3,
        nome: 'Estendida',
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 1, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 2, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 3, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 4,
        nome: 'Consistente',
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 1, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 2, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 3, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 5,
        nome: 'Compacta',
        descricao: 'Reduz o peso',
        basesArma: [
            { idBaseArma: 1, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { modificadorPeso: -1 } } },
            { idBaseArma: 2, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: { modificadorPeso: -1 } } },
        ],
    },
    {
        id: 6,
        nome: 'Projetada',
        descricao: 'Aumenta a Defesa',
        basesArma: [
            {
                idBaseArma: 1,
                dadosCaracteristicaNaBase: {
                    custoCaracteristica: 2,
                    dadosCaracteristicasArmas: {
                        modificadores: [{ props: { nome: 'Arma Projetada', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 54, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 2 } }], dadosComportamentos: { dadosComportamentoPassivo: [true] } } }],
                    }
                }
            },
            {
                idBaseArma: 2,
                dadosCaracteristicaNaBase: {
                    custoCaracteristica: 2,
                    dadosCaracteristicasArmas: {
                        modificadores: [{ props: { nome: 'Arma Projetada', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 54, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 2 } }], dadosComportamentos: { dadosComportamentoPassivo: [true] } } }],
                    }
                }
            },
            {
                idBaseArma: 3,
                dadosCaracteristicaNaBase: {
                    custoCaracteristica: 2,
                    dadosCaracteristicasArmas: {
                        modificadores: [{ props: { nome: 'Arma Projetada', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 54, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 3 } }], dadosComportamentos: { dadosComportamentoPassivo: [true] } } }],
                    }
                }
            },
        ]
    },
    {
        id: 7,
        nome: 'Anti-Proteção',
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 2, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 3, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 4, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 5, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 6, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 7, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 8,
        nome: 'Fatal',
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 1, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 2, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 3, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 4, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 5, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 6, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 7, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 9,
        nome: 'Colossal',
        descricao: '',
        basesArma: [],
    },
    {
        id: 10,
        nome: 'Atroz',
        descricao: '',
        basesArma: [],
    },
    {
        id: 11,
        nome: 'Arremessável',
        descricao: '',
        basesArma: [],
    },
    {
        id: 12,
        nome: 'Retrátil', // diminui peso
        descricao: '',
        basesArma: [],
    },
    {
        id: 13,
        nome: 'Destruidora', // Remove R.D. pelo resto do combate
        descricao: '',
        basesArma: [],
    },
    {
        id: 14,
        nome: 'Sincronizada',
        descricao: '',
        basesArma: [],
    },
    {
        id: 15,
        nome: 'Resguardada',
        descricao: '',
        basesArma: [],
    },
    {
        id: 16,
        nome: 'Envenenada',
        descricao: '',
        basesArma: [],
    },
    {
        id: 17,
        nome: 'Embainhada', // bonus no turno que saca
        descricao: '',
        basesArma: [],
    },
    {
        id: 18,
        nome: 'Reciclada',
        descricao: '',
        basesArma: [],
    },
    {
        id: 19,
        nome: 'Veloz',
        descricao: '',
        basesArma: [],
    },
    {
        id: 20,
        nome: 'Degoladora',
        descricao: '',
        basesArma: [],
    },
    {
        id: 21,
        nome: 'Sombra',
        descricao: '',
        basesArma: [],
    },
    {
        id: 22,
        nome: 'Beijo da Serpente',
        descricao: '',
        basesArma: [],
    },
    {
        id: 23,
        nome: 'Sem Ponto Fraco',
        descricao: '',
        basesArma: [],
    },
    {
        id: 24,
        nome: 'Acoplada',
        descricao: '',
        basesArma: [],
    },
    {
        id: 25,
        nome: 'Imparável',
        descricao: '',
        basesArma: [],
    },
    {
        id: 26,
        nome: 'Bastarda',
        descricao: '',
        basesArma: [],
    },
    {
        id: 27,
        nome: 'Quebra-Quebra',
        descricao: '',
        basesArma: [],
    },
    {
        id: 28,
        nome: 'Massiva',
        descricao: '',
        basesArma: [],
    },
    {
        id: 29,
        nome: 'Fortaleza',
        descricao: '',
        basesArma: [],
    },
    {
        id: 30,
        nome: 'Dispersar',
        descricao: '',
        basesArma: [],
    },
    {
        id: 31,
        nome: 'Protetora', // gasta ação para receber + defesa
        descricao: '',
        basesArma: [],
    },
    {
        id: 32,
        nome: 'Restringente', // arma que agarra
        descricao: '',
        basesArma: [],
    },
    {
        id: 33,
        nome: 'Engatilhar', // para travar uma munição na arma
        descricao: '',
        basesArma: [],
    },
    {
        id: 34,
        nome: 'Armação Reduzida', // diminui peso
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 4, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 35,
        nome: 'Munição Leve', // diminui peso
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 4, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 5, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 36,
        nome: 'Munição Destruidora', // remove R.D. até o fim da cena, acumulando
        descricao: '',
        basesArma: [],
    },
    {
        id: 37,
        nome: 'Armação de Combate', // ataque corpo-a-corpo
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 4, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 38,
        nome: 'Munição Aerodinâmica', // aumenta alcance
        descricao: '',
        basesArma: [],
    },
    {
        id: 39,
        nome: 'Lente Auxiliar', // pequeno bonus de pontaria
        descricao: '',
        basesArma: [],
    },
    {
        id: 40,
        nome: 'Munição Especializada', // outro tipo de dano
        descricao: '',
        basesArma: [],
    },
    {
        id: 41,
        nome: 'Munição Armadeira', // atira no chão
        descricao: '',
        basesArma: [],
    },
    {
        id: 42,
        nome: 'Tiro Alfinete', // restringe movimento do alvo acertado
        descricao: '',
        basesArma: [],
    },
    {
        id: 43,
        nome: 'Armação Tensionada', // aumenta alcance
        descricao: '',
        basesArma: [],
    },
    {
        id: 44,
        nome: 'Tiro Carpete', // ataque em área, dano reduzido
        descricao: '',
        basesArma: [],
    },
    {
        id: 45,
        nome: 'Munição Broca', // tiro em linha reta
        descricao: '',
        basesArma: [],
    },
    {
        id: 45,
        nome: 'Tiro de Cobertura', // ignora cobertura
        descricao: '',
        basesArma: [],
    },
    {
        id: 46,
        nome: 'Saque Duplo', // pega 2 munições por vez
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 4, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 5, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 47,
        nome: 'Disparo Sequêncial', // ação com maior execução, atira várias munições em mão
        descricao: '',
        basesArma: [],
    },
    {
        id: 48,
        nome: 'Modo Franco-Atirado', // aumenta execução de saque de munição, aumenta dano e alcance
        descricao: '',
        basesArma: [],
    },
    {
        id: 49,
        nome: 'Modo Entrega Especial', // envia item no ataque
        descricao: '',
        basesArma: [],
    },
    {
        id: 50,
        nome: 'Correia de Disparo', // vários ataques para automático
        descricao: '',
        basesArma: [],
    },
    {
        id: 51,
        nome: 'Modo Queima-Roupa', // reduz alcance, aumenta uso de munição, dano aumentado
        descricao: '',
        basesArma: [],
    },
    {
        id: 52,
        nome: 'Lente Falcão', // usa PERC para bonus de PONT
        descricao: '',
        basesArma: [],
    },
    {
        id: 53,
        nome: 'Munição Bumerangue',
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 5, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 54,
        nome: 'Luva de Arremesso', // aumenta alcance
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 5, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 55,
        nome: 'Instância de Arremesso', // aumenta bonus de alcance por atributo
        descricao: '',
        basesArma: [],
    },
    {
        id: 56,
        nome: 'Munição Estrepe', // arremessa no chão
        descricao: '',
        basesArma: [],
    },
    {
        id: 57,
        nome: 'Estojo de Munições', // reduz peso
        descricao: '',
        basesArma: [],
    },
    {
        id: 58,
        nome: 'Saque em Sequência', // saca com ambas as mãos em uma única ação
        descricao: '',
        basesArma: [],
    },
    {
        id: 59,
        nome: 'Munição Colosso', // reduz muito o alcance, muda atributo para força
        descricao: '',
        basesArma: [],
    },
    {
        id: 60,
        nome: 'Arremesso Duplo', // dois ataques em uma única ação, precisa estar com as munições em ambas as mãos
        descricao: '',
        basesArma: [],
    },
    {
        id: 61,
        nome: 'Pente Extendido', // aumenta munição na arma
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 6, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 7, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 62,
        nome: 'Coronha',
        descricao: 'Um Ataque Corpo-a-Corpo simples',
        basesArma: [
            {
                idBaseArma: 6, dadosCaracteristicaNaBase: {
                    custoCaracteristica: 1, dadosCaracteristicasArmas: {
                        acoes: [{
                            args: { nome: 'Coronhada', idTipoAcao: 2, idMecanica: 6, },
                            dadosComportamentos: {
                                dadosComportamentoAcao: [
                                    'Dano',
                                    1,
                                    4,
                                ],
                                dadosComportamentoDificuldadeAcao: [
                                    { idAtributo: 2, idPericia: 8 }
                                ]
                            }, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2],
                        }]
                    }
                }
            },
            {
                idBaseArma: 7, dadosCaracteristicaNaBase: {
                    custoCaracteristica: 1, dadosCaracteristicasArmas: {
                        acoes: [{
                            args: { nome: 'Coronhada', idTipoAcao: 2, idMecanica: 6, },
                            dadosComportamentos: {
                                dadosComportamentoAcao: [
                                    'Dano',
                                    1,
                                    5,
                                ],
                                dadosComportamentoDificuldadeAcao: [
                                    { idAtributo: 2, idPericia: 8 }
                                ]
                            }, custos: { custoExecucao: [{ idExecucao: 2, valor: 1 }] }, requisitos: [2],
                        }]
                    }
                }
            },
        ],
    },
    {
        id: 63,
        nome: 'Estabilizador', // segura arma com uma unica mão
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 6, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 7, dadosCaracteristicaNaBase: { custoCaracteristica: 3, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 64,
        nome: 'Mira Laser', // bonus PONT
        descricao: '',
        basesArma: [],
    },
    {
        id: 65,
        nome: 'Cinto de Munição', // não precisa empunhar a munição para recarregar
        descricao: '',
        basesArma: [],
    },
    {
        id: 66,
        nome: 'Carregador Automático', // não precisa gastar ação para recarregar
        descricao: '',
        basesArma: [],
    },
    {
        id: 67,
        nome: 'Desmontável', // para FURT
        descricao: '',
        basesArma: [],
    },
    {
        id: 68,
        nome: 'Munição Bioquímica', // categoria de dano extra
        descricao: '',
        basesArma: [],
    },
    {
        id: 69,
        nome: 'Modo de Fogo Extra', // novo alcance extra
        descricao: '',
        basesArma: [],
    },
    {
        id: 70,
        nome: 'Supressão', // mantem alvos sobre fogo continuo
        descricao: '',
        basesArma: [],
    },
    {
        id: 71,
        nome: 'Munição Grande', // melhorar o nome.... aumenta gasto de munição, + dano
        descricao: '',
        basesArma: [],
    },
    {
        id: 72,
        nome: 'Fonte de Luz Embutida', // fonte de luz
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 6, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 7, dadosCaracteristicaNaBase: { custoCaracteristica: 1, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 73,
        nome: 'Modo Lançador', // usa consumiveis de área de efeito como munição
        descricao: '',
        basesArma: [],
    },
    {
        id: 74,
        nome: 'Investida', // ataque com pequena movimentação para armas Corpo-a-Corpo
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 1, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 2, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 3, dadosCaracteristicaNaBase: { custoCaracteristica: 3, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 75,
        nome: 'Ataque em Arco', // ataque em cone para armas Corpo-a-Corpo
        descricao: '',
        basesArma: [],
    },
    {
        id: 76,
        nome: 'Golpeio', // mecanicamente ataca arremessaveis corpo-a-corpo sem lançar a munição
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 5, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
        ],
    },
    {
        id: 77,
        nome: 'Spray', // atira em cone
        descricao: '',
        basesArma: [],
    },
    {
        id: 78,
        nome: 'Limitadora', // agarrar enquanto empunhando
        descricao: '(Ainda não Implementada)',
        basesArma: [
            { idBaseArma: 1, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 2, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
            { idBaseArma: 5, dadosCaracteristicaNaBase: { custoCaracteristica: 2, dadosCaracteristicasArmas: {} } },
        ],
    },
];