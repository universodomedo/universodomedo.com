import { criaMatrizRotacaoX, criaMatrizRotacaoZ, multiplicaMatriz4 } from './editor3D.matrizes';
import type { EixoEditor3D } from './editor3D.tipos';

export type DirecaoAjusteVistaEditor3D = 'DIREITA' | 'ESQUERDA' | 'CIMA' | 'BAIXO';
export type ModoArrasteEditor3D = 'ROTACIONAR' | 'PAN' | 'DOLLY' | 'AJUSTAR_VISTA' | 'AREA_SELECAO' | 'EDICAO_MALHA' | 'INSET_FACE';
export type PlanoGuiaEditor3D = 'XY' | 'XZ' | 'YZ';
export type EspacoMovimentoGrabEditor3D = PlanoGuiaEditor3D | 'XYZ';
export type ResetAbsolutoVistaEditor3D = 'X' | 'Y' | 'Z' | '-X' | '-Y' | '-Z';

export interface CameraEditor3D {
    readonly rotacaoX: number;
    readonly rotacaoY: number;
    readonly rotacaoTela: number;
    readonly matrizCena: Float32Array;
    readonly deslocamentoX: number;
    readonly deslocamentoY: number;
    readonly zoom: number;
    readonly planoGuia: PlanoGuiaEditor3D;
    readonly espacoMovimentoGrab: EspacoMovimentoGrabEditor3D;
};

export interface EstadoArrasteCameraEditor3D {
    arrastando: boolean;
    modoArraste: ModoArrasteEditor3D;
    botao: number | null;
    inicioX: number;
    inicioY: number;
    ultimoX: number;
    ultimoY: number;
    movimentoAcumulado: number;
    direcaoAjusteVista: DirecaoAjusteVistaEditor3D | null;
    acumuladoAjusteVista: number;
    ajusteVistaAplicado: boolean;
    animacaoCameraFrameId: number | null;
    finalizandoModoComPointerLock: boolean;
};

interface OrientacaoCanonicaCameraEditor3D {
    readonly camera: CameraEditor3D;
    readonly matrizCena: Float32Array;
};

type VetorCameraEditor3D = readonly [number, number, number];

const rotacaoXPerspectivaPadraoCameraEditor3D = -Math.PI / 3;
const rotacaoYPerspectivaPadraoCameraEditor3D = -Math.PI / 4;
const quartoDeVoltaCameraEditor3D = Math.PI / 2;
const sensibilidadeOrbitCameraEditor3D = 0.008;
const margemPitchTurntableCameraEditor3D = 0.001;

function limitaValor(valor: number, minimo: number, maximo: number): number { return Math.min(maximo, Math.max(minimo, valor)); };
function interpolaValorCameraEditor3D(origem: number, destino: number, progresso: number): number { return origem + ((destino - origem) * progresso); };
function suavizaProgressoCameraEditor3D(progresso: number): number { return 1 - Math.pow(1 - progresso, 3); };

function normalizaAnguloCameraEditor3D(angulo: number): number {
    let anguloNormalizado = angulo;

    while (anguloNormalizado <= -Math.PI) anguloNormalizado += Math.PI * 2;
    while (anguloNormalizado > Math.PI) anguloNormalizado -= Math.PI * 2;

    return anguloNormalizado;
};

function limitaPitchTurntableCameraEditor3D(rotacaoX: number): number {
    let rotacaoNormalizada = normalizaAnguloCameraEditor3D(rotacaoX);

    if (rotacaoNormalizada > 0) rotacaoNormalizada -= Math.PI * 2;

    return limitaValor(rotacaoNormalizada, -Math.PI + margemPitchTurntableCameraEditor3D, -margemPitchTurntableCameraEditor3D);
};

function interpolaAnguloCameraEditor3D(origem: number, destino: number, progresso: number): number { return origem + (normalizaAnguloCameraEditor3D(destino - origem) * progresso); };
function produtoEscalarVetorCameraEditor3D(a: VetorCameraEditor3D, b: VetorCameraEditor3D): number { return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]); };
function subtraiVetoresCameraEditor3D(a: VetorCameraEditor3D, b: VetorCameraEditor3D): VetorCameraEditor3D { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; };
function multiplicaVetorCameraEditor3D(vetor: VetorCameraEditor3D, multiplicador: number): VetorCameraEditor3D { return [vetor[0] * multiplicador, vetor[1] * multiplicador, vetor[2] * multiplicador]; };
function produtoVetorialCameraEditor3D(a: VetorCameraEditor3D, b: VetorCameraEditor3D): VetorCameraEditor3D { return [(a[1] * b[2]) - (a[2] * b[1]), (a[2] * b[0]) - (a[0] * b[2]), (a[0] * b[1]) - (a[1] * b[0])]; };

function normalizaVetorCameraEditor3D(vetor: VetorCameraEditor3D, fallback: VetorCameraEditor3D): VetorCameraEditor3D {
    const tamanho = Math.sqrt((vetor[0] * vetor[0]) + (vetor[1] * vetor[1]) + (vetor[2] * vetor[2]));

    if (tamanho <= 0.00001) return fallback;

    return [vetor[0] / tamanho, vetor[1] / tamanho, vetor[2] / tamanho];
};

function criaMatrizCenaEulerCameraEditor3D(rotacaoX: number, rotacaoY: number, rotacaoTela: number): Float32Array { return multiplicaMatriz4(criaMatrizRotacaoZ(rotacaoTela), multiplicaMatriz4(criaMatrizRotacaoX(rotacaoX), criaMatrizRotacaoZ(rotacaoY))); };

function normalizaMatrizRotacaoCameraEditor3D(matriz: Float32Array): Float32Array {
    const xInicial: VetorCameraEditor3D = [matriz[0], matriz[1], matriz[2]];
    const yInicial: VetorCameraEditor3D = [matriz[4], matriz[5], matriz[6]];
    const x = normalizaVetorCameraEditor3D(xInicial, [1, 0, 0]);
    const ySemX = subtraiVetoresCameraEditor3D(yInicial, multiplicaVetorCameraEditor3D(x, produtoEscalarVetorCameraEditor3D(yInicial, x)));
    const y = normalizaVetorCameraEditor3D(ySemX, [0, 1, 0]);
    const z = normalizaVetorCameraEditor3D(produtoVetorialCameraEditor3D(x, y), [0, 0, 1]);

    return new Float32Array([x[0], x[1], x[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, 0, 0, 0, 1]);
};

function interpolaMatrizCenaCameraEditor3D(origem: Float32Array, destino: Float32Array, progresso: number): Float32Array {
    const matriz = new Float32Array(16);

    for (let indice = 0; indice < 16; indice++) matriz[indice] = interpolaValorCameraEditor3D(origem[indice], destino[indice], progresso);

    matriz[3] = 0;
    matriz[7] = 0;
    matriz[11] = 0;
    matriz[12] = 0;
    matriz[13] = 0;
    matriz[14] = 0;
    matriz[15] = 1;

    return normalizaMatrizRotacaoCameraEditor3D(matriz);
};

function criaCameraEditor3D(rotacaoX: number, rotacaoY: number, rotacaoTela: number, planoGuia: PlanoGuiaEditor3D, espacoMovimentoGrab: EspacoMovimentoGrabEditor3D, cameraBase?: CameraEditor3D): CameraEditor3D {
    return { rotacaoX, rotacaoY, rotacaoTela, matrizCena: criaMatrizCenaEulerCameraEditor3D(rotacaoX, rotacaoY, rotacaoTela), deslocamentoX: cameraBase?.deslocamentoX ?? 0, deslocamentoY: cameraBase?.deslocamentoY ?? 0, zoom: cameraBase?.zoom ?? 1, planoGuia, espacoMovimentoGrab };
};

function criaCameraComMatrizCenaEditor3D(camera: CameraEditor3D, matrizCena: Float32Array): CameraEditor3D { return { ...camera, matrizCena: normalizaMatrizRotacaoCameraEditor3D(matrizCena), planoGuia: 'XY', espacoMovimentoGrab: 'XYZ' }; };

export function criaMatrizCenaCameraEditor3D(camera: CameraEditor3D): Float32Array { return camera.matrizCena; };

function calculaDistanciaMatrizesCameraEditor3D(a: Float32Array, b: Float32Array): number {
    const indices = [0, 1, 2, 4, 5, 6, 8, 9, 10];

    return indices.reduce((total, indice) => total + ((a[indice] - b[indice]) * (a[indice] - b[indice])), 0);
};

function criaOrientacoesCanonicasCameraEditor3D(cameraBase: CameraEditor3D): OrientacaoCanonicaCameraEditor3D[] {
    const bases: readonly CameraEditor3D[] = [
        aplicaVistaLateralCameraEditor3D(cameraBase),
        aplicaVistaNegativaXCameraEditor3D(cameraBase),
        aplicaVistaFrenteCameraEditor3D(cameraBase),
        aplicaVistaNegativaYCameraEditor3D(cameraBase),
        aplicaVistaTopoCameraEditor3D(cameraBase),
        aplicaVistaNegativaZCameraEditor3D(cameraBase),
    ];

    return bases.map(camera => ({ camera, matrizCena: camera.matrizCena }));
};

function obtemOrientacaoCanonicaMaisProximaCameraEditor3D(cameraBase: CameraEditor3D, matrizAlvo: Float32Array): CameraEditor3D {
    const orientacoes = criaOrientacoesCanonicasCameraEditor3D(cameraBase);
    const orientacaoMaisProxima = orientacoes.reduce((melhor, atual) => calculaDistanciaMatrizesCameraEditor3D(matrizAlvo, atual.matrizCena) < calculaDistanciaMatrizesCameraEditor3D(matrizAlvo, melhor.matrizCena) ? atual : melhor, orientacoes[0]);

    return orientacaoMaisProxima.camera;
};

function criaMatrizAjusteVistaPorDirecaoEditor3D(direcao: DirecaoAjusteVistaEditor3D): Float32Array {
    if (direcao === 'DIREITA') return criaMatrizRotacaoZ(quartoDeVoltaCameraEditor3D);
    if (direcao === 'ESQUERDA') return criaMatrizRotacaoZ(-quartoDeVoltaCameraEditor3D);
    if (direcao === 'BAIXO') return criaMatrizRotacaoX(quartoDeVoltaCameraEditor3D);

    return criaMatrizRotacaoX(-quartoDeVoltaCameraEditor3D);
};

export function criaCameraPadraoEditor3D(): CameraEditor3D { return criaCameraEditor3D(rotacaoXPerspectivaPadraoCameraEditor3D, rotacaoYPerspectivaPadraoCameraEditor3D, 0, 'XY', 'XYZ'); };

export function criaEstadoArrasteCameraEditor3D(): EstadoArrasteCameraEditor3D { return { arrastando: false, modoArraste: 'ROTACIONAR', botao: null, inicioX: 0, inicioY: 0, ultimoX: 0, ultimoY: 0, movimentoAcumulado: 0, direcaoAjusteVista: null, acumuladoAjusteVista: 0, ajusteVistaAplicado: false, animacaoCameraFrameId: null, finalizandoModoComPointerLock: false }; };

export function aplicaRotacaoCameraEditor3D(camera: CameraEditor3D, deltaX: number, deltaY: number): CameraEditor3D {
    const rotacaoX = limitaPitchTurntableCameraEditor3D(camera.rotacaoX + (deltaY * sensibilidadeOrbitCameraEditor3D));
    const rotacaoY = normalizaAnguloCameraEditor3D(camera.rotacaoY + (deltaX * sensibilidadeOrbitCameraEditor3D));

    return criaCameraEditor3D(rotacaoX, rotacaoY, 0, 'XY', 'XYZ', camera);
};

export function aplicaPanCameraEditor3D(camera: CameraEditor3D, deltaX: number, deltaY: number, largura: number, altura: number): CameraEditor3D { return { ...camera, deslocamentoX: camera.deslocamentoX + ((deltaX / largura) * (3 / camera.zoom)), deslocamentoY: camera.deslocamentoY - ((deltaY / altura) * (3 / camera.zoom)) }; };

export function obtemDistanciaCameraEditor3D(camera: CameraEditor3D): number { return 4 / camera.zoom; };

export function aplicaDollyCameraEditor3D(camera: CameraEditor3D, deltaY: number): CameraEditor3D {
    const distanciaAtual = obtemDistanciaCameraEditor3D(camera);
    const proximaDistancia = limitaValor(distanciaAtual + (deltaY * 0.018), 1.35, 9.5);

    return { ...camera, zoom: 4 / proximaDistancia };
};

export function aplicaVistaTopoCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return criaCameraEditor3D(0, 0, 0, 'XY', 'XY', camera); };

export function aplicaVistaFrenteCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return criaCameraEditor3D(-Math.PI / 2, 0, 0, 'XZ', 'XZ', camera); };

export function aplicaVistaLateralCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return criaCameraEditor3D(-Math.PI / 2, -Math.PI / 2, 0, 'YZ', 'YZ', camera); };

export function aplicaVistaPerspectivaCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return criaCameraEditor3D(rotacaoXPerspectivaPadraoCameraEditor3D, rotacaoYPerspectivaPadraoCameraEditor3D, 0, 'XY', 'XYZ', camera); };

export function aplicaVistaNegativaXCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return criaCameraEditor3D(-Math.PI / 2, Math.PI / 2, 0, 'YZ', 'YZ', camera); };

export function aplicaVistaNegativaYCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return criaCameraEditor3D(-Math.PI / 2, Math.PI, 0, 'XZ', 'XZ', camera); };

export function aplicaVistaNegativaZCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return criaCameraEditor3D(Math.PI, 0, 0, 'XY', 'XY', camera); };

export function aplicaResetAbsolutoVistaCameraEditor3D(camera: CameraEditor3D, vista: ResetAbsolutoVistaEditor3D): CameraEditor3D {
    if (vista === 'X') return aplicaVistaLateralCameraEditor3D(camera);
    if (vista === 'Y') return aplicaVistaFrenteCameraEditor3D(camera);
    if (vista === 'Z') return aplicaVistaTopoCameraEditor3D(camera);
    if (vista === '-X') return aplicaVistaNegativaXCameraEditor3D(camera);
    if (vista === '-Y') return aplicaVistaNegativaYCameraEditor3D(camera);

    return aplicaVistaNegativaZCameraEditor3D(camera);
};

export function obtemCameraAjusteVistaPorDirecaoEditor3D(camera: CameraEditor3D, direcao: DirecaoAjusteVistaEditor3D): CameraEditor3D {
    const ajuste = criaMatrizAjusteVistaPorDirecaoEditor3D(direcao);
    const matrizAlvo = multiplicaMatriz4(ajuste, camera.matrizCena);

    return obtemOrientacaoCanonicaMaisProximaCameraEditor3D(camera, matrizAlvo);
};

export function interpolaCameraEditor3D(origem: CameraEditor3D, destino: CameraEditor3D, progresso: number): CameraEditor3D {
    if (progresso >= 1) return destino;

    const progressoSuavizado = suavizaProgressoCameraEditor3D(limitaValor(progresso, 0, 1));

    return { ...origem, rotacaoX: interpolaAnguloCameraEditor3D(origem.rotacaoX, destino.rotacaoX, progressoSuavizado), rotacaoY: interpolaAnguloCameraEditor3D(origem.rotacaoY, destino.rotacaoY, progressoSuavizado), rotacaoTela: interpolaAnguloCameraEditor3D(origem.rotacaoTela, destino.rotacaoTela, progressoSuavizado), matrizCena: interpolaMatrizCenaCameraEditor3D(origem.matrizCena, destino.matrizCena, progressoSuavizado), deslocamentoX: interpolaValorCameraEditor3D(origem.deslocamentoX, destino.deslocamentoX, progressoSuavizado), deslocamentoY: interpolaValorCameraEditor3D(origem.deslocamentoY, destino.deslocamentoY, progressoSuavizado), zoom: interpolaValorCameraEditor3D(origem.zoom, destino.zoom, progressoSuavizado) };
};

export function aplicaVistaEixoGrabCameraEditor3D(camera: CameraEditor3D, eixo: EixoEditor3D): CameraEditor3D {
    if (eixo === 'Z') return aplicaVistaFrenteCameraEditor3D(camera);

    return aplicaVistaTopoCameraEditor3D(camera);
};

export function aplicaVistaEixoRotateCameraEditor3D(camera: CameraEditor3D, eixo: EixoEditor3D): CameraEditor3D {
    if (eixo === 'X') return aplicaVistaLateralCameraEditor3D(camera);
    if (eixo === 'Y') return aplicaVistaFrenteCameraEditor3D(camera);

    return aplicaVistaTopoCameraEditor3D(camera);
};
