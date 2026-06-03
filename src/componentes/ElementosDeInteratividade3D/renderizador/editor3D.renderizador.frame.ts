import { criaMatrizesCenaEditor3D } from './editor3D.renderizador.matrizes';
import { desenhaGizmoEixosEditor3D, desenhaGuiasCenaEditor3D, desenhaOrigemEditor3D } from './editor3D.renderizador.guias';
import { desenhaObjetosCenaEditor3D } from './editor3D.renderizador.objetos';
import { preparaFrameEditor3D } from '../webgl/editor3D.webgl.renderizacao';
import type { RefsRenderizadorEditor3D } from './editor3D.renderizador.refs';
import type { RecursosRenderizadorEditor3D } from './editor3D.renderizador.types';

export function ajustaTamanhoCanvasEditor3D(gl: WebGLRenderingContext, canvas: HTMLCanvasElement): void {
    const area = canvas.getBoundingClientRect();
    const escala = Math.min(window.devicePixelRatio || 1, 2);
    const largura = Math.max(1, Math.floor(area.width * escala));
    const altura = Math.max(1, Math.floor(area.height * escala));

    if (canvas.width !== largura || canvas.height !== altura) {
        canvas.width = largura;
        canvas.height = altura;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
};

export function iniciaLoopRenderizacaoEditor3D(gl: WebGLRenderingContext, canvas: HTMLCanvasElement, recursos: RecursosRenderizadorEditor3D, refs: RefsRenderizadorEditor3D): () => void {
    let frameId = 0;

    function renderiza(): void {
        ajustaTamanhoCanvasEditor3D(gl, canvas);

        const state = refs.estado.current;
        const matrizes = criaMatrizesCenaEditor3D(state.camera, canvas.width, canvas.height);
        const guiasVisiveis = state.ocultacoesGuiasCenaTemporaria <= 0;

        preparaFrameEditor3D(gl, recursos.programa);
        desenhaGuiasCenaEditor3D(gl, recursos, state.camera.planoGuia, matrizes.finalCena, matrizes.cena, guiasVisiveis);
        desenhaObjetosCenaEditor3D(gl, recursos, state, matrizes);
        desenhaOrigemEditor3D(gl, recursos, matrizes.finalCena, matrizes.cena);
        desenhaGizmoEixosEditor3D(gl, canvas, recursos, matrizes.cena);

        frameId = requestAnimationFrame(renderiza);
    };

    frameId = requestAnimationFrame(renderiza);

    return () => cancelAnimationFrame(frameId);
};