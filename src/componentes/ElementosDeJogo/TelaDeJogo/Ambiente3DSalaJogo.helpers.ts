import { criaMatrizIdentidadeEditor3D } from 'Componentes/ElementosDeInteratividade3D/editor/editor3D.matrizes';
import { criaEstadoInicialEditor3D } from 'Componentes/ElementosDeInteratividade3D/estado/editor3D.estado.inicial';
import type { DocumentoCena3DPrototipo, ObjetoCena3DPrototipo, Vetor3Cena3DPrototipo } from 'Funcionalidades/Cena3DPrototipo/cena3DPrototipo.types';
import type { Editor3DState } from 'Componentes/ElementosDeInteratividade3D/estado/editor3D.estado.types';
import type { ObjetoCenaEditor3D, Vetor3 } from 'Componentes/ElementosDeInteratividade3D/editor/editor3D.tipos';

interface CaixaHorizontalAmbiente3DSalaJogo {
    readonly centroX: number;
    readonly centroY: number;
    readonly extensao: number;
};

function clonaVetor3Ambiente3DSalaJogo(vetor: Vetor3Cena3DPrototipo): Vetor3 { return [vetor[0], vetor[1], vetor[2]]; };
function deslocaVetor3Ambiente3DSalaJogo(vetor: Vetor3Cena3DPrototipo, caixa: CaixaHorizontalAmbiente3DSalaJogo): Vetor3 { return [vetor[0] - caixa.centroX, vetor[1] - caixa.centroY, vetor[2]]; };
function criaMatrizBaseAmbiente3DSalaJogo(objeto: ObjetoCena3DPrototipo): Float32Array { return objeto.transform.matrizBase.length === 16 ? new Float32Array(objeto.transform.matrizBase) : criaMatrizIdentidadeEditor3D(); };

function calculaCaixaHorizontalAmbiente3DSalaJogo(documento: DocumentoCena3DPrototipo): CaixaHorizontalAmbiente3DSalaJogo {
    const objetosVisiveis = documento.objetos.filter(objeto => objeto.visivel);

    if (objetosVisiveis.length === 0) return { centroX: 0, centroY: 0, extensao: 1 };

    let minimoX = Number.POSITIVE_INFINITY;
    let maximoX = Number.NEGATIVE_INFINITY;
    let minimoY = Number.POSITIVE_INFINITY;
    let maximoY = Number.NEGATIVE_INFINITY;

    objetosVisiveis.forEach(objeto => {
        const posicao = objeto.transform.posicao;
        const escala = objeto.transform.escala;
        const metadeX = Math.max(0.05, Math.abs(escala[0]) / 2);
        const metadeY = Math.max(0.05, Math.abs(escala[1]) / 2);

        minimoX = Math.min(minimoX, posicao[0] - metadeX);
        maximoX = Math.max(maximoX, posicao[0] + metadeX);
        minimoY = Math.min(minimoY, posicao[1] - metadeY);
        maximoY = Math.max(maximoY, posicao[1] + metadeY);
    });

    const largura = Math.max(1, maximoX - minimoX);
    const altura = Math.max(1, maximoY - minimoY);

    return { centroX: (minimoX + maximoX) / 2, centroY: (minimoY + maximoY) / 2, extensao: Math.max(largura, altura) };
};

function calculaZoomAmbiente3DSalaJogo(caixa: CaixaHorizontalAmbiente3DSalaJogo): number {
    const distancia = Math.max(6, caixa.extensao * 1.32);

    return 4 / distancia;
};

function criaObjetoEditor3DAmbiente3DSalaJogo(objeto: ObjetoCena3DPrototipo, caixa: CaixaHorizontalAmbiente3DSalaJogo, indice: number): ObjetoCenaEditor3D {
    return {
        id: objeto.id,
        nome: objeto.nome,
        tipo: objeto.tipo,
        quantidadeVertices: objeto.quantidadeVertices,
        posicao: deslocaVetor3Ambiente3DSalaJogo(objeto.transform.posicao, caixa),
        rotacao: clonaVetor3Ambiente3DSalaJogo(objeto.transform.rotacao),
        escala: clonaVetor3Ambiente3DSalaJogo(objeto.transform.escala),
        matrizBase: criaMatrizBaseAmbiente3DSalaJogo(objeto),
        malhaEditavel: null,
        versaoGeometria: indice + 1,
        corBase: clonaVetor3Ambiente3DSalaJogo(objeto.material.corBase),
        corLuz: clonaVetor3Ambiente3DSalaJogo(objeto.material.corLuz),
        materialVisual: null,
        shader: 'PADRAO',
    };
};

export function criaEstadoAmbiente3DParaSalaJogo(documento: DocumentoCena3DPrototipo): Editor3DState {
    const estadoInicial = criaEstadoInicialEditor3D();
    const caixa = calculaCaixaHorizontalAmbiente3DSalaJogo(documento);
    const idsObjetosOcultos = documento.objetos.filter(objeto => !objeto.visivel).map(objeto => objeto.id);

    return {
        ...estadoInicial,
        objetos: documento.objetos.map((objeto, indice) => criaObjetoEditor3DAmbiente3DSalaJogo(objeto, caixa, indice)),
        idsObjetosOcultos,
        idsObjetosOcultosManualmente: idsObjetosOcultos,
        modoVisualizacaoViewport: 'RENDERIZADO',
        visualizacaoXRayAtiva: false,
        camera: { ...estadoInicial.camera, deslocamentoX: 0, deslocamentoY: 0, zoom: calculaZoomAmbiente3DSalaJogo(caixa) },
    };
};

export function criaAssinaturaAmbiente3DSalaJogo(documento: DocumentoCena3DPrototipo): string {
    return documento.objetos.map(objeto => `${objeto.id}:${objeto.tipo}:${objeto.quantidadeVertices}:${objeto.visivel ? '1' : '0'}:${objeto.transform.posicao.join(',')}:${objeto.transform.rotacao.join(',')}:${objeto.transform.escala.join(',')}:${objeto.material.corBase.join(',')}:${objeto.material.corLuz.join(',')}`).join('|');
};
