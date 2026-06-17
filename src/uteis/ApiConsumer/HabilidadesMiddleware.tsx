import type { CapacidadeInataDto, LogicaComponivel, PAYLOAD__SalvarLogicaHabilidade } from 'types-nora-api';

import api from 'Uteis/ApiConsumer/Consumer.tsx';

export async function obtemLogicaHabilidade(idHabilidade: number): Promise<LogicaComponivel> {
    return await api<LogicaComponivel>({ uri: '/habilidades/obtemLogica', method: 'GET', params: { idHabilidade } });
}

export async function salvarLogicaHabilidade(payload: PAYLOAD__SalvarLogicaHabilidade): Promise<LogicaComponivel> {
    return await api<LogicaComponivel>({ uri: '/habilidades/salvarLogica', method: 'POST', data: payload });
}

export async function obtemCapacidadesInatas(): Promise<CapacidadeInataDto[]> {
    return await api<CapacidadeInataDto[]>({ uri: '/capacidades_inatas/obtemTodos', method: 'GET' });
}
