import { PAYLOAD__CriarObjetivo, PAYLOAD__CriarColuna, PAYLOAD__CriarCard } from 'types-nora-api';

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
