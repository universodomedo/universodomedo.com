import type { ConfiguracaoPartida, KeySerEmSala } from 'types-nora-api';

export type CondicaoVitoria = ConfiguracaoPartida['condicaoVitoria'];
export type TipoCondicaoVitoria = CondicaoVitoria['tipo'];
export type Interagivel = ConfiguracaoPartida['interagiveis'][number];
export type InteragivelObjeto = Extract<Interagivel, { tipo: 'objeto' }>;
export type InteragivelSer = Extract<Interagivel, { tipo: 'ser' }>;
export type Luz = NonNullable<ConfiguracaoPartida['luzes']>[number];
export type Controlador = InteragivelSer['controlador'];
export type Descoberta = Interagivel['descobertas'][number];
export type Recompensa = Descoberta['recompensas'][number];
// As duas grades de Ser no formulario: os que um Jogador controla vs os que o Sistema (Narrador) controla.
export type GrupoControle = 'jogador' | 'sistema';
// Slot unico por enquanto: multi-slot (varios jogadores) e autoria futura; o runtime ja liga usuarios reais aos slots.
export const SLOT_JOGADOR_PADRAO = 1;

// Tamanho fisico padrao (mm) de um objeto novo. Espelha TAMANHO_OBJETO_PADRAO_MILIMETROS do backend (codegen exporta tipos, nao consts).
export const TAMANHO_OBJETO_PADRAO_MILIMETROS = { largura: 800, altura: 900, profundidade: 800 };

// Valores padrao de uma luz nova. Espelha LUZ_PADRAO do backend.
export const LUZ_PADRAO = { alcanceMilimetros: 4000, intensidade: 3 };

// Acao 'vitoria' nova de um objeto. Espelha ACAO_OBJETO_VITORIA_PADRAO do backend (codegen exporta tipos, nao consts).
export const ACAO_OBJETO_VITORIA_PADRAO = { alcanceMilimetros: 1500 };
export type AcaoObjeto = NonNullable<InteragivelObjeto['acoes']>[number];

export function luzesDaConfig(config: ConfiguracaoPartida): Luz[] {
    return [...(config.luzes ?? [])];
};

export const ROTULOS_TIPO_CONDICAO_VITORIA: Record<TipoCondicaoVitoria, string> = { qualquer_acao_executada: 'Executar qualquer ação', refem_percebido: 'Perceber um refém (Ser)', inimigo_derrotado: 'Derrotar um Ser do Sistema', tempo_jogo_alcancado: 'Alcançar um marco de tempo', proximidade_ser_alcancada: 'Chegar perto de um Ser (locomoção)' };

export const KEY_SER_EM_SALA_VAZIA = 'SER_EM_SALA:' as KeySerEmSala;

// Runtime key de um Ser (usada por condicaoVitoria e por reveal de descoberta): SER_EM_SALA:${chave do interagivel}.
export function keySerEmSalaDaChave(chave: string): KeySerEmSala {
    return `SER_EM_SALA:${chave}`;
};

export function ehSer(interagivel: Interagivel): interagivel is InteragivelSer {
    return interagivel.tipo === 'ser';
};

export function ehObjeto(interagivel: Interagivel): interagivel is InteragivelObjeto {
    return interagivel.tipo === 'objeto';
};

export function seresDoGrupo(config: ConfiguracaoPartida, grupo: GrupoControle): InteragivelSer[] {
    return config.interagiveis.filter(ehSer).filter(ser => ser.controlador.tipo === grupo);
};

export function objetosDaConfig(config: ConfiguracaoPartida): InteragivelObjeto[] {
    return config.interagiveis.filter(ehObjeto);
};

export function controladorDoGrupo(grupo: GrupoControle): Controlador {
    return grupo === 'jogador' ? { tipo: 'jogador', slotJogador: SLOT_JOGADOR_PADRAO } : { tipo: 'sistema' };
};

// O cenário nasce SEM mapa: nome e dimensões lógicas derivam do Projeto 3D (tipo MAPA) quando ele é selecionado — nada é digitado à mão.
export function criaConfiguracaoVazia(): ConfiguracaoPartida {
    return { narracaoInicial: '', cenario: { nome: '', mapaLogico: { larguraMilimetros: 0, alturaMilimetros: 0, idProjetoMapa: null } }, interagiveis: [], luzes: [], condicaoVitoria: { tipo: 'qualquer_acao_executada' }, temporal: { momentoInicialMs: 0 } };
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
    if (tipo === 'proximidade_ser_alcancada') return { tipo, keySerEmSala: KEY_SER_EM_SALA_VAZIA, distanciaMaximaMilimetros: 1000 };
    return { tipo: 'qualquer_acao_executada' };
};

// Rótulo de um Ser: Nome do catálogo (via nomesPorIdSer, quando o domínio de nome existir) + "nome em jogo" entre parênteses; fallback = Ser #id.
export function rotuloSer(ser: InteragivelSer | null, nomesPorIdSer: Record<number, string>): string {
    if (!ser) return 'Ser';
    const nomeSer = nomesPorIdSer[ser.idSer];
    const nomeEmJogo = ser.nome && ser.nome.trim().length > 0 ? ser.nome : null;
    if (nomeSer && nomeEmJogo) return `${nomeSer} (${nomeEmJogo})`;
    return nomeSer ?? nomeEmJogo ?? `Ser #${ser.idSer}`;
};

export function rotuloObjeto(objeto: InteragivelObjeto | null): string {
    if (!objeto) return 'objeto';
    if (objeto.nome && objeto.nome.trim().length > 0) return objeto.nome;
    return 'novo objeto';
};

export function rotuloLuz(luz: Luz | null): string {
    if (!luz) return 'luz';
    if (luz.nome && luz.nome.trim().length > 0) return luz.nome;
    return 'nova luz';
};

export function rotuloInteragivel(interagivel: Interagivel | null, nomesPorIdSer: Record<number, string>): string {
    if (!interagivel) return 'interagível';
    return ehSer(interagivel) ? rotuloSer(interagivel, nomesPorIdSer) : rotuloObjeto(interagivel);
};

export function rotuloDescoberta(descoberta: Descoberta | null): string {
    if (!descoberta) return 'descoberta';
    if (descoberta.nome && descoberta.nome.trim().length > 0) return descoberta.nome;
    return 'nova descoberta';
};

export function configuracaoEstaPreenchida(config: ConfiguracaoPartida): boolean {
    if (config.narracaoInicial.trim().length === 0) return false;
    // Mapa OBRIGATÓRIO: o cenário só existe apontando um Projeto 3D tipo MAPA (nome/dimensões derivam dele na seleção).
    if (config.cenario.mapaLogico.idProjetoMapa == null || config.cenario.mapaLogico.idProjetoMapa <= 0) return false;
    if (config.cenario.nome.trim().length === 0) return false;
    if (config.cenario.mapaLogico.larguraMilimetros <= 0 || config.cenario.mapaLogico.alturaMilimetros <= 0) return false;
    const seres = config.interagiveis.filter(ehSer);
    if (seres.filter(ser => ser.controlador.tipo === 'jogador').length === 0) return false;
    if (seres.some(ser => !Number.isInteger(ser.idSer) || ser.idSer <= 0)) return false;
    return true;
};
