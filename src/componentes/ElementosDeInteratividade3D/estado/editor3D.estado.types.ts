import type { CameraEditor3D } from '../editor/editor3D.camera';
import type { CampoVetorMalhaEditor3D, EixoEditor3D, IndiceVetor3Editor3D, MalhaEditavelEditor3D, ObjetoCenaEditor3D, TipoMalhaEditor3D, Vetor3 } from '../editor/editor3D.tipos';
import type { ArestaSelecionadaEdicaoEditor3D, EscopoEdicaoEditor3D, FaceSelecionadaEdicaoEditor3D, ModoOperacaoEditor3D, TipoSelecaoEdicaoEditor3D, VerticeSelecionadoEdicaoEditor3D } from '../modoOperacao/editor3D.modoOperacao.tipos';
import type { FerramentaMouseEditor3D } from '../mouse/editor3D.mouse.tipos';
import type { ModoEditor3D } from '../modos/editor3D.modo.tipos';
import type { MaterialVisualEditor3D } from '../editor/editor3D.materialVisual.tipos';
import type { ShaderEditor3D } from '../editor/editor3D.shader.tipos';
import type { ModoVisualizacaoViewportEditor3D } from '../viewport/editor3D.viewport.tipos';
import type { ArestaBevelMalhaEditavelEditor3D } from '../geometria/editor3D.geometria.bevel';

export type PosicaoSoltarCenaEditor3D = 'ANTES' | 'DEPOIS';

export interface AreaSelecaoEditor3D {
    readonly inicioX: number;
    readonly inicioY: number;
    readonly fimX: number;
    readonly fimY: number;
    readonly adicionando: boolean;
};

export interface CursorVirtualEditor3D {
    readonly ativo: boolean;
    readonly x: number;
    readonly y: number;
};

export interface ColecaoCenaEditor3D {
    readonly id: string;
    readonly nome: string;
    readonly idsObjetos: string[];
};

export interface NotificacaoAreaInterativaEditor3D {
    readonly id: number;
    readonly texto: string;
};

export interface InsetFaceEdicaoEditor3D {
    readonly idObjeto: string;
    readonly idFaceOriginal: string;
    readonly idFaceInterna: string;
    readonly malhaOriginal: MalhaEditavelEditor3D;
    readonly escala: number;
};

export interface BevelEdicaoEditor3D {
    readonly idObjeto: string;
    readonly idFace: string | null;
    readonly malhaOriginal: MalhaEditavelEditor3D;
    readonly arestas: readonly ArestaBevelMalhaEditavelEditor3D[];
    readonly idsFacesBevel: readonly string[];
    readonly largura: number;
    readonly segmentos: number;
};

export interface Editor3DState {
    readonly objetos: ObjetoCenaEditor3D[];
    readonly malhaEmCriacao: ObjetoCenaEditor3D | null;
    readonly idObjetoSelecionado: string | null;
    readonly idsObjetosSelecionados: string[];
    readonly idsObjetosOcultos: string[];
    readonly idsObjetosOcultosManualmente: string[];
    readonly colecoes: ColecaoCenaEditor3D[];
    readonly idsColecoesOcultas: string[];
    readonly idColecaoSelecionada: string | null;
    readonly proximoIdColecao: number;
    readonly notificacaoAreaInterativa: NotificacaoAreaInterativaEditor3D | null;
    readonly proximoIdNotificacaoAreaInterativa: number;
    readonly modoVisualizacaoViewport: ModoVisualizacaoViewportEditor3D;
    readonly visualizacaoXRayAtiva: boolean;
    readonly modoOperacao: ModoOperacaoEditor3D;
    readonly escopoEdicao: EscopoEdicaoEditor3D | null;
    readonly tipoSelecaoEdicao: TipoSelecaoEdicaoEditor3D;
    readonly verticeSelecionadoEdicao: VerticeSelecionadoEdicaoEditor3D | null;
    readonly arestaSelecionadaEdicao: ArestaSelecionadaEdicaoEditor3D | null;
    readonly faceSelecionadaEdicao: FaceSelecionadaEdicaoEditor3D | null;
    readonly insetFaceEdicao: InsetFaceEdicaoEditor3D | null;
    readonly bevelEdicao: BevelEdicaoEditor3D | null;
    readonly modoAtual: ModoEditor3D;
    readonly camera: CameraEditor3D;
    readonly ferramentaMouse: FerramentaMouseEditor3D;
    readonly areaSelecao: AreaSelecaoEditor3D | null;
    readonly cursorVirtual: CursorVirtualEditor3D;
    readonly tipoSelecionado: TipoMalhaEditor3D;
    readonly quantidadeVertices: number;
    readonly proximoId: number;
};

export type Editor3DAcao = { readonly tipo: 'ATUALIZA_CAMERA'; readonly camera: CameraEditor3D } | { readonly tipo: 'RESETA_CAMERA' } | { readonly tipo: 'EXIBE_NOTIFICACAO_AREA_INTERATIVA'; readonly texto: string } | { readonly tipo: 'LIMPA_NOTIFICACAO_AREA_INTERATIVA'; readonly id: number } | { readonly tipo: 'DEFINE_MODO_VISUALIZACAO_VIEWPORT'; readonly modoVisualizacaoViewport: ModoVisualizacaoViewportEditor3D } | { readonly tipo: 'ALTERNA_VISUALIZACAO_XRAY' } | { readonly tipo: 'ENTRA_MODO_EDICAO' } | { readonly tipo: 'SAI_MODO_EDICAO' } | { readonly tipo: 'ALTERNA_MODO_OPERACAO' } | { readonly tipo: 'DEFINE_TIPO_SELECAO_EDICAO'; readonly tipoSelecao: TipoSelecaoEdicaoEditor3D } | { readonly tipo: 'SELECIONA_VERTICE_EDICAO'; readonly idObjeto: string | null; readonly indiceVertice: number | null } | { readonly tipo: 'SELECIONA_ARESTA_EDICAO'; readonly idObjeto: string | null; readonly indiceOrigem: number | null; readonly indiceDestino: number | null } | { readonly tipo: 'SELECIONA_FACE_EDICAO'; readonly idObjeto: string | null; readonly idFace: string | null } | { readonly tipo: 'INICIA_INSET_FACE_SELECIONADA' } | { readonly tipo: 'ATUALIZA_INSET_FACE_EM_EDICAO'; readonly deltaEscala: number } | { readonly tipo: 'CONFIRMA_INSET_FACE_EM_EDICAO' } | { readonly tipo: 'CANCELA_INSET_FACE_EM_EDICAO' } | { readonly tipo: 'INICIA_BEVEL_SELECAO' } | { readonly tipo: 'ATUALIZA_BEVEL_EM_EDICAO'; readonly deltaLargura: number } | { readonly tipo: 'ALTERA_SEGMENTOS_BEVEL_EM_EDICAO'; readonly deltaSegmentos: number } | { readonly tipo: 'CONFIRMA_BEVEL_EM_EDICAO' } | { readonly tipo: 'CANCELA_BEVEL_EM_EDICAO' } | { readonly tipo: 'MOVE_SELECAO_EDICAO'; readonly delta: Vetor3 } | { readonly tipo: 'APLICA_INSET_FACE_SELECIONADA' } | { readonly tipo: 'ATIVA_FERRAMENTA_MOUSE'; readonly ferramenta: FerramentaMouseEditor3D } | { readonly tipo: 'RESETA_FERRAMENTA_MOUSE' } | { readonly tipo: 'INICIA_AREA_SELECAO'; readonly x: number; readonly y: number; readonly adicionando: boolean } | { readonly tipo: 'ATUALIZA_AREA_SELECAO'; readonly x: number; readonly y: number } | { readonly tipo: 'FINALIZA_AREA_SELECAO' } | { readonly tipo: 'ATUALIZA_CURSOR_VIRTUAL'; readonly x: number; readonly y: number; readonly ativo: boolean } | { readonly tipo: 'DESATIVA_CURSOR_VIRTUAL' } | { readonly tipo: 'SELECIONA_OBJETO'; readonly idObjeto: string | null; readonly adiciona: boolean } | { readonly tipo: 'SELECIONA_OBJETOS'; readonly idsObjetos: string[]; readonly adiciona: boolean } | { readonly tipo: 'SELECIONA_COLECAO_CENA'; readonly idColecao: string } | { readonly tipo: 'CRIA_COLECAO_CENA' } | { readonly tipo: 'RENOMEIA_OBJETO_CENA'; readonly idObjeto: string; readonly nome: string } | { readonly tipo: 'RENOMEIA_COLECAO_CENA'; readonly idColecao: string; readonly nome: string } | { readonly tipo: 'MOVE_OBJETO_PARA_COLECAO_CENA'; readonly idObjeto: string; readonly idColecao: string | null; readonly idObjetoReferencia: string | null; readonly posicao: PosicaoSoltarCenaEditor3D | null } | { readonly tipo: 'MOVE_COLECAO_CENA'; readonly idColecao: string; readonly idColecaoReferencia: string | null; readonly posicao: PosicaoSoltarCenaEditor3D | null } | { readonly tipo: 'DELETA_OBJETOS_SELECIONADOS' } | { readonly tipo: 'ALTERNA_VISIBILIDADE_OBJETO'; readonly idObjeto: string } | { readonly tipo: 'ALTERNA_VISIBILIDADE_COLECAO'; readonly idColecao: string } | { readonly tipo: 'SELECIONA_TIPO_MALHA'; readonly tipoMalha: TipoMalhaEditor3D } | { readonly tipo: 'ALTERA_QUANTIDADE_VERTICES'; readonly delta: number } | { readonly tipo: 'DEFINE_QUANTIDADE_VERTICES'; readonly quantidadeVertices: number } | { readonly tipo: 'INICIA_MALHA_EM_CRIACAO'; readonly tipoMalha: TipoMalhaEditor3D } | { readonly tipo: 'ATUALIZA_VETOR_MALHA_EM_CRIACAO'; readonly campo: CampoVetorMalhaEditor3D; readonly indice: IndiceVetor3Editor3D; readonly valor: number } | { readonly tipo: 'ATUALIZA_VETOR_OBJETO_SELECIONADO'; readonly campo: CampoVetorMalhaEditor3D; readonly indice: IndiceVetor3Editor3D; readonly valor: number } | { readonly tipo: 'DEFINE_SHADER_OBJETO_SELECIONADO'; readonly shader: ShaderEditor3D } | { readonly tipo: 'APLICA_MATERIAL_VISUAL_OBJETO_SELECIONADO'; readonly materialVisual: MaterialVisualEditor3D } | { readonly tipo: 'APLICA_ROTATION_SCALE_OBJETOS_SELECIONADOS' } | { readonly tipo: 'CONFIRMA_MALHA_EM_CRIACAO' } | { readonly tipo: 'CANCELA_MALHA_EM_CRIACAO' } | { readonly tipo: 'LIMPA_CENA' } | { readonly tipo: 'MOVE_OBJETO_SELECIONADO'; readonly delta: Vetor3 } | { readonly tipo: 'INICIA_GRAB' } | { readonly tipo: 'APLICA_EIXO_GRAB'; readonly eixo: EixoEditor3D } | { readonly tipo: 'MOVE_OBJETO_GRAB'; readonly delta: Vetor3 } | { readonly tipo: 'INICIA_ROTATE' } | { readonly tipo: 'APLICA_EIXO_ROTATE'; readonly eixo: EixoEditor3D } | { readonly tipo: 'APLICA_ROTATE_LIVRE' } | { readonly tipo: 'ATUALIZA_ENTRADA_NUMERICA_ROTATE'; readonly entrada: string } | { readonly tipo: 'ROTACIONA_OBJETO_ROTATE'; readonly delta: Vetor3 } | { readonly tipo: 'INICIA_SCALE' } | { readonly tipo: 'APLICA_EIXO_SCALE'; readonly eixo: EixoEditor3D } | { readonly tipo: 'ESCALA_OBJETO_SCALE'; readonly delta: Vetor3 } | { readonly tipo: 'CONFIRMA_MODO' } | { readonly tipo: 'CANCELA_MODO' };

export interface Editor3DAcoes {
    atualizaCamera: (camera: CameraEditor3D) => void;
    resetaCamera: () => void;
    exibeNotificacaoAreaInterativa: (texto: string) => void;
    limpaNotificacaoAreaInterativa: (id: number) => void;
    defineModoVisualizacaoViewport: (modoVisualizacaoViewport: ModoVisualizacaoViewportEditor3D) => void;
    alternaVisualizacaoXRay: () => void;
    entraModoEdicao: () => void;
    saiModoEdicao: () => void;
    alternaModoOperacao: () => void;
    defineTipoSelecaoEdicao: (tipoSelecao: TipoSelecaoEdicaoEditor3D) => void;
    selecionaVerticeEdicao: (idObjeto: string | null, indiceVertice: number | null) => void;
    selecionaArestaEdicao: (idObjeto: string | null, indiceOrigem: number | null, indiceDestino: number | null) => void;
    selecionaFaceEdicao: (idObjeto: string | null, idFace: string | null) => void;
    iniciaInsetFaceSelecionada: () => void;
    atualizaInsetFaceEmEdicao: (deltaEscala: number) => void;
    confirmaInsetFaceEmEdicao: () => void;
    cancelaInsetFaceEmEdicao: () => void;
    iniciaBevelSelecao: () => void;
    atualizaBevelEmEdicao: (deltaLargura: number) => void;
    alteraSegmentosBevelEmEdicao: (deltaSegmentos: number) => void;
    confirmaBevelEmEdicao: () => void;
    cancelaBevelEmEdicao: () => void;
    moveSelecaoEdicao: (delta: Vetor3) => void;
    aplicaInsetFaceSelecionada: () => void;
    ativaFerramentaMouse: (ferramenta: FerramentaMouseEditor3D) => void;
    resetaFerramentaMouse: () => void;
    iniciaAreaSelecao: (x: number, y: number, adicionando: boolean) => void;
    atualizaAreaSelecao: (x: number, y: number) => void;
    finalizaAreaSelecao: () => void;
    atualizaCursorVirtual: (x: number, y: number, ativo: boolean) => void;
    desativaCursorVirtual: () => void;
    selecionaObjeto: (idObjeto: string | null, adiciona?: boolean) => void;
    selecionaObjetos: (idsObjetos: string[], adiciona?: boolean) => void;
    selecionaColecaoCena: (idColecao: string) => void;
    criaColecaoCena: () => void;
    renomeiaObjetoCena: (idObjeto: string, nome: string) => void;
    renomeiaColecaoCena: (idColecao: string, nome: string) => void;
    moveObjetoParaColecaoCena: (idObjeto: string, idColecao: string | null, idObjetoReferencia?: string | null, posicao?: PosicaoSoltarCenaEditor3D | null) => void;
    moveColecaoCena: (idColecao: string, idColecaoReferencia?: string | null, posicao?: PosicaoSoltarCenaEditor3D | null) => void;
    deletaObjetosSelecionados: () => void;
    alternaVisibilidadeObjeto: (idObjeto: string) => void;
    alternaVisibilidadeColecao: (idColecao: string) => void;
    selecionaTipoMalha: (tipoMalha: TipoMalhaEditor3D) => void;
    alteraQuantidadeVertices: (delta: number) => void;
    defineQuantidadeVertices: (quantidadeVertices: number) => void;
    iniciaMalhaEmCriacao: (tipoMalha: TipoMalhaEditor3D) => void;
    atualizaVetorMalhaEmCriacao: (campo: CampoVetorMalhaEditor3D, indice: IndiceVetor3Editor3D, valor: number) => void;
    atualizaVetorObjetoSelecionado: (campo: CampoVetorMalhaEditor3D, indice: IndiceVetor3Editor3D, valor: number) => void;
    defineShaderObjetoSelecionado: (shader: ShaderEditor3D) => void;
    aplicaMaterialVisualObjetoSelecionado: (materialVisual: MaterialVisualEditor3D) => void;
    aplicaRotationScaleObjetosSelecionados: () => void;
    confirmaMalhaEmCriacao: () => void;
    cancelaMalhaEmCriacao: () => void;
    limpaCena: () => void;
    moveObjetoSelecionado: (delta: Vetor3) => void;
    iniciaGrabObjetoSelecionado: () => void;
    aplicaEixoGrabObjetoSelecionado: (eixo: EixoEditor3D) => void;
    moveObjetoGrab: (delta: Vetor3) => void;
    iniciaRotateObjetoSelecionado: () => void;
    aplicaEixoRotateObjetoSelecionado: (eixo: EixoEditor3D) => void;
    aplicaRotateLivreObjetoSelecionado: () => void;
    atualizaEntradaNumericaRotate: (entrada: string) => void;
    rotacionaObjetoRotate: (delta: Vetor3) => void;
    iniciaScaleObjetoSelecionado: () => void;
    aplicaEixoScaleObjetoSelecionado: (eixo: EixoEditor3D) => void;
    escalaObjetoScale: (delta: Vetor3) => void;
    confirmaModoAtual: () => void;
    cancelaModoAtual: () => void;
};

export interface Editor3DModelo {
    readonly estado: Editor3DState;
    readonly acoes: Editor3DAcoes;
};
