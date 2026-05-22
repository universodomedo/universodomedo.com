import { criaDeltaMovimentoGrabEditor3D } from '../../modos/grab/editor3D.modoGrab.movimento';
import { criaDeltaRotacaoEditor3D } from '../../modos/rotate/editor3D.modoRotate.movimento';
import { criaDeltaScaleEditor3D } from '../../modos/scale/editor3D.modoScale.movimento';
import { desativaCursorVirtualEditor3D } from './editor3D.eventos.cursor';
import type { ControleEventosEditor3D } from './editor3D.eventos.types';

export function moveModoAtualEditor3D(controle: ControleEventosEditor3D, event: MouseEvent, deltaX: number, deltaY: number): boolean {
    const state = controle.refs.estado.current;
    const acoes = controle.refs.acoes.current;
    const largura = Math.max(1, controle.canvas.clientWidth);
    const altura = Math.max(1, controle.canvas.clientHeight);

    if (state.modoAtual.tipo === 'GRAB') {
        acoes.moveObjetoGrab(criaDeltaMovimentoGrabEditor3D(state.camera, deltaX, deltaY, largura, altura, state.modoAtual.eixo));
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

    if (state.modoAtual.tipo === 'NENHUM') return;
    if (event.button === 0) controle.refs.acoes.current.confirmaModoAtual();
    if (event.button === 2) controle.refs.acoes.current.cancelaModoAtual();

    if (event.button === 0 || event.button === 2) {
        desativaCursorVirtualEditor3D(controle);
        if (document.pointerLockElement === controle.canvas) document.exitPointerLock();

        event.preventDefault();
    }
};