'use client';

import styles from './styles.module.css';

import { ReactNode, useEffect } from 'react';

import { useAppSelector } from 'redux/hooks/useRedux';
import { registrosMenu } from 'componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/registrosMenu';

export default function LayoutContextualizado({ children }: { children: ReactNode }) {
    const activeKey = useAppSelector((s) => s.menu.activeKey);

    useEffect(() => {
        if (!activeKey) return;
        const proporcaoMenu = registrosMenu[activeKey].proporcaoMenu;

        document.documentElement.style.setProperty('--proporcao-menu', String(proporcaoMenu));
        document.documentElement.style.setProperty('--proporcao-conteudo', String(1 - proporcaoMenu));
    }, [activeKey]);

    if (!activeKey) return null;

    const { componente } = registrosMenu[activeKey];

    return (
        <div id={styles.recipiente_layout_contextualizado}>
            <div id={styles.recipiente_areas_layout_contextualizado}>
                <div id={styles.recipiente_layout_contextualizado_conteudo}>
                    {children}
                </div>
                <div id={styles.recipiente_layout_contextualizado_menu}>
                    {componente}
                </div>
            </div>
        </div>
    );
};