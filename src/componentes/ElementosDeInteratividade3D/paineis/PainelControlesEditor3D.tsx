'use client';

import styles from './styles.module.css';

import { type MouseEvent } from 'react';

import { PainelCenaColecaoEditor3D } from './PainelCenaColecaoEditor3D';
import { PainelContextualEditor3D } from './PainelContextualEditor3D';
import type { ControlesMenuLateralDireitoEditor3D } from '../layout/useMenuLateralDireitoEditor3D';

interface PainelControlesEditor3DProps {
    menuLateralDireito: ControlesMenuLateralDireitoEditor3D;
};

export function PainelControlesEditor3D({ menuLateralDireito }: PainelControlesEditor3DProps) {
    function iniciaRedimensionamento(event: MouseEvent<HTMLDivElement>): void {
        event.preventDefault();
        event.stopPropagation();
        menuLateralDireito.iniciaRedimensionamento();
    };

    return (
        <aside className={`${styles.painelControles} ${menuLateralDireito.colapsado ? styles.painelControlesColapsado : ''} ${menuLateralDireito.redimensionando ? styles.painelControlesRedimensionando : ''}`} aria-label="Menu lateral direito do editor 3D">
            {!menuLateralDireito.colapsado && <div className={styles.alcaRedimensionamentoPainelDireito} role="separator" aria-orientation="vertical" aria-label="Redimensionar menu lateral direito" onMouseDown={iniciaRedimensionamento} />}

            <button className={styles.botaoColapsarPainelDireito} type="button" onClick={menuLateralDireito.alternaColapsado} aria-label={menuLateralDireito.colapsado ? 'Expandir menu lateral direito' : 'Colapsar menu lateral direito'} title={menuLateralDireito.colapsado ? 'Expandir menu' : 'Colapsar menu'}>
                {menuLateralDireito.colapsado ? '‹' : '›'}
            </button>

            <div className={styles.conteudoPainelControles} aria-hidden={menuLateralDireito.colapsado}>
                <PainelCenaColecaoEditor3D />

                <PainelContextualEditor3D />
            </div>
        </aside>
    );
};