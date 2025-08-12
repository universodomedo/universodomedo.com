'use client';

import styles from './styles.module.css';

import { ReactNode, useEffect } from 'react';

import { useAppSelector } from 'redux/hooks/useRedux';
import { registrosMenu } from 'componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/registrosMenu';
import useScrollable from '../ElementoScrollable/useScrollable';

export default function LayoutContextualizado({ children }: { children: ReactNode }) {
    const { chaveMenu, tituloConteudo } = useAppSelector((s) => s.menu);

    useEffect(() => {
        if (!chaveMenu) return;
        const proporcaoMenu = registrosMenu[chaveMenu].proporcaoMenu;

        document.documentElement.style.setProperty('--proporcao-menu', String(proporcaoMenu));
        document.documentElement.style.setProperty('--proporcao-conteudo', String(1 - proporcaoMenu));
    }, [chaveMenu]);

    if (!chaveMenu) return null;

    const { componente } = registrosMenu[chaveMenu];

    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_layout_contextualizado}>
            <div id={styles.recipiente_areas_layout_contextualizado}>
                <div id={styles.recipiente_layout_contextualizado_conteudo} {...scrollableProps}>
                    {tituloConteudo && <h1 id={styles.titulo_conteudo}>{tituloConteudo}</h1>}
                    {children}
                </div>
                <div id={styles.recipiente_layout_contextualizado_menu} {...scrollableProps}>
                    {componente}
                </div>
            </div>
        </div>
    );
};