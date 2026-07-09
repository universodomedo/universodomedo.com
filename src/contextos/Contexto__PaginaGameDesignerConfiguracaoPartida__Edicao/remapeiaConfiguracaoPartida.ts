import type { ConfiguracaoPartida, KeySerEmSala, PartidaGraphqlDto } from 'types-nora-api';
import type { Controlador, Descoberta, Interagivel } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';

// A leitura GraphQL da Partida entrega o configuracao "achatado": o interagivel vem com os campos de ambas as variantes (objeto|ser) opcionais + tipo,
// condicaoVitoria com os campos de todas as variantes opcionais, e os tipos de marca (KeySerEmSala, enums) alargados como string. O Editor trabalha no
// ConfiguracaoPartida nativo (uniao discriminada de interagivel/condicaoVitoria). Este remap reconstroi o nativo — a forma achatada nao escapa daqui.
type ConfiguracaoPartidaGraphql = NonNullable<PartidaGraphqlDto['configuracao']>;
type InteragivelGraphql = ConfiguracaoPartidaGraphql['interagiveis'][number];
type DescobertaGraphql = InteragivelGraphql['descobertas'][number];
type CondicaoVitoriaGraphql = ConfiguracaoPartidaGraphql['condicaoVitoria'];

function remapeiaDescoberta(descoberta: DescobertaGraphql): Descoberta {
    return { nome: descoberta.nome, descricaoInterna: descoberta.descricaoInterna, idCapacidadeInata: descoberta.idCapacidadeInata, recompensas: descoberta.recompensas.map(recompensa => ({ dificuldadeMinima: recompensa.dificuldadeMinima, chavesReveladas: recompensa.chavesReveladas ?? [] })) };
};

function remapeiaControlador(controlador: InteragivelGraphql['controlador']): Controlador {
    if (controlador !== null && controlador.tipo === 'jogador') return { tipo: 'jogador', slotJogador: controlador.slotJogador ?? 1 };
    return { tipo: 'sistema' };
};

function remapeiaInteragivel(interagivel: InteragivelGraphql): Interagivel {
    const base = {
        chave: interagivel.chave,
        nome: interagivel.nome,
        descricao: interagivel.descricao,
        posicao: interagivel.posicao === null ? null : { x: interagivel.posicao.x, y: interagivel.posicao.y },
        estadoPercepcaoInicial: interagivel.estadoPercepcaoInicial as 'DESPERCEBIDO' | 'PERCEBIDO',
        descobertas: interagivel.descobertas.map(remapeiaDescoberta),
    };
    if (interagivel.tipo === 'ser') return { ...base, tipo: 'ser', idSer: interagivel.idSer ?? 0, controlador: remapeiaControlador(interagivel.controlador) };
    return { ...base, tipo: 'objeto', pontosDurabilidadeMaximo: interagivel.pontosDurabilidadeMaximo ?? 1 };
};

function remapeiaCondicaoVitoria(condicao: CondicaoVitoriaGraphql): ConfiguracaoPartida['condicaoVitoria'] {
    if (condicao.tipo === 'refem_percebido') return { tipo: 'refem_percebido', keySerEmSala: (condicao.keySerEmSala ?? '') as KeySerEmSala };
    if (condicao.tipo === 'inimigo_derrotado') return { tipo: 'inimigo_derrotado', keySerEmSala: (condicao.keySerEmSala ?? '') as KeySerEmSala, idEstatisticaDanificavel: condicao.idEstatisticaDanificavel ?? 0 };
    if (condicao.tipo === 'tempo_jogo_alcancado') return { tipo: 'tempo_jogo_alcancado', tempoAlvoMs: condicao.tempoAlvoMs ?? 0 };
    if (condicao.tipo === 'proximidade_ser_alcancada') return { tipo: 'proximidade_ser_alcancada', keySerEmSala: (condicao.keySerEmSala ?? '') as KeySerEmSala, distanciaMaximaMilimetros: condicao.distanciaMaximaMilimetros ?? 0 };
    return { tipo: 'qualquer_acao_executada' };
};

export function remapeiaConfiguracaoPartidaGraphql(configuracao: ConfiguracaoPartidaGraphql): ConfiguracaoPartida {
    return {
        narracaoInicial: configuracao.narracaoInicial,
        cenario: { nome: configuracao.cenario.nome, mapaLogico: { larguraMilimetros: configuracao.cenario.mapaLogico.larguraMilimetros, alturaMilimetros: configuracao.cenario.mapaLogico.alturaMilimetros } },
        interagiveis: configuracao.interagiveis.map(remapeiaInteragivel),
        condicaoVitoria: remapeiaCondicaoVitoria(configuracao.condicaoVitoria),
        temporal: configuracao.temporal === null ? undefined : { momentoInicialMs: configuracao.temporal.momentoInicialMs },
    };
};
