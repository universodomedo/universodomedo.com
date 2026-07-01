import type { ConfiguracaoPartida, KeySerEmSala, PartidaGraphqlDto } from 'types-nora-api';

// A leitura GraphQL da Partida entrega o configuracao em forma "achatada": condicaoVitoria vira { tipo + campos de todas as variantes opcionais }
// e os tipos de marca (KeySerEmSala, 'Ser', enums de percepcao) chegam alargados como string. O Editor trabalha no ConfiguracaoPartida nativo
// (uniao discriminada de condicaoVitoria, KeySerEmSala). Este remap reconstroi o nativo a partir do GraphQL — a forma achatada nao escapa daqui.
type ConfiguracaoPartidaGraphql = NonNullable<PartidaGraphqlDto['configuracao']>;
type SerEmSalaGraphql = ConfiguracaoPartidaGraphql['controlaveis'][number];
type InteragivelGraphql = ConfiguracaoPartidaGraphql['interagiveis'][number];
type DescobertaGraphql = ConfiguracaoPartidaGraphql['descobertasCondicionadas'][number];
type CondicaoVitoriaGraphql = ConfiguracaoPartidaGraphql['condicaoVitoria'];

function remapeiaSerEmSala(ser: SerEmSalaGraphql): ConfiguracaoPartida['controlaveis'][number] {
    return {
        key: ser.key as KeySerEmSala,
        referencia: { tipo: 'Ser', id: ser.referencia.id },
        posicaoInicial: { x: ser.posicaoInicial.x, y: ser.posicaoInicial.y },
        nomeExibicao: ser.nomeExibicao === null ? undefined : ser.nomeExibicao,
        percepcaoInicial: ser.percepcaoInicial === null ? undefined : ser.percepcaoInicial as 'DESPERCEBIDO' | 'PERCEBIDO',
    };
};

function remapeiaInteragivel(interagivel: InteragivelGraphql): ConfiguracaoPartida['interagiveis'][number] {
    return {
        key: interagivel.key,
        nome: interagivel.nome,
        tipo: interagivel.tipo as 'ser' | 'objeto' | 'elemento_sensorial',
        descricao: interagivel.descricao,
        posicao: interagivel.posicao === null ? null : { x: interagivel.posicao.x, y: interagivel.posicao.y },
        estadoPercepcaoInicial: interagivel.estadoPercepcaoInicial as 'DESPERCEBIDO' | 'PERCEBIDO',
    };
};

function remapeiaDescoberta(descoberta: DescobertaGraphql): ConfiguracaoPartida['descobertasCondicionadas'][number] {
    return {
        key: descoberta.key,
        nome: descoberta.nome,
        descricaoInterna: descoberta.descricaoInterna,
        idCapacidadeInata: descoberta.idCapacidadeInata,
        recompensas: descoberta.recompensas.map(recompensa => ({ dificuldadeMinima: recompensa.dificuldadeMinima, keysSeresPercebidos: recompensa.keysSeresPercebidos as readonly KeySerEmSala[] })),
    };
};

function remapeiaCondicaoVitoria(condicao: CondicaoVitoriaGraphql): ConfiguracaoPartida['condicaoVitoria'] {
    if (condicao.tipo === 'refem_percebido') return { tipo: 'refem_percebido', keySerEmSala: (condicao.keySerEmSala ?? '') as KeySerEmSala };
    if (condicao.tipo === 'inimigo_derrotado') return { tipo: 'inimigo_derrotado', keySerEmSala: (condicao.keySerEmSala ?? '') as KeySerEmSala, idEstatisticaDanificavel: condicao.idEstatisticaDanificavel ?? 0 };
    if (condicao.tipo === 'tempo_jogo_alcancado') return { tipo: 'tempo_jogo_alcancado', tempoAlvoMs: condicao.tempoAlvoMs ?? 0 };
    if (condicao.tipo === 'proximidade_ser_alcancada') return { tipo: 'proximidade_ser_alcancada', keySerEmSala: (condicao.keySerEmSala ?? '') as KeySerEmSala, distanciaMaximaMetros: condicao.distanciaMaximaMetros ?? 0 };
    return { tipo: 'qualquer_acao_executada' };
};

export function remapeiaConfiguracaoPartidaGraphql(configuracao: ConfiguracaoPartidaGraphql): ConfiguracaoPartida {
    return {
        narracaoInicial: configuracao.narracaoInicial,
        cenario: { nome: configuracao.cenario.nome, mapaLogico: { larguraMetros: configuracao.cenario.mapaLogico.larguraMetros, alturaMetros: configuracao.cenario.mapaLogico.alturaMetros } },
        controlaveis: configuracao.controlaveis.map(remapeiaSerEmSala),
        naoControlaveis: configuracao.naoControlaveis.map(remapeiaSerEmSala),
        interagiveis: configuracao.interagiveis.map(remapeiaInteragivel),
        descobertasCondicionadas: configuracao.descobertasCondicionadas.map(remapeiaDescoberta),
        condicaoVitoria: remapeiaCondicaoVitoria(configuracao.condicaoVitoria),
        temporal: configuracao.temporal === null ? undefined : { momentoInicialMs: configuracao.temporal.momentoInicialMs },
    };
};
