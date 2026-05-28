'use client';

import styles from './styles.module.css';

import { CampoStatusEditor3D } from './CampoStatusEditor3D';
import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';

export function PainelViewportEditor3D() {
    const { estado, acoes } = useEditor3DContexto();

    return (
        <PainelColapsavelEditor3D titulo="Viewport" valor={estado.camera.planoGuia}>
            <CampoStatusEditor3D titulo="Gizmo" valor="Click" />
            <CampoStatusEditor3D titulo="Rotate" valor="MMB" />
            <CampoStatusEditor3D titulo="Pan" valor="Shift + MMB" />
            <CampoStatusEditor3D titulo="Snap" valor="Alt + MMB" />
            <CampoStatusEditor3D titulo="Zoom" valor="Scroll" />
            <CampoStatusEditor3D titulo="Zoom" valor={`${estado.camera.zoom.toFixed(2)}x`} />

            <div className={styles.linhaBotoes}>
                <button className={styles.botaoControle} type="button" onClick={acoes.resetaCamera}>Reset View</button>
            </div>
        </PainelColapsavelEditor3D>
    );
};
