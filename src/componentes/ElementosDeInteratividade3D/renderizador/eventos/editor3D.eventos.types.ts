import type { RefObject } from 'react';

import type { RefsRenderizadorEditor3D } from '../editor3D.renderizador.refs';

export interface ControleEventosEditor3D {
    readonly canvas: HTMLCanvasElement;
    readonly cursorFantasma: RefObject<HTMLDivElement | null>;
    readonly refs: RefsRenderizadorEditor3D;
};