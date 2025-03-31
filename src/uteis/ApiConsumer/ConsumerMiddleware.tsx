import useApi from "Uteis/ApiConsumer/Consumer.tsx";

import { AventuraDto, DadosMinhasDisponibilidades, DisponibilidadeUsuarioDto, EstruturaPaginaDefinicao, PersonagemDto, UsuarioDto } from 'types-nora-api';

export async function obtemUsuarioLogado() {
    return await useApi<UsuarioDto>({ uri: '/usuarios/obtemUsuarioLogado', method: 'GET' });
}

export async function salvaPrimeiroAcessoUsuario(username: string) {
    return await useApi<void>({ uri: '/usuarios/atualizaUsuarioPrimeiroAcesso', method: 'PUT', data: { username: username } });
}

export async function obtemDadosMinhasDisponibilidades() {
    return await useApi<DadosMinhasDisponibilidades>({ uri: '/disponibilidadesUsuario/obtemDadosMinhasDisponibilidades', method: 'GET' });
}

export async function salvaDisponibilidadeDeUsuario(disponibilidades: DisponibilidadeUsuarioDto[]) {
    return await useApi<void>({ uri: '/disponibilidadesUsuario/salvaDisponibilidadeDeUsuario', method: 'POST', data: { disponibilidades: disponibilidades } });
}

export async function obtemDadosPorPaginaDefinicao(identificadorPagina: string) {
    return await useApi<EstruturaPaginaDefinicao>({ uri: '/definicoes/obtemDadosPorPaginaDefinicao', method: 'GET', params: { identificadorPagina } });
}

export async function obtemDadosPaginaAventuras() {
    return await useApi<AventuraDto[]>({ uri: '/aventuras/obtemListaDeAventurasComPossivelUsuario', method: 'GET' });
}

export async function obtemDadosPaginaPersonagens() {
    return await useApi<PersonagemDto[]>({ uri: '/personagens/obtemDadosPaginaPersonagens', method: 'GET' });
}

export async function uploadImagem(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return await useApi<boolean>({ uri: '/imagens/upload', method: 'POST', data: formData});
}

//

export async function authCheck() {
    return await useApi<string>({ uri: '/auth/me2', method: 'GET', desativaRedirect: true });
}

export async function verificaLogado() {
    return await useApi<string>({ uri: '/auth/loggedIn', method: 'GET' });
}