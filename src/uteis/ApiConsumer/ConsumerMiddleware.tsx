import useApi from "Uteis/ApiConsumer/Consumer.tsx";

import { AventuraDto, DisponibilidadeUsuarioDto, EstruturaPaginaDefinicao, ImagemDto, PersonagemDto, SessaoDto, TipoImagemDto, ObjetoAutenticacao } from 'types-nora-api';

export async function obtemObjetoAutenticacao() {
    return await useApi<ObjetoAutenticacao>({ uri: '/paginas/obtemObjetoAutenticacao', method: 'GET' });
}

export async function salvaPrimeiroAcessoUsuario(username: string) {
    return await useApi<boolean>({ uri: '/usuarios/atualizaUsuarioPrimeiroAcesso', method: 'PUT', data: { username: username } });
}

export async function obtemDadosMinhasDisponibilidades() {
    return await useApi<DisponibilidadeUsuarioDto[]>({ uri: '/disponibilidadesUsuario/obtemDadosMinhasDisponibilidades', method: 'GET' });
}

export async function salvaDisponibilidadeDeUsuario(disponibilidades: DisponibilidadeUsuarioDto[]) {
    return await useApi<boolean>({ uri: '/disponibilidadesUsuario/salvaDisponibilidadeDeUsuario', method: 'POST', data: { disponibilidades: disponibilidades } });
}

export async function obtemDadosPorPaginaDefinicao(identificadorPagina: string) {
    try {
        return await useApi<EstruturaPaginaDefinicao>({ uri: '/definicoes/obtemDadosPorPaginaDefinicao', method: 'GET', params: { identificadorPagina } });    
    } catch (error) {
        return null;   
    }    
}

export async function obtemTodasAventuras() {
    return await useApi<AventuraDto[]>({ uri: '/aventuras/obtemTodasAventuras', method: 'GET' });
}

export async function obtemAventuraCompleta(idAventura: number) {
    return await useApi<AventuraDto>({ uri: '/aventuras/obtemAventuraCompleta', method: 'GET', params: { idAventura } });
}

export async function obtemDadosPaginaPersonagens() {
    return await useApi<PersonagemDto[]>({ uri: '/personagens/obtemDadosPaginaPersonagens', method: 'GET' });
}

export async function obtemDadosPersonagemDoUsuario(idPersonagem: number) {
    return await useApi<PersonagemDto>({ uri: '/personagens/obtemDadosPersonagemDoUsuario', method: 'GET', params: { idPersonagem } });
}

export async function obtemTiposImagem() {
    return await useApi<TipoImagemDto[]>({ uri: '/tipos_imagem/obtemTiposImagem', method: 'GET' });
}

export async function uploadImagem(file: File, tipo: string) {
    const formData = new FormData();
    formData.append('files', file);

    return await useApi<boolean>({ uri: `/imagens/many/${tipo}`, method: 'POST', data: formData });
}

export async function atualizaAvatarUsuario(idPersonagem: number) {
    return await useApi<ImagemDto[]>({ uri: '/usuarios/atualizaAvatarUsuario', method: 'PUT', data: { idPersonagem: idPersonagem } });
}

export async function obtemDadosProximaSessao() {
    return await useApi<SessaoDto>({ uri: '/sessoes/obtemDadosProximaSessao', method: 'GET'});
}

//

export async function desconectar() {
    return useApi<void>({ uri: '/auth/logout', method: 'DELETE' });
}