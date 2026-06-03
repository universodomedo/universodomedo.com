import { criaMatrizPerspectiva, criaMatrizTranslacao, multiplicaMatriz4 } from '../editor/editor3D.matrizes';
import { criaMatrizesCenaEditor3D } from './editor3D.renderizador.matrizes';
import { obtemCameraAjusteVistaPorDirecaoEditor3D, obtemResetAbsolutoVistaAtualCameraEditor3D, type CameraEditor3D, type DirecaoAjusteVistaEditor3D, type ResetAbsolutoVistaEditor3D } from '../editor/editor3D.camera';
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
    readonly eixo: ResetAbsolutoVistaEditor3D;
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
    readonly eixoOriginal: ResetAbsolutoVistaEditor3D;
    readonly x: number;
    readonly y: number;
    readonly profundidade: number;
};

interface ParMarcadoresProjetadosGizmoEixosEditor3D {
    readonly positivo: MarcadorProjetadoGizmoEixosEditor3D;
    readonly negativo: MarcadorProjetadoGizmoEixosEditor3D;
};

type EixoBaseGizmoEditor3D = 'X' | 'Y' | 'Z';

const escalaGizmoEixosEditor3D = 1.60;
const proporcaoGizmoEixosEditor3D = 0.075 * escalaGizmoEixosEditor3D;
const tamanhoMinimoGizmoEixosEditor3D = 54 * escalaGizmoEixosEditor3D;

function obtemVistaOpostaGizmoEditor3D(eixo: ResetAbsolutoVistaEditor3D): ResetAbsolutoVistaEditor3D {
    if (eixo === 'X') return '-X';
    if (eixo === '-X') return 'X';
    if (eixo === 'Y') return '-Y';
    if (eixo === '-Y') return 'Y';
    if (eixo === 'Z') return '-Z';

    return 'Z';
};

function eixoGizmoEditor3DEhNegativo(eixo: ResetAbsolutoVistaEditor3D): boolean { return eixo === '-X' || eixo === '-Y' || eixo === '-Z'; };
function obtemEixoBaseGizmoEditor3D(eixo: ResetAbsolutoVistaEditor3D): EixoBaseGizmoEditor3D {
    if (eixo === '-X') return 'X';
    if (eixo === '-Y') return 'Y';
    if (eixo === '-Z') return 'Z';

    return eixo;
};

function obtemEixoNegativoBaseGizmoEditor3D(eixo: EixoBaseGizmoEditor3D): ResetAbsolutoVistaEditor3D {
    if (eixo === 'X') return '-X';
    if (eixo === 'Y') return '-Y';

    return '-Z';
};

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

function obtemEixoPorDirecaoGizmoEditor3D(camera: CameraEditor3D, direcao: DirecaoAjusteVistaEditor3D): ResetAbsolutoVistaEditor3D { return obtemResetAbsolutoVistaAtualCameraEditor3D(obtemCameraAjusteVistaPorDirecaoEditor3D(camera, direcao)); };

function obtemParMarcadoresProjetadosGizmoEditor3D(marcadores: MarcadorProjetadoGizmoEixosEditor3D[], eixo: EixoBaseGizmoEditor3D): ParMarcadoresProjetadosGizmoEixosEditor3D | null {
    const positivo = marcadores.find(marcador => marcador.eixoOriginal === eixo);
    const negativo = marcadores.find(marcador => marcador.eixoOriginal === obtemEixoNegativoBaseGizmoEditor3D(eixo));

    return positivo === undefined || negativo === undefined ? null : { positivo, negativo };
};

function atribuiEixosDirecionaisParHorizontalGizmoEditor3D(eixosPorChave: Map<ResetAbsolutoVistaEditor3D, ResetAbsolutoVistaEditor3D>, camera: CameraEditor3D, par: ParMarcadoresProjetadosGizmoEixosEditor3D): void {
    const direita = par.positivo.x >= par.negativo.x ? par.positivo : par.negativo;
    const esquerda = direita === par.positivo ? par.negativo : par.positivo;

    eixosPorChave.set(direita.eixoOriginal, obtemEixoPorDirecaoGizmoEditor3D(camera, 'DIREITA'));
    eixosPorChave.set(esquerda.eixoOriginal, obtemEixoPorDirecaoGizmoEditor3D(camera, 'ESQUERDA'));
};

function atribuiEixosDirecionaisParVerticalGizmoEditor3D(eixosPorChave: Map<ResetAbsolutoVistaEditor3D, ResetAbsolutoVistaEditor3D>, camera: CameraEditor3D, par: ParMarcadoresProjetadosGizmoEixosEditor3D): void {
    const cima = par.positivo.y <= par.negativo.y ? par.positivo : par.negativo;
    const baixo = cima === par.positivo ? par.negativo : par.positivo;

    eixosPorChave.set(cima.eixoOriginal, obtemEixoPorDirecaoGizmoEditor3D(camera, 'CIMA'));
    eixosPorChave.set(baixo.eixoOriginal, obtemEixoPorDirecaoGizmoEditor3D(camera, 'BAIXO'));
};

function obtemEixosPorChaveMarcadoresGizmoEditor3D(camera: CameraEditor3D, marcadores: MarcadorProjetadoGizmoEixosEditor3D[]): Map<ResetAbsolutoVistaEditor3D, ResetAbsolutoVistaEditor3D> {
    const vistaAtual = obtemResetAbsolutoVistaAtualCameraEditor3D(camera);
    const eixoBaseVistaAtual = obtemEixoBaseGizmoEditor3D(vistaAtual);
    const eixosPorChave = new Map<ResetAbsolutoVistaEditor3D, ResetAbsolutoVistaEditor3D>();
    const eixosLaterais = (['X', 'Y', 'Z'] as const).filter(eixo => eixo !== eixoBaseVistaAtual);
    const primeiroPar = obtemParMarcadoresProjetadosGizmoEditor3D(marcadores, eixosLaterais[0]);
    const segundoPar = obtemParMarcadoresProjetadosGizmoEditor3D(marcadores, eixosLaterais[1]);

    eixosPorChave.set(vistaAtual, vistaAtual);
    eixosPorChave.set(obtemVistaOpostaGizmoEditor3D(vistaAtual), obtemVistaOpostaGizmoEditor3D(vistaAtual));
    if (primeiroPar === null || segundoPar === null) return eixosPorChave;

    const primeiroParEhHorizontal = Math.abs(primeiroPar.positivo.x - primeiroPar.negativo.x) >= Math.abs(segundoPar.positivo.x - segundoPar.negativo.x);

    atribuiEixosDirecionaisParHorizontalGizmoEditor3D(eixosPorChave, camera, primeiroParEhHorizontal ? primeiroPar : segundoPar);
    atribuiEixosDirecionaisParVerticalGizmoEditor3D(eixosPorChave, camera, primeiroParEhHorizontal ? segundoPar : primeiroPar);

    return eixosPorChave;
};

export function projetaMarcadoresGizmoEixosEditor3D(camera: CameraEditor3D, larguraCanvas: number, alturaCanvas: number): MarcadorGizmoEixosEditor3D[] {
    if (larguraCanvas <= 0 || alturaCanvas <= 0) return [];

    const viewport = obtemViewportGizmoEixosEditor3D(larguraCanvas, alturaCanvas);
    const matrizCena = criaMatrizesCenaEditor3D(camera, larguraCanvas, alturaCanvas).cena;
    const matrizPerspectivaGizmo = criaMatrizPerspectiva(Math.PI / 3.2, 1, 0.1, 100);
    const matrizCameraGizmo = criaMatrizTranslacao(0, 0, -2.6);
    const matrizFinalGizmo = multiplicaMatriz4(matrizPerspectivaGizmo, multiplicaMatriz4(matrizCameraGizmo, matrizCena));
    const pontos: { readonly eixo: ResetAbsolutoVistaEditor3D; readonly ponto: Vetor3 }[] = [
        { eixo: '-X', ponto: [-0.9, 0, 0] },
        { eixo: '-Y', ponto: [0, -0.9, 0] },
        { eixo: '-Z', ponto: [0, 0, -0.9] },
        { eixo: 'X', ponto: [0.9, 0, 0] },
        { eixo: 'Y', ponto: [0, 0.9, 0] },
        { eixo: 'Z', ponto: [0, 0, 0.9] },
    ];

    const marcadoresProjetados = pontos.map(item => {
        const pontoProjetado = projetaPontoNoViewportEditor3D(matrizFinalGizmo, viewport, item.ponto);

        if (pontoProjetado === null) return null;

        return { eixoOriginal: item.eixo, x: pontoProjetado.x, y: pontoProjetado.y, profundidade: pontoProjetado.profundidade };
    }).filter((item): item is MarcadorProjetadoGizmoEixosEditor3D => item !== null);
    const eixosPorChave = obtemEixosPorChaveMarcadoresGizmoEditor3D(camera, marcadoresProjetados);

    return marcadoresProjetados.map(item => {
        const eixo = eixosPorChave.get(item.eixoOriginal) ?? item.eixoOriginal;

        return { chave: item.eixoOriginal, eixo, x: item.x, y: item.y, profundidade: item.profundidade, negativo: eixoGizmoEditor3DEhNegativo(eixo) };
    }).sort((a, b) => b.profundidade - a.profundidade);
};