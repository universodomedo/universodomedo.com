import { criaGeometriaObjetoEditor3D } from '../../geometria/primitivas/editor3D.geometria.primitivas';
import { criaMatrizTransformObjetoEditor3D } from '../../editor/editor3D.transform';
import { criaMatrizesCenaEditor3D } from '../editor3D.renderizador.matrizes';
import { multiplicaMatriz4 } from '../../editor/editor3D.matrizes';
import { obtemDimensoesLogicasCanvasEditor3D, type PontoCanvasEditor3D } from './editor3D.eventos.cursor';
import type { AreaSelecaoEditor3D, Editor3DState } from '../../estado/editor3D.estado.types';
import type { ControleEventosEditor3D } from './editor3D.eventos.types';
import type { FaceGeometriaEditor3D, TrianguloFaceEditor3D } from '../../geometria/editor3D.geometria.types';
import type { FaceSelecionadaEdicaoEditor3D } from '../../modoOperacao/editor3D.modoOperacao.tipos';
import type { ObjetoCenaEditor3D, Vetor3 } from '../../editor/editor3D.tipos';

interface PontoProjetadoEditor3D {
    readonly x: number;
    readonly y: number;
    readonly profundidade: number;
    readonly visivel: boolean;
};

interface RetanguloSelecaoEditor3D {
    readonly esquerda: number;
    readonly direita: number;
    readonly topo: number;
    readonly baixo: number;
    readonly largura: number;
    readonly altura: number;
    readonly centroX: number;
    readonly centroY: number;
};

interface ClipEditor3D {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly w: number;
};

const toleranciaSelecaoObjetoEditor3D = 12;
const tamanhoMinimoAreaSelecaoEditor3D = 5;

function multiplicaMatrizPorPontoEditor3D(matriz: Float32Array, ponto: Vetor3): ClipEditor3D { return { x: (matriz[0] * ponto[0]) + (matriz[4] * ponto[1]) + (matriz[8] * ponto[2]) + matriz[12], y: (matriz[1] * ponto[0]) + (matriz[5] * ponto[1]) + (matriz[9] * ponto[2]) + matriz[13], z: (matriz[2] * ponto[0]) + (matriz[6] * ponto[1]) + (matriz[10] * ponto[2]) + matriz[14], w: (matriz[3] * ponto[0]) + (matriz[7] * ponto[1]) + (matriz[11] * ponto[2]) + matriz[15] }; };

function objetoEstaOcultoEditor3D(state: Editor3DState, idObjeto: string): boolean { return state.idsObjetosOcultos.includes(idObjeto); };

function distanciaEntrePontosEditor3D(aX: number, aY: number, bX: number, bY: number): number {
    const deltaX = aX - bX;
    const deltaY = aY - bY;

    return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
};

function criaRetanguloSelecaoEditor3D(areaSelecao: AreaSelecaoEditor3D, fim: PontoCanvasEditor3D): RetanguloSelecaoEditor3D {
    const esquerda = Math.min(areaSelecao.inicioX, fim.x);
    const direita = Math.max(areaSelecao.inicioX, fim.x);
    const topo = Math.min(areaSelecao.inicioY, fim.y);
    const baixo = Math.max(areaSelecao.inicioY, fim.y);
    const largura = direita - esquerda;
    const altura = baixo - topo;

    return { esquerda, direita, topo, baixo, largura, altura, centroX: esquerda + (largura / 2), centroY: topo + (altura / 2) };
};

function criaRetanguloPorPontosEditor3D(pontos: readonly PontoProjetadoEditor3D[]): RetanguloSelecaoEditor3D | null {
    const pontosVisiveis = pontos.filter(ponto => ponto.visivel);

    if (pontosVisiveis.length === 0) return null;

    let esquerda = Number.POSITIVE_INFINITY;
    let direita = Number.NEGATIVE_INFINITY;
    let topo = Number.POSITIVE_INFINITY;
    let baixo = Number.NEGATIVE_INFINITY;

    pontosVisiveis.forEach(ponto => {
        esquerda = Math.min(esquerda, ponto.x);
        direita = Math.max(direita, ponto.x);
        topo = Math.min(topo, ponto.y);
        baixo = Math.max(baixo, ponto.y);
    });

    const largura = direita - esquerda;
    const altura = baixo - topo;

    return { esquerda, direita, topo, baixo, largura, altura, centroX: esquerda + (largura / 2), centroY: topo + (altura / 2) };
};

function retanguloEhClickEditor3D(retangulo: RetanguloSelecaoEditor3D): boolean { return retangulo.largura < tamanhoMinimoAreaSelecaoEditor3D && retangulo.altura < tamanhoMinimoAreaSelecaoEditor3D; };
function retangulosInterceptamEditor3D(a: RetanguloSelecaoEditor3D, b: RetanguloSelecaoEditor3D): boolean { return a.esquerda <= b.direita && a.direita >= b.esquerda && a.topo <= b.baixo && a.baixo >= b.topo; };

function distanciaPontoRetanguloEditor3D(ponto: PontoCanvasEditor3D, retangulo: RetanguloSelecaoEditor3D): number {
    const xMaisProximo = Math.max(retangulo.esquerda, Math.min(ponto.x, retangulo.direita));
    const yMaisProximo = Math.max(retangulo.topo, Math.min(ponto.y, retangulo.baixo));

    return distanciaEntrePontosEditor3D(ponto.x, ponto.y, xMaisProximo, yMaisProximo);
};

function criaPontosCaixaEditor3D(x: number, y: number, z: number): Vetor3[] { return [[-x, -y, -z], [x, -y, -z], [-x, y, -z], [x, y, -z], [-x, -y, z], [x, -y, z], [-x, y, z], [x, y, z], [0, 0, 0]]; };

function obtemPontosLimiteObjetoEditor3D(objeto: ObjetoCenaEditor3D): Vetor3[] {
    if (objeto.tipo === 'VERTICE') return [[0, 0, 0]];
    if (objeto.tipo === 'PLANO_2D') return [[-0.6, -0.6, 0], [0.6, -0.6, 0], [-0.6, 0.6, 0], [0.6, 0.6, 0], [0, 0, 0]];
    if (objeto.tipo === 'CIRCULO_2D') return [[-0.62, -0.62, 0], [0.62, -0.62, 0], [-0.62, 0.62, 0], [0.62, 0.62, 0], [0, 0, 0]];
    if (objeto.tipo === 'CUBO_3D') return criaPontosCaixaEditor3D(0.5, 0.5, 0.5);
    if (objeto.tipo === 'CILINDRO_3D') return criaPontosCaixaEditor3D(0.48, 0.48, 0.45);

    return criaPontosCaixaEditor3D(0.55, 0.55, 0.55);
};

function projetaPontoEditor3D(matrizFinal: Float32Array, dimensoes: { readonly largura: number; readonly altura: number }, ponto: Vetor3): PontoProjetadoEditor3D {
    const clip = multiplicaMatrizPorPontoEditor3D(matrizFinal, ponto);

    if (clip.w <= 0) return { x: 0, y: 0, profundidade: Number.POSITIVE_INFINITY, visivel: false };

    const ndcX = clip.x / clip.w;
    const ndcY = clip.y / clip.w;
    const ndcZ = clip.z / clip.w;

    return { x: ((ndcX + 1) / 2) * dimensoes.largura, y: ((1 - ndcY) / 2) * dimensoes.altura, profundidade: ndcZ, visivel: true };
};

function projetaRetanguloObjetoEditor3D(objeto: ObjetoCenaEditor3D, controle: ControleEventosEditor3D): RetanguloSelecaoEditor3D | null {
    const dimensoes = obtemDimensoesLogicasCanvasEditor3D(controle.canvas);
    const matrizes = criaMatrizesCenaEditor3D(controle.refs.estado.current.camera, dimensoes.largura, dimensoes.altura);
    const matrizObjeto = multiplicaMatriz4(matrizes.cena, criaMatrizTransformObjetoEditor3D(objeto));
    const matrizFinal = multiplicaMatriz4(matrizes.perspectiva, multiplicaMatriz4(matrizes.camera, matrizObjeto));
    const pontosProjetados = obtemPontosLimiteObjetoEditor3D(objeto).map(ponto => projetaPontoEditor3D(matrizFinal, dimensoes, ponto));

    return criaRetanguloPorPontosEditor3D(pontosProjetados);
};

function obtemIdObjetoSelecionadoPorClickEditor3D(controle: ControleEventosEditor3D, pontoMouse: PontoCanvasEditor3D): string | null {
    let idObjetoMaisProximo: string | null = null;
    let pontuacaoMaisProxima = Number.POSITIVE_INFINITY;

    controle.refs.estado.current.objetos.filter(objeto => !objetoEstaOcultoEditor3D(controle.refs.estado.current, objeto.id)).forEach(objeto => {
        const retanguloObjeto = projetaRetanguloObjetoEditor3D(objeto, controle);

        if (retanguloObjeto === null) return;

        const distancia = distanciaPontoRetanguloEditor3D(pontoMouse, retanguloObjeto);

        if (distancia > toleranciaSelecaoObjetoEditor3D) return;

        const distanciaCentro = distanciaEntrePontosEditor3D(pontoMouse.x, pontoMouse.y, retanguloObjeto.centroX, retanguloObjeto.centroY);
        const pontuacao = distancia + (distanciaCentro * 0.001);

        if (pontuacao >= pontuacaoMaisProxima) return;

        idObjetoMaisProximo = objeto.id;
        pontuacaoMaisProxima = pontuacao;
    });

    return idObjetoMaisProximo;
};

function obtemIdsObjetosSelecionadosPorAreaEditor3D(controle: ControleEventosEditor3D, retangulo: RetanguloSelecaoEditor3D): string[] {
    const objetosEncontrados = controle.refs.estado.current.objetos.filter(objeto => !objetoEstaOcultoEditor3D(controle.refs.estado.current, objeto.id)).map(objeto => ({ objeto, retangulo: projetaRetanguloObjetoEditor3D(objeto, controle) })).filter(item => item.retangulo !== null && retangulosInterceptamEditor3D(item.retangulo, retangulo));

    return objetosEncontrados.sort((a, b) => distanciaEntrePontosEditor3D(retangulo.centroX, retangulo.centroY, a.retangulo?.centroX ?? 0, a.retangulo?.centroY ?? 0) - distanciaEntrePontosEditor3D(retangulo.centroX, retangulo.centroY, b.retangulo?.centroX ?? 0, b.retangulo?.centroY ?? 0)).map(item => item.objeto.id);
};

function pontoEstaNoTrianguloProjetadoEditor3D(ponto: PontoCanvasEditor3D, a: PontoProjetadoEditor3D, b: PontoProjetadoEditor3D, c: PontoProjetadoEditor3D): boolean {
    const denominador = ((b.y - c.y) * (a.x - c.x)) + ((c.x - b.x) * (a.y - c.y));

    if (Math.abs(denominador) < 0.000001) return false;

    const pesoA = (((b.y - c.y) * (ponto.x - c.x)) + ((c.x - b.x) * (ponto.y - c.y))) / denominador;
    const pesoB = (((c.y - a.y) * (ponto.x - c.x)) + ((a.x - c.x) * (ponto.y - c.y))) / denominador;
    const pesoC = 1 - pesoA - pesoB;

    return pesoA >= -0.001 && pesoB >= -0.001 && pesoC >= -0.001;
};

function calculaProfundidadeTrianguloProjetadoEditor3D(a: PontoProjetadoEditor3D, b: PontoProjetadoEditor3D, c: PontoProjetadoEditor3D): number { return (a.profundidade + b.profundidade + c.profundidade) / 3; };

function pontoSelecionaTrianguloFaceEditor3D(matrizFinal: Float32Array, dimensoes: { readonly largura: number; readonly altura: number }, pontoMouse: PontoCanvasEditor3D, triangulo: TrianguloFaceEditor3D): number | null {
    const a = projetaPontoEditor3D(matrizFinal, dimensoes, triangulo[0]);
    const b = projetaPontoEditor3D(matrizFinal, dimensoes, triangulo[1]);
    const c = projetaPontoEditor3D(matrizFinal, dimensoes, triangulo[2]);

    if (!a.visivel || !b.visivel || !c.visivel) return null;
    if (!pontoEstaNoTrianguloProjetadoEditor3D(pontoMouse, a, b, c)) return null;

    return calculaProfundidadeTrianguloProjetadoEditor3D(a, b, c);
};

function calculaPontuacaoSelecaoFaceEditor3D(matrizFinal: Float32Array, dimensoes: { readonly largura: number; readonly altura: number }, pontoMouse: PontoCanvasEditor3D, face: FaceGeometriaEditor3D): number | null {
    let melhorProfundidade = Number.POSITIVE_INFINITY;

    face.triangulos.forEach(triangulo => {
        const profundidade = pontoSelecionaTrianguloFaceEditor3D(matrizFinal, dimensoes, pontoMouse, triangulo);

        if (profundidade === null || profundidade >= melhorProfundidade) return;

        melhorProfundidade = profundidade;
    });

    return melhorProfundidade === Number.POSITIVE_INFINITY ? null : melhorProfundidade;
};

function obtemFaceSelecionadaPorClickEditor3D(controle: ControleEventosEditor3D, pontoMouse: PontoCanvasEditor3D): FaceSelecionadaEdicaoEditor3D | null {
    const state = controle.refs.estado.current;
    const idsEscopo = state.escopoEdicao?.idsObjetos ?? [];
    const dimensoes = obtemDimensoesLogicasCanvasEditor3D(controle.canvas);
    const matrizes = criaMatrizesCenaEditor3D(state.camera, dimensoes.largura, dimensoes.altura);
    let faceSelecionada: FaceSelecionadaEdicaoEditor3D | null = null;
    let melhorProfundidade = Number.POSITIVE_INFINITY;

    state.objetos.filter(objeto => idsEscopo.includes(objeto.id) && !objetoEstaOcultoEditor3D(state, objeto.id)).forEach(objeto => {
        const geometria = criaGeometriaObjetoEditor3D(objeto);
        const matrizObjeto = multiplicaMatriz4(matrizes.cena, criaMatrizTransformObjetoEditor3D(objeto));
        const matrizFinal = multiplicaMatriz4(matrizes.perspectiva, multiplicaMatriz4(matrizes.camera, matrizObjeto));

        geometria.faces.forEach(face => {
            const profundidade = calculaPontuacaoSelecaoFaceEditor3D(matrizFinal, dimensoes, pontoMouse, face);

            if (profundidade === null || profundidade >= melhorProfundidade) return;

            faceSelecionada = { idObjeto: objeto.id, idFace: face.id };
            melhorProfundidade = profundidade;
        });
    });

    return faceSelecionada;
};

export function selecionaObjetoPorAreaEditor3D(controle: ControleEventosEditor3D, fim: PontoCanvasEditor3D, adiciona: boolean): void {
    const areaSelecao = controle.refs.estado.current.areaSelecao;

    if (areaSelecao === null) return;

    const retangulo = criaRetanguloSelecaoEditor3D(areaSelecao, fim);

    if (retanguloEhClickEditor3D(retangulo)) {
        controle.refs.acoes.current.selecionaObjeto(obtemIdObjetoSelecionadoPorClickEditor3D(controle, fim), adiciona);

        return;
    }

    controle.refs.acoes.current.selecionaObjetos(obtemIdsObjetosSelecionadosPorAreaEditor3D(controle, retangulo), adiciona);
};

export function selecionaFacePorClickEditor3D(controle: ControleEventosEditor3D, pontoMouse: PontoCanvasEditor3D): void {
    const faceSelecionada = obtemFaceSelecionadaPorClickEditor3D(controle, pontoMouse);

    controle.refs.acoes.current.selecionaFaceEdicao(faceSelecionada?.idObjeto ?? null, faceSelecionada?.idFace ?? null);
};