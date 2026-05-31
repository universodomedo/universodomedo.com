import { criaMatrizTransformObjetoEditor3D } from '../../editor/editor3D.transform';
import type { CameraEditor3D } from '../../editor/editor3D.camera';
import type { EixoEditor3D, ObjetoCenaEditor3D, Vetor3 } from '../../editor/editor3D.tipos';

interface ValoresMovimentoMouseEditor3D {
    readonly horizontal: number;
    readonly vertical: number;
};

interface TransformacaoLinearGrabEditor3D {
    readonly matriz: Float32Array;
    readonly inversa: Float32Array;
};

const toleranciaMatrizGrabEditor3D = 0.000001;

function criaValoresMovimentoMouseEditor3D(deltaX: number, deltaY: number, largura: number, altura: number, zoom: number): ValoresMovimentoMouseEditor3D {
    const escala = 4 / zoom;

    return { horizontal: (deltaX / largura) * escala, vertical: (-deltaY / altura) * escala };
};

function aplicaRotacaoXInversa(vetor: Vetor3, angulo: number): Vetor3 {
    const c = Math.cos(-angulo);
    const s = Math.sin(-angulo);

    return [vetor[0], (vetor[1] * c) - (vetor[2] * s), (vetor[1] * s) + (vetor[2] * c)];
};

function aplicaRotacaoZInversa(vetor: Vetor3, angulo: number): Vetor3 {
    const c = Math.cos(-angulo);
    const s = Math.sin(-angulo);

    return [(vetor[0] * c) - (vetor[1] * s), (vetor[0] * s) + (vetor[1] * c), vetor[2]];
};

function aplicaRotacaoInversaCamera(camera: CameraEditor3D, vetor: Vetor3): Vetor3 {
    return aplicaRotacaoZInversa(aplicaRotacaoXInversa(aplicaRotacaoZInversa(vetor, camera.rotacaoTela), camera.rotacaoX), camera.rotacaoY);
};

function multiplicaVetor(vetor: Vetor3, multiplicador: number): Vetor3 {
    return [vetor[0] * multiplicador, vetor[1] * multiplicador, vetor[2] * multiplicador];
};

function somaVetores(a: Vetor3, b: Vetor3): Vetor3 {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
};

function produtoEscalar(a: Vetor3, b: Vetor3): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

function tamanhoVetor(vetor: Vetor3): number {
    return Math.sqrt(produtoEscalar(vetor, vetor));
};

function normalizaVetor(vetor: Vetor3): Vetor3 | null {
    const tamanho = tamanhoVetor(vetor);

    if (tamanho <= toleranciaMatrizGrabEditor3D) return null;

    return multiplicaVetor(vetor, 1 / tamanho);
};

function aplicaMatrizLinearVetor(matriz: Float32Array, vetor: Vetor3): Vetor3 {
    return [(matriz[0] * vetor[0]) + (matriz[4] * vetor[1]) + (matriz[8] * vetor[2]), (matriz[1] * vetor[0]) + (matriz[5] * vetor[1]) + (matriz[9] * vetor[2]), (matriz[2] * vetor[0]) + (matriz[6] * vetor[1]) + (matriz[10] * vetor[2])];
};

function criaMatrizLinearInversa(matriz: Float32Array): Float32Array | null {
    const m00 = matriz[0];
    const m01 = matriz[4];
    const m02 = matriz[8];
    const m10 = matriz[1];
    const m11 = matriz[5];
    const m12 = matriz[9];
    const m20 = matriz[2];
    const m21 = matriz[6];
    const m22 = matriz[10];
    const determinante = (m00 * ((m11 * m22) - (m12 * m21))) - (m01 * ((m10 * m22) - (m12 * m20))) + (m02 * ((m10 * m21) - (m11 * m20)));

    if (Math.abs(determinante) <= toleranciaMatrizGrabEditor3D) return null;

    const invDeterminante = 1 / determinante;
    const i00 = ((m11 * m22) - (m12 * m21)) * invDeterminante;
    const i01 = ((m02 * m21) - (m01 * m22)) * invDeterminante;
    const i02 = ((m01 * m12) - (m02 * m11)) * invDeterminante;
    const i10 = ((m12 * m20) - (m10 * m22)) * invDeterminante;
    const i11 = ((m00 * m22) - (m02 * m20)) * invDeterminante;
    const i12 = ((m02 * m10) - (m00 * m12)) * invDeterminante;
    const i20 = ((m10 * m21) - (m11 * m20)) * invDeterminante;
    const i21 = ((m01 * m20) - (m00 * m21)) * invDeterminante;
    const i22 = ((m00 * m11) - (m01 * m10)) * invDeterminante;

    return new Float32Array([i00, i10, i20, 0, i01, i11, i21, 0, i02, i12, i22, 0, 0, 0, 0, 1]);
};

function criaTransformacaoLinearGrabEditor3D(objeto: ObjetoCenaEditor3D | null): TransformacaoLinearGrabEditor3D | null {
    if (objeto === null) return null;

    const matriz = criaMatrizTransformObjetoEditor3D(objeto);
    const inversa = criaMatrizLinearInversa(matriz);

    if (inversa === null) return null;

    return { matriz, inversa };
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

function obtemVetorEixo(eixo: EixoEditor3D): Vetor3 {
    if (eixo === 'X') return [1, 0, 0];
    if (eixo === 'Y') return [0, 1, 0];

    return [0, 0, 1];
};

function criaDeltaLocalPorTransformacao(deltaMundo: Vetor3, transformacao: TransformacaoLinearGrabEditor3D | null): Vetor3 {
    if (transformacao === null) return deltaMundo;

    return aplicaMatrizLinearVetor(transformacao.inversa, deltaMundo);
};

function criaDeltaEixo(camera: CameraEditor3D, eixo: EixoEditor3D, movimento: ValoresMovimentoMouseEditor3D, transformacao: TransformacaoLinearGrabEditor3D | null): Vetor3 {
    const vetorEixo = obtemVetorEixo(eixo);
    const deltaLivre = criaDeltaLivre(camera, movimento);
    const eixoMundo = transformacao === null ? vetorEixo : aplicaMatrizLinearVetor(transformacao.matriz, vetorEixo);
    const eixoMundoNormalizado = normalizaVetor(eixoMundo);

    if (eixoMundoNormalizado === null) return [0, 0, 0];

    const deslocamentoMundo = produtoEscalar(deltaLivre, eixoMundoNormalizado);
    const deslocamentoLocal = transformacao === null ? deslocamentoMundo : deslocamentoMundo / tamanhoVetor(eixoMundo);

    return multiplicaVetor(vetorEixo, deslocamentoLocal);
};

export function criaDeltaMovimentoGrabEditor3D(camera: CameraEditor3D, deltaX: number, deltaY: number, largura: number, altura: number, eixo: EixoEditor3D | null, objetoEdicao: ObjetoCenaEditor3D | null = null): Vetor3 {
    const movimento = criaValoresMovimentoMouseEditor3D(deltaX, deltaY, largura, altura, camera.zoom);
    const transformacao = criaTransformacaoLinearGrabEditor3D(objetoEdicao);

    if (eixo !== null) return criaDeltaEixo(camera, eixo, movimento, transformacao);

    return criaDeltaLocalPorTransformacao(criaDeltaPlano(camera, movimento), transformacao);
};
