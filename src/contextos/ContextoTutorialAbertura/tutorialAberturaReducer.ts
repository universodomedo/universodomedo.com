import type { AberturaTutorialPayload } from 'types-nora-api';

// Etapa 11: estado runtime puro do controlador de aberturas de Tutorial (sem storage). Transições atômicas via reducer (sem stale closure; fechar/concluir+consumir-fila num único passo).
export type EstadoTutorialAbertura = { aberturaAtual: AberturaTutorialPayload | null; indicePasso: number; fila: AberturaTutorialPayload[] };
export type AcaoTutorialAbertura = { tipo: 'ENFILEIRAR'; payload: AberturaTutorialPayload } | { tipo: 'AVANCAR' } | { tipo: 'VOLTAR' } | { tipo: 'FECHAR' } | { tipo: 'CONCLUIR' } | { tipo: 'RESET' };

export const ESTADO_INICIAL_TUTORIAL_ABERTURA: EstadoTutorialAbertura = { aberturaAtual: null, indicePasso: 0, fila: [] };

// Total de Passos da abertura atual (0 quando nada aberto).
function totalPassos(estado: EstadoTutorialAbertura): number { return estado.aberturaAtual?.tutorial.passos.length ?? 0; };

// Encerramento (fechar/concluir): retira o atual e consome exatamente o primeiro da fila, reiniciando no Passo 0; preserva o resto na ordem.
function encerrarEConsumirFila(estado: EstadoTutorialAbertura): EstadoTutorialAbertura {
    if (estado.fila.length > 0) return { aberturaAtual: estado.fila[0], indicePasso: 0, fila: estado.fila.slice(1) };
    return ESTADO_INICIAL_TUTORIAL_ABERTURA;
};

export function reducerTutorialAbertura(estado: EstadoTutorialAbertura, acao: AcaoTutorialAbertura): EstadoTutorialAbertura {
    switch (acao.tipo) {
        case 'ENFILEIRAR':
            if (estado.aberturaAtual === null) return { aberturaAtual: acao.payload, indicePasso: 0, fila: estado.fila };
            return { ...estado, fila: [...estado.fila, acao.payload] };
        case 'AVANCAR':
            return { ...estado, indicePasso: Math.min(estado.indicePasso + 1, Math.max(totalPassos(estado) - 1, 0)) };
        case 'VOLTAR':
            return { ...estado, indicePasso: Math.max(estado.indicePasso - 1, 0) };
        case 'FECHAR':
            return encerrarEConsumirFila(estado);
        // CONCLUIR: mesma transição local de FECHAR nesta etapa; ação distinta para que a futura conclusão backend não altere o significado de Fechar.
        case 'CONCLUIR':
            return encerrarEConsumirFila(estado);
        case 'RESET':
            return ESTADO_INICIAL_TUTORIAL_ABERTURA;
    }
};
