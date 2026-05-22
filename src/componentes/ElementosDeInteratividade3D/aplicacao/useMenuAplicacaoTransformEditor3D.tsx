'use client';

import { useState } from 'react';

import type { PosicaoMenuAplicacaoTransformEditor3D } from './editor3D.aplicacaoTransform.tipos';

export interface MenuAplicacaoTransformEditor3D {
    readonly posicaoMenu: PosicaoMenuAplicacaoTransformEditor3D | null;
    abreMenuNoCentro: (workspace: HTMLElement | null, podeAbrir: boolean) => void;
    fechaMenu: () => void;
};

export function useMenuAplicacaoTransformEditor3D(): MenuAplicacaoTransformEditor3D {
    const [posicaoMenu, setPosicaoMenu] = useState<PosicaoMenuAplicacaoTransformEditor3D | null>(null);

    function abreMenuNoCentro(workspace: HTMLElement | null, podeAbrir: boolean): void {
        if (!podeAbrir || workspace === null) return;

        setPosicaoMenu({ x: workspace.clientWidth / 2, y: workspace.clientHeight / 2 });
    };

    function fechaMenu(): void { setPosicaoMenu(null); };

    return { posicaoMenu, abreMenuNoCentro, fechaMenu };
};