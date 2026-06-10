'use client';

import { useState, type MouseEvent as ReactMouseEvent } from 'react';

import type { PosicaoMenuCriacaoMeshEditor3D } from './editor3D.criacaoMesh.tipos';

export interface MenuCriacaoMeshEditor3D {
    readonly posicaoMenu: PosicaoMenuCriacaoMeshEditor3D | null;
    abreMenu: (event: ReactMouseEvent<HTMLElement>, workspace: HTMLElement | null, podeAbrir: boolean) => void;
    abreMenuNoCentro: (workspace: HTMLElement | null, podeAbrir: boolean) => void;
    abreMenuInferiorEsquerdo: (podeAbrir: boolean) => void;
    fechaMenu: () => void;
};

export function useMenuCriacaoMeshEditor3D(): MenuCriacaoMeshEditor3D {
    const [posicaoMenu, setPosicaoMenu] = useState<PosicaoMenuCriacaoMeshEditor3D | null>(null);

    function abreMenu(event: ReactMouseEvent<HTMLElement>, workspace: HTMLElement | null, podeAbrir: boolean): void {
        if (!podeAbrir || workspace === null) return;

        const rect = workspace.getBoundingClientRect();
        setPosicaoMenu({ tipo: 'PONTO', x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    function abreMenuNoCentro(workspace: HTMLElement | null, podeAbrir: boolean): void {
        if (!podeAbrir || workspace === null) return;

        setPosicaoMenu({ tipo: 'PONTO', x: workspace.clientWidth / 2, y: workspace.clientHeight / 2 });
    };

    function abreMenuInferiorEsquerdo(podeAbrir: boolean): void {
        if (!podeAbrir) return;

        setPosicaoMenu({ tipo: 'INFERIOR_ESQUERDO' });
    };

    function fechaMenu(): void { setPosicaoMenu(null); };

    return { posicaoMenu, abreMenu, abreMenuNoCentro, abreMenuInferiorEsquerdo, fechaMenu };
};