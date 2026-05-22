import { aplicaMatrizesEditor3D, desenhaMalhaEditor3D } from '../webgl/editor3D.webgl.renderizacao';
import { criaMatrizTransformObjetoEditor3D } from '../editor/editor3D.transform';
import { desenhaSelecaoObjetoEditor3D } from './selecao/editor3D.selecao.render';
import { multiplicaMatriz4 } from '../editor/editor3D.matrizes';
import type { Editor3DState } from '../estado/editor3D.estado.types';
import type { MatrizesCenaEditor3D } from './editor3D.renderizador.matrizes';
import type { ObjetoCenaEditor3D, Vetor3 } from '../editor/editor3D.tipos';
import type { RecursosRenderizadorEditor3D } from './editor3D.renderizador.types';

const corVisualObjetoSemMaterialBase: Vetor3 = [0.62, 0.62, 0.62];
const corVisualObjetoSemMaterialLuz: Vetor3 = [0.86, 0.86, 0.86];

function obtemObjetoAtual(state: Editor3DState, idObjeto: string): ObjetoCenaEditor3D | null {
    if (state.malhaEmCriacao !== null && state.malhaEmCriacao.id === idObjeto) return state.malhaEmCriacao;

    return state.objetos.find(objeto => objeto.id === idObjeto) ?? null;
};

function objetoEstaEmModoEditor3D(state: Editor3DState, idObjeto: string): boolean {
    if (state.modoAtual.tipo === 'NENHUM') return false;

    return state.modoAtual.idsObjetos.includes(idObjeto);
};

export function desenhaObjetosCenaEditor3D(gl: WebGLRenderingContext, recursos: RecursosRenderizadorEditor3D, state: Editor3DState, matrizes: MatrizesCenaEditor3D): void {
    recursos.malhas.forEach(malha => {
        const objetoAtual = obtemObjetoAtual(state, malha.idObjeto);

        if (objetoAtual === null) return;

        const matrizObjeto = multiplicaMatriz4(matrizes.cena, criaMatrizTransformObjetoEditor3D(objetoAtual));
        const matrizFinal = multiplicaMatriz4(matrizes.perspectiva, multiplicaMatriz4(matrizes.camera, matrizObjeto));
        const objetoSelecionado = state.idsObjetosSelecionados.includes(malha.idObjeto);
        const objetoEmModo = objetoEstaEmModoEditor3D(state, malha.idObjeto);

        if (objetoSelecionado) desenhaSelecaoObjetoEditor3D(gl, recursos.programa, malha, matrizes.perspectiva, matrizes.camera, matrizObjeto, objetoEmModo);
        aplicaMatrizesEditor3D(gl, recursos.programa, matrizFinal, matrizObjeto);
        desenhaMalhaEditor3D(gl, recursos.programa, malha.buffers, malha.geometria, corVisualObjetoSemMaterialBase, corVisualObjetoSemMaterialLuz);
    });
};