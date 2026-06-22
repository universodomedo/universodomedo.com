import { PAYLOAD__CriarObjetivo, PAYLOAD__CriarColuna, PAYLOAD__CriarCard, PAYLOAD__CriarComentario, PAYLOAD__AtualizarCard, PAYLOAD__ReordenarCards, PAYLOAD__CriarDependenciaCard, PAYLOAD__AtualizarDependenciaCard, PAYLOAD__DeletarDependenciaCard, PAYLOAD__DefinirPosicaoFluxogramaCard, PAYLOAD__DeletarCard, PAYLOAD__AtualizarColuna, PAYLOAD__DeletarColuna, PAYLOAD__ReordenarColunas, PAYLOAD__AtualizarObjetivo, PAYLOAD__DeletarObjetivo } from 'types-nora-api';

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

export async function deletaCard(payload: PAYLOAD__DeletarCard): Promise<void> {
    await useApi<void>({ uri: '/cards/deletaCard', method: 'POST', data: payload });
};

export async function atualizaColuna(payload: PAYLOAD__AtualizarColuna): Promise<void> {
    await useApi<void>({ uri: '/colunas/atualizaColuna', method: 'POST', data: payload });
};

export async function deletaColuna(payload: PAYLOAD__DeletarColuna): Promise<void> {
    await useApi<void>({ uri: '/colunas/deletaColuna', method: 'POST', data: payload });
};

export async function reordenaColunas(payload: PAYLOAD__ReordenarColunas): Promise<void> {
    await useApi<void>({ uri: '/colunas/reordenaColunas', method: 'POST', data: payload });
};

export async function atualizaObjetivo(payload: PAYLOAD__AtualizarObjetivo): Promise<void> {
    await useApi<void>({ uri: '/objetivos/atualizaObjetivo', method: 'POST', data: payload });
};

export async function deletaObjetivo(payload: PAYLOAD__DeletarObjetivo): Promise<void> {
    await useApi<void>({ uri: '/objetivos/deletaObjetivo', method: 'POST', data: payload });
};
