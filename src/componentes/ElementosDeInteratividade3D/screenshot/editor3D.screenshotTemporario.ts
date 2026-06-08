import { obtemBloqueioGeracaoCenaCanonicaEditor3D, serializaEditor3DParaCenaCanonica } from '../editor/editor3D.cenaCanonica.serializador';
import type { CameraEditor3D, EspacoMovimentoGrabEditor3D, PlanoGuiaEditor3D } from '../editor/editor3D.camera';
import type { Editor3DState } from '../estado/editor3D.estado.types';
import type { CenaCanonicaEditor3D, FaceMalhaEditavelCenaCanonicaEditor3D, MalhaEditavelCenaCanonicaEditor3D, ObjetoCenaCanonicaEditor3D, Vetor3CenaCanonicaEditor3D } from 'types-nora-api/shared';

export const ROTA_SCREENSHOT_TEMPORARIO_EDITOR_3D = '/teste-3d/screenshot';
export const CHAVE_PAYLOAD_SCREENSHOT_TEMPORARIO_EDITOR_3D = 'udm:editor-3d:screenshot:temporario:v1';

const larguraPadraoScreenshotTemporarioEditor3D = 1280;
const alturaPadraoScreenshotTemporarioEditor3D = 720;
const planosGuiaValidosScreenshotTemporarioEditor3D: readonly PlanoGuiaEditor3D[] = ['XY', 'XZ', 'YZ'];
const espacosMovimentoGrabValidosScreenshotTemporarioEditor3D: readonly EspacoMovimentoGrabEditor3D[] = ['XY', 'XZ', 'YZ', 'XYZ'];

export interface CameraScreenshotTemporarioEditor3D {
    readonly rotacaoX: number;
    readonly rotacaoY: number;
    readonly rotacaoTela: number;
    readonly matrizCena: readonly number[];
    readonly deslocamentoX: number;
    readonly deslocamentoY: number;
    readonly zoom: number;
    readonly planoGuia: PlanoGuiaEditor3D;
    readonly espacoMovimentoGrab: EspacoMovimentoGrabEditor3D;
};

export interface PayloadScreenshotTemporarioEditor3D {
    readonly origem: 'EDITOR_3D';
    readonly modo: 'SCREENSHOT';
    readonly nomeTemporario: string;
    readonly cenaCanonica: CenaCanonicaEditor3D;
    readonly camera: CameraScreenshotTemporarioEditor3D;
    readonly largura: number;
    readonly altura: number;
};

function numeroScreenshotTemporarioEditor3DEhValido(valor: number): boolean { return typeof valor === 'number' && Number.isFinite(valor); };
function inteiroPositivoScreenshotTemporarioEditor3DEhValido(valor: number): boolean { return Number.isInteger(valor) && valor > 0; };
function textoScreenshotTemporarioEditor3DEhValido(valor: string): boolean { return typeof valor === 'string'; };
function textoOuNuloScreenshotTemporarioEditor3DEhValido(valor: string | null): boolean { return valor === null || typeof valor === 'string'; };
function listaNumerosScreenshotTemporarioEditor3DEhValida(valores: readonly number[], tamanho: number): boolean { return Array.isArray(valores) && valores.length === tamanho && valores.every(numeroScreenshotTemporarioEditor3DEhValido); };
function vetor3ScreenshotTemporarioEditor3DEhValido(vetor: Vetor3CenaCanonicaEditor3D): boolean { return listaNumerosScreenshotTemporarioEditor3DEhValida(vetor, 3); };
function matrizBaseScreenshotTemporarioEditor3DEhValida(matriz: readonly number[]): boolean { return listaNumerosScreenshotTemporarioEditor3DEhValida(matriz, 16); };
function planoGuiaScreenshotTemporarioEditor3DEhValido(plano: PlanoGuiaEditor3D): boolean { return planosGuiaValidosScreenshotTemporarioEditor3D.includes(plano); };
function espacoMovimentoGrabScreenshotTemporarioEditor3DEhValido(espaco: EspacoMovimentoGrabEditor3D): boolean { return espacosMovimentoGrabValidosScreenshotTemporarioEditor3D.includes(espaco); };
function indicesFaceScreenshotTemporarioEditor3DEhValidos(indices: readonly number[]): boolean { return Array.isArray(indices) && indices.every(indice => Number.isInteger(indice) && indice >= 0); };

function serializaCameraScreenshotTemporarioEditor3D(camera: CameraEditor3D): CameraScreenshotTemporarioEditor3D {
    return {
        rotacaoX: camera.rotacaoX,
        rotacaoY: camera.rotacaoY,
        rotacaoTela: camera.rotacaoTela,
        matrizCena: Array.from(camera.matrizCena),
        deslocamentoX: camera.deslocamentoX,
        deslocamentoY: camera.deslocamentoY,
        zoom: camera.zoom,
        planoGuia: camera.planoGuia,
        espacoMovimentoGrab: camera.espacoMovimentoGrab,
    };
};

function cameraScreenshotTemporarioEditor3DEhValida(camera: CameraScreenshotTemporarioEditor3D | null): camera is CameraScreenshotTemporarioEditor3D {
    if (camera === null || typeof camera !== 'object') return false;
    if (!numeroScreenshotTemporarioEditor3DEhValido(camera.rotacaoX)) return false;
    if (!numeroScreenshotTemporarioEditor3DEhValido(camera.rotacaoY)) return false;
    if (!numeroScreenshotTemporarioEditor3DEhValido(camera.rotacaoTela)) return false;
    if (!listaNumerosScreenshotTemporarioEditor3DEhValida(camera.matrizCena, 16)) return false;
    if (!numeroScreenshotTemporarioEditor3DEhValido(camera.deslocamentoX)) return false;
    if (!numeroScreenshotTemporarioEditor3DEhValido(camera.deslocamentoY)) return false;
    if (!numeroScreenshotTemporarioEditor3DEhValido(camera.zoom)) return false;
    if (!planoGuiaScreenshotTemporarioEditor3DEhValido(camera.planoGuia)) return false;

    return espacoMovimentoGrabScreenshotTemporarioEditor3DEhValido(camera.espacoMovimentoGrab);
};

function faceMalhaEditavelScreenshotTemporarioEditor3DEhValida(face: FaceMalhaEditavelCenaCanonicaEditor3D | null): boolean {
    if (face === null || typeof face !== 'object') return false;
    if (!textoScreenshotTemporarioEditor3DEhValido(face.id)) return false;
    if (!textoScreenshotTemporarioEditor3DEhValido(face.nome)) return false;

    return indicesFaceScreenshotTemporarioEditor3DEhValidos(face.indicesVertices);
};

function malhaEditavelScreenshotTemporarioEditor3DEhValida(malha: MalhaEditavelCenaCanonicaEditor3D | null): boolean {
    if (malha === null || typeof malha !== 'object') return false;
    if (!Array.isArray(malha.vertices) || !malha.vertices.every(vetor3ScreenshotTemporarioEditor3DEhValido)) return false;
    if (!Array.isArray(malha.faces) || !malha.faces.every(face => faceMalhaEditavelScreenshotTemporarioEditor3DEhValida(face))) return false;

    return inteiroPositivoScreenshotTemporarioEditor3DEhValido(malha.proximoIdFace);
};

function objetoCenaCanonicaScreenshotTemporarioEditor3DEhValido(objeto: ObjetoCenaCanonicaEditor3D | null): boolean {
    if (objeto === null || typeof objeto !== 'object') return false;
    if (!textoScreenshotTemporarioEditor3DEhValido(objeto.idLocal)) return false;
    if (!textoScreenshotTemporarioEditor3DEhValido(objeto.nome)) return false;
    if (!textoScreenshotTemporarioEditor3DEhValido(objeto.tipo)) return false;
    if (!inteiroPositivoScreenshotTemporarioEditor3DEhValido(objeto.quantidadeVertices)) return false;
    if (!vetor3ScreenshotTemporarioEditor3DEhValido(objeto.posicao)) return false;
    if (!vetor3ScreenshotTemporarioEditor3DEhValido(objeto.rotacao)) return false;
    if (!vetor3ScreenshotTemporarioEditor3DEhValido(objeto.escala)) return false;
    if (!matrizBaseScreenshotTemporarioEditor3DEhValida(objeto.matrizBase)) return false;
    if (!vetor3ScreenshotTemporarioEditor3DEhValido(objeto.corBase)) return false;
    if (!vetor3ScreenshotTemporarioEditor3DEhValido(objeto.corLuz)) return false;
    if (!textoOuNuloScreenshotTemporarioEditor3DEhValido(objeto.materialVisual)) return false;
    if (!textoScreenshotTemporarioEditor3DEhValido(objeto.shader)) return false;
    if (typeof objeto.visivel !== 'boolean') return false;
    if (objeto.malhaEditavel !== undefined && !malhaEditavelScreenshotTemporarioEditor3DEhValida(objeto.malhaEditavel)) return false;

    return true;
};

function idsLocaisObjetosCenaCanonicaScreenshotTemporarioEditor3DSaoUnicos(objetos: readonly ObjetoCenaCanonicaEditor3D[]): boolean {
    const ids = new Set<string>();

    for (const objeto of objetos) {
        if (ids.has(objeto.idLocal)) return false;

        ids.add(objeto.idLocal);
    }

    return true;
};

function cenaCanonicaScreenshotTemporarioEditor3DEhValida(cena: CenaCanonicaEditor3D | null): cena is CenaCanonicaEditor3D {
    if (cena === null || typeof cena !== 'object') return false;
    if (cena.versao !== 1) return false;
    if (!Array.isArray(cena.objetos) || !cena.objetos.every(objeto => objetoCenaCanonicaScreenshotTemporarioEditor3DEhValido(objeto))) return false;

    return idsLocaisObjetosCenaCanonicaScreenshotTemporarioEditor3DSaoUnicos(cena.objetos);
};

function payloadScreenshotTemporarioEditor3DEhValido(payload: PayloadScreenshotTemporarioEditor3D | null): payload is PayloadScreenshotTemporarioEditor3D {
    if (payload === null || typeof payload !== 'object') return false;
    if (payload.origem !== 'EDITOR_3D') return false;
    if (payload.modo !== 'SCREENSHOT') return false;
    if (typeof payload.nomeTemporario !== 'string') return false;
    if (!numeroScreenshotTemporarioEditor3DEhValido(payload.largura) || payload.largura <= 0) return false;
    if (!numeroScreenshotTemporarioEditor3DEhValido(payload.altura) || payload.altura <= 0) return false;
    if (!cenaCanonicaScreenshotTemporarioEditor3DEhValida(payload.cenaCanonica)) return false;

    return cameraScreenshotTemporarioEditor3DEhValida(payload.camera);
};

export function obtemBloqueioGeracaoScreenshotTemporarioEditor3D(state: Editor3DState): string | null { return obtemBloqueioGeracaoCenaCanonicaEditor3D(state); };

export function criaPayloadScreenshotTemporarioEditor3D(state: Editor3DState): PayloadScreenshotTemporarioEditor3D {
    return {
        origem: 'EDITOR_3D',
        modo: 'SCREENSHOT',
        nomeTemporario: state.projetoAberto?.nome ?? 'Cena temporaria do Editor 3D',
        cenaCanonica: serializaEditor3DParaCenaCanonica(state),
        camera: serializaCameraScreenshotTemporarioEditor3D(state.camera),
        largura: larguraPadraoScreenshotTemporarioEditor3D,
        altura: alturaPadraoScreenshotTemporarioEditor3D,
    };
};

export function salvaPayloadScreenshotTemporarioEditor3D(payload: PayloadScreenshotTemporarioEditor3D): void {
    if (typeof window === 'undefined') return;

    window.sessionStorage.setItem(CHAVE_PAYLOAD_SCREENSHOT_TEMPORARIO_EDITOR_3D, JSON.stringify(payload));
};

export function carregaPayloadScreenshotTemporarioEditor3D(): PayloadScreenshotTemporarioEditor3D | null {
    if (typeof window === 'undefined') return null;

    const payloadSerializado = window.sessionStorage.getItem(CHAVE_PAYLOAD_SCREENSHOT_TEMPORARIO_EDITOR_3D);

    if (payloadSerializado === null) return null;

    try {
        const payload = JSON.parse(payloadSerializado) as PayloadScreenshotTemporarioEditor3D | null;

        return payloadScreenshotTemporarioEditor3DEhValido(payload) ? payload : null;
    } catch {
        return null;
    }
};

export function desserializaCameraScreenshotTemporarioEditor3D(camera: CameraScreenshotTemporarioEditor3D): CameraEditor3D {
    return { ...camera, matrizCena: new Float32Array(camera.matrizCena) };
};
