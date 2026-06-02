import { aplicaMatrizesEditor3D, desenhaMalhaComMaterialEditor3D, desenhaMalhaEditor3D } from '../webgl/editor3D.webgl.renderizacao';
import { criaMatrizTransformObjetoEditor3D } from '../editor/editor3D.transform';
import { criaMaterialNormalsEditor3D, criaMaterialSemIluminacaoEditor3D } from '../webgl/editor3D.webgl.material';
import { desenhaArestasEdicaoEditor3D, desenhaArestasSelecaoObjetoEditor3D, desenhaFaceSelecionadaEditor3D, desenhaSelecaoObjetoEditor3D, desenhaVerticesEdicaoEditor3D } from './selecao/editor3D.selecao.render';
import { multiplicaMatriz4 } from '../editor/editor3D.matrizes';
import type { Editor3DState } from '../estado/editor3D.estado.types';
import type { FaceRenderizadaEditor3D, MalhaRenderizadaEditor3D } from './editor3D.renderizador.types';
import type { MatrizesCenaEditor3D } from './editor3D.renderizador.matrizes';
import type { ObjetoCenaEditor3D, Vetor3 } from '../editor/editor3D.tipos';
import type { RecursosRenderizadorEditor3D } from './editor3D.renderizador.types';

interface CoresObjetoVisualizacaoViewportEditor3D {
    readonly corBase: Vetor3;
    readonly corLuz: Vetor3;
};

const corBaseSolidoVisualizacaoViewportEditor3D: Vetor3 = [0.48, 0.5, 0.54];
const corLuzSolidoVisualizacaoViewportEditor3D: Vetor3 = [0.9, 0.92, 0.98];
const alphaSolidoXRayEditor3D = 0.42;
const alphaArestasEstruturaXRayEditor3D = 0.68;

function obtemObjetoAtual(state: Editor3DState, idObjeto: string): ObjetoCenaEditor3D | null {
    if (state.malhaEmCriacao !== null && state.malhaEmCriacao.id === idObjeto) return state.malhaEmCriacao;

    return state.objetos.find(objeto => objeto.id === idObjeto) ?? null;
};

function objetoEstaOcultoEditor3D(state: Editor3DState, idObjeto: string): boolean { return state.idsObjetosOcultos.includes(idObjeto); };

function objetoEstaEmModoEditor3D(state: Editor3DState, idObjeto: string): boolean {
    if (state.modoAtual.tipo === 'NENHUM') return false;

    return state.modoAtual.idsObjetos.includes(idObjeto);
};

function obtemFacesDestacadasRenderizadasEditor3D(state: Editor3DState, malha: MalhaRenderizadaEditor3D): FaceRenderizadaEditor3D[] {
    const bevelEdicao = state.bevelEdicao;

    if (bevelEdicao !== null && bevelEdicao.idObjeto === malha.idObjeto) return malha.faces.filter(face => bevelEdicao.idsFacesBevel.includes(face.idFace));

    const faceSelecionada = state.faceSelecionadaEdicao;

    if (faceSelecionada === null || faceSelecionada.idObjeto !== malha.idObjeto) return [];

    const face = malha.faces.find(faceAtual => faceAtual.idFace === faceSelecionada.idFace) ?? null;

    return face === null ? [] : [face];
};

function objetoEstaNoEscopoEdicaoEditor3D(state: Editor3DState, idObjeto: string): boolean { return state.modoOperacao === 'EDICAO' && (state.escopoEdicao?.idsObjetos.includes(idObjeto) ?? false); };

function limitaComponenteCorEditor3D(valor: number): number { return Math.max(0, Math.min(1, valor)); };

function intensificaCorLuzRenderizadoEditor3D(corLuz: Vetor3): Vetor3 { return [limitaComponenteCorEditor3D((corLuz[0] * 1.08) + 0.04), limitaComponenteCorEditor3D((corLuz[1] * 1.08) + 0.04), limitaComponenteCorEditor3D((corLuz[2] * 1.08) + 0.04)]; };

function obtemCoresObjetoVisualizacaoViewportEditor3D(state: Editor3DState, objeto: ObjetoCenaEditor3D): CoresObjetoVisualizacaoViewportEditor3D {
    if (state.modoVisualizacaoViewport === 'SOLIDO' && objeto.materialVisual === null) return { corBase: corBaseSolidoVisualizacaoViewportEditor3D, corLuz: corLuzSolidoVisualizacaoViewportEditor3D };
    if (state.modoVisualizacaoViewport === 'RENDERIZADO') return { corBase: objeto.corBase, corLuz: intensificaCorLuzRenderizadoEditor3D(objeto.corLuz) };

    return { corBase: objeto.corBase, corLuz: objeto.corLuz };
};

function deveDesenharMalhaPreenchidaEditor3D(state: Editor3DState): boolean { return state.modoVisualizacaoViewport !== 'ESTRUTURA'; };

function deveDesenharArestasEditor3D(state: Editor3DState, idObjeto: string): boolean { return state.modoVisualizacaoViewport === 'ESTRUTURA' || objetoEstaNoEscopoEdicaoEditor3D(state, idObjeto); };

function visualizacaoEstruturaEstaAtivaEditor3D(state: Editor3DState): boolean { return state.modoVisualizacaoViewport === 'ESTRUTURA'; };

function visualizacaoXRayEstaAtivaEditor3D(state: Editor3DState): boolean { return state.visualizacaoXRayAtiva && (state.modoVisualizacaoViewport === 'SOLIDO' || state.modoVisualizacaoViewport === 'ESTRUTURA'); };

function obtemAlphaMalhaPreenchidaEditor3D(state: Editor3DState): number { return visualizacaoXRayEstaAtivaEditor3D(state) && state.modoVisualizacaoViewport === 'SOLIDO' ? alphaSolidoXRayEditor3D : 1; };

function obtemAlphaArestasEditor3D(state: Editor3DState): number { return visualizacaoXRayEstaAtivaEditor3D(state) && state.modoVisualizacaoViewport === 'ESTRUTURA' ? alphaArestasEstruturaXRayEditor3D : 0.9; };

function deveIgnorarProfundidadeArestasEditor3D(state: Editor3DState): boolean { return visualizacaoXRayEstaAtivaEditor3D(state) && state.modoVisualizacaoViewport === 'ESTRUTURA'; };

function desenhaMalhaPrincipalEditor3D(gl: WebGLRenderingContext, recursos: RecursosRenderizadorEditor3D, objeto: ObjetoCenaEditor3D, malha: MalhaRenderizadaEditor3D, cores: CoresObjetoVisualizacaoViewportEditor3D, alpha: number): void {
    switch (objeto.shader) {
        case 'PADRAO':
            desenhaMalhaEditor3D(gl, recursos.programa, malha.buffers, malha.geometria, cores.corBase, cores.corLuz, alpha);
            break;
        case 'SEM_ILUMINACAO':
            desenhaMalhaComMaterialEditor3D(gl, recursos.programa, malha.buffers, malha.geometria, criaMaterialSemIluminacaoEditor3D(cores.corBase, cores.corLuz, alpha));
            break;
        case 'NORMALS':
            desenhaMalhaComMaterialEditor3D(gl, recursos.programa, malha.buffers, malha.geometria, criaMaterialNormalsEditor3D(cores.corBase, cores.corLuz, alpha));
            break;
        default:
            const shaderNaoConfigurado: never = objeto.shader;

            throw new Error(`Shader do objeto do Editor 3D sem renderizacao configurada: ${shaderNaoConfigurado}`);
    }
};

function desenhaMalhaPreenchidaViewportEditor3D(gl: WebGLRenderingContext, recursos: RecursosRenderizadorEditor3D, objeto: ObjetoCenaEditor3D, malha: MalhaRenderizadaEditor3D, matrizFinal: Float32Array, matrizObjeto: Float32Array, cores: CoresObjetoVisualizacaoViewportEditor3D, alpha: number): void {
    if (alpha >= 1) {
        aplicaMatrizesEditor3D(gl, recursos.programa, matrizFinal, matrizObjeto);
        desenhaMalhaPrincipalEditor3D(gl, recursos, objeto, malha, cores, 1);

        return;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);
    aplicaMatrizesEditor3D(gl, recursos.programa, matrizFinal, matrizObjeto);
    desenhaMalhaPrincipalEditor3D(gl, recursos, objeto, malha, cores, alpha);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
};

export function desenhaObjetosCenaEditor3D(gl: WebGLRenderingContext, recursos: RecursosRenderizadorEditor3D, state: Editor3DState, matrizes: MatrizesCenaEditor3D): void {
    recursos.malhas.forEach(malha => {
        if (objetoEstaOcultoEditor3D(state, malha.idObjeto)) return;

        const objetoAtual = obtemObjetoAtual(state, malha.idObjeto);

        if (objetoAtual === null) return;

        const matrizObjeto = multiplicaMatriz4(matrizes.cena, criaMatrizTransformObjetoEditor3D(objetoAtual));
        const matrizFinal = multiplicaMatriz4(matrizes.perspectiva, multiplicaMatriz4(matrizes.camera, matrizObjeto));
        const objetoSelecionado = state.idsObjetosSelecionados.includes(malha.idObjeto);
        const objetoEmModo = objetoEstaEmModoEditor3D(state, malha.idObjeto);
        const facesDestacadas = obtemFacesDestacadasRenderizadasEditor3D(state, malha);
        const coresVisualizacao = obtemCoresObjetoVisualizacaoViewportEditor3D(state, objetoAtual);
        const alphaMalhaPreenchida = obtemAlphaMalhaPreenchidaEditor3D(state);

        if (objetoSelecionado && !visualizacaoEstruturaEstaAtivaEditor3D(state) && alphaMalhaPreenchida >= 1) desenhaSelecaoObjetoEditor3D(gl, recursos.programa, malha, matrizes.perspectiva, matrizes.camera, matrizObjeto, objetoEmModo);
        if (deveDesenharMalhaPreenchidaEditor3D(state)) {
            desenhaMalhaPreenchidaViewportEditor3D(gl, recursos, objetoAtual, malha, matrizFinal, matrizObjeto, coresVisualizacao, alphaMalhaPreenchida);
        }
        if (objetoSelecionado && !visualizacaoEstruturaEstaAtivaEditor3D(state) && alphaMalhaPreenchida < 1) desenhaSelecaoObjetoEditor3D(gl, recursos.programa, malha, matrizes.perspectiva, matrizes.camera, matrizObjeto, objetoEmModo);
        if (!visualizacaoEstruturaEstaAtivaEditor3D(state)) facesDestacadas.forEach(face => desenhaFaceSelecionadaEditor3D(gl, recursos.programa, face, matrizes.perspectiva, matrizes.camera, matrizObjeto));
        if (deveDesenharArestasEditor3D(state, malha.idObjeto) && malha.arestasEdicao !== null) desenhaArestasEdicaoEditor3D(gl, recursos.programa, malha.arestasEdicao, state.arestaSelecionadaEdicao, malha.idObjeto, matrizes.perspectiva, matrizes.camera, matrizObjeto, { alphaBase: obtemAlphaArestasEditor3D(state), ignoraProfundidade: deveIgnorarProfundidadeArestasEditor3D(state) });
        if (objetoSelecionado && state.modoOperacao === 'OBJETO' && visualizacaoEstruturaEstaAtivaEditor3D(state) && malha.arestasEdicao !== null) desenhaArestasSelecaoObjetoEditor3D(gl, recursos.programa, malha.arestasEdicao, matrizes.perspectiva, matrizes.camera, matrizObjeto, objetoEmModo);
        if (objetoEstaNoEscopoEdicaoEditor3D(state, malha.idObjeto) && state.tipoSelecaoEdicao === 'VERTICE' && malha.verticesEdicao !== null) desenhaVerticesEdicaoEditor3D(gl, recursos.programa, malha.verticesEdicao, state.verticeSelecionadoEdicao, malha.idObjeto, matrizes.perspectiva, matrizes.camera, matrizObjeto);
    });
};
