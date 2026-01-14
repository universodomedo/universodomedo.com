'use client';

import styles from './styles.module.css';

import { ReactNode } from 'react';
import cn from 'classnames';

import { useLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import useScrollable from '../ElementoScrollable/useScrollable';
import { FerramentaRetornoPagina } from 'Componentes/Elementos/FerramentaRetornoPagina/FerramentaRetornoPagina';

export default function LayoutContextualizado({ children }: { children: ReactNode }) {
    return (
        <div id={styles.recipiente_layout_contextualizado}>
            <div id={styles.recipiente_areas_layout_contextualizado}>
                {children}
            </div>
        </div>
    );
};

LayoutContextualizado.Conteudo = function Conteudo({ children }: { children: ReactNode }) {
    const { proporcoes, titulo, escondeFundo, fecharProps } = useLayoutContextualizado();
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_layout_contextualizado_conteudo} className={cn(escondeFundo && styles.fundo_layout_contextualizado_conteudo)} style={{ width: `${proporcoes.proporcaoConteudo}%` }} {...scrollableProps}>
            {fecharProps != undefined && <FerramentaRetornoPagina props={fecharProps} />}
            {titulo && <h1 id={styles.titulo_conteudo}>{titulo}</h1>}
            {children}
        </div>
    );
};

LayoutContextualizado.Menu = function Menu({ children }: { children: ReactNode }) {
    const { proporcoes } = useLayoutContextualizado();
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_layout_contextualizado_menu} style={{ width: `${proporcoes.proporcaoMenu}%` }} {...scrollableProps}>
            {children}
        </div>
    );
};