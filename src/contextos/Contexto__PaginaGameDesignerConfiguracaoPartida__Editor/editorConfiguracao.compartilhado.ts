import type { ConfiguracaoPartida, SerEmSala } from 'types-nora-api';

export type CondicaoVitoria = ConfiguracaoPartida['condicaoVitoria'];
export type TipoCondicaoVitoria = CondicaoVitoria['tipo'];
export type GrupoSeres = 'controlaveis' | 'naoControlaveis';
export type DescobertaCondicionada = ConfiguracaoPartida['descobertasCondicionadas'][number];
export type RecompensaDescoberta = DescobertaCondicionada['recompensas'][number];
export type Interagivel = ConfiguracaoPartida['interagiveis'][number];

export const ROTULOS_TIPO_CONDICAO_VITORIA: Record<TipoCondicaoVitoria, string> = { qualquer_acao_executada: 'Executar qualquer ação', refem_percebido: 'Perceber um refém (Ser)', inimigo_derrotado: 'Derrotar um não-controlável', tempo_jogo_alcancado: 'Alcançar um marco de tempo', proximidade_ser_alcancada: 'Chegar perto de um Ser (locomoção)' };

export const KEY_SER_EM_SALA_VAZIA = 'SER_EM_SALA:' as ConfiguracaoPartida['controlaveis'][number]['key'];

export function criaConfiguracaoVazia(): ConfiguracaoPartida {
    return { narracaoInicial: '', cenario: { nome: '', mapaLogico: { larguraMetros: 100, alturaMetros: 100 } }, controlaveis: [], naoControlaveis: [], interagiveis: [], descobertasCondicionadas: [], condicaoVitoria: { tipo: 'qualquer_acao_executada' }, temporal: { momentoInicialMs: 0 } };
};

// Tempo real e base do jogo (nao e configuravel): toda configuracao nasce com o sistema temporal ativo.
export function garanteTemporal(config: ConfiguracaoPartida): ConfiguracaoPartida {
    if (config.temporal !== undefined) return config;
    return { ...config, temporal: { momentoInicialMs: 0 } };
};

export function criaCondicaoVitoria(tipo: TipoCondicaoVitoria): CondicaoVitoria {
    if (tipo === 'refem_percebido') return { tipo, keySerEmSala: KEY_SER_EM_SALA_VAZIA };
    if (tipo === 'inimigo_derrotado') return { tipo, keySerEmSala: KEY_SER_EM_SALA_VAZIA, idEstatisticaDanificavel: 0 };
    if (tipo === 'tempo_jogo_alcancado') return { tipo, tempoAlvoMs: 0 };
    if (tipo === 'proximidade_ser_alcancada') return { tipo, keySerEmSala: KEY_SER_EM_SALA_VAZIA, distanciaMaximaMetros: 1 };
    return { tipo: 'qualquer_acao_executada' };
};

// Rótulo de um Ser em sala SEM nunca expor id: Nome do Ser (catálogo, via nomesPorIdSer) + "nome em jogo" entre parênteses quando houver.
// Enquanto o mapa de nomes ainda carrega, cai no nome em jogo (nunca no id).
export function rotuloSer(ser: SerEmSala | null, nomesPorIdSer: Record<number, string>): string {
    if (!ser) return 'Ser';
    const nomeSer = nomesPorIdSer[ser.referencia.id];
    const nomeEmJogo = ser.nomeExibicao && ser.nomeExibicao.trim().length > 0 ? ser.nomeExibicao : null;
    if (nomeSer && nomeEmJogo) return `${nomeSer} (${nomeEmJogo})`;
    return nomeSer ?? nomeEmJogo ?? 'Ser';
};

export function rotuloObjeto(objeto: Interagivel | null): string {
    if (!objeto) return 'objeto';
    if (objeto.nome && objeto.nome.trim().length > 0) return objeto.nome;
    return 'novo objeto';
};

export function rotuloDescoberta(descoberta: DescobertaCondicionada | null): string {
    if (!descoberta) return 'descoberta';
    if (descoberta.nome && descoberta.nome.trim().length > 0) return descoberta.nome;
    return 'nova descoberta';
};

export function configuracaoEstaPreenchida(config: ConfiguracaoPartida): boolean {
    if (config.narracaoInicial.trim().length === 0) return false;
    if (config.cenario.nome.trim().length === 0) return false;
    if (config.cenario.mapaLogico.larguraMetros <= 0 || config.cenario.mapaLogico.alturaMetros <= 0) return false;
    if (config.controlaveis.length === 0) return false;
    if ([...config.controlaveis, ...config.naoControlaveis].some(ser => !Number.isInteger(ser.referencia.id) || ser.referencia.id <= 0)) return false;
    return true;
};
