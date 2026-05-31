import { criaDeltaMovimentoGrabEditor3D } from '../../modos/grab/editor3D.modoGrab.movimento';
import { criaDeltaRotacaoEditor3D } from '../../modos/rotate/editor3D.modoRotate.movimento';
import { criaDeltaScaleEditor3D } from '../../modos/scale/editor3D.modoScale.movimento';
import { comandoMouseAreaInterativa3DEstaAtivo } from '../../comandos/editor3D.comandos';
import { desativaCursorVirtualEditor3D } from './editor3D.eventos.cursor';
import type { ControleEventosEditor3D } from './editor3D.eventos.types';
import type { ObjetoCenaEditor3D } from '../../editor/editor3D.tipos';

function obtemObjetoEdicaoGrabEditor3D(controle: ControleEventosEditor3D): ObjetoCenaEditor3D | null {
    const state = controle.refs.estado.current;
    const modoAtual = state.modoAtual;

    if (modoAtual.tipo !== 'GRAB' || modoAtual.escopo !== 'EDICAO') return null;

    return state.objetos.find(objeto => objeto.id === modoAtual.idObjeto) ?? null;
};

export function moveModoAtualEditor3D(controle: ControleEventosEditor3D, event: MouseEvent, deltaX: number, deltaY: number): boolean {
    const state = controle.refs.estado.current;
    const acoes = controle.refs.acoes.current;
    const largura = Math.max(1, controle.canvas.clientWidth);
    const altura = Math.max(1, controle.canvas.clientHeight);

    if (state.modoAtual.tipo === 'GRAB') {
        acoes.moveObjetoGrab(criaDeltaMovimentoGrabEditor3D(state.camera, deltaX, deltaY, largura, altura, state.modoAtual.eixo, obtemObjetoEdicaoGrabEditor3D(controle)));
        event.preventDefault();

        return true;
    }

    if (state.modoAtual.tipo === 'ROTATE') {
        acoes.rotacionaObjetoRotate(criaDeltaRotacaoEditor3D(state.camera, state.modoAtual, deltaX, deltaY));
        event.preventDefault();

        return true;
    }

    if (state.modoAtual.tipo === 'SCALE') {
        acoes.escalaObjetoScale(criaDeltaScaleEditor3D(state.camera, state.modoAtual, deltaX, deltaY));
        event.preventDefault();

        return true;
    }

    return false;
};

export function finalizaOuCancelaModoAtualEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): void {
    const state = controle.refs.estado.current;
    const deveConfirmar = comandoMouseAreaInterativa3DEstaAtivo('lmb-confirma-transform', event);
    const deveCancelar = comandoMouseAreaInterativa3DEstaAtivo('rmb-cancela-transform', event);

    if (state.modoAtual.tipo === 'NENHUM') return;
    if (deveConfirmar) controle.refs.acoes.current.confirmaModoAtual();
    if (deveCancelar) controle.refs.acoes.current.cancelaModoAtual();

    if (deveConfirmar || deveCancelar) {
        const pointerLockAtivo = document.pointerLockElement === controle.canvas;

        controle.refs.arraste.current.finalizandoModoComPointerLock = pointerLockAtivo;
        desativaCursorVirtualEditor3D(controle);
        if (pointerLockAtivo) document.exitPointerLock();

        event.preventDefault();
    }
};
