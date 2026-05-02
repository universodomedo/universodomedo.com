export const NoraApiCarregamento = {
    BARRA: 'BARRA',
    BLOQUEIA_INTERFACE: 'BLOQUEIA_INTERFACE',
} as const;

export type NoraApiCarregamento = typeof NoraApiCarregamento[keyof typeof NoraApiCarregamento];

export type NoraApiRequisicoesEstado = {
    readonly totalAtivas: number;
    readonly totalBloqueantes: number;
    readonly existeRequisicaoAtiva: boolean;
    readonly existeRequisicaoBloqueante: boolean;
    readonly ultimaAtualizacaoEmMs: number;
};

type NoraApiRequisicoesListener = () => void;

const ESTADO_INICIAL_REQUISICOES_NORA_API: NoraApiRequisicoesEstado = {
    totalAtivas: 0,
    totalBloqueantes: 0,
    existeRequisicaoAtiva: false,
    existeRequisicaoBloqueante: false,
    ultimaAtualizacaoEmMs: 0,
};

let estadoAtual = ESTADO_INICIAL_REQUISICOES_NORA_API;

const listeners = new Set<NoraApiRequisicoesListener>();

function criaEstadoRequisicoesNoraApi(totalAtivas: number, totalBloqueantes: number): NoraApiRequisicoesEstado {
    const totalAtivasSeguro = Math.max(0, totalAtivas);
    const totalBloqueantesSeguro = Math.max(0, totalBloqueantes);

    return {
        totalAtivas: totalAtivasSeguro,
        totalBloqueantes: totalBloqueantesSeguro,
        existeRequisicaoAtiva: totalAtivasSeguro > 0,
        existeRequisicaoBloqueante: totalBloqueantesSeguro > 0,
        ultimaAtualizacaoEmMs: Date.now(),
    };
};

function notificaListenersRequisicoesNoraApi(): void {
    listeners.forEach(listener => listener());
};

function atualizaEstadoRequisicoesNoraApi(totalAtivas: number, totalBloqueantes: number): void {
    estadoAtual = criaEstadoRequisicoesNoraApi(totalAtivas, totalBloqueantes);
    notificaListenersRequisicoesNoraApi();
};

export function obtemSnapshotRequisicoesNoraApi(): NoraApiRequisicoesEstado { return estadoAtual; };

export function obtemSnapshotServidorRequisicoesNoraApi(): NoraApiRequisicoesEstado { return ESTADO_INICIAL_REQUISICOES_NORA_API; };

export function inscreveListenerRequisicoesNoraApi(listener: NoraApiRequisicoesListener): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

export function registraRequisicaoNoraApi(carregamento: NoraApiCarregamento): () => void {
    const bloqueante = carregamento === NoraApiCarregamento.BLOQUEIA_INTERFACE;

    atualizaEstadoRequisicoesNoraApi(estadoAtual.totalAtivas + 1, bloqueante ? estadoAtual.totalBloqueantes + 1 : estadoAtual.totalBloqueantes);

    let finalizada = false;

    return () => {
        if (finalizada) return;

        finalizada = true;

        atualizaEstadoRequisicoesNoraApi(estadoAtual.totalAtivas - 1, bloqueante ? estadoAtual.totalBloqueantes - 1 : estadoAtual.totalBloqueantes);
    };
};