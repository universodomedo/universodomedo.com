import { aplicaAtalhoTecladoEditor3D, cancelaModoSelecionarPorPerdaFocoEditor3D, finalizaModoSelecionarPorShiftEditor3D } from './editor3D.eventos.teclado';
import { aplicaDollyScrollMouseEditor3D, finalizaArrasteCameraEditor3D, finalizaArrastePorPerdaPointerLockEditor3D, iniciaArrasteCameraEditor3D, moveMouseEditor3D } from './editor3D.eventos.mouse';
import { finalizaOuCancelaModoAtualEditor3D } from './editor3D.eventos.modo';
import { ocultaCursorFantasmaEditor3D } from './editor3D.eventos.cursor';
import type { ControleEventosEditor3D } from './editor3D.eventos.types';

export function registraEventosRenderizadorEditor3D(controle: ControleEventosEditor3D): () => void {
    const iniciaArraste = (event: MouseEvent): void => iniciaArrasteCameraEditor3D(controle, event);
    const moveMouse = (event: MouseEvent): void => moveMouseEditor3D(controle, event);
    const finalizaArraste = (event: MouseEvent): void => finalizaArrasteCameraEditor3D(controle, event);
    const finalizaModo = (event: MouseEvent): void => finalizaOuCancelaModoAtualEditor3D(controle, event);
    const aplicaDollyScroll = (event: WheelEvent): void => aplicaDollyScrollMouseEditor3D(controle, event);
    const aplicaAtalho = (event: KeyboardEvent): void => aplicaAtalhoTecladoEditor3D(controle, event);
    const finalizaModoSelecionar = (event: KeyboardEvent): void => finalizaModoSelecionarPorShiftEditor3D(controle, event);
    const cancelaModoSelecionar = (): void => cancelaModoSelecionarPorPerdaFocoEditor3D(controle);
    const bloqueiaMenuModo = (event: MouseEvent): void => {
        if (controle.refs.estado.current.modoAtual.tipo !== 'NENHUM' || controle.refs.arraste.current.arrastando) event.preventDefault();
    };
    const finalizaPointerLock = (): void => finalizaArrastePorPerdaPointerLockEditor3D(controle);

    controle.canvas.addEventListener('mousedown', iniciaArraste);
    controle.canvas.addEventListener('wheel', aplicaDollyScroll, { passive: false });
    document.addEventListener('mousemove', moveMouse);
    document.addEventListener('mousedown', finalizaModo);
    document.addEventListener('mouseup', finalizaArraste);
    document.addEventListener('contextmenu', bloqueiaMenuModo);
    document.addEventListener('pointerlockchange', finalizaPointerLock);
    window.addEventListener('keydown', aplicaAtalho);
    window.addEventListener('keyup', finalizaModoSelecionar);
    window.addEventListener('blur', cancelaModoSelecionar);

    return () => {
        const animacaoCameraFrameId = controle.refs.arraste.current.animacaoCameraFrameId;

        controle.canvas.removeEventListener('mousedown', iniciaArraste);
        controle.canvas.removeEventListener('wheel', aplicaDollyScroll);
        document.removeEventListener('mousemove', moveMouse);
        document.removeEventListener('mousedown', finalizaModo);
        document.removeEventListener('mouseup', finalizaArraste);
        document.removeEventListener('contextmenu', bloqueiaMenuModo);
        document.removeEventListener('pointerlockchange', finalizaPointerLock);
        window.removeEventListener('keydown', aplicaAtalho);
        window.removeEventListener('keyup', finalizaModoSelecionar);
        window.removeEventListener('blur', cancelaModoSelecionar);
        ocultaCursorFantasmaEditor3D(controle);
        if (animacaoCameraFrameId !== null) {
            cancelAnimationFrame(animacaoCameraFrameId);
            controle.refs.arraste.current.animacaoCameraFrameId = null;
            controle.refs.acoes.current.finalizaOcultacaoGuiasCenaTemporaria();
        }
        if (document.pointerLockElement === controle.canvas) document.exitPointerLock();
    };
};