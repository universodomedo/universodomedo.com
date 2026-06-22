import { PAYLOAD__CriarObjetivo, PAYLOAD__CriarColuna, PAYLOAD__CriarCard, PAYLOAD__CriarComentario, PAYLOAD__AtualizarCard, PAYLOAD__ReordenarCards, PAYLOAD__CriarDependenciaCard, PAYLOAD__AtualizarDependenciaCard, PAYLOAD__DeletarDependenciaCard, PAYLOAD__DefinirPosicaoFluxogramaCard } from 'types-nora-api';

import useApi from 'Uteis/ApiConsumer/Consumer.tsx';

export async function criaObjetivo(payload: PAYLOAD__CriarObjetivo): Promise<void> {
    await useApi<void>({ uri: '/objetivos/criaObjetivo', method: 'POST', data: payload });
};

export async function criaColuna(payload: PAYLOAD__CriarColuna): Promise<void> {
    await useApi<void>({ uri: '/colunas/criaColuna', method: 'POST', data: payload });
};

export async function criaCard(payload: PAYLOAD__CriarCard): Promise<void> {
    await useApi<void>({ uri: '/cards/criaCard', method: 'POST', data: payload });
};

export async function criaComentario(payload: PAYLOAD__CriarComentario): Promise<void> {
    await useApi<void>({ uri: '/comentarios/criaComentario', method: 'POST', data: payload });
};

export async function atualizaCard(payload: PAYLOAD__AtualizarCard): Promise<void> {
    await useApi<void>({ uri: '/cards/atualizaCard', method: 'POST', data: payload });
};

export async function reordenaCards(payload: PAYLOAD__ReordenarCards): Promise<void> {
    await useApi<void>({ uri: '/cards/reordenaCards', method: 'POST', data: payload });
};

export async function criaDependenciaCard(payload: PAYLOAD__CriarDependenciaCard): Promise<void> {
    await useApi<void>({ uri: '/dependenciasCards/criaDependencia', method: 'POST', data: payload });
};

export async function atualizaDependenciaCard(payload: PAYLOAD__AtualizarDependenciaCard): Promise<void> {
    await useApi<void>({ uri: '/dependenciasCards/atualizaDependencia', method: 'POST', data: payload });
};

export async function deletaDependenciaCard(payload: PAYLOAD__DeletarDependenciaCard): Promise<void> {
    await useApi<void>({ uri: '/dependenciasCards/deletaDependencia', method: 'POST', data: payload });
};

export async function definePosicaoFluxogramaCard(payload: PAYLOAD__DefinirPosicaoFluxogramaCard): Promise<void> {
    await useApi<void>({ uri: '/posicoesFluxogramaCards/definePosicao', method: 'POST', data: payload });
};
