'use client';

import styles from './styles.module.css';

import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import { criaDadosOverlayModoEditor3D } from './editor3D.overlay.dados';

export function OverlayModoEditor3D() {
    const { estado } = useEditor3DContexto();
    const dadosOverlay = criaDadosOverlayModoEditor3D(estado);

    if (dadosOverlay === null) return null;

    return (
        <div className={styles.overlayModoEditor3D}>
            <span>{dadosOverlay.titulo}</span>
            <strong>{dadosOverlay.nomeObjeto}</strong>

            {dadosOverlay.detalhes.map(detalhe => (
                <span key={detalhe}>{detalhe}</span>
            ))}
        </div>
    );
};