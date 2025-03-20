import useApi from "Uteis/ApiConsumer/Consumer.tsx";

import { DadosMinhaPagina, DadosMinhasDisponibilidades, DisponibilidadeUsuario, EstruturaPaginaDefinicao } from 'types-nora-api';

export async function obtemDadosMinhaPagina() {
    return await useApi<DadosMinhaPagina>({ uri: '/paginas/obtemDadosMinhaPagina', method: 'GET' });
}

export async function salvaPrimeiroAcessoUsuario(username: string) {
    return await useApi<void>({ uri: '/usuarios/atualizaUsuarioPrimeiroAcesso', method: 'PUT', data: { username: username } });
}

export async function obtemDadosMinhasDisponibilidades() {
    return await useApi<DadosMinhasDisponibilidades>({ uri: '/paginas/obtemDadosMinhasDisponibilidades', method: 'GET' });
}

export async function salvaDisponibilidadeDeUsuario(disponibilidades: DisponibilidadeUsuario[]) {
    return await useApi<void>({ uri: '/disponibilidadesUsuario/salvaDisponibilidadeDeUsuario', method: 'POST', data: { disponibilidades: disponibilidades } });
}

export async function obtemDadosPorPaginaDefinicao(identificadorPagina: string) {
    return await useApi<EstruturaPaginaDefinicao>({ uri: '/definicoes/obtemDadosPorPaginaDefinicao', method: 'GET', params: { identificadorPagina } });
}


//

export async function healthcheck() {
    return await useApi<string>({ uri: '/auth/me2', method: 'GET', desativaRedirect: true });
}