import type { CameraEditor3D } from '../../editor/editor3D.camera';
import type { EixoEditor3D, Vetor3 } from '../../editor/editor3D.tipos';

interface ValoresMovimentoMouseEditor3D {
    readonly horizontal: number;
    readonly vertical: number;
};

function criaValoresMovimentoMouseEditor3D(deltaX: number, deltaY: number, largura: number, altura: number, zoom: number): ValoresMovimentoMouseEditor3D {
    const escala = 4 / zoom;

    return { horizontal: (deltaX / largura) * escala, vertical: (-deltaY / altura) * escala };
};

function aplicaRotacaoXInversa(vetor: Vetor3, angulo: number): Vetor3 {
    const c = Math.cos(-angulo);
    const s = Math.sin(-angulo);

    return [vetor[0], (vetor[1] * c) - (vetor[2] * s), (vetor[1] * s) + (vetor[2] * c)];
};

function aplicaRotacaoYInversa(vetor: Vetor3, angulo: number): Vetor3 {
    const c = Math.cos(-angulo);
    const s = Math.sin(-angulo);

    return [(vetor[0] * c) + (vetor[2] * s), vetor[1], (-vetor[0] * s) + (vetor[2] * c)];
};

function aplicaRotacaoInversaCamera(camera: CameraEditor3D, vetor: Vetor3): Vetor3 {
    return aplicaRotacaoXInversa(aplicaRotacaoYInversa(vetor, camera.rotacaoY), camera.rotacaoX);
};

function multiplicaVetor(vetor: Vetor3, multiplicador: number): Vetor3 {
    return [vetor[0] * multiplicador, vetor[1] * multiplicador, vetor[2] * multiplicador];
};

function somaVetores(a: Vetor3, b: Vetor3): Vetor3 {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
};

function criaDeltaLivre(camera: CameraEditor3D, movimento: ValoresMovimentoMouseEditor3D): Vetor3 {
    const direita = aplicaRotacaoInversaCamera(camera, [1, 0, 0]);
    const cima = aplicaRotacaoInversaCamera(camera, [0, 1, 0]);

    return somaVetores(multiplicaVetor(direita, movimento.horizontal), multiplicaVetor(cima, movimento.vertical));
};

function criaDeltaPlano(camera: CameraEditor3D, movimento: ValoresMovimentoMouseEditor3D): Vetor3 {
    if (camera.espacoMovimentoGrab === 'XZ') return [movimento.horizontal, 0, movimento.vertical];
    if (camera.espacoMovimentoGrab === 'YZ') return [0, movimento.horizontal, movimento.vertical];
    if (camera.espacoMovimentoGrab === 'XY') return [movimento.horizontal, movimento.vertical, 0];

    return criaDeltaLivre(camera, movimento);
};

function criaDeltaEixo(eixo: EixoEditor3D, movimento: ValoresMovimentoMouseEditor3D): Vetor3 {
    if (eixo === 'X') return [movimento.horizontal, 0, 0];
    if (eixo === 'Y') return [0, movimento.vertical, 0];

    return [0, 0, movimento.vertical];
};

export function criaDeltaMovimentoGrabEditor3D(camera: CameraEditor3D, deltaX: number, deltaY: number, largura: number, altura: number, eixo: EixoEditor3D | null): Vetor3 {
    const movimento = criaValoresMovimentoMouseEditor3D(deltaX, deltaY, largura, altura, camera.zoom);

    if (eixo !== null) return criaDeltaEixo(eixo, movimento);

    return criaDeltaPlano(camera, movimento);
};