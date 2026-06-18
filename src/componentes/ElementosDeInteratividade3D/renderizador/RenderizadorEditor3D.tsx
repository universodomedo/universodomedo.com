'use client';

import styles from './styles.module.css';

import { useEffect, useRef } from 'react';

import { OverlayGizmoEixosEditor3D } from './OverlayGizmoEixosEditor3D';
import type { ConfiguracaoCameraJogo3D } from './editor3D.renderizador.jogo';
import { renderizacaoEditor3DExibeAmbienteEdicao, type ModoRenderizacaoEditor3D } from './editor3D.renderizador.modo';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import { useRenderizadorEditor3D } from './useRenderizadorEditor3D';
import type { FerramentaMouseEditor3D } from '../mouse/editor3D.mouse.tipos';

const duracaoNotificacaoAreaInterativaEditor3D = 3200;

interface RenderizadorEditor3DProps {
    readonly modoRenderizacao?: ModoRenderizacaoEditor3D;
    readonly configuracaoCameraJogo?: ConfiguracaoCameraJogo3D;
};

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

export function RenderizadorEditor3D({ modoRenderizacao = 'EDICAO', configuracaoCameraJogo }: RenderizadorEditor3DProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const cursorFantasmaRef = useRef<HTMLDivElement | null>(null);
    const { estado, acoes } = useEditor3DContexto();
    const webglDisponivel = useRenderizadorEditor3D(canvasRef, cursorFantasmaRef, modoRenderizacao, configuracaoCameraJogo);
    const exibeAmbienteEdicao = renderizacaoEditor3DExibeAmbienteEdicao(modoRenderizacao);
    const classeCursor = obtemClasseCursorEditor3D(estado.modoAtual.tipo, estado.ferramentaMouse);
    const notificacao = estado.notificacaoAreaInterativa;

    useEffect(() => {
        if (!exibeAmbienteEdicao) return;
        if (notificacao === null) return;

        const idTimeout = window.setTimeout(() => acoes.limpaNotificacaoAreaInterativa(notificacao.id), duracaoNotificacaoAreaInterativaEditor3D);

        return () => window.clearTimeout(idTimeout);
    }, [acoes, exibeAmbienteEdicao, notificacao]);

    return (
        <>
            <canvas ref={canvasRef} className={`${styles.canvas3d} ${exibeAmbienteEdicao ? classeCursor : ''}`} aria-label="Área interativa 3D" tabIndex={exibeAmbienteEdicao ? 0 : -1} />
            {exibeAmbienteEdicao && <div ref={cursorFantasmaRef} className={styles.cursorFantasmaEditor3D} aria-hidden="true" />}
            {exibeAmbienteEdicao && notificacao !== null && <div className={styles.notificacaoAreaInterativaEditor3D} role="status" aria-live="polite">{notificacao.texto}</div>}
            {exibeAmbienteEdicao && <OverlayGizmoEixosEditor3D canvasRef={canvasRef} />}

            {!webglDisponivel && <div className={styles.webglAviso}>WebGL indisponível neste navegador.</div>}
        </>
    );
};
