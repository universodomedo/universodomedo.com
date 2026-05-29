'use client';

import styles from './styles.module.css';

import { obtemEstadoToolbarInteracaoAtualEditor3D } from '../comandos/editor3D.comandos';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';

export function ToolbarMouseEditor3D() {
    const { estado } = useEditor3DContexto();
    const modoAtual = obtemEstadoToolbarInteracaoAtualEditor3D(estado.modoAtual.tipo, estado.ferramentaMouse);

    return (
        <aside className={styles.toolbarMouseEditor3D} data-editor3d-toolbar-mouse="true" aria-label="Modo atual de interacao">
            <div className={styles.visualizadorModoAtualEditor3D} title={`${modoAtual.titulo}${modoAtual.atalho === null ? '' : ` (${modoAtual.atalho})`}`} aria-live="polite">
                <span className={styles.iconeModoAtualEditor3D}>{modoAtual.icone}</span>
                <strong>{modoAtual.titulo}</strong>
                {modoAtual.subtitulo !== null && <span className={styles.subtituloModoAtualEditor3D}>{modoAtual.subtitulo}</span>}
            </div>
        </aside>
    );
};
