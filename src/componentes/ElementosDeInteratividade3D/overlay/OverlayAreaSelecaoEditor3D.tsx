'use client';

import styles from '../styles.module.css';

import { useEffect, useRef } from 'react';

import { useEditor3DContexto } from '../contexto/Editor3DContexto';

function formataValorCss(valor: number): string { return `${valor}px`; };

export function OverlayAreaSelecaoEditor3D() {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const { estado } = useEditor3DContexto();
    const areaSelecao = estado.areaSelecao;

    useEffect(() => {
        const overlay = overlayRef.current;

        if (overlay === null || areaSelecao === null) return;

        const esquerda = Math.min(areaSelecao.inicioX, areaSelecao.fimX);
        const topo = Math.min(areaSelecao.inicioY, areaSelecao.fimY);
        const largura = Math.abs(areaSelecao.fimX - areaSelecao.inicioX);
        const altura = Math.abs(areaSelecao.fimY - areaSelecao.inicioY);

        overlay.style.setProperty('--editor3d-area-selecao-x', formataValorCss(esquerda));
        overlay.style.setProperty('--editor3d-area-selecao-y', formataValorCss(topo));
        overlay.style.setProperty('--editor3d-area-selecao-largura', formataValorCss(largura));
        overlay.style.setProperty('--editor3d-area-selecao-altura', formataValorCss(altura));
    }, [areaSelecao]);

    if (areaSelecao === null) return null;

    return <div ref={overlayRef} className={styles.areaSelecaoEditor3D} aria-hidden="true" />;
};