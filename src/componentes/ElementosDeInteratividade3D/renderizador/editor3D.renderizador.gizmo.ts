import { criaMatrizPerspectiva, criaMatrizTranslacao, multiplicaMatriz4 } from '../editor/editor3D.matrizes';
import { criaMatrizesCenaEditor3D } from './editor3D.renderizador.matrizes';
import type { CameraEditor3D, ResetAbsolutoVistaEditor3D } from '../editor/editor3D.camera';
import type { Vetor3 } from '../editor/editor3D.tipos';

export interface ViewportGizmoEixosEditor3D {
    readonly esquerda: number;
    readonly topo: number;
    readonly largura: number;
    readonly altura: number;
    readonly xViewport: number;
    readonly yViewport: number;
};

export interface MarcadorGizmoEixosEditor3D {
    readonly chave: ResetAbsolutoVistaEditor3D;
    readonly eixoFisico: ResetAbsolutoVistaEditor3D;
    readonly rotulo: string;
    readonly destinoClique: ResetAbsolutoVistaEditor3D;
    readonly x: number;
    readonly y: number;
    readonly profundidade: number;
    readonly negativo: boolean;
};

interface PontoClipEditor3D {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly w: number;
};

interface MarcadorProjetadoGizmoEixosEditor3D {
    readonly eixoFisico: ResetAbsolutoVistaEditor3D;
    readonly x: number;
    readonly y: number;
    readonly profundidade: number;
};

const escalaGizmoEixosEditor3D = 1.60;
const proporcaoGizmoEixosEditor3D = 0.075 * escalaGizmoEixosEditor3D;
const tamanhoMinimoGizmoEixosEditor3D = 54 * escalaGizmoEixosEditor3D;

function eixoGizmoEditor3DEhNegativo(eixo: ResetAbsolutoVistaEditor3D): boolean { return eixo === '-X' || eixo === '-Y' || eixo === '-Z'; };

function multiplicaMatrizPorPontoEditor3D(matriz: Float32Array, ponto: Vetor3): PontoClipEditor3D {
    return {
        x: (matriz[0] * ponto[0]) + (matriz[4] * ponto[1]) + (matriz[8] * ponto[2]) + matriz[12],
        y: (matriz[1] * ponto[0]) + (matriz[5] * ponto[1]) + (matriz[9] * ponto[2]) + matriz[13],
        z: (matriz[2] * ponto[0]) + (matriz[6] * ponto[1]) + (matriz[10] * ponto[2]) + matriz[14],
        w: (matriz[3] * ponto[0]) + (matriz[7] * ponto[1]) + (matriz[11] * ponto[2]) + matriz[15],
    };
};

function projetaPontoNoViewportEditor3D(matriz: Float32Array, viewport: ViewportGizmoEixosEditor3D, ponto: Vetor3): { readonly x: number; readonly y: number; readonly profundidade: number } | null {
    const clip = multiplicaMatrizPorPontoEditor3D(matriz, ponto);

    if (clip.w <= 0) return null;

    const ndcX = clip.x / clip.w;
    const ndcY = clip.y / clip.w;
    const profundidade = clip.z / clip.w;

    return { x: viewport.esquerda + (((ndcX + 1) / 2) * viewport.largura), y: viewport.topo + (((1 - ndcY) / 2) * viewport.altura), profundidade };
};

export function obtemViewportGizmoEixosEditor3D(larguraCanvas: number, alturaCanvas: number): ViewportGizmoEixosEditor3D {
    const tamanhoBase = Math.min(larguraCanvas, alturaCanvas);
    const tamanhoGizmo = Math.max(Math.floor(tamanhoMinimoGizmoEixosEditor3D), Math.floor(tamanhoBase * proporcaoGizmoEixosEditor3D));
    const margemTopo = 12;
    const margemDireita = 2;
    const esquerda = larguraCanvas - tamanhoGizmo - margemDireita;
    const topo = margemTopo;

    return { esquerda, topo, largura: tamanhoGizmo, altura: tamanhoGizmo, xViewport: esquerda, yViewport: alturaCanvas - tamanhoGizmo - margemTopo };
};

export function projetaMarcadoresGizmoEixosEditor3D(camera: CameraEditor3D, larguraCanvas: number, alturaCanvas: number): MarcadorGizmoEixosEditor3D[] {
    if (larguraCanvas <= 0 || alturaCanvas <= 0) return [];

    const viewport = obtemViewportGizmoEixosEditor3D(larguraCanvas, alturaCanvas);
    const matrizCena = criaMatrizesCenaEditor3D(camera, larguraCanvas, alturaCanvas).cena;
    const matrizPerspectivaGizmo = criaMatrizPerspectiva(Math.PI / 3.2, 1, 0.1, 100);
    const matrizCameraGizmo = criaMatrizTranslacao(0, 0, -2.6);
    const matrizFinalGizmo = multiplicaMatriz4(matrizPerspectivaGizmo, multiplicaMatriz4(matrizCameraGizmo, matrizCena));
    const pontos: { readonly eixoFisico: ResetAbsolutoVistaEditor3D; readonly ponto: Vetor3 }[] = [
        { eixoFisico: '-X', ponto: [-0.9, 0, 0] },
        { eixoFisico: '-Y', ponto: [0, -0.9, 0] },
        { eixoFisico: '-Z', ponto: [0, 0, -0.9] },
        { eixoFisico: 'X', ponto: [0.9, 0, 0] },
        { eixoFisico: 'Y', ponto: [0, 0.9, 0] },
        { eixoFisico: 'Z', ponto: [0, 0, 0.9] },
    ];

    const marcadoresProjetados = pontos.map(item => {
        const pontoProjetado = projetaPontoNoViewportEditor3D(matrizFinalGizmo, viewport, item.ponto);

        if (pontoProjetado === null) return null;

        return { eixoFisico: item.eixoFisico, x: pontoProjetado.x, y: pontoProjetado.y, profundidade: pontoProjetado.profundidade };
    }).filter((item): item is MarcadorProjetadoGizmoEixosEditor3D => item !== null);

    return marcadoresProjetados.map(item => ({ chave: item.eixoFisico, eixoFisico: item.eixoFisico, rotulo: item.eixoFisico, destinoClique: item.eixoFisico, x: item.x, y: item.y, profundidade: item.profundidade, negativo: eixoGizmoEditor3DEhNegativo(item.eixoFisico) })).sort((a, b) => b.profundidade - a.profundidade);
};