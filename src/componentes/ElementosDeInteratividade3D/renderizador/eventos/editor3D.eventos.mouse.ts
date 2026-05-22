import { aplicaPanCameraEditor3D, aplicaRotacaoCameraEditor3D, aplicaZoomCameraEditor3D, type ModoArrasteEditor3D } from '../../editor/editor3D.camera';
import { ativaCursorVirtualPorEventoEditor3D, atualizaCursorVirtualPorMovimentoEditor3D, criaPontoCanvasEditor3D, desativaCursorVirtualEditor3D } from './editor3D.eventos.cursor';
import { selecionaObjetoPorAreaEditor3D } from './editor3D.eventos.selecao';
import { modoEditor3DEstaAtivo } from '../../modos/editor3D.modo.utils';
import { moveModoAtualEditor3D } from './editor3D.eventos.modo';
import { obtemModoArrasteEditor3D } from '../editor3D.renderizador.helpers';
import type { ControleEventosEditor3D } from './editor3D.eventos.types';
import type { FerramentaMouseEditor3D } from '../../mouse/editor3D.mouse.tipos';

function obtemFerramentaMouseInicioEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): FerramentaMouseEditor3D | null {
    if (event.button === 2) return null;
    if (event.button === 1) return obtemModoArrasteEditor3D(event) === 'PAN' ? 'PAN' : 'ROTACIONAR';
    if (event.button === 0) return controle.refs.estado.current.ferramentaMouse;

    return null;
};

function obtemModoArrastePorFerramentaEditor3D(ferramenta: FerramentaMouseEditor3D): ModoArrasteEditor3D | null {
    if (ferramenta === 'PAN') return 'PAN';
    if (ferramenta === 'ROTACIONAR') return 'ROTACIONAR';

    return null;
};

function iniciaAreaSelecaoEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): void {
    const ponto = criaPontoCanvasEditor3D(controle.canvas, event);

    controle.refs.acoes.current.iniciaAreaSelecao(ponto.x, ponto.y, event.shiftKey);
    event.preventDefault();
};

function atualizaAreaSelecaoEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    if (controle.refs.estado.current.areaSelecao === null) return false;

    const ponto = criaPontoCanvasEditor3D(controle.canvas, event);

    controle.refs.acoes.current.atualizaAreaSelecao(ponto.x, ponto.y);
    event.preventDefault();

    return true;
};

function finalizaAreaSelecaoEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    const areaSelecao = controle.refs.estado.current.areaSelecao;

    if (event.button !== 0 || areaSelecao === null) return false;

    const ponto = criaPontoCanvasEditor3D(controle.canvas, event);

    selecionaObjetoPorAreaEditor3D(controle, ponto, areaSelecao.adicionando);
    controle.refs.acoes.current.finalizaAreaSelecao();
    controle.refs.acoes.current.resetaFerramentaMouse();
    event.preventDefault();

    return true;
};

export function iniciaArrasteCameraEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): void {
    if (modoEditor3DEstaAtivo(controle.refs.estado.current.modoAtual)) return;

    const ferramenta = obtemFerramentaMouseInicioEditor3D(controle, event);

    if (ferramenta === null) return;

    controle.refs.acoes.current.ativaFerramentaMouse(ferramenta);

    if (ferramenta === 'SELECIONAR') {
        iniciaAreaSelecaoEditor3D(controle, event);

        return;
    }

    const modoArraste = obtemModoArrastePorFerramentaEditor3D(ferramenta);

    if (modoArraste === null) return;

    const arraste = controle.refs.arraste.current;

    arraste.arrastando = true;
    arraste.modoArraste = modoArraste;
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;

    ativaCursorVirtualPorEventoEditor3D(controle, event);
    controle.canvas.focus();
    controle.canvas.requestPointerLock();
    event.preventDefault();
};

export function moveMouseEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): void {
    const pointerLockAtivo = document.pointerLockElement === controle.canvas;
    const deltaX = pointerLockAtivo ? event.movementX : event.clientX - controle.refs.arraste.current.ultimoX;
    const deltaY = pointerLockAtivo ? event.movementY : event.clientY - controle.refs.arraste.current.ultimoY;

    if (pointerLockAtivo) atualizaCursorVirtualPorMovimentoEditor3D(controle, event);
    if (moveModoAtualEditor3D(controle, event, deltaX, deltaY)) return;
    if (atualizaAreaSelecaoEditor3D(controle, event)) return;

    const arraste = controle.refs.arraste.current;

    if (!arraste.arrastando) return;

    const state = controle.refs.estado.current;
    const largura = Math.max(1, controle.canvas.clientWidth);
    const altura = Math.max(1, controle.canvas.clientHeight);
    const novaCamera = arraste.modoArraste === 'PAN' ? aplicaPanCameraEditor3D(state.camera, deltaX, deltaY, largura, altura) : aplicaRotacaoCameraEditor3D(state.camera, deltaX, deltaY);

    controle.refs.acoes.current.atualizaCamera(novaCamera);
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;
    event.preventDefault();
};

export function finalizaArrasteCameraEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): void {
    if (modoEditor3DEstaAtivo(controle.refs.estado.current.modoAtual)) return;
    if (finalizaAreaSelecaoEditor3D(controle, event)) return;
    if (!controle.refs.arraste.current.arrastando) return;

    controle.refs.arraste.current.arrastando = false;
    controle.refs.acoes.current.resetaFerramentaMouse();
    desativaCursorVirtualEditor3D(controle);

    if (document.pointerLockElement === controle.canvas) document.exitPointerLock();

    event.preventDefault();
};

export function aplicaZoomMouseEditor3D(controle: ControleEventosEditor3D, event: WheelEvent): void {
    const state = controle.refs.estado.current;

    if (modoEditor3DEstaAtivo(state.modoAtual)) return;

    controle.refs.acoes.current.atualizaCamera(aplicaZoomCameraEditor3D(state.camera, event.deltaY));
    event.preventDefault();
};

export function finalizaArrastePorPerdaPointerLockEditor3D(controle: ControleEventosEditor3D): void {
    const state = controle.refs.estado.current;

    if (document.pointerLockElement !== controle.canvas && !modoEditor3DEstaAtivo(state.modoAtual)) {
        controle.refs.arraste.current.arrastando = false;
        controle.refs.acoes.current.resetaFerramentaMouse();
        desativaCursorVirtualEditor3D(controle);
    }
};