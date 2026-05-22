import { aplicaCameraPorAtalhoEditor3D } from '../editor3D.renderizador.helpers';
import { ativaCursorVirtualCentroEditor3D, desativaCursorVirtualEditor3D } from './editor3D.eventos.cursor';
import { obtemEixoTeclaEditor3D } from './editor3D.eventos.eixo';
import type { ControleEventosEditor3D } from './editor3D.eventos.types';

function eventoVeioDeElementoEditavel(event: KeyboardEvent): boolean {
    const alvo = event.target;

    if (!(alvo instanceof Element)) return false;

    return alvo.closest('input, textarea, select, button, [contenteditable="true"]') !== null;
};

function temObjetoSelecionado(controle: ControleEventosEditor3D): boolean {
    const state = controle.refs.estado.current;

    return state.idsObjetosSelecionados.some(idObjetoSelecionado => state.objetos.some(objeto => objeto.id === idObjetoSelecionado));
};

function encerraPointerLockEditor3D(controle: ControleEventosEditor3D): void {
    desativaCursorVirtualEditor3D(controle);
    if (document.pointerLockElement === controle.canvas) document.exitPointerLock();
};

function teclaEntradaNumericaRotateEditor3D(tecla: string): boolean { return tecla.length === 1 && ((tecla >= '0' && tecla <= '9') || tecla === '-' || tecla === '+' || tecla === '.' || tecla === ','); };
function entradaNumericaRotateValidaEditor3D(entrada: string): boolean { return /^[-+]?\d*([.,]\d*)?$/.test(entrada); };

function iniciaModoPorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const tecla = event.key.toLowerCase();
    const state = controle.refs.estado.current;

    if (tecla === 'g' && state.modoAtual.tipo === 'NENHUM' && temObjetoSelecionado(controle)) controle.refs.acoes.current.iniciaGrabObjetoSelecionado();
    else if (tecla === 'r' && state.modoAtual.tipo === 'NENHUM' && temObjetoSelecionado(controle)) controle.refs.acoes.current.iniciaRotateObjetoSelecionado();
    else if (tecla === 's' && state.modoAtual.tipo === 'NENHUM' && temObjetoSelecionado(controle)) controle.refs.acoes.current.iniciaScaleObjetoSelecionado();
    else if (tecla === 'r' && state.modoAtual.tipo === 'ROTATE') controle.refs.acoes.current.aplicaRotateLivreObjetoSelecionado();
    else return false;

    ativaCursorVirtualCentroEditor3D(controle);
    controle.canvas.focus();
    controle.canvas.requestPointerLock();
    event.preventDefault();

    return true;
};

function aplicaEixoModoPorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const eixo = obtemEixoTeclaEditor3D(event.key);
    const state = controle.refs.estado.current;

    if (eixo === null) return false;
    if (state.modoAtual.tipo === 'GRAB') controle.refs.acoes.current.aplicaEixoGrabObjetoSelecionado(eixo);
    else if (state.modoAtual.tipo === 'ROTATE') controle.refs.acoes.current.aplicaEixoRotateObjetoSelecionado(eixo);
    else if (state.modoAtual.tipo === 'SCALE') controle.refs.acoes.current.aplicaEixoScaleObjetoSelecionado(eixo);
    else return false;

    event.preventDefault();

    return true;
};

function aplicaEntradaNumericaRotatePorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const modoAtual = controle.refs.estado.current.modoAtual;

    if (modoAtual.tipo !== 'ROTATE' || modoAtual.eixo === null) return false;

    if (event.key === 'Enter') {
        controle.refs.acoes.current.confirmaModoAtual();
        encerraPointerLockEditor3D(controle);
        event.preventDefault();

        return true;
    }

    if (event.key === 'Escape') {
        controle.refs.acoes.current.cancelaModoAtual();
        encerraPointerLockEditor3D(controle);
        event.preventDefault();

        return true;
    }

    if (event.key === 'Backspace') {
        controle.refs.acoes.current.atualizaEntradaNumericaRotate(modoAtual.entradaNumerica.slice(0, -1));
        event.preventDefault();

        return true;
    }

    if (!teclaEntradaNumericaRotateEditor3D(event.key)) return false;

    const proximaEntrada = `${modoAtual.entradaNumerica}${event.key}`;

    if (entradaNumericaRotateValidaEditor3D(proximaEntrada)) controle.refs.acoes.current.atualizaEntradaNumericaRotate(proximaEntrada);

    event.preventDefault();

    return true;
};

export function aplicaAtalhoTecladoEditor3D(controle: ControleEventosEditor3D, event: KeyboardEvent): void {
    const state = controle.refs.estado.current;

    if (eventoVeioDeElementoEditavel(event)) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (iniciaModoPorAtalho(controle, event)) return;
    if (aplicaEixoModoPorAtalho(controle, event)) return;
    if (aplicaEntradaNumericaRotatePorAtalho(controle, event)) return;
    if (state.modoAtual.tipo !== 'NENHUM') return;

    const novaCamera = aplicaCameraPorAtalhoEditor3D(event.key, state.camera);

    if (novaCamera === null) return;

    controle.refs.acoes.current.atualizaCamera(novaCamera);
    event.preventDefault();
};