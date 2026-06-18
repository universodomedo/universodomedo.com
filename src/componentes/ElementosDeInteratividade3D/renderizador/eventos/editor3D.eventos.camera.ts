import { aplicaPanCameraEditor3D, aplicaRotacaoCameraEditor3D, type CameraEditor3D, type ModoArrasteEditor3D } from '../../editor/editor3D.camera';
import { comandoMouseAreaInterativa3DEstaAtivo, comandoRodaMouseAreaInterativa3DEstaAtivo } from '../../comandos/editor3D.comandos';
import type { ControleEventosEditor3D } from './editor3D.eventos.types';
import type { ConfiguracaoCameraJogo3D } from '../editor3D.renderizador.jogo';
import type { FerramentaMouseEditor3D } from '../../mouse/editor3D.mouse.tipos';

const distanciaMinimaPrimeiraPessoaJogo3D = 0.08;
const distanciaMinimaTerceiraPessoaJogo3D = 2.2;
const distanciaMaximaJogo3D = 16;
const fovMinimoPrimeiraPessoaJogo3D = Math.PI / 5.8;
const fovMaximoPrimeiraPessoaJogo3D = Math.PI / 2.15;

function limitaDistanciaCameraJogo3D(valor: number, minimo: number): number { return Math.min(distanciaMaximaJogo3D, Math.max(minimo, valor)); };

function aplicaDollyCameraJogo3D(camera: CameraEditor3D, deltaY: number, minimo: number): CameraEditor3D {
    const distanciaAtual = 4 / camera.zoom;
    const proximaDistancia = limitaDistanciaCameraJogo3D(distanciaAtual + (deltaY * 0.018), minimo);

    return { ...camera, zoom: 4 / proximaDistancia };
};

function aplicaZoomPrimeiraPessoaCameraJogo3D(camera: CameraEditor3D, deltaY: number): CameraEditor3D {
    const proximoFov = Math.min(fovMaximoPrimeiraPessoaJogo3D, Math.max(fovMinimoPrimeiraPessoaJogo3D, camera.fov + (deltaY * 0.0012)));

    return { ...camera, fov: proximoFov };
};

function obtemFerramentaMouseCameraEditor3D(configuracao: ConfiguracaoCameraJogo3D, event: MouseEvent): FerramentaMouseEditor3D | null {
    if (configuracao.modoCamera === 'PRIMEIRA_PESSOA') {
        if (comandoMouseAreaInterativa3DEstaAtivo('mouse-sala-3d', event)) return 'ROTACIONAR';
        if (comandoMouseAreaInterativa3DEstaAtivo('mmb-dolly-camera', event)) return 'DOLLY';

        return null;
    }

    if (comandoMouseAreaInterativa3DEstaAtivo('arrastar-camera-sala-3d', event)) return 'PAN';
    if (comandoMouseAreaInterativa3DEstaAtivo('rotacionar-camera-sala-3d', event)) return 'ROTACIONAR';
    if (comandoMouseAreaInterativa3DEstaAtivo('mmb-dolly-camera', event)) return 'DOLLY';

    return null;
};

function obtemModoArrasteCameraEditor3D(ferramenta: FerramentaMouseEditor3D): ModoArrasteEditor3D | null {
    if (ferramenta === 'PAN') return 'PAN';
    if (ferramenta === 'DOLLY') return 'DOLLY';
    if (ferramenta === 'ROTACIONAR') return 'ROTACIONAR';

    return null;
};

function limpaArrasteCameraJogoEditor3D(controle: ControleEventosEditor3D): void {
    controle.refs.arraste.current.arrastando = false;
    controle.refs.arraste.current.botao = null;
    controle.refs.arraste.current.inicioX = 0;
    controle.refs.arraste.current.inicioY = 0;
    controle.refs.arraste.current.ultimoX = 0;
    controle.refs.arraste.current.ultimoY = 0;
    controle.refs.arraste.current.movimentoAcumulado = 0;
    controle.refs.arraste.current.finalizandoModoComPointerLock = false;
    controle.refs.acoes.current.resetaFerramentaMouse();
};

function iniciaArrasteCameraJogoEditor3D(controle: ControleEventosEditor3D, configuracao: ConfiguracaoCameraJogo3D, event: MouseEvent): void {
    const ferramenta = obtemFerramentaMouseCameraEditor3D(configuracao, event);

    if (ferramenta === null) return;

    const modoArraste = obtemModoArrasteCameraEditor3D(ferramenta);

    if (modoArraste === null) return;

    const arraste = controle.refs.arraste.current;

    arraste.arrastando = true;
    arraste.modoArraste = modoArraste;
    arraste.botao = event.button;
    arraste.inicioX = event.clientX;
    arraste.inicioY = event.clientY;
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;
    arraste.movimentoAcumulado = 0;
    arraste.finalizandoModoComPointerLock = false;

    controle.refs.acoes.current.ativaFerramentaMouse(ferramenta);
    controle.canvas.focus();
    controle.canvas.requestPointerLock();
    event.preventDefault();
};

function moveCameraJogoEditor3D(controle: ControleEventosEditor3D, configuracao: ConfiguracaoCameraJogo3D, event: MouseEvent): void {
    const arraste = controle.refs.arraste.current;

    if (!arraste.arrastando) return;

    const pointerLockAtivo = document.pointerLockElement === controle.canvas;
    const deltaX = pointerLockAtivo ? event.movementX : event.clientX - arraste.ultimoX;
    const deltaY = pointerLockAtivo ? event.movementY : event.clientY - arraste.ultimoY;
    const cameraAtual = controle.refs.estado.current.camera;
    const largura = Math.max(1, controle.canvas.clientWidth);
    const altura = Math.max(1, controle.canvas.clientHeight);
    const distanciaMinima = configuracao.modoCamera === 'PRIMEIRA_PESSOA' ? distanciaMinimaPrimeiraPessoaJogo3D : distanciaMinimaTerceiraPessoaJogo3D;
    const proximaCamera = arraste.modoArraste === 'PAN' ? aplicaPanCameraEditor3D(cameraAtual, deltaX, deltaY, largura, altura) : arraste.modoArraste === 'DOLLY' && configuracao.modoCamera === 'PRIMEIRA_PESSOA' ? aplicaZoomPrimeiraPessoaCameraJogo3D(cameraAtual, deltaY) : arraste.modoArraste === 'DOLLY' ? aplicaDollyCameraJogo3D(cameraAtual, deltaY, distanciaMinima) : aplicaRotacaoCameraEditor3D(cameraAtual, deltaX, deltaY);

    controle.refs.acoes.current.atualizaCamera(proximaCamera);
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;
    event.preventDefault();
};

function finalizaArrasteCameraJogoEditor3D(controle: ControleEventosEditor3D, event?: MouseEvent): void {
    if (!controle.refs.arraste.current.arrastando) return;

    limpaArrasteCameraJogoEditor3D(controle);
    if (document.pointerLockElement === controle.canvas) document.exitPointerLock();
    event?.preventDefault();
};

function aplicaDollyScrollCameraJogoEditor3D(controle: ControleEventosEditor3D, configuracao: ConfiguracaoCameraJogo3D, event: WheelEvent): void {
    if (!comandoRodaMouseAreaInterativa3DEstaAtivo('zoom-camera-sala-3d')) return;

    if (configuracao.modoCamera === 'PRIMEIRA_PESSOA') {
        controle.refs.acoes.current.atualizaCamera(aplicaZoomPrimeiraPessoaCameraJogo3D(controle.refs.estado.current.camera, event.deltaY));
        event.preventDefault();

        return;
    }

    controle.refs.acoes.current.atualizaCamera(aplicaDollyCameraJogo3D(controle.refs.estado.current.camera, event.deltaY, distanciaMinimaTerceiraPessoaJogo3D));
    event.preventDefault();
};

export function registraEventosCameraRenderizadorEditor3D(controle: ControleEventosEditor3D, configuracao: ConfiguracaoCameraJogo3D): () => void {
    const iniciaArraste = (event: MouseEvent): void => iniciaArrasteCameraJogoEditor3D(controle, configuracao, event);
    const moveMouse = (event: MouseEvent): void => moveCameraJogoEditor3D(controle, configuracao, event);
    const finalizaArraste = (event: MouseEvent): void => finalizaArrasteCameraJogoEditor3D(controle, event);
    const aplicaDollyScroll = (event: WheelEvent): void => aplicaDollyScrollCameraJogoEditor3D(controle, configuracao, event);
    const bloqueiaMenuDuranteArraste = (event: MouseEvent): void => {
        if (controle.refs.arraste.current.arrastando) event.preventDefault();
    };
    const finalizaPointerLock = (): void => {
        if (document.pointerLockElement !== controle.canvas) finalizaArrasteCameraJogoEditor3D(controle);
    };

    controle.canvas.addEventListener('mousedown', iniciaArraste);
    controle.canvas.addEventListener('wheel', aplicaDollyScroll, { passive: false });
    document.addEventListener('mousemove', moveMouse);
    document.addEventListener('mouseup', finalizaArraste);
    document.addEventListener('contextmenu', bloqueiaMenuDuranteArraste);
    document.addEventListener('pointerlockchange', finalizaPointerLock);

    return () => {
        controle.canvas.removeEventListener('mousedown', iniciaArraste);
        controle.canvas.removeEventListener('wheel', aplicaDollyScroll);
        document.removeEventListener('mousemove', moveMouse);
        document.removeEventListener('mouseup', finalizaArraste);
        document.removeEventListener('contextmenu', bloqueiaMenuDuranteArraste);
        document.removeEventListener('pointerlockchange', finalizaPointerLock);
        if (document.pointerLockElement === controle.canvas) document.exitPointerLock();
        limpaArrasteCameraJogoEditor3D(controle);
    };
};
