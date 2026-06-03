import { aplicaDollyCameraEditor3D, aplicaPanCameraEditor3D, aplicaRotacaoCameraEditor3D, interpolaCameraEditor3D, obtemCameraAjusteVistaPorDirecaoEditor3D, type DirecaoAjusteVistaEditor3D, type ModoArrasteEditor3D } from '../../editor/editor3D.camera';
import { ativaCursorVirtualPorEventoEditor3D, atualizaCursorVirtualPorMovimentoEditor3D, criaPontoCanvasEditor3D, criaPontoCanvasPorCoordenadaEditor3D, desativaCursorVirtualEditor3D } from './editor3D.eventos.cursor';
import { comandoMouseAreaInterativa3DEstaAtivo, comandoRodaMouseAreaInterativa3DEstaAtivo } from '../../comandos/editor3D.comandos';
import { selecionaElementoEdicaoPorClickEditor3D, selecionaObjetoPorAreaEntrePontosEditor3D, selecionaObjetoPorClickEditor3D } from './editor3D.eventos.selecao';
import { criaDeltaMovimentoGrabEditor3D } from '../../modos/grab/editor3D.modoGrab.movimento';
import { modoEditor3DEstaAtivo } from '../../modos/editor3D.modo.utils';
import { moveModoAtualEditor3D } from './editor3D.eventos.modo';
import type { ControleEventosEditor3D } from './editor3D.eventos.types';
import type { ObjetoCenaEditor3D } from '../../editor/editor3D.tipos';
import type { FerramentaMouseEditor3D } from '../../mouse/editor3D.mouse.tipos';

const movimentoMinimoEventoAjusteVistaEditor3D = 2;
const movimentoMinimoArrasteNavegacaoEditor3D = 4;
const acumuladoMinimoAjusteVistaEditor3D = 28;
const dominanciaMinimaAjusteVistaEditor3D = 1.25;
const duracaoAnimacaoAjusteVistaEditor3D = 260;

function obtemFerramentaMouseInicioEditor3D(event: MouseEvent): FerramentaMouseEditor3D | null {
    if (comandoMouseAreaInterativa3DEstaAtivo('rmb-pan-camera', event)) return 'PAN';
    if (comandoMouseAreaInterativa3DEstaAtivo('shift-mmb-pan-camera', event)) return 'PAN';
    if (comandoMouseAreaInterativa3DEstaAtivo('mmb-dolly-camera', event)) return 'DOLLY';
    if (comandoMouseAreaInterativa3DEstaAtivo('lmb-orbita-camera', event)) return 'ROTACIONAR';

    return null;
};

function obtemModoArrastePorFerramentaEditor3D(ferramenta: FerramentaMouseEditor3D): ModoArrasteEditor3D | null {
    if (ferramenta === 'PAN') return 'PAN';
    if (ferramenta === 'DOLLY') return 'DOLLY';
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

function eventoMantemModoSelecionarEditor3D(event: MouseEvent): boolean { return event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey; };

function limpaEstadoArrastePorPointerLockEditor3D(controle: ControleEventosEditor3D, event?: MouseEvent): void {
    controle.refs.arraste.current.arrastando = false;
    controle.refs.arraste.current.botao = null;
    controle.refs.arraste.current.inicioX = 0;
    controle.refs.arraste.current.inicioY = 0;
    controle.refs.arraste.current.ultimoX = 0;
    controle.refs.arraste.current.ultimoY = 0;
    controle.refs.arraste.current.movimentoAcumulado = 0;
    controle.refs.arraste.current.direcaoAjusteVista = null;
    controle.refs.arraste.current.acumuladoAjusteVista = 0;
    controle.refs.arraste.current.ajusteVistaAplicado = false;
    controle.refs.acoes.current.resetaFerramentaMouse();
    if (event !== undefined && eventoMantemModoSelecionarEditor3D(event)) controle.refs.acoes.current.ativaFerramentaMouse('SELECIONAR_MULTIPLO');
    desativaCursorVirtualEditor3D(controle);
};

function limpaEstadoArrasteSemPointerLockEditor3D(controle: ControleEventosEditor3D): void {
    controle.refs.arraste.current.arrastando = false;
    controle.refs.arraste.current.botao = null;
    controle.refs.arraste.current.inicioX = 0;
    controle.refs.arraste.current.inicioY = 0;
    controle.refs.arraste.current.ultimoX = 0;
    controle.refs.arraste.current.ultimoY = 0;
    controle.refs.arraste.current.movimentoAcumulado = 0;
    controle.refs.arraste.current.direcaoAjusteVista = null;
    controle.refs.arraste.current.acumuladoAjusteVista = 0;
    controle.refs.arraste.current.ajusteVistaAplicado = false;
    controle.refs.arraste.current.finalizandoModoComPointerLock = false;
};

function animaCameraAteEditor3D(controle: ControleEventosEditor3D, destino: ReturnType<typeof obtemCameraAjusteVistaPorDirecaoEditor3D>): void {
    const arraste = controle.refs.arraste.current;
    const origem = controle.refs.estado.current.camera;
    const inicio = performance.now();

    if (arraste.animacaoCameraFrameId !== null) {
        cancelAnimationFrame(arraste.animacaoCameraFrameId);
        arraste.animacaoCameraFrameId = null;
        controle.refs.acoes.current.finalizaOcultacaoGuiasCenaTemporaria();
    }

    controle.refs.acoes.current.iniciaOcultacaoGuiasCenaTemporaria();

    function animaFrame(agora: number): void {
        const progresso = Math.min(1, (agora - inicio) / duracaoAnimacaoAjusteVistaEditor3D);

        controle.refs.acoes.current.atualizaCamera(interpolaCameraEditor3D(origem, destino, progresso));

        if (progresso < 1) {
            arraste.animacaoCameraFrameId = requestAnimationFrame(animaFrame);

            return;
        }

        arraste.animacaoCameraFrameId = null;
        controle.refs.acoes.current.finalizaOcultacaoGuiasCenaTemporaria();
        controle.refs.acoes.current.resetaFerramentaMouse();
    };

    arraste.animacaoCameraFrameId = requestAnimationFrame(animaFrame);
};

function iniciaAjusteVistaPorArrasteEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    if (!comandoMouseAreaInterativa3DEstaAtivo('alt-mmb-snap-orbital', event)) return false;

    const arraste = controle.refs.arraste.current;

    arraste.arrastando = true;
    arraste.modoArraste = 'AJUSTAR_VISTA';
    arraste.botao = event.button;
    arraste.inicioX = event.clientX;
    arraste.inicioY = event.clientY;
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;
    arraste.movimentoAcumulado = 0;
    arraste.direcaoAjusteVista = null;
    arraste.acumuladoAjusteVista = 0;
    arraste.ajusteVistaAplicado = false;
    arraste.finalizandoModoComPointerLock = false;

    controle.refs.acoes.current.ativaFerramentaMouse('ROTACIONAR_RAPIDO');
    ativaCursorVirtualPorEventoEditor3D(controle, event);
    controle.canvas.focus();
    controle.canvas.requestPointerLock();
    event.preventDefault();

    return true;
};

function iniciaAreaSelecaoPorShiftEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    const state = controle.refs.estado.current;

    if (!comandoMouseAreaInterativa3DEstaAtivo('shift-lmb-seleciona-elemento', event)) return false;
    if (state.modoOperacao !== 'OBJETO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null) return false;

    const arraste = controle.refs.arraste.current;

    arraste.arrastando = true;
    arraste.modoArraste = 'AREA_SELECAO';
    arraste.botao = event.button;
    arraste.inicioX = event.clientX;
    arraste.inicioY = event.clientY;
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;
    arraste.movimentoAcumulado = 0;
    arraste.finalizandoModoComPointerLock = false;

    controle.refs.acoes.current.ativaFerramentaMouse('SELECIONAR_MULTIPLO');
    controle.canvas.focus();
    event.preventDefault();

    return true;
};

function iniciaArrasteEdicaoMalhaPorClickEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    const state = controle.refs.estado.current;

    if (!comandoMouseAreaInterativa3DEstaAtivo('lmb-arrasta-selecao-edicao', event)) return false;
    if (state.modoOperacao !== 'EDICAO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null || state.insetFaceEdicao !== null || state.bevelEdicao !== null) return false;

    const ponto = criaPontoCanvasEditor3D(controle.canvas, event);

    if (!selecionaElementoEdicaoPorClickEditor3D(controle, ponto)) return false;

    const arraste = controle.refs.arraste.current;

    arraste.arrastando = true;
    arraste.modoArraste = 'EDICAO_MALHA';
    arraste.botao = event.button;
    arraste.inicioX = event.clientX;
    arraste.inicioY = event.clientY;
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;
    arraste.movimentoAcumulado = 0;
    arraste.finalizandoModoComPointerLock = false;

    controle.refs.acoes.current.ativaFerramentaMouse('SELECIONAR');
    controle.canvas.focus();
    event.preventDefault();

    return true;
};

function finalizaInsetFacePorMouseEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    if (controle.refs.estado.current.insetFaceEdicao === null) return false;

    if (comandoMouseAreaInterativa3DEstaAtivo('lmb-confirma-inset-face', event)) controle.refs.acoes.current.confirmaInsetFaceEmEdicao();
    else if (comandoMouseAreaInterativa3DEstaAtivo('rmb-cancela-inset-face', event)) controle.refs.acoes.current.cancelaInsetFaceEmEdicao();
    else return false;

    limpaEstadoArrasteSemPointerLockEditor3D(controle);
    event.preventDefault();

    return true;
};

function finalizaBevelPorMouseEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    if (controle.refs.estado.current.bevelEdicao === null) return false;

    if (comandoMouseAreaInterativa3DEstaAtivo('lmb-confirma-bevel', event)) controle.refs.acoes.current.confirmaBevelEmEdicao();
    else if (comandoMouseAreaInterativa3DEstaAtivo('rmb-cancela-bevel', event)) controle.refs.acoes.current.cancelaBevelEmEdicao();
    else return false;

    limpaEstadoArrasteSemPointerLockEditor3D(controle);
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

function processaAreaSelecaoPorArrasteEditor3D(controle: ControleEventosEditor3D, event: MouseEvent, deltaX: number, deltaY: number): boolean {
    const arraste = controle.refs.arraste.current;

    if (!arraste.arrastando || arraste.modoArraste !== 'AREA_SELECAO') return false;

    const ponto = criaPontoCanvasEditor3D(controle.canvas, event);

    arraste.movimentoAcumulado += Math.hypot(deltaX, deltaY);
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;

    const areaSelecaoAtiva = controle.refs.estado.current.areaSelecao !== null;

    if (arraste.movimentoAcumulado <= movimentoMinimoArrasteNavegacaoEditor3D || (!areaSelecaoAtiva && !comandoMouseAreaInterativa3DEstaAtivo('shift-lmb-area-selecao', event))) {
        event.preventDefault();

        return true;
    }

    if (!areaSelecaoAtiva) {
        const inicio = criaPontoCanvasPorCoordenadaEditor3D(controle.canvas, arraste.inicioX, arraste.inicioY);

        controle.refs.acoes.current.ativaFerramentaMouse('AREA_SELECAO');
        controle.refs.acoes.current.iniciaAreaSelecao(inicio.x, inicio.y, true);
    }

    controle.refs.acoes.current.atualizaAreaSelecao(ponto.x, ponto.y);
    event.preventDefault();

    return true;
};

function processaInsetFacePorMovimentoEditor3D(controle: ControleEventosEditor3D, event: MouseEvent, deltaX: number, deltaY: number): boolean {
    const state = controle.refs.estado.current;
    const arraste = controle.refs.arraste.current;

    if (state.insetFaceEdicao === null) return false;

    if (arraste.modoArraste !== 'INSET_FACE' || !Number.isFinite(deltaX) || !Number.isFinite(deltaY)) {
        arraste.modoArraste = 'INSET_FACE';
        arraste.ultimoX = event.clientX;
        arraste.ultimoY = event.clientY;
        event.preventDefault();

        return true;
    }

    controle.refs.acoes.current.atualizaInsetFaceEmEdicao(deltaX - deltaY);
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;
    event.preventDefault();

    return true;
};

function processaBevelPorMovimentoEditor3D(controle: ControleEventosEditor3D, event: MouseEvent, deltaX: number, deltaY: number): boolean {
    const state = controle.refs.estado.current;
    const arraste = controle.refs.arraste.current;

    if (state.bevelEdicao === null) return false;

    if (arraste.modoArraste !== 'BEVEL' || !Number.isFinite(deltaX) || !Number.isFinite(deltaY)) {
        arraste.modoArraste = 'BEVEL';
        arraste.ultimoX = event.clientX;
        arraste.ultimoY = event.clientY;
        event.preventDefault();

        return true;
    }

    controle.refs.acoes.current.atualizaBevelEmEdicao(deltaX - deltaY);
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;
    event.preventDefault();

    return true;
};

function obtemObjetoAtivoEdicaoMouseEditor3D(controle: ControleEventosEditor3D): ObjetoCenaEditor3D | null {
    const state = controle.refs.estado.current;
    const idObjetoAtivo = state.escopoEdicao?.idObjetoAtivo ?? null;

    if (idObjetoAtivo === null) return null;

    return state.objetos.find(objeto => objeto.id === idObjetoAtivo) ?? null;
};

function processaArrasteEdicaoMalhaEditor3D(controle: ControleEventosEditor3D, event: MouseEvent, deltaX: number, deltaY: number): boolean {
    const arraste = controle.refs.arraste.current;

    if (!arraste.arrastando || arraste.modoArraste !== 'EDICAO_MALHA') return false;

    arraste.movimentoAcumulado += Math.hypot(deltaX, deltaY);
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;

    if (arraste.movimentoAcumulado <= movimentoMinimoArrasteNavegacaoEditor3D) {
        event.preventDefault();

        return true;
    }

    controle.refs.acoes.current.moveSelecaoEdicao(criaDeltaMovimentoGrabEditor3D(controle.refs.estado.current.camera, deltaX, deltaY, Math.max(1, controle.canvas.clientWidth), Math.max(1, controle.canvas.clientHeight), null, obtemObjetoAtivoEdicaoMouseEditor3D(controle)));
    event.preventDefault();

    return true;
};

function finalizaArrasteEdicaoMalhaEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    const arraste = controle.refs.arraste.current;

    if (!arraste.arrastando || arraste.modoArraste !== 'EDICAO_MALHA' || arraste.botao !== 0) return false;

    limpaEstadoArrasteSemPointerLockEditor3D(controle);
    event.preventDefault();

    return true;
};

function finalizaAreaSelecaoPorArrasteEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    const arraste = controle.refs.arraste.current;

    if (!arraste.arrastando || arraste.modoArraste !== 'AREA_SELECAO' || arraste.botao !== 0) return false;

    const inicio = criaPontoCanvasPorCoordenadaEditor3D(controle.canvas, arraste.inicioX, arraste.inicioY);
    const fim = criaPontoCanvasEditor3D(controle.canvas, event);

    if (arraste.movimentoAcumulado <= movimentoMinimoArrasteNavegacaoEditor3D && comandoMouseAreaInterativa3DEstaAtivo('shift-lmb-seleciona-elemento', event)) selecionaObjetoPorClickEditor3D(controle, fim, true);
    else {
        controle.refs.acoes.current.atualizaAreaSelecao(fim.x, fim.y);
        selecionaObjetoPorAreaEntrePontosEditor3D(controle, inicio, fim, true);
    }

    controle.refs.acoes.current.finalizaAreaSelecao();
    limpaEstadoArrastePorPointerLockEditor3D(controle, event);
    event.preventDefault();

    return true;
};

function selecionaElementoPorClickEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): boolean {
    const state = controle.refs.estado.current;
    const arraste = controle.refs.arraste.current;

    if (!comandoMouseAreaInterativa3DEstaAtivo('lmb-seleciona-elemento', event)) return false;
    if (arraste.botao !== 0 || arraste.modoArraste !== 'ROTACIONAR' || arraste.movimentoAcumulado > movimentoMinimoArrasteNavegacaoEditor3D) return false;
    if (modoEditor3DEstaAtivo(state.modoAtual)) return false;

    const ponto = criaPontoCanvasPorCoordenadaEditor3D(controle.canvas, arraste.inicioX, arraste.inicioY);

    if (state.modoOperacao === 'EDICAO') selecionaElementoEdicaoPorClickEditor3D(controle, ponto);
    else if (state.modoOperacao === 'OBJETO') selecionaObjetoPorClickEditor3D(controle, ponto, event.shiftKey);
    else return false;

    event.preventDefault();

    return true;
};

export function iniciaArrasteCameraEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): void {
    if (modoEditor3DEstaAtivo(controle.refs.estado.current.modoAtual)) return;
    if (finalizaBevelPorMouseEditor3D(controle, event)) return;
    if (controle.refs.estado.current.bevelEdicao !== null) {
        event.preventDefault();

        return;
    }
    if (finalizaInsetFacePorMouseEditor3D(controle, event)) return;
    if (controle.refs.estado.current.insetFaceEdicao !== null) {
        event.preventDefault();

        return;
    }
    if (iniciaAjusteVistaPorArrasteEditor3D(controle, event)) return;
    if (iniciaAreaSelecaoPorShiftEditor3D(controle, event)) return;
    if (iniciaArrasteEdicaoMalhaPorClickEditor3D(controle, event)) return;

    const ferramenta = obtemFerramentaMouseInicioEditor3D(event);

    if (ferramenta === null) return;

    controle.refs.acoes.current.ativaFerramentaMouse(ferramenta);

    const modoArraste = obtemModoArrastePorFerramentaEditor3D(ferramenta);

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

    ativaCursorVirtualPorEventoEditor3D(controle, event);
    controle.canvas.focus();
    controle.canvas.requestPointerLock();
    event.preventDefault();
};

export function moveMouseEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): void {
    const pointerLockAtivo = document.pointerLockElement === controle.canvas;
    const modoAtualAtivo = modoEditor3DEstaAtivo(controle.refs.estado.current.modoAtual);

    if (modoAtualAtivo && !pointerLockAtivo) return;

    const deltaX = pointerLockAtivo ? event.movementX : event.clientX - controle.refs.arraste.current.ultimoX;
    const deltaY = pointerLockAtivo ? event.movementY : event.clientY - controle.refs.arraste.current.ultimoY;

    if (pointerLockAtivo) atualizaCursorVirtualPorMovimentoEditor3D(controle, event);
    if (processaBevelPorMovimentoEditor3D(controle, event, deltaX, deltaY)) return;
    if (processaInsetFacePorMovimentoEditor3D(controle, event, deltaX, deltaY)) return;
    if (processaAjusteVistaPorArrasteEditor3D(controle, event, deltaX, deltaY)) return;
    if (moveModoAtualEditor3D(controle, event, deltaX, deltaY)) return;
    if (processaAreaSelecaoPorArrasteEditor3D(controle, event, deltaX, deltaY)) return;
    if (processaArrasteEdicaoMalhaEditor3D(controle, event, deltaX, deltaY)) return;

    const arraste = controle.refs.arraste.current;

    if (!arraste.arrastando) return;

    arraste.movimentoAcumulado += Math.hypot(deltaX, deltaY);

    if (arraste.modoArraste === 'ROTACIONAR' && arraste.movimentoAcumulado <= movimentoMinimoArrasteNavegacaoEditor3D) {
        event.preventDefault();

        return;
    }

    const state = controle.refs.estado.current;
    const largura = Math.max(1, controle.canvas.clientWidth);
    const altura = Math.max(1, controle.canvas.clientHeight);
    const novaCamera = arraste.modoArraste === 'PAN' ? aplicaPanCameraEditor3D(state.camera, deltaX, deltaY, largura, altura) : arraste.modoArraste === 'DOLLY' ? aplicaDollyCameraEditor3D(state.camera, deltaY) : aplicaRotacaoCameraEditor3D(state.camera, deltaX, deltaY);

    controle.refs.acoes.current.atualizaCamera(novaCamera);
    arraste.ultimoX = event.clientX;
    arraste.ultimoY = event.clientY;
    event.preventDefault();
};

export function finalizaArrasteCameraEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): void {
    if (modoEditor3DEstaAtivo(controle.refs.estado.current.modoAtual)) return;
    if (!controle.refs.arraste.current.arrastando) return;
    if (finalizaAreaSelecaoPorArrasteEditor3D(controle, event)) return;
    if (finalizaArrasteEdicaoMalhaEditor3D(controle, event)) return;

    selecionaElementoPorClickEditor3D(controle, event);
    limpaEstadoArrastePorPointerLockEditor3D(controle, event);

    if (document.pointerLockElement === controle.canvas) document.exitPointerLock();

    event.preventDefault();
};

export function aplicaDollyScrollMouseEditor3D(controle: ControleEventosEditor3D, event: WheelEvent): void {
    const state = controle.refs.estado.current;

    if (modoEditor3DEstaAtivo(state.modoAtual)) return;
    if (state.bevelEdicao !== null) {
        if (comandoRodaMouseAreaInterativa3DEstaAtivo('scroll-segmentos-bevel')) controle.refs.acoes.current.alteraSegmentosBevelEmEdicao(event.deltaY < 0 ? 1 : -1);
        event.preventDefault();

        return;
    }
    if (state.insetFaceEdicao !== null) {
        event.preventDefault();

        return;
    }
    if (!comandoRodaMouseAreaInterativa3DEstaAtivo('scroll-dolly-camera')) return;

    controle.refs.acoes.current.atualizaCamera(aplicaDollyCameraEditor3D(state.camera, event.deltaY));
    event.preventDefault();
};

export function finalizaArrastePorPerdaPointerLockEditor3D(controle: ControleEventosEditor3D): void {
    const state = controle.refs.estado.current;
    const arraste = controle.refs.arraste.current;
    const finalizacaoEsperadaModo = arraste.finalizandoModoComPointerLock;

    if (document.pointerLockElement === controle.canvas) return;

    arraste.finalizandoModoComPointerLock = false;
    limpaEstadoArrastePorPointerLockEditor3D(controle);

    if (modoEditor3DEstaAtivo(state.modoAtual) && !finalizacaoEsperadaModo) controle.refs.acoes.current.cancelaModoAtual();
};