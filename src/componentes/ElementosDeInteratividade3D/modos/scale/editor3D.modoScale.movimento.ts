import type { CameraEditor3D } from '../../editor/editor3D.camera';
import type { EixoEditor3D, Vetor3 } from '../../editor/editor3D.tipos';
import type { ModoScaleEditor3D } from '../editor3D.modo.tipos';

function criaDeltaScalePorEixo(eixo: EixoEditor3D, delta: number): Vetor3 {
    if (eixo === 'X') return [delta, 0, 0];
    if (eixo === 'Y') return [0, delta, 0];

    return [0, 0, delta];
};

function criaDeltaScalePorAnguloVisualizacao(camera: CameraEditor3D, delta: number): Vetor3 {
    if (camera.espacoMovimentoGrab === 'XY') return [0, 0, delta];
    if (camera.espacoMovimentoGrab === 'XZ') return [0, delta, 0];
    if (camera.espacoMovimentoGrab === 'YZ') return [delta, 0, 0];

    return [delta, delta, delta];
};

export function criaDeltaScaleEditor3D(camera: CameraEditor3D, scale: ModoScaleEditor3D, deltaX: number, deltaY: number): Vetor3 {
    const delta = (deltaX - deltaY) * 0.006;

    if (scale.eixo !== null) return criaDeltaScalePorEixo(scale.eixo, delta);

    return criaDeltaScalePorAnguloVisualizacao(camera, delta);
};