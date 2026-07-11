'use client';

import styles from './Editor3D.module.css';

import { CURSOR_MODO_TRANSFORM_EDITOR3D, ROTULO_MODO_TRANSFORM_EDITOR3D, type ModoTransformEditor3D } from './editor3D.tipos';

// Glifo que representa cada modo. 'select' = seta padrão; 'rotate' = ícone de rotação (seta circular); 'translate'/'scale' = setas.
function GlifoCursorModo({ modo }: { readonly modo: ModoTransformEditor3D }) {
    if (modo === 'rotate') {
        return (
            <svg viewBox="0 0 24 24" className={styles.glifo_cursor_rotacao} aria-hidden="true">
                <path d="M12 5A7 7 0 1 1 5 12" />
                <path d="M3.5 14.6 5 12 6.5 14.6" />
            </svg>
        );
    }
    if (modo === 'translate') {
        return (
            <svg viewBox="0 0 24 24" className={styles.glifo_cursor} aria-hidden="true">
                <path d="M12 3l3 3h-2v5h5V9l3 3-3 3v-2h-5v5h2l-3 3-3-3h2v-5H6v2l-3-3 3-3v2h5V6H9z" />
            </svg>
        );
    }
    if (modo === 'scale') {
        return (
            <svg viewBox="0 0 24 24" className={styles.glifo_cursor} aria-hidden="true">
                <path d="M4 4h7L8.5 6.5l9 9L20 13v7h-7l2.5-2.5-9-9L4 11z" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" className={styles.glifo_cursor} aria-hidden="true">
            <path d="M5 3v15.5L9 15l2.5 5.5 2.2-.9-2.5-5.4h5.3z" />
        </svg>
    );
};

interface IndicadorModoEditor3DProps {
    readonly modo: ModoTransformEditor3D;
};

// Indicador de modo (SSOT `modo` do Editor): quadro com o cursor do modo + nome embaixo. Só exibe; a troca de modo é por atalho (G/R/S).
export function IndicadorModoEditor3D({ modo }: IndicadorModoEditor3DProps) {
    return (
        <div className={styles.indicador_modo}>
            <div className={styles.quadro_indicador_modo} style={{ cursor: CURSOR_MODO_TRANSFORM_EDITOR3D[modo] }} title={`Modo atual: ${ROTULO_MODO_TRANSFORM_EDITOR3D[modo]}`}>
                <GlifoCursorModo modo={modo} />
            </div>
            <span className={styles.nome_indicador_modo}>{ROTULO_MODO_TRANSFORM_EDITOR3D[modo]}</span>
        </div>
    );
};
