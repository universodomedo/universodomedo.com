import useApi from "Uteis/ApiConsumer/Consumer.tsx";

import { AventuraDto, DisponibilidadeUsuarioDto, EstruturaPaginaDefinicao, ImagemDto, PersonagemDto, SessaoDto, TipoImagemDto, ObjetoAutenticacao, FichaPersonagemDto, PericiaDto, ObjetoEvoluiPersonagem, GanhoNivelClasseDto, ObjetoGanhosEvolucao } from 'types-nora-api';

export async function obtemObjetoAutenticacao() {
    return await useApi<ObjetoAutenticacao>({ uri: '/paginas/obtemObjetoAutenticacao', method: 'GET' });
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

export async function obtemPersonagensDoUsuario() {
    return await useApi<PersonagemDto[]>({ uri: '/personagens/obtemPersonagensDoUsuario', method: 'GET' });
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
    return await useApi<SessaoDto>({ uri: '/sessoes/obtemDadosProximaSessao', method: 'GET' });
}

export async function obtemFichaDePersonagemEmNivel() {
// export async function obtemFichaDePersonagemEmNivel(idPersonagem: number) {
    return await useApi<FichaPersonagemDto>({ uri: 'fichas_personagem/obtemFichaDePersonagemEmNivel', method: 'GET' });
    // return await useApi<FichaPersonagemDto>({ uri: 'fichas_personagem/obtemFichaDePersonagemEmNivel', method: 'GET', data: { idPersonagem: idPersonagem } });
}

export async function obtemPersonagensComPendencias() {
    return await useApi<PersonagemDto[]>({ uri: 'personagens/obtemPersonagensComPendencias', method: 'GET' });
}

export async function obtemPericiasParaCriacaoFicha() {
    return await useApi<PericiaDto[]>({ uri: 'pericias/obtemTodos', method: 'GET', params: { criandoFicha: true } });
}

export async function criaFicha(idPersonagem: number, listaIdPericiasNessaFicha: number[]) {
    return await useApi<boolean>({ uri: 'fichas_personagem/criaFicha', method: 'POST', data: { idPersonagem: idPersonagem, listaIdPericiasNessaFicha: listaIdPericiasNessaFicha } });
}

export async function obtemPersonagensComEvolucaoPendente() {
    return await useApi<PersonagemDto[]>({ uri: 'personagens/obtemPersonagensComEvolucaoPendente', method: 'GET' });
}

export async function obtemPersogemEmProcessoDeEvolucao(idPersonagem: number) {
    return await useApi<PersonagemDto>({ uri: 'personagens/obtemPersogemEmProcessoDeEvolucao', method: 'GET', params: { idPersonagem } });
}

export async function obtemGanhosParaEvoluir(idNivel: number, idClasse: number) {
    return await useApi<ObjetoGanhosEvolucao>({ uri: 'ganhos_nivel_classe/obtemGanhosParaEvoluir', method: 'GET', params: { idNivel, idClasse } });
}

export async function salvarEvolucaoDoPersonagem(idFichaPendente:number, resumoProvisorio: string) {
// export async function salvarEvolucaoDoPersonagem(ficha: FichaPersonagemDto) {
    return await useApi<boolean>({ uri: '/fichas_personagem/salvarEvolucaoDoPersonagem', method: 'POST', data: { idFichaPendente: idFichaPendente, resumoProvisorio: resumoProvisorio } });
}

//

export async function desconectar() {
    return useApi<void>({ uri: '/auth/logout', method: 'DELETE' });
}