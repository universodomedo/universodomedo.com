import type { EixoEditor3D } from './editor3D.tipos';

export type ModoArrasteEditor3D = 'ROTACIONAR' | 'PAN';
export type PlanoGuiaEditor3D = 'XY' | 'XZ' | 'YZ';
export type EspacoMovimentoGrabEditor3D = PlanoGuiaEditor3D | 'XYZ';

export interface CameraEditor3D {
    readonly rotacaoX: number;
    readonly rotacaoY: number;
    readonly deslocamentoX: number;
    readonly deslocamentoY: number;
    readonly zoom: number;
    readonly planoGuia: PlanoGuiaEditor3D;
    readonly espacoMovimentoGrab: EspacoMovimentoGrabEditor3D;
};

export interface EstadoArrasteCameraEditor3D {
    arrastando: boolean;
    modoArraste: ModoArrasteEditor3D;
    ultimoX: number;
    ultimoY: number;
};

function limitaValor(valor: number, minimo: number, maximo: number): number { return Math.min(maximo, Math.max(minimo, valor)); };

export function criaCameraPadraoEditor3D(): CameraEditor3D { return { rotacaoX: -Math.PI / 3, rotacaoY: -Math.PI / 4, deslocamentoX: 0, deslocamentoY: 0, zoom: 1, planoGuia: 'XY', espacoMovimentoGrab: 'XYZ' }; };

export function criaEstadoArrasteCameraEditor3D(): EstadoArrasteCameraEditor3D { return { arrastando: false, modoArraste: 'ROTACIONAR', ultimoX: 0, ultimoY: 0 }; };

export function aplicaRotacaoCameraEditor3D(camera: CameraEditor3D, deltaX: number, deltaY: number): CameraEditor3D { return { ...camera, rotacaoY: camera.rotacaoY + (deltaX * 0.008), rotacaoX: limitaValor(camera.rotacaoX + (deltaY * 0.008), -Math.PI + 0.04, Math.PI - 0.04), planoGuia: 'XY', espacoMovimentoGrab: 'XYZ' }; };

export function aplicaPanCameraEditor3D(camera: CameraEditor3D, deltaX: number, deltaY: number, largura: number, altura: number): CameraEditor3D { return { ...camera, deslocamentoX: camera.deslocamentoX + ((deltaX / largura) * (3 / camera.zoom)), deslocamentoY: camera.deslocamentoY - ((deltaY / altura) * (3 / camera.zoom)) }; };

export function aplicaZoomCameraEditor3D(camera: CameraEditor3D, deltaY: number): CameraEditor3D {
    const multiplicador = deltaY > 0 ? 0.92 : 1.08;

    return { ...camera, zoom: limitaValor(camera.zoom * multiplicador, 0.55, 2.4) };
};

export function aplicaVistaTopoCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return { ...camera, rotacaoX: 0, rotacaoY: 0, planoGuia: 'XY', espacoMovimentoGrab: 'XY' }; };

export function aplicaVistaFrenteCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return { ...camera, rotacaoX: -Math.PI / 2, rotacaoY: 0, planoGuia: 'XZ', espacoMovimentoGrab: 'XZ' }; };

export function aplicaVistaLateralCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return { ...camera, rotacaoX: -Math.PI / 2, rotacaoY: -Math.PI / 2, planoGuia: 'YZ', espacoMovimentoGrab: 'YZ' }; };

export function aplicaVistaPerspectivaCameraEditor3D(camera: CameraEditor3D): CameraEditor3D { return { ...camera, rotacaoX: -Math.PI / 3, rotacaoY: -Math.PI / 4, planoGuia: 'XY', espacoMovimentoGrab: 'XYZ' }; };

export function aplicaVistaEixoGrabCameraEditor3D(camera: CameraEditor3D, eixo: EixoEditor3D): CameraEditor3D {
    if (eixo === 'Z') return aplicaVistaFrenteCameraEditor3D(camera);

    return aplicaVistaTopoCameraEditor3D(camera);
};

export function aplicaVistaEixoRotateCameraEditor3D(camera: CameraEditor3D, eixo: EixoEditor3D): CameraEditor3D {
    if (eixo === 'X') return aplicaVistaLateralCameraEditor3D(camera);
    if (eixo === 'Y') return aplicaVistaFrenteCameraEditor3D(camera);

    return aplicaVistaTopoCameraEditor3D(camera);
};