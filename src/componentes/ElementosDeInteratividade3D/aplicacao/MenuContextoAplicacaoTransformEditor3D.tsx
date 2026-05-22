'use client';

import styles from './styles.module.css';

import { useEffect, useRef } from 'react';

import type { PosicaoMenuAplicacaoTransformEditor3D } from './editor3D.aplicacaoTransform.tipos';

interface MenuContextoAplicacaoTransformEditor3DProps {
    posicao: PosicaoMenuAplicacaoTransformEditor3D;
    aplicaRotationScale: () => void;
};

export function MenuContextoAplicacaoTransformEditor3D({ posicao, aplicaRotationScale }: MenuContextoAplicacaoTransformEditor3DProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const menu = menuRef.current;

        if (menu === null) return;

        menu.style.setProperty('--editor3d-menu-aplicacao-x', `${posicao.x}px`);
        menu.style.setProperty('--editor3d-menu-aplicacao-y', `${posicao.y}px`);
    }, [posicao]);

    return (
        <div ref={menuRef} className={styles.menuContextoAplicacaoTransform} data-editor3d-menu-aplicacao="true">
            <div className={styles.cabecalhoMenuAplicacaoTransform}>Apply</div>

            <button className={styles.itemMenuAplicacaoTransform} type="button" onClick={aplicaRotationScale}>
                <span>Rotation & Scale</span>
                <strong>Ctrl + A</strong>
            </button>
        </div>
    );
};