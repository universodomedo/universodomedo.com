import useApi from "Uteis/ApiConsumer/Consumer.tsx";

import { AventuraDto, DisponibilidadeUsuarioDto, EstruturaPaginaDefinicao, ImagemDto, PersonagemDto, SessaoDto, TipoImagemDto, ObjetoAutenticacao, FichaPersonagemDto, PericiaDto, ObjetoGanhosEvolucao, FichaDeJogo, GanhoNivelClasseDto, ObjetoEvolucaoCompleto, PaginaObjeto, LinkDto, TipoLinkDto, GrupoAventuraDto, DetalheSessaoCanonicaDto, RascunhoDto, ObjetoCache, ListaDisponibilidadesUsuario, EstiloSessaoMestradaDto } from 'types-nora-api';

export async function obtemObjetoAutenticacao(paginaAtual?: PaginaObjeto | null) {
    return await useApi<ObjetoAutenticacao>({ uri: '/paginas/obtemObjetoAutenticacao', method: 'GET', params: paginaAtual === undefined ? {} : { idPaginaAtual: paginaAtual?.id || '' } });
}

export async function obtemTodosObjetosCache() {
    return await useApi<ObjetoCache>({ uri: '/cache/obtemTodosObjetosCache', method: 'GET' });
}

export async function obtemDadosMinhasDisponibilidades() {
    return await useApi<DisponibilidadeUsuarioDto>({ uri: '/disponibilidades_usuario/obtemDadosMinhasDisponibilidades', method: 'GET' });
}

export async function me_salvaDisponibilidade(listaDisponibilidadesUsuario: ListaDisponibilidadesUsuario) {
    return await useApi<boolean>({ uri: '/disponibilidades_usuario/me/me_salvaDisponibilidade', method: 'POST', data: { listaDisponibilidadesUsuario: listaDisponibilidadesUsuario } });
}

export async function obtemDadosPorPaginaDefinicao(identificadorPagina: string) {
    try {
        return await useApi<EstruturaPaginaDefinicao>({ uri: '/definicoes/obtemDadosPorPaginaDefinicao', method: 'GET', params: { identificadorPagina } });
    } catch (error) {
        return null;
    }
}

export async function obtemTodosGruposParaAdmin() {
    return await useApi<GrupoAventuraDto[]>({ uri: '/grupos_aventuras/obtemTodosGruposParaAdmin', method: 'GET' });
}

export async function obtemAventurasParaAssistir() {
    return await useApi<AventuraDto[]>({ uri: '/aventuras/obtemAventurasParaAssistir', method: 'GET' });
}

export async function obtemAventuraCompleta(idAventura: number) {
    return await useApi<AventuraDto>({ uri: '/aventuras/obtemAventuraCompleta', method: 'GET', params: { idAventura } });
}

export async function buscaGrupoAventuraEspecifico(idGrupoAventura: number) {
    return await useApi<GrupoAventuraDto | null>({ uri: '/grupos_aventuras/buscaGrupoAventuraEspecifico', method: 'GET', params: { idGrupoAventura } });
}

export async function obtemSessaoGeral(idSessao: number) {
    return await useApi<SessaoDto | null>({ uri: '/sessoes/obtemSessaoGeral', method: 'GET', params: { idSessao } });
}

export async function me_obtemPersonagens(idTipoPersonagem: number) {
    return await useApi<PersonagemDto[]>({ uri: '/personagens/me/me_obtemPersonagens', method: 'GET', params: { idTipoPersonagem } });
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
    return await useApi<FichaDeJogo>({ uri: 'fichas_personagens/obtemFichaDePersonagemEmNivel', method: 'GET' });
    // return await useApi<FichaPersonagemDto>({ uri: 'fichas_personagens/obtemFichaDePersonagemEmNivel', method: 'GET', data: { idPersonagem: idPersonagem } });
}

export async function obtemPersonagensComPendencias() {
    return await useApi<PersonagemDto[]>({ uri: 'personagens/obtemPersonagensComPendencias', method: 'GET' });
}

export async function obtemPericiasParaCriacaoFicha() {
    return await useApi<PericiaDto[]>({ uri: 'pericias/obtemTodos', method: 'GET', params: { criandoFicha: true } });
}

export async function obtemPersonagensComEvolucaoPendente() {
    return await useApi<PersonagemDto[]>({ uri: 'personagens/obtemPersonagensComEvolucaoPendente', method: 'GET' });
}

export async function obtemPersonagemEmProcessoDeEvolucao(idPersonagem: number) {
    return await useApi<PersonagemDto>({ uri: 'personagens/obtemPersonagemEmProcessoDeEvolucao', method: 'GET', params: { idPersonagem } });
}

export async function obtemGanhosParaEvoluir(idPersonagem: number) {
    return await useApi<ObjetoEvolucaoCompleto>({ uri: 'ganhos_nivel_classe/obtemGanhosParaEvoluir', method: 'GET', params: { idPersonagem } });
}

export async function obtemGanhosAposSelecaoClasse(idClasse: number) {
    return await useApi<ObjetoGanhosEvolucao>({ uri: 'ganhos_nivel_classe/obtemGanhosAposSelecaoClasse', method: 'GET', params: { idClasse } });
}

export async function salvarEvolucaoDoPersonagem(fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo): Promise<boolean> {
    return await useApi<boolean>({ uri: '/fichas_personagens/salvarEvolucaoDoPersonagem', method: 'POST', data: { fichaEvoluida: fichaEvoluida, fichaDeJogoEvoluida: fichaDeJogoEvoluida } });
}

export async function obtemListaProxEpisodioPrevistoPorAventuraEmAndamento() {
    return await useApi<SessaoDto[]>({ uri: '/sessoes/obtemListaProxEpisodioPrevistoPorAventuraEmAndamento', method: 'GET' });
}

export async function obtemTodosTiposLink() {
    return await useApi<TipoLinkDto[]>({ uri: '/tipos_link/obtemTodosTiposLink', method: 'GET' });
}

export async function vinculaLinkDeSessao(idSessao: number, novoLink: LinkDto): Promise<boolean> {
    return await useApi<boolean>({ uri: '/detalhes_sessao_canonica/vinculaLinkDeSessao', method: 'POST', data: { idSessao: idSessao, novoLink: novoLink } });
}

export async function vinculaLinkDeGrupoAventura(idGrupoAventura: number, novoLink: LinkDto): Promise<boolean> {
    return await useApi<boolean>({ uri: '/grupos_aventuras/vinculaLinkDeGrupoAventura', method: 'POST', data: { idGrupoAventura: idGrupoAventura, novoLink: novoLink } });
}

export async function obtemGruposPorMestre(idUsuario: number): Promise<GrupoAventuraDto[]> {
    return await useApi<GrupoAventuraDto[]>({ uri: '/grupos_aventuras/obtemGruposPorMestre', method: 'GET', params: { idUsuario } });
}

export async function obtemUltimaSessoesPostadas(): Promise<DetalheSessaoCanonicaDto[]> {
    return await useApi<DetalheSessaoCanonicaDto[]>({ uri: 'detalhes_sessao_canonica/obtemUltimaSessoesPostadas', method: 'GET' });
}

export async function encerraGrupoAventura(idGrupoAventura: number): Promise<boolean> {
    return await useApi<boolean>({ uri: '/grupos_aventuras/encerraGrupoAventura', method: 'PUT', data: { idGrupoAventura: idGrupoAventura } })
}

export async function encerrarSessaoEmAndamentoDeGrupoAventura(idGrupoAventura: number): Promise<boolean> {
    return await useApi<boolean>({ uri: 'sessoes/encerrarSessaoEmAndamentoDeGrupoAventura', method: 'PUT', data: { idGrupoAventura: idGrupoAventura } })
}

export async function obtemEstilosSessaoPorParam(ehSessaoUnica: boolean): Promise<EstiloSessaoMestradaDto[]> {
    return await useApi<EstiloSessaoMestradaDto[]>({ uri: 'estilos_sessao_mestrada/obtemEstilosSessaoPorParam', method: 'GET', params: { ehSessaoUnica } });
}

export async function me_obtemRascunhosPorTipo(sessaoUnica: boolean): Promise<RascunhoDto[]> {
    return await useApi<RascunhoDto[]>({ uri: 'rascunhos/me/me_obtemRascunhosPorTipo', method: 'GET', params: { sessaoUnica } });
}

export async function me_obtemDetalhesRascunho(idRascunho: number): Promise<RascunhoDto | null> {
    return await useApi<RascunhoDto | null>({ uri: 'rascunhos/me/me_obtemDetalhesRascunho', method: 'GET', params: { idRascunho } });
}

export async function me_salvarRascunho(titulo: string, idEstiloSessaoMestrada: number): Promise<boolean> {
    return await useApi<boolean>({ uri: 'rascunhos/me/me_salvarRascunho', method: 'POST', data: { titulo: titulo, idEstiloSessaoMestrada: idEstiloSessaoMestrada } });
}

export async function editaDetalheRascunho(rascunho: RascunhoDto): Promise<boolean> {
    return await useApi<boolean>({ uri: 'rascunhos/editaDetalheRascunho', method: 'POST', data: { rascunho: rascunho } });
}

export async function criaBaseadoEmRascunho(idRascunho: number): Promise<boolean> {
    return await useApi<boolean>({ uri: 'rascunhos/criaBaseadoEmRascunho', method: 'PUT', data: { idRascunho: idRascunho } });
}

//

export async function desconectar() {
    return useApi<void>({ uri: '/auth/logout', method: 'DELETE' });
}