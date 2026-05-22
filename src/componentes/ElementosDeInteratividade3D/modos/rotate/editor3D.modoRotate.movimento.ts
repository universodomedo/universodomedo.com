import type { CameraEditor3D } from '../../editor/editor3D.camera';
import type { EixoEditor3D, Vetor3 } from '../../editor/editor3D.tipos';
import type { ModoRotateEditor3D } from '../editor3D.modo.tipos';

interface ValoresRotacaoMouseEditor3D {
    readonly horizontal: number;
    readonly vertical: number;
};

function criaValoresRotacaoMouseEditor3D(deltaX: number, deltaY: number): ValoresRotacaoMouseEditor3D {
    return { horizontal: deltaX * 0.01, vertical: deltaY * 0.01 };
};

function criaDeltaRotacaoEixo(eixo: EixoEditor3D, movimento: ValoresRotacaoMouseEditor3D): Vetor3 {
    const delta = movimento.horizontal + movimento.vertical;

    if (eixo === 'X') return [delta, 0, 0];
    if (eixo === 'Y') return [0, delta, 0];

    return [0, 0, delta];
};

function criaDeltaRotacaoPorPlano(camera: CameraEditor3D, movimento: ValoresRotacaoMouseEditor3D): Vetor3 {
    if (camera.espacoMovimentoGrab === 'XY') return [0, 0, movimento.horizontal + movimento.vertical];
    if (camera.espacoMovimentoGrab === 'XZ') return [0, movimento.horizontal + movimento.vertical, 0];
    if (camera.espacoMovimentoGrab === 'YZ') return [movimento.horizontal + movimento.vertical, 0, 0];

    return [movimento.vertical, movimento.horizontal, 0];
};

function criaDeltaRotacaoLivre(movimento: ValoresRotacaoMouseEditor3D): Vetor3 {
    return [movimento.vertical, movimento.horizontal, (movimento.horizontal + movimento.vertical) * 0.5];
};

export function criaDeltaRotacaoEditor3D(camera: CameraEditor3D, rotate: ModoRotateEditor3D, deltaX: number, deltaY: number): Vetor3 {
    const movimento = criaValoresRotacaoMouseEditor3D(deltaX, deltaY);

    if (rotate.eixo !== null) return criaDeltaRotacaoEixo(rotate.eixo, movimento);
    if (rotate.livre) return criaDeltaRotacaoLivre(movimento);

    return criaDeltaRotacaoPorPlano(camera, movimento);
};