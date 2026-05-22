'use client';

import styles from './styles.module.css';

import { CursorVirtualEditor3D } from './mouse/CursorVirtualEditor3D';
import { OverlayAreaSelecaoEditor3D } from './overlay/OverlayAreaSelecaoEditor3D';
import { OverlayModoEditor3D } from './overlay/OverlayModoEditor3D';
import { RenderizadorEditor3D } from './renderizador/RenderizadorEditor3D';

export function AreaInterativa3D() {
    return (
        <section className={styles.areaInterativa3D} aria-label="Área interativa 3D">
            <RenderizadorEditor3D />

            <OverlayAreaSelecaoEditor3D />

            <OverlayModoEditor3D />

            <CursorVirtualEditor3D />
        </section>
    );
};