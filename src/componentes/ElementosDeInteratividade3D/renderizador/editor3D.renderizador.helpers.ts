import { aplicaVistaFrenteCameraEditor3D, aplicaVistaLateralCameraEditor3D, aplicaVistaPerspectivaCameraEditor3D, aplicaVistaTopoCameraEditor3D, type CameraEditor3D, type ModoArrasteEditor3D, type PlanoGuiaEditor3D } from '../editor/editor3D.camera';
import { criaBuffersEditor3D, type BuffersEditor3D } from '../webgl/editor3D.webgl.buffers';
import { criaGeometriasGuiaEditor3D } from '../geometria/guias/editor3D.geometria.guias';
import type { GuiaEditor3D } from '../geometria/editor3D.geometria.types';
import type { GuiaRenderizadaEditor3D, GuiasRenderizadasPorPlanoEditor3D } from './editor3D.renderizador.types';

export function obtemModoArrasteEditor3D(event: MouseEvent): ModoArrasteEditor3D { return event.shiftKey ? 'PAN' : 'ROTACIONAR'; };

export function criaGuiasRenderizadasEditor3D(gl: WebGLRenderingContext, definicoes: readonly GuiaEditor3D[]): GuiaRenderizadaEditor3D[] | null {
    const guias: GuiaRenderizadaEditor3D[] = [];

    for (const guia of definicoes) {
        const buffers = criaBuffersEditor3D(gl, guia.geometria);

        if (buffers === null) return null;

        guias.push({ guia, buffers });
    }

    return guias;
};

function criaGuiasRenderizadasPlanoEditor3D(gl: WebGLRenderingContext, plano: PlanoGuiaEditor3D): GuiaRenderizadaEditor3D[] | null { return criaGuiasRenderizadasEditor3D(gl, criaGeometriasGuiaEditor3D(plano)); };

export function criaGuiasPorPlanoEditor3D(gl: WebGLRenderingContext): GuiasRenderizadasPorPlanoEditor3D | null {
    const xy = criaGuiasRenderizadasPlanoEditor3D(gl, 'XY');
    const xz = criaGuiasRenderizadasPlanoEditor3D(gl, 'XZ');
    const yz = criaGuiasRenderizadasPlanoEditor3D(gl, 'YZ');

    if (xy === null || xz === null || yz === null) return null;

    return { XY: xy, XZ: xz, YZ: yz };
};

export function obtemBuffersGuiasEditor3D(guiasPorPlano: GuiasRenderizadasPorPlanoEditor3D): BuffersEditor3D[] { return [...guiasPorPlano.XY, ...guiasPorPlano.XZ, ...guiasPorPlano.YZ].map(guia => guia.buffers); };

export function aplicaCameraPorAtalhoEditor3D(tecla: string, camera: CameraEditor3D): CameraEditor3D | null {
    if (tecla === '1') return aplicaVistaFrenteCameraEditor3D(camera);
    if (tecla === '3') return aplicaVistaLateralCameraEditor3D(camera);
    if (tecla === '7') return aplicaVistaTopoCameraEditor3D(camera);
    if (tecla === '0') return aplicaVistaPerspectivaCameraEditor3D(camera);

    return null;
};