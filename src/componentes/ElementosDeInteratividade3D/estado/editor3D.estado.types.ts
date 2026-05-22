import type { CameraEditor3D } from '../editor/editor3D.camera';
import type { CampoVetorMalhaEditor3D, EixoEditor3D, IndiceVetor3Editor3D, ObjetoCenaEditor3D, TipoMalhaEditor3D, Vetor3 } from '../editor/editor3D.tipos';
import type { FerramentaMouseEditor3D } from '../mouse/editor3D.mouse.tipos';
import type { ModoEditor3D } from '../modos/editor3D.modo.tipos';

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

export interface Editor3DState {
    readonly objetos: ObjetoCenaEditor3D[];
    readonly malhaEmCriacao: ObjetoCenaEditor3D | null;
    readonly idObjetoSelecionado: string | null;
    readonly idsObjetosSelecionados: string[];
    readonly modoAtual: ModoEditor3D;
    readonly camera: CameraEditor3D;
    readonly ferramentaMouse: FerramentaMouseEditor3D;
    readonly areaSelecao: AreaSelecaoEditor3D | null;
    readonly cursorVirtual: CursorVirtualEditor3D;
    readonly tipoSelecionado: TipoMalhaEditor3D;
    readonly quantidadeVertices: number;
    readonly proximoId: number;
};

export type Editor3DAcao = { readonly tipo: 'ATUALIZA_CAMERA'; readonly camera: CameraEditor3D } | { readonly tipo: 'RESETA_CAMERA' } | { readonly tipo: 'ATIVA_FERRAMENTA_MOUSE'; readonly ferramenta: FerramentaMouseEditor3D } | { readonly tipo: 'RESETA_FERRAMENTA_MOUSE' } | { readonly tipo: 'INICIA_AREA_SELECAO'; readonly x: number; readonly y: number; readonly adicionando: boolean } | { readonly tipo: 'ATUALIZA_AREA_SELECAO'; readonly x: number; readonly y: number } | { readonly tipo: 'FINALIZA_AREA_SELECAO' } | { readonly tipo: 'ATUALIZA_CURSOR_VIRTUAL'; readonly x: number; readonly y: number; readonly ativo: boolean } | { readonly tipo: 'DESATIVA_CURSOR_VIRTUAL' } | { readonly tipo: 'SELECIONA_OBJETO'; readonly idObjeto: string | null; readonly adiciona: boolean } | { readonly tipo: 'SELECIONA_OBJETOS'; readonly idsObjetos: string[]; readonly adiciona: boolean } | { readonly tipo: 'SELECIONA_TIPO_MALHA'; readonly tipoMalha: TipoMalhaEditor3D } | { readonly tipo: 'ALTERA_QUANTIDADE_VERTICES'; readonly delta: number } | { readonly tipo: 'DEFINE_QUANTIDADE_VERTICES'; readonly quantidadeVertices: number } | { readonly tipo: 'INICIA_MALHA_EM_CRIACAO'; readonly tipoMalha: TipoMalhaEditor3D } | { readonly tipo: 'ATUALIZA_VETOR_MALHA_EM_CRIACAO'; readonly campo: CampoVetorMalhaEditor3D; readonly indice: IndiceVetor3Editor3D; readonly valor: number } | { readonly tipo: 'ATUALIZA_VETOR_OBJETO_SELECIONADO'; readonly campo: CampoVetorMalhaEditor3D; readonly indice: IndiceVetor3Editor3D; readonly valor: number } | { readonly tipo: 'APLICA_ROTATION_SCALE_OBJETOS_SELECIONADOS' } | { readonly tipo: 'CONFIRMA_MALHA_EM_CRIACAO' } | { readonly tipo: 'CANCELA_MALHA_EM_CRIACAO' } | { readonly tipo: 'LIMPA_CENA' } | { readonly tipo: 'MOVE_OBJETO_SELECIONADO'; readonly delta: Vetor3 } | { readonly tipo: 'INICIA_GRAB' } | { readonly tipo: 'APLICA_EIXO_GRAB'; readonly eixo: EixoEditor3D } | { readonly tipo: 'MOVE_OBJETO_GRAB'; readonly delta: Vetor3 } | { readonly tipo: 'INICIA_ROTATE' } | { readonly tipo: 'APLICA_EIXO_ROTATE'; readonly eixo: EixoEditor3D } | { readonly tipo: 'APLICA_ROTATE_LIVRE' } | { readonly tipo: 'ATUALIZA_ENTRADA_NUMERICA_ROTATE'; readonly entrada: string } | { readonly tipo: 'ROTACIONA_OBJETO_ROTATE'; readonly delta: Vetor3 } | { readonly tipo: 'INICIA_SCALE' } | { readonly tipo: 'APLICA_EIXO_SCALE'; readonly eixo: EixoEditor3D } | { readonly tipo: 'ESCALA_OBJETO_SCALE'; readonly delta: Vetor3 } | { readonly tipo: 'CONFIRMA_MODO' } | { readonly tipo: 'CANCELA_MODO' };

export interface Editor3DAcoes {
    atualizaCamera: (camera: CameraEditor3D) => void;
    resetaCamera: () => void;
    ativaFerramentaMouse: (ferramenta: FerramentaMouseEditor3D) => void;
    resetaFerramentaMouse: () => void;
    iniciaAreaSelecao: (x: number, y: number, adicionando: boolean) => void;
    atualizaAreaSelecao: (x: number, y: number) => void;
    finalizaAreaSelecao: () => void;
    atualizaCursorVirtual: (x: number, y: number, ativo: boolean) => void;
    desativaCursorVirtual: () => void;
    selecionaObjeto: (idObjeto: string | null, adiciona?: boolean) => void;
    selecionaObjetos: (idsObjetos: string[], adiciona?: boolean) => void;
    selecionaTipoMalha: (tipoMalha: TipoMalhaEditor3D) => void;
    alteraQuantidadeVertices: (delta: number) => void;
    defineQuantidadeVertices: (quantidadeVertices: number) => void;
    iniciaMalhaEmCriacao: (tipoMalha: TipoMalhaEditor3D) => void;
    atualizaVetorMalhaEmCriacao: (campo: CampoVetorMalhaEditor3D, indice: IndiceVetor3Editor3D, valor: number) => void;
    atualizaVetorObjetoSelecionado: (campo: CampoVetorMalhaEditor3D, indice: IndiceVetor3Editor3D, valor: number) => void;
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