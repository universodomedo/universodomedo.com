'use client';

import styles from './styles.module.css';

import { ReactNode } from 'react';
import cn from 'classnames';

import useScrollable from '../ElementoScrollable/useScrollable';
import FerramentaRetornoPagina from 'Componentes/Elementos/FerramentaRetornoPagina/FerramentaRetornoPagina';

export default function LayoutContextualizado({ children }: { children: ReactNode }) {
    return (
        <div id={styles.recipiente_layout_contextualizado}>
            <div id={styles.recipiente_areas_layout_contextualizado}>
                {children}
            </div>
        </div>
    );
};

LayoutContextualizado.Conteudo = function Conteudo({ children, escondeFundo = false, titulo, hrefPaginaRetorno }: { children: ReactNode; escondeFundo?: boolean; titulo?: string; hrefPaginaRetorno?: string }) {
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_layout_contextualizado_conteudo} className={cn(escondeFundo && styles.fundo_layout_contextualizado_conteudo)} {...scrollableProps}>
            {hrefPaginaRetorno && <FerramentaRetornoPagina hrefPaginaRetorno={hrefPaginaRetorno} />}
            {titulo && <h1 id={styles.titulo_conteudo}>{titulo}</h1>}
            {children}
        </div>
    );
};

LayoutContextualizado.Menu = function Menu({ children }: { children: ReactNode }) {
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_layout_contextualizado_menu} {...scrollableProps}>
            {children}
        </div>
    );
};