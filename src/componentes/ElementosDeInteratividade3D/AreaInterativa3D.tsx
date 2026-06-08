'use client';

import styles from './styles.module.css';

import { CursorVirtualEditor3D } from './mouse/CursorVirtualEditor3D';
import { OverlayAreaSelecaoEditor3D } from './overlay/OverlayAreaSelecaoEditor3D';
import { OverlayModoEditor3D } from './overlay/OverlayModoEditor3D';
import { RenderizadorEditor3D } from './renderizador/RenderizadorEditor3D';
import { renderizacaoEditor3DExibeAmbienteEdicao, type ModoRenderizacaoEditor3D } from './renderizador/editor3D.renderizador.modo';

interface AreaInterativa3DProps {
    readonly modoRenderizacao?: ModoRenderizacaoEditor3D;
};

export function AreaInterativa3D({ modoRenderizacao = 'EDICAO' }: AreaInterativa3DProps) {
    const exibeAmbienteEdicao = renderizacaoEditor3DExibeAmbienteEdicao(modoRenderizacao);

    return (
        <section className={styles.areaInterativa3D} aria-label="Área interativa 3D">
            <RenderizadorEditor3D modoRenderizacao={modoRenderizacao} />

            {exibeAmbienteEdicao && <OverlayAreaSelecaoEditor3D />}

            {exibeAmbienteEdicao && <OverlayModoEditor3D />}

            {exibeAmbienteEdicao && <CursorVirtualEditor3D />}
        </section>
    );
};
