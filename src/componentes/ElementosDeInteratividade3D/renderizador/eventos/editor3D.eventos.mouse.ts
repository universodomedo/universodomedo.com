import { aplicaPanCameraEditor3D, aplicaRotacaoCameraEditor3D, aplicaZoomCameraEditor3D, interpolaCameraEditor3D, obtemCameraAjusteVistaPorDirecaoEditor3D, type DirecaoAjusteVistaEditor3D, type ModoArrasteEditor3D } from '../../editor/editor3D.camera';
import { ativaCursorVirtualPorEventoEditor3D, atualizaCursorVirtualPorMovimentoEditor3D, criaPontoCanvasEditor3D, desativaCursorVirtualEditor3D } from './editor3D.eventos.cursor';
import { selecionaFacePorClickEditor3D, selecionaObjetoPorAreaEditor3D } from './editor3D.eventos.selecao';
import { modoEditor3DEstaAtivo } from '../../modos/editor3D.modo.utils';
import { moveModoAtualEditor3D } from './editor3D.eventos.modo';
import { obtemModoArrasteEditor3D } from '../editor3D.renderizador.helpers';
import type { ControleEventosEditor3D } from './editor3D.eventos.types';
import type { FerramentaMouseEditor3D } from '../../mouse/editor3D.mouse.tipos';

const movimentoMinimoEventoAjusteVistaEditor3D = 2;
const acumuladoMinimoAjusteVistaEditor3D = 28;
const dominanciaMinimaAjusteVistaEditor3D = 1.25;
const duracaoAnimacaoAjusteVistaEditor3D = 260;

function obtemFerramentaMouseInicioEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): FerramentaMouseEditor3D | null {
    if (event.button === 2) return null;
    if (event.button === 1) return obtemModoArrasteEditor3D(event) === 'PAN' ? 'PAN' : 'ROTACIONAR';
    if (event.button === 0 && controle.refs.estado.current.modoOperacao === 'EDICAO') return null;
    if (event.button === 0) return controle.refs.estado.current.ferramentaMouse;

    return null;
};

function obtemModoArrastePorFerramentaEditor3D(ferramenta: FerramentaMouseEditor3D): ModoArrasteEditor3D | null {
    if (ferramenta === 'PAN') return 'PAN';
    if (ferramenta === 'ROTACIONAR') return 'ROTACIONAR';

    return null;
};

function obtemDirecaoAjusteVistaEditor3D(deltaX: number, deltaY: number): DirecaoAjusteVistaEditor3D | null {
    const absolutoX = Math.abs(deltaX);
    const absolutoY = Math.abs(deltaY);

    if (absolutoX < movimentoMinimoEventoAjusteVistaEditor3D && absolutoY < movimentoMinimoEventoAjusteVistaEditor3D) return null;
    if (absolutoX >= absolutoY * dominanciaMinimaAjusteVistaEditor3D) return deltaX > 0 ? 'DIREITA' : 'ESQUERDA';
    if (absolutoY >= absolutoX * dominanciaMinimaAjusteVistaEditor3D) return deltaY < 0 ? 'CIMA' : 'BAIXO';

    return null;
};

function obtemMagnitudeDirecaoAjusteVistaEditor3D(direcao: DirecaoAjusteVistaEditor3D, deltaX: number, deltaY: number): number {
    if (direcao === 'DIREITA' || direcao === 'ESQUERDA') return Math.abs(deltaX);

    return Math.abs(deltaY);
};

function encerraPointerLockEditor3D(controle: ControleEventosEditor3D): void {
    desativaCursorVirtualEditor3D(controle);
    if (document.pointerLockElement === controle.canvas) document.exitPointerLock();
};

function animaCameraAteEditor3D(controle: ControleEventosEditor3D, destino: ReturnType<typeof obtemCameraAjusteVistaPorDirecaoEditor3D>): void {
    const arraste = controle.refs.arraste.current;
    const origem = controle.refs.estado.current.camera;
    const inicio = performance.now();

    if (arraste.animacaoCameraFrameId !== null) cancelAnimationFrame(arraste.animacaoCameraFrameId);

    function animaFrame(agora: number): void {
        const progresso = Math.min(1, (agora - inicio) / duracaoAnimacaoAjusteVistaEditor3D);

        controle.refs.acoes.current.atualizaCamera(interpolaCameraEditor3D(origem, destino, progresso));

        if (progresso < 1) {
            arraste.animacaoCameraFrameId = requestAnimationFrame(animaFrame);

            return;
        }

        arraste.animacaoCameraFrameId = null;
        controle.refs.acoes.current.resetaFerramentaMouse();
    };

    arraste.animacaoCameraFrameId = requestAnimationFrame(animaFrame);
};

function iniciaAjusteVistaPorArrasteEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    if (event.button !== 1 || !event.altKey) return false;

    const arraste = controle.refs.arraste.current;

    arraste.arrastando = true;
    arraste.modoArraste = 'AJUSTAR_VISTA';
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;
    arraste.direcaoAjusteVista = null;
    arraste.acumuladoAjusteVista = 0;
    arraste.ajusteVistaAplicado = false;

    controle.refs.acoes.current.ativaFerramentaMouse('ROTACIONAR_RAPIDO');
    ativaCursorVirtualPorEventoEditor3D(controle, event);
    controle.canvas.focus();
    controle.canvas.requestPointerLock();
    event.preventDefault();

    return true;
};

function processaAjusteVistaPorArrasteEditor3D(controle: ControleEventosEditor3D, event: MouseEvent, deltaX: number, deltaY: number): boolean {
    const arraste = controle.refs.arraste.current;

    if (!arraste.arrastando || arraste.modoArraste !== 'AJUSTAR_VISTA') return false;

    const direcao = obtemDirecaoAjusteVistaEditor3D(deltaX, deltaY);

    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;

    if (direcao === null || arraste.ajusteVistaAplicado) {
        event.preventDefault();

        return true;
    }

    const magnitude = obtemMagnitudeDirecaoAjusteVistaEditor3D(direcao, deltaX, deltaY);

    if (arraste.direcaoAjusteVista !== direcao) {
        arraste.direcaoAjusteVista = direcao;
        arraste.acumuladoAjusteVista = magnitude;
    } else {
        arraste.acumuladoAjusteVista += magnitude;
    }

    if (arraste.acumuladoAjusteVista >= acumuladoMinimoAjusteVistaEditor3D) {
        arraste.ajusteVistaAplicado = true;
        arraste.arrastando = false;
        animaCameraAteEditor3D(controle, obtemCameraAjusteVistaPorDirecaoEditor3D(controle.refs.estado.current.camera, direcao));
        encerraPointerLockEditor3D(controle);
    }

    event.preventDefault();

    return true;
};

function tentaSelecionarFaceEdicaoEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    const state = controle.refs.estado.current;

    if (event.button !== 0 || state.modoOperacao !== 'EDICAO' || modoEditor3DEstaAtivo(state.modoAtual)) return false;

    selecionaFacePorClickEditor3D(controle, criaPontoCanvasEditor3D(controle.canvas, event));
    event.preventDefault();

    return true;
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
    if (iniciaAjusteVistaPorArrasteEditor3D(controle, event)) return;
    if (tentaSelecionarFaceEdicaoEditor3D(controle, event)) return;

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
    if (processaAjusteVistaPorArrasteEditor3D(controle, event, deltaX, deltaY)) return;
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
    controle.refs.arraste.current.direcaoAjusteVista = null;
    controle.refs.arraste.current.acumuladoAjusteVista = 0;
    controle.refs.arraste.current.ajusteVistaAplicado = false;
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
        controle.refs.arraste.current.direcaoAjusteVista = null;
        controle.refs.arraste.current.acumuladoAjusteVista = 0;
        controle.refs.arraste.current.ajusteVistaAplicado = false;
        controle.refs.acoes.current.resetaFerramentaMouse();
        desativaCursorVirtualEditor3D(controle);
    }
};