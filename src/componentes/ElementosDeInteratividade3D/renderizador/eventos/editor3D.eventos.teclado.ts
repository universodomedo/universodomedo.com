import { ativaCursorVirtualCentroEditor3D, desativaCursorVirtualEditor3D } from './editor3D.eventos.cursor';
import { comandoTecladoAreaInterativa3DEstaAtivo, comandoTecladoAreaInterativa3DUsaTecla, obtemModoVisualizacaoViewportPorAtalhoEditor3D } from '../../comandos/editor3D.comandos';
import { obtemMotivoBloqueioInsetFacesEditor3D } from '../../estado/editor3D.estado.edicao.selectors';
import { obtemEixoTeclaEditor3D } from './editor3D.eventos.eixo';
import { modoVisualizacaoViewportPermiteXRayEditor3D } from '../../viewport/editor3D.viewport.tipos';
import type { ControleEventosEditor3D } from './editor3D.eventos.types';
import type { FerramentaMouseEditor3D } from '../../mouse/editor3D.mouse.tipos';

const avisoXRayIncompativelEditor3D = 'X-Ray so esta disponivel nas visualizacoes Solido e Estrutura.';

function eventoVeioDeElementoEditavel(event: KeyboardEvent): boolean {
    const alvo = event.target;

    if (!(alvo instanceof Element)) return false;

    return alvo.closest('input, textarea, select, [contenteditable="true"]') !== null;
};

function temObjetoSelecionado(controle: ControleEventosEditor3D): boolean {
    const state = controle.refs.estado.current;

    return state.modoOperacao === 'OBJETO' && state.idsObjetosSelecionados.some(idObjetoSelecionado => state.objetos.some(objeto => objeto.id === idObjetoSelecionado));
};

function encerraPointerLockEditor3D(controle: ControleEventosEditor3D): void {
    desativaCursorVirtualEditor3D(controle);
    if (document.pointerLockElement === controle.canvas) document.exitPointerLock();
};

function entradaNumericaRotateValidaEditor3D(entrada: string): boolean { return /^[-+]?\d*([.,]\d*)?$/.test(entrada); };

function ferramentaMouseEhModoSelecionarEditor3D(ferramentaMouse: FerramentaMouseEditor3D): boolean { return ferramentaMouse === 'SELECIONAR_MULTIPLO' || ferramentaMouse === 'AREA_SELECAO'; };

function ativaModoSelecionarPorShiftEditor3D(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const state = controle.refs.estado.current;

    if (!comandoTecladoAreaInterativa3DEstaAtivo('shift-modo-selecionar', event)) return false;
    if (state.modoOperacao !== 'OBJETO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null || controle.refs.arraste.current.arrastando) return false;

    controle.refs.acoes.current.ativaFerramentaMouse('SELECIONAR_MULTIPLO');

    return true;
};

function defineModoVisualizacaoViewportPorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const modoVisualizacaoViewport = obtemModoVisualizacaoViewportPorAtalhoEditor3D(event);

    if (modoVisualizacaoViewport === null) return false;

    controle.refs.acoes.current.defineModoVisualizacaoViewport(modoVisualizacaoViewport);
    event.preventDefault();

    return true;
};

function alternaVisualizacaoXRayPorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const state = controle.refs.estado.current;

    if (!comandoTecladoAreaInterativa3DEstaAtivo('alt-x-visualizacao-xray', event)) return false;

    if (!modoVisualizacaoViewportPermiteXRayEditor3D(state.modoVisualizacaoViewport)) {
        controle.refs.acoes.current.exibeNotificacaoAreaInterativa(avisoXRayIncompativelEditor3D);
        event.preventDefault();

        return true;
    }

    controle.refs.acoes.current.alternaVisualizacaoXRay();
    event.preventDefault();

    return true;
};

function iniciaModoPorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const state = controle.refs.estado.current;

    if (state.modoOperacao !== 'OBJETO') return false;
    if (comandoTecladoAreaInterativa3DEstaAtivo('mover', event) && state.modoAtual.tipo === 'NENHUM' && temObjetoSelecionado(controle)) controle.refs.acoes.current.iniciaGrabObjetoSelecionado();
    else if (comandoTecladoAreaInterativa3DEstaAtivo('rotacionar', event) && state.modoAtual.tipo === 'NENHUM' && temObjetoSelecionado(controle)) controle.refs.acoes.current.iniciaRotateObjetoSelecionado();
    else if (comandoTecladoAreaInterativa3DEstaAtivo('escalar', event) && state.modoAtual.tipo === 'NENHUM' && temObjetoSelecionado(controle)) controle.refs.acoes.current.iniciaScaleObjetoSelecionado();
    else if (comandoTecladoAreaInterativa3DEstaAtivo('r-rotacionar-livre', event) && state.modoAtual.tipo === 'ROTATE') controle.refs.acoes.current.aplicaRotateLivreObjetoSelecionado();
    else return false;

    ativaCursorVirtualCentroEditor3D(controle);
    controle.canvas.focus();
    controle.refs.arraste.current.finalizandoModoComPointerLock = false;
    controle.canvas.requestPointerLock();
    event.preventDefault();

    return true;
};

function aplicaEixoModoPorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    if (!comandoTecladoAreaInterativa3DEstaAtivo('xyz-eixo', event)) return false;

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

    if (comandoTecladoAreaInterativa3DEstaAtivo('enter-rotacao-eixo', event)) {
        controle.refs.acoes.current.confirmaModoAtual();
        encerraPointerLockEditor3D(controle);
        event.preventDefault();

        return true;
    }

    if (comandoTecladoAreaInterativa3DEstaAtivo('escape-rotacao-numerica', event)) {
        controle.refs.acoes.current.cancelaModoAtual();
        encerraPointerLockEditor3D(controle);
        event.preventDefault();

        return true;
    }

    if (comandoTecladoAreaInterativa3DEstaAtivo('backspace-rotacao-numerica', event)) {
        controle.refs.acoes.current.atualizaEntradaNumericaRotate(modoAtual.entradaNumerica.slice(0, -1));
        event.preventDefault();

        return true;
    }

    if (!comandoTecladoAreaInterativa3DEstaAtivo('valor-rotacao-numerica', event)) return false;

    const proximaEntrada = `${modoAtual.entradaNumerica}${event.key}`;

    if (entradaNumericaRotateValidaEditor3D(proximaEntrada)) controle.refs.acoes.current.atualizaEntradaNumericaRotate(proximaEntrada);

    event.preventDefault();

    return true;
};

function deletaObjetosSelecionadosPorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const state = controle.refs.estado.current;

    if (!comandoTecladoAreaInterativa3DEstaAtivo('delete-objetos', event)) return false;
    if (state.modoOperacao !== 'OBJETO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null || state.idsObjetosSelecionados.length === 0) return false;

    controle.refs.acoes.current.deletaObjetosSelecionados();
    event.preventDefault();

    return true;
};

function aplicaInsetFacesPorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const state = controle.refs.estado.current;

    if (!comandoTecladoAreaInterativa3DEstaAtivo('i-inset-faces', event)) return false;
    if (state.modoOperacao !== 'EDICAO') return false;

    const motivoBloqueio = obtemMotivoBloqueioInsetFacesEditor3D(state);

    if (motivoBloqueio !== null) {
        controle.refs.acoes.current.exibeNotificacaoAreaInterativa(motivoBloqueio);
        event.preventDefault();

        return true;
    }

    controle.refs.acoes.current.iniciaInsetFaceSelecionada();
    controle.refs.arraste.current.modoArraste = 'INSET_FACE';
    controle.refs.arraste.current.ultimoX = Number.NaN;
    controle.refs.arraste.current.ultimoY = Number.NaN;
    event.preventDefault();

    return true;
};

function defineTipoSelecaoEdicaoPorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const state = controle.refs.estado.current;

    if (state.modoOperacao !== 'EDICAO' || state.modoAtual.tipo !== 'NENHUM' || state.malhaEmCriacao !== null || state.insetFaceEdicao !== null) return false;

    if (comandoTecladoAreaInterativa3DEstaAtivo('1-selecao-vertice-edicao', event)) controle.refs.acoes.current.defineTipoSelecaoEdicao('VERTICE');
    else if (comandoTecladoAreaInterativa3DEstaAtivo('2-selecao-aresta-edicao', event)) controle.refs.acoes.current.defineTipoSelecaoEdicao('ARESTA');
    else if (comandoTecladoAreaInterativa3DEstaAtivo('3-selecao-face-edicao', event)) controle.refs.acoes.current.defineTipoSelecaoEdicao('FACE');
    else return false;

    event.preventDefault();

    return true;
};

function finalizaInsetFacesPorAtalho(controle: ControleEventosEditor3D, event: KeyboardEvent): boolean {
    const state = controle.refs.estado.current;

    if (state.insetFaceEdicao === null) return false;

    if (comandoTecladoAreaInterativa3DEstaAtivo('enter-confirma-inset-face', event)) controle.refs.acoes.current.confirmaInsetFaceEmEdicao();
    else if (comandoTecladoAreaInterativa3DEstaAtivo('escape-cancela-inset-face', event)) controle.refs.acoes.current.cancelaInsetFaceEmEdicao();
    else return false;

    controle.refs.arraste.current.modoArraste = 'ROTACIONAR';
    controle.refs.arraste.current.ultimoX = 0;
    controle.refs.arraste.current.ultimoY = 0;
    event.preventDefault();

    return true;
};

export function aplicaAtalhoTecladoEditor3D(controle: ControleEventosEditor3D, event: KeyboardEvent): void {
    const state = controle.refs.estado.current;

    if (eventoVeioDeElementoEditavel(event)) return;
    if (defineModoVisualizacaoViewportPorAtalho(controle, event)) return;
    if (alternaVisualizacaoXRayPorAtalho(controle, event)) return;
    if (finalizaInsetFacesPorAtalho(controle, event)) return;
    if (ativaModoSelecionarPorShiftEditor3D(controle, event)) return;
    if (iniciaModoPorAtalho(controle, event)) return;
    if (aplicaEixoModoPorAtalho(controle, event)) return;
    if (aplicaEntradaNumericaRotatePorAtalho(controle, event)) return;
    if (deletaObjetosSelecionadosPorAtalho(controle, event)) return;
    if (defineTipoSelecaoEdicaoPorAtalho(controle, event)) return;
    if (aplicaInsetFacesPorAtalho(controle, event)) return;
    if (state.modoAtual.tipo !== 'NENHUM') return;
};

export function finalizaModoSelecionarPorShiftEditor3D(controle: ControleEventosEditor3D, event: KeyboardEvent): void {
    const state = controle.refs.estado.current;

    if (!comandoTecladoAreaInterativa3DUsaTecla('shift-modo-selecionar', event.key)) return;
    if (state.modoAtual.tipo !== 'NENHUM' || controle.refs.arraste.current.arrastando) return;
    if (ferramentaMouseEhModoSelecionarEditor3D(state.ferramentaMouse)) controle.refs.acoes.current.resetaFerramentaMouse();
};

export function cancelaModoSelecionarPorPerdaFocoEditor3D(controle: ControleEventosEditor3D): void {
    const state = controle.refs.estado.current;

    if (state.modoAtual.tipo !== 'NENHUM' || controle.refs.arraste.current.arrastando) return;
    if (ferramentaMouseEhModoSelecionarEditor3D(state.ferramentaMouse)) controle.refs.acoes.current.resetaFerramentaMouse();
};
