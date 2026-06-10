import { ArquivoCompletaDto, ArvoreItensPermissaoDto, AventuraCompletaDto, AventuraParaAssistirDto, DadosCriacaoSessao, DadosEvolucaoFicha, DadosJanelaDisponibilidade, DetalheSessaoCanonicaParaAssistirDto, DisponibilidadeUsuarioCompletaDto, EstiloSessaoMestradaDto, EstruturaPaginaDefinicao, FichaEmClient, FichaPersonagemCompletaDto, GrupoAventuraCompletaDto, JanelaDisponibilidadeCompletaDto, LinkCompletaDto, ListaDisponibilidadesUsuario, ObjetoAutenticacao, ObjetoCache, ConfiguracaoPatentesTestePericiaProjetada, ConfiguracaoTestePericiaProjetada, PAYLOAD__SalvarConfiguracaoPatentesTestePericia, PAYLOAD__SalvarConfiguracaoTestePericia, ObjetoEvolucaoCompleto, ObjetoGanhosEvolucao, PericiaCompletaDto, PersonagemCompletaDto, RascunhoCompletaDto, RegrasUploadArquivo, SessaoCompletaDto, SessaoEmVisualizacaoDto, VIEW_SessaoDeJogadorDto, TipoArquivoDef, TipoImagemCompletaDto, TipoLinkCompletaDto, UsuarioCompletaDto, PersonagemVisualizacaoDetalhadaDto, VIEW_SessaoComParticipantesDto, FichaTemporariaVisualizacaoDetalhadaDto, J_DadosFichaEmJogo, PAYLOAD_DetalheRascunhoEdicaoDto, VIEW_SessaoListagemGeralDto, VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto, CaminhoArquivoAvatar, VIEW_GrupoAventuraDetalhado, DTO__CREATE__Emblema, DTO__CREATE__HabilidadePericia, DTO__CREATE__HabilidadeEspecial, DTO__CREATE__ModificadorHabilidade, DTO__CREATE__CapacidadeInata, DTO__CREATE__Ser, CaminhoArquivoArte, DadosCriarTutorial, DadosEditarTutorial } from "types-nora-api";

import useApi from "Uteis/ApiConsumer/Consumer.tsx";

//

export async function obtemObjetoAutenticacao() {
    return await useApi<ObjetoAutenticacao>({ uri: '/paginas/obtemObjetoAutenticacao', method: 'GET' });
};

export async function obtemTodosObjetosCache() {
    return await useApi<ObjetoCache>({ uri: '/cache/obtemTodosObjetosCache', method: 'GET' });
}

export async function salvaConfiguracaoTestePericia(payload: PAYLOAD__SalvarConfiguracaoTestePericia): Promise<ConfiguracaoTestePericiaProjetada> {
    return await useApi<ConfiguracaoTestePericiaProjetada>({ uri: '/cache/salvaConfiguracaoTestePericia', method: 'POST', data: payload });
}

export async function salvaConfiguracaoPatentesTestePericia(payload: PAYLOAD__SalvarConfiguracaoPatentesTestePericia): Promise<ConfiguracaoPatentesTestePericiaProjetada> {
    return await useApi<ConfiguracaoPatentesTestePericiaProjetada>({ uri: '/cache/salvaConfiguracaoPatentesTestePericia', method: 'POST', data: payload });
}

export async function obtemDadosMinhasDisponibilidades() {
    return await useApi<DisponibilidadeUsuarioCompletaDto | null>({ uri: '/disponibilidades_usuario/me/me_obtemDadosMinhasDisponibilidades', method: 'GET' });
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
    return await useApi<GrupoAventuraCompletaDto[]>({ uri: '/grupos_aventuras/obtemTodosGruposParaAdmin', method: 'GET' });
}

export async function obtemAventurasParaAssistir() {
    return await useApi<AventuraParaAssistirDto[]>({ uri: '/aventuras/obtemAventurasParaAssistir', method: 'GET' });
}

export async function obtemAventuraCompleta(idAventura: number) {
    return await useApi<AventuraCompletaDto | null>({ uri: '/aventuras/obtemAventuraCompleta', method: 'GET', params: { idAventura } });
}

export async function buscaGrupoAventuraEspecifico(idGrupoAventura: number): Promise<VIEW_GrupoAventuraDetalhado | null> {
    return await useApi<VIEW_GrupoAventuraDetalhado | null>({ uri: '/grupos_aventuras/buscaGrupoAventuraEspecifico', method: 'GET', params: { idGrupoAventura } });
}

export async function obtemSessaoGeral(idSessao: number) {
    return await useApi<SessaoCompletaDto | null>({ uri: '/sessoes/obtemSessaoGeral', method: 'GET', params: { idSessao } });
}

export async function obtemDadosPublicosSessao(idSessao: number) {
    return await useApi<SessaoCompletaDto | null>({ uri: '/sessoes/obtemDadosPublicosSessao', method: 'GET', params: { idSessao } });
}

export async function me_obtemMinhasSessoesEmEsperaParaMestrar(): Promise<VIEW_SessaoComParticipantesDto[]> {
    return await useApi<VIEW_SessaoComParticipantesDto[]>({ uri: '/sessoes/me/me_obtemMinhasSessoesEmEsperaParaMestrar', method: 'GET' });
}

export async function me_obtemPersonagensPorTipo__View(idTipoPersonagem?: number): Promise<VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto[]> {
    return await useApi<VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto[]>({ uri: '/personagens/me/me_obtemPersonagensPorTipo__View', method: 'GET', params: { idTipoPersonagem } });
}

export async function me_obtemPersonagensPorTipo(idTipoPersonagem?: number): Promise<PersonagemVisualizacaoDetalhadaDto[]> {
    return await useApi<PersonagemVisualizacaoDetalhadaDto[]>({ uri: '/personagens/me/me_obtemPersonagensPorTipo', method: 'GET', params: { idTipoPersonagem } });
}

export async function obtemDadosInteligentePersonagem(idPersonagem: number) {
    return await useApi<PersonagemVisualizacaoDetalhadaDto | null>({ uri: '/personagens/obtemDadosInteligentePersonagem', method: 'GET', params: { idPersonagem } });
}

export async function obtemTiposImagem() {
    return await useApi<TipoImagemCompletaDto[]>({ uri: '/tipos_imagem/obtemTiposImagem', method: 'GET' });
}

export async function obtemArvoreItensParaPaginaPermissoes() {
    return await useApi<ArvoreItensPermissaoDto>({ uri: '/permissoes_itens/obtemArvoreItensParaPaginaPermissoes', method: 'GET' });
}

export async function me_criaItem(parentId: number | null, codigo: string, descricao: string) {
    return await useApi<boolean>({ uri: '/permissoes_itens/me/me_criaItem', method: 'POST', data: { parentId: parentId, codigo: codigo, descricao: descricao } });
}

export async function me_atualizaEstadoItem(idItemPermissao: number, idUsuario: number, idEstadoPermissao: number) {
    return await useApi<boolean>({ uri: '/permissoes_usuarios/me/me_atualizaEstadoItem', method: 'POST', data: { idItemPermissao, idUsuario, idEstadoPermissao } });
}

export async function deleteArquivo_PorPath_SUDO(pathRelativo: string) {
    return await useApi<boolean>({ uri: '/arquivos/deleteArquivo_PorPath_SUDO', method: 'DELETE', params: { pathRelativo: pathRelativo } });
}

export async function deleteArquivo_SUDO(idArquivo: number) {
    return await useApi<boolean>({ uri: '/arquivos/deleteArquivo_SUDO', method: 'DELETE', params: { idArquivo: idArquivo } });
}

export async function me_upload({ arquivo, tipoArquivo, camposExtras }: { arquivo: File; tipoArquivo: TipoArquivoDef; camposExtras?: Record<string, string | number>; }) {
    const formData = new FormData();

    formData.append('arquivo', arquivo);

    Object.entries(camposExtras ?? {}).forEach(([nomeCampo, valorCampo]) => {
        formData.append(nomeCampo, String(valorCampo));
    });

    return await useApi<ArquivoCompletaDto>({ uri: `/arquivos/me/me_upload/${tipoArquivo.id}`, method: 'POST', data: formData });
}

export async function atualizaAvatarUsuario(idPersonagem: number): Promise<boolean> {
    return await useApi<boolean>({ uri: '/usuarios/atualizaAvatarUsuario', method: 'PUT', data: { idPersonagem: idPersonagem } });
}

export async function obtemFichaDePersonagemEmNivel() {
    // export async function obtemFichaDePersonagemEmNivel(idPersonagem: number) {
    return await useApi<FichaEmClient>({ uri: '/fichas_personagens/obtemFichaDePersonagemEmNivel', method: 'GET' });
    // return await useApi<FichaPersonagemCompletaDto>({ uri: '/fichas_personagens/obtemFichaDePersonagemEmNivel', method: 'GET', data: { idPersonagem: idPersonagem } });
}

export async function obtemPersonagensComPendencias() {
    return await useApi<PersonagemCompletaDto[]>({ uri: '/personagens/obtemPersonagensComPendencias', method: 'GET' });
}

export async function obtemPericiasParaCriacaoFicha() {
    return await useApi<PericiaCompletaDto[]>({ uri: '/pericias/obtemTodos', method: 'GET', params: { criandoFicha: true } });
}

export async function obtemGanhosParaEvoluirPorIdFicha(idPersonagem: number) {
    return await useApi<ObjetoEvolucaoCompleto>({ uri: '/fichas/obtemGanhosParaEvoluirPorIdFicha', method: 'GET', params: { idPersonagem } });
}

export async function obtemGanhosParaCriarFicha_FichaTemporaria(nomeFicha: string) {
    return await useApi<ObjetoEvolucaoCompleto>({ uri: '/fichas/obtemGanhosParaCriarFicha_FichaTemporaria', method: 'GET', params: { nomeFicha: nomeFicha } });
}

export async function obtemGanhosAposSelecaoClasse(idClasse: number) {
    return await useApi<ObjetoGanhosEvolucao>({ uri: '/ganhos_nivel_classe/obtemGanhosAposSelecaoClasse', method: 'GET', params: { idClasse } });
}

export async function salvarEvolucaoDoPersonagem(fichaEvoluida: FichaPersonagemCompletaDto, fichaDeJogoEvoluida: FichaEmClient): Promise<boolean> {
    return await useApi<boolean>({ uri: '/fichas_personagens/salvarEvolucaoDoPersonagem', method: 'POST', data: { fichaEvoluida: fichaEvoluida, fichaDeJogoEvoluida: fichaDeJogoEvoluida } });
}

export async function obtemListaSessoesPrevistas(): Promise<SessaoEmVisualizacaoDto[]> {
    return await useApi<SessaoEmVisualizacaoDto[]>({ uri: '/sessoes/obtemListaSessoesPrevistas', method: 'GET' });
};

export async function obtemListaProxEpisodioPrevistoPorAventuraEmAndamento() {
    return await useApi<SessaoCompletaDto[]>({ uri: '/sessoes/obtemListaProxEpisodioPrevistoPorAventuraEmAndamento', method: 'GET' });
}

export async function obtemTodosTiposLink() {
    return await useApi<TipoLinkCompletaDto[]>({ uri: '/tipos_link/obtemTodosTiposLink', method: 'GET' });
}

export async function vinculaLinkDeSessao(idSessao: number, novoLink: LinkCompletaDto): Promise<boolean> {
    return await useApi<boolean>({ uri: '/detalhes_sessao_canonica/vinculaLinkDeSessao', method: 'POST', data: { idSessao: idSessao, novoLink: novoLink } });
}

export async function vinculaLinkDeGrupoAventura(idGrupoAventura: number, novoLink: LinkCompletaDto): Promise<boolean> {
    return await useApi<boolean>({ uri: '/grupos_aventuras/vinculaLinkDeGrupoAventura', method: 'POST', data: { idGrupoAventura: idGrupoAventura, novoLink: novoLink } });
}

export async function me_obtemSessoesUnicasPorMestre(): Promise<SessaoCompletaDto[]> {
    return await useApi<SessaoCompletaDto[]>({ uri: '/detalhes_sessao_unica/me/me_obtemSessoesUnicasPorMestre', method: 'GET' });
}

export async function obtemUltimaSessoesPostadas(): Promise<DetalheSessaoCanonicaParaAssistirDto[]> {
    return await useApi<DetalheSessaoCanonicaParaAssistirDto[]>({ uri: '/detalhes_sessao_canonica/obtemUltimaSessoesPostadas', method: 'GET' });
}

export async function encerraGrupoAventura(idGrupoAventura: number): Promise<boolean> {
    return await useApi<boolean>({ uri: '/grupos_aventuras/encerraGrupoAventura', method: 'PUT', data: { idGrupoAventura: idGrupoAventura } })
}

export async function me_executaIniciaSessao(idSessao: number): Promise<boolean> {
    return await useApi<boolean>({ uri: '/sessoes/me/me_executaIniciaSessao', method: 'PATCH', data: { idSessao: idSessao } });
}

export async function me_executaEncerraSessao(idSessao: number): Promise<boolean> {
    return await useApi<boolean>({ uri: '/sessoes/me/me_executaEncerraSessao', method: 'PATCH', data: { idSessao: idSessao } })
}

export async function obtemEstilosSessaoPorParam(ehSessaoUnica: boolean): Promise<EstiloSessaoMestradaDto[]> {
    return await useApi<EstiloSessaoMestradaDto[]>({ uri: '/estilos_sessao_mestrada/obtemEstilosSessaoPorParam', method: 'GET', params: { ehSessaoUnica } });
}

export async function me_obtemRascunhosPorTipo(sessaoUnica: boolean): Promise<RascunhoCompletaDto[]> {
    return await useApi<RascunhoCompletaDto[]>({ uri: '/rascunhos/me/me_obtemRascunhosPorTipo', method: 'GET', params: { sessaoUnica } });
}

export async function me_obtemDetalhesRascunho(idRascunho: number): Promise<RascunhoCompletaDto | null> {
    return await useApi<RascunhoCompletaDto | null>({ uri: '/rascunhos/me/me_obtemDetalhesRascunho', method: 'GET', params: { idRascunho } });
}

export async function me_salvarRascunho(titulo: string, idEstiloSessaoMestrada: number): Promise<boolean> {
    return await useApi<boolean>({ uri: '/rascunhos/me/me_salvarRascunho', method: 'POST', data: { titulo: titulo, idEstiloSessaoMestrada: idEstiloSessaoMestrada } });
}

export async function editaDetalheRascunho(detalheRascunho: PAYLOAD_DetalheRascunhoEdicaoDto): Promise<boolean> {
    return await useApi<boolean>({ uri: '/rascunhos/editaDetalheRascunho', method: 'POST', data: { detalheRascunho: detalheRascunho } });
}

export async function obtemDadosEPermissoes(idUsuario: number): Promise<UsuarioCompletaDto | null> {
    return await useApi<UsuarioCompletaDto | null>({ uri: '/usuarios/obtemDadosEPermissoes', method: 'GET', params: { idUsuario: idUsuario } });
}

export async function buscaRegrasPorTipoArquivo(tipoArquivo: TipoArquivoDef): Promise<RegrasUploadArquivo> {
    return await useApi<RegrasUploadArquivo>({ uri: '/arquivos/buscaRegrasPorTipoArquivo', method: 'GET', params: { idTipoArquivo: tipoArquivo.id } });
}

export async function me_obtemArquivoPendente(): Promise<ArquivoCompletaDto | null> {
    return await useApi<ArquivoCompletaDto | null>({ uri: '/arquivos/me/me_obtemArquivoPendente', method: 'GET' });
}

export async function obtemTodasImagensEspeciaisArtistaAprovadas(): Promise<ArquivoCompletaDto[]> {
    return await useApi<ArquivoCompletaDto[]>({ uri: '/arquivos/obtemTodasImagensEspeciaisArtistaAprovadas', method: 'GET' });
}

export async function me_criaEVinculaFicha__FichaTemporaria(nomeFicha: string, descricaoFicha: string, dadosEvolucaoFicha: DadosEvolucaoFicha): Promise<number> {
    return await useApi<number>({ uri: '/fichas_temporarias/me/me_criaEVinculaFicha__FichaTemporaria', method: 'POST', data: { nomeFicha: nomeFicha, descricaoFicha: descricaoFicha, dadosEvolucaoFicha: dadosEvolucaoFicha } });
}

export async function me_obtemFichas(): Promise<FichaTemporariaVisualizacaoDetalhadaDto[]> {
    return await useApi<FichaTemporariaVisualizacaoDetalhadaDto[]>({ uri: '/fichas_temporarias/me/me_obtemFichas', method: 'GET' })
}

export async function me_obtemSessoesPrevistasQueEuVouJogar() {
    return await useApi<VIEW_SessaoDeJogadorDto[]>({ uri: '/sessoes/me/me_obtemSessoesPrevistasQueEuVouJogar', method: 'GET' })
}

export async function me_deleteFichaTemporaria(fichaTemporaria: FichaTemporariaVisualizacaoDetalhadaDto) {
    return await useApi<boolean>({ uri: '/fichas_temporarias/me/me_deleteFichaTemporaria', method: 'DELETE', params: { idFichaTemporaria: String(fichaTemporaria.id) } });
}

export async function me_temFichaTemporaria() {
    return await useApi<boolean>({ uri: '/fichas_temporarias/me/me_temFichaTemporaria', method: 'GET' });
}

export async function obtemJanelasDisponibilidadesPorJanela(dadosJanelaDisponibilidade: DadosJanelaDisponibilidade) {
    return await useApi<JanelaDisponibilidadeCompletaDto[]>({ uri: '/janelas_disponibilidade/obtemJanelasDisponibilidadesPorJanela', method: 'POST', data: { dadosJanelaDisponibilidade: dadosJanelaDisponibilidade } });
}

export async function me_obtemRascunhosParaSessaoUnicaNaoCanonica() {
    return await useApi<RascunhoCompletaDto[]>({ uri: '/rascunhos/me/me_obtemRascunhosParaSessaoUnicaNaoCanonica', method: 'GET' });
}

export async function me_criaSessaoUnica(dadosCriacaoSessao: DadosCriacaoSessao): Promise<number> {
    return await useApi<number>({ uri: '/sessoes/me/me_criaSessaoUnica', method: 'POST', data: { dadosCriacaoSessao: dadosCriacaoSessao } });
}

export async function me_atualizaCapaDeSessaoUnica(idSessao: number, idArquivo: number): Promise<boolean> {
    return await useApi<boolean>({ uri: '/detalhes_sessao_unica/me/me_atualizaCapaDeSessaoUnica', method: 'PATCH', data: { idSessao: idSessao, idArquivo: idArquivo } });
}

export async function obtemPersonagensPorUsuario(idUsuario: number): Promise<PersonagemCompletaDto[]> {
    return await useApi<PersonagemCompletaDto[]>({ uri: '/personagens/obtemPersonagensPorUsuario', method: 'GET', params: { idUsuario: idUsuario } });
}

export async function me_amarraFichaTemporariaEmParticipacaoDeSessaoUnica(idSessao: number, idFichaTemporariaSelecionada: number): Promise<boolean> {
    return await useApi<boolean>({ uri: '/fichas_amarradas_participante_sessao_unica/me/me_amarraFichaTemporariaEmParticipacaoDeSessaoUnica', method: 'POST', data: { idSessao: idSessao, idFichaTemporariaSelecionada: idFichaTemporariaSelecionada } });
}

export async function obtemJDadosFichaEmJogoPorIdFicha(idFicha: number): Promise<J_DadosFichaEmJogo> {
    return await useApi<J_DadosFichaEmJogo>({ uri: '/fichas/obtemJDadosFichaEmJogoPorIdFicha', method: 'GET', params: { idFicha: idFicha } });
}

export async function obtemAvataresDeComparacao(): Promise<CaminhoArquivoAvatar[]> {
    return await useApi<CaminhoArquivoAvatar[]>({ uri: '/arquivos_tipados_avatar/obtemAvataresDeComparacao', method: 'GET' });
}

export async function configuraArteCapaGrupoAventura(idGrupoAventura: number, idArquivoTipadoArte: number): Promise<boolean> {
    return await useApi<boolean>({ uri: '/grupos_aventuras/configuraArteCapaGrupoAventura', method: 'PUT', data: { idGrupoAventura, idArquivoTipadoArte } });
}

export async function criaEmblema(payload: DTO__CREATE__Emblema): Promise<boolean> {
    return await useApi<boolean>({ uri: '/emblemas/criaEmblema', method: 'POST', data: payload });
}

export async function criaHabilidadePericia(payload: DTO__CREATE__HabilidadePericia): Promise<boolean> {
    return await useApi<boolean>({ uri: '/habilidades_pericia/criaHabilidadePericia', method: 'POST', data: payload });
}

export async function criaHabilidadeEspecial(payload: DTO__CREATE__HabilidadeEspecial): Promise<boolean> {
    return await useApi<boolean>({ uri: '/habilidades_especiais/criaHabilidadeEspecial', method: 'POST', data: payload });
}

export async function criaModificadorHabilidade(payload: DTO__CREATE__ModificadorHabilidade): Promise<boolean> {
    return await useApi<boolean>({ uri: '/modificadores_habilidade/criaModificadorHabilidade', method: 'POST', data: payload });
}

export async function criaCapacidadeInata(payload: DTO__CREATE__CapacidadeInata): Promise<boolean> {
    return await useApi<boolean>({ uri: '/capacidades_inatas/criaCapacidadeInata', method: 'POST', data: payload });
}

export async function criaSer(payload: DTO__CREATE__Ser): Promise<boolean> {
    return await useApi<boolean>({ uri: '/seres/criaSer', method: 'POST', data: payload });
}

export async function criaTutorial(payload: DadosCriarTutorial): Promise<{ id: number }> {
    return await useApi<{ id: number }>({ uri: '/tutoriais/criaTutorial', method: 'POST', data: payload });
}

export async function editaTutorial(id: number, payload: DadosEditarTutorial): Promise<boolean> {
    return await useApi<boolean>({ uri: `/tutoriais/editaTutorial/${id}`, method: 'PUT', data: payload });
}

export async function deletaModificadorHabilidade(idModificadorHabilidade: number): Promise<boolean> {
    return await useApi<boolean>({ uri: '/modificadores_habilidade/deletaModificadorHabilidade', method: 'DELETE', params: { idModificadorHabilidade } });
}

export async function PROTOTIPO_LUIZ__recupera_capa_perfil_usuario(): Promise<CaminhoArquivoArte> {
    return await useApi<CaminhoArquivoArte>({ uri: '/arquivos_tipados_arte/PROTOTIPO_LUIZ__recupera_capa_perfil_usuario', method: 'GET' });
}

export async function me_atualizaArteCapaPerfilUsuario(idArquivoTipadoArte: number) {
    return await useApi<null>({ uri: '/customizacoes_usuario/me/me_atualizaArteCapaPerfilUsuario', method: 'PUT', data: { idArquivoTipadoArte: idArquivoTipadoArte } });
}

export async function me_obtemMinhasChavesNovoAvatar() {
    return await useApi<{ id: number; caminhoArquivo: CaminhoArquivoAvatar; avatarEstaConfigurado: boolean; descricao: string; }[]>({ uri: '/customizacoes_usuario/me/me_obtemMinhasChavesNovoAvatar', method: 'GET' });
}

export async function me_atualizaAvatarPerfilUsuario(idChaveNovoAvatar: number) {
    return await useApi<null>({ uri: '/customizacoes_usuario/me/me_atualizaAvatarPerfilUsuario', method: 'PUT', data: { idChaveNovoAvatar: idChaveNovoAvatar } });
}

//

export async function desconectar() {
    return useApi<void>({ uri: '/auth/logout', method: 'DELETE' });
}