'use client';

import styles from './styles.module.css';

import { useEffect, useRef } from 'react';

import { OverlayGizmoEixosEditor3D } from './OverlayGizmoEixosEditor3D';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import { useRenderizadorEditor3D } from './useRenderizadorEditor3D';
import type { FerramentaMouseEditor3D } from '../mouse/editor3D.mouse.tipos';

const duracaoNotificacaoAreaInterativaEditor3D = 3200;

function obtemClasseCursorEditor3D(tipoModo: string, ferramentaMouse: FerramentaMouseEditor3D): string {
    if (tipoModo === 'GRAB') return styles.canvas3dGrabAtivo;
    if (tipoModo === 'ROTATE') return styles.canvas3dRotateAtivo;
    if (tipoModo === 'SCALE') return styles.canvas3dScaleAtivo;
    if (ferramentaMouse === 'PAN') return styles.canvas3dPanAtivo;
    if (ferramentaMouse === 'DOLLY') return styles.canvas3dDollyAtivo;
    if (ferramentaMouse === 'ROTACIONAR_RAPIDO') return styles.canvas3dRotacaoRapidaAtiva;
    if (ferramentaMouse === 'ROTACIONAR') return styles.canvas3dRotacaoMouseAtiva;
    if (ferramentaMouse === 'SELECIONAR_MULTIPLO' || ferramentaMouse === 'AREA_SELECAO') return styles.canvas3dSelecionarAtivo;

    return styles.canvas3dMovimentacaoAtiva;
};

export function RenderizadorEditor3D() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const cursorFantasmaRef = useRef<HTMLDivElement | null>(null);
    const { estado, acoes } = useEditor3DContexto();
    const webglDisponivel = useRenderizadorEditor3D(canvasRef, cursorFantasmaRef);
    const classeCursor = obtemClasseCursorEditor3D(estado.modoAtual.tipo, estado.ferramentaMouse);
    const notificacao = estado.notificacaoAreaInterativa;

    useEffect(() => {
        if (notificacao === null) return;

        const idTimeout = window.setTimeout(() => acoes.limpaNotificacaoAreaInterativa(notificacao.id), duracaoNotificacaoAreaInterativaEditor3D);

        return () => window.clearTimeout(idTimeout);
    }, [acoes, notificacao]);

    return (
        <>
            <canvas ref={canvasRef} className={`${styles.canvas3d} ${classeCursor}`} aria-label="Área interativa 3D" tabIndex={0} />
            <div ref={cursorFantasmaRef} className={styles.cursorFantasmaEditor3D} aria-hidden="true" />
            {notificacao !== null && <div className={styles.notificacaoAreaInterativaEditor3D} role="status" aria-live="polite">{notificacao.texto}</div>}
            <OverlayGizmoEixosEditor3D canvasRef={canvasRef} />

            {!webglDisponivel && <div className={styles.webglAviso}>WebGL indisponível neste navegador.</div>}
        </>
    );
};
