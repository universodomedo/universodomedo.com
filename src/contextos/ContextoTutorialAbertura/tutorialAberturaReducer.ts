import type { AberturaTutorialPayload } from 'types-nora-api';

// Etapa 11/12: estado runtime puro do controlador de aberturas de Tutorial (sem storage). Transições atômicas via reducer.
// instanciaAberturaId (Etapa 12): contador de transição da abertura visível — muda a cada nova abertura mostrada/encerramento/RESET; amarra ACK e conclusão à instância correta (resposta WS tardia nunca atinge outra abertura).
export type EstadoTutorialAbertura = { aberturaAtual: AberturaTutorialPayload | null; indicePasso: number; fila: AberturaTutorialPayload[]; instanciaAberturaId: number };
export type AcaoTutorialAbertura = { tipo: 'ENFILEIRAR'; payload: AberturaTutorialPayload } | { tipo: 'AVANCAR' } | { tipo: 'VOLTAR' } | { tipo: 'FECHAR' } | { tipo: 'CONCLUIR_SE_ATUAL'; instanciaAberturaId: number } | { tipo: 'RESET' };

export const ESTADO_INICIAL_TUTORIAL_ABERTURA: EstadoTutorialAbertura = { aberturaAtual: null, indicePasso: 0, fila: [], instanciaAberturaId: 0 };

// Total de Passos da abertura atual (0 quando nada aberto).
function totalPassos(estado: EstadoTutorialAbertura): number { return estado.aberturaAtual?.tutorial.passos.length ?? 0; };

// Encerramento (fechar/concluir): retira o atual e consome exatamente o primeiro da fila, reiniciando no Passo 0; preserva o resto na ordem. SEMPRE incrementa instanciaAberturaId (a abertura visível mudou — inclusive indo a null).
function encerrarEConsumirFila(estado: EstadoTutorialAbertura): EstadoTutorialAbertura {
    const instanciaAberturaId = estado.instanciaAberturaId + 1;
    if (estado.fila.length > 0) return { aberturaAtual: estado.fila[0], indicePasso: 0, fila: estado.fila.slice(1), instanciaAberturaId };
    return { aberturaAtual: null, indicePasso: 0, fila: [], instanciaAberturaId };
};

export function reducerTutorialAbertura(estado: EstadoTutorialAbertura, acao: AcaoTutorialAbertura): EstadoTutorialAbertura {
    switch (acao.tipo) {
        case 'ENFILEIRAR':
            if (estado.aberturaAtual === null) return { aberturaAtual: acao.payload, indicePasso: 0, fila: estado.fila, instanciaAberturaId: estado.instanciaAberturaId + 1 };
            return { ...estado, fila: [...estado.fila, acao.payload] };
        case 'AVANCAR':
            return { ...estado, indicePasso: Math.min(estado.indicePasso + 1, Math.max(totalPassos(estado) - 1, 0)) };
        case 'VOLTAR':
            return { ...estado, indicePasso: Math.max(estado.indicePasso - 1, 0) };
        case 'FECHAR':
            return encerrarEConsumirFila(estado);
        // CONCLUIR_SE_ATUAL: só encerra/consome se a instância capturada no clique ainda é a vigente; resposta tardia em outra instância é no-op.
        case 'CONCLUIR_SE_ATUAL':
            if (acao.instanciaAberturaId !== estado.instanciaAberturaId) return estado;
            return encerrarEConsumirFila(estado);
        // RESET: limpa tudo, mas INCREMENTA instanciaAberturaId (nunca volta a um valor inicial que possa colidir com resposta assíncrona antiga pendente).
        case 'RESET':
            return { aberturaAtual: null, indicePasso: 0, fila: [], instanciaAberturaId: estado.instanciaAberturaId + 1 };
    }
};
