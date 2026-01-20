'use client';

import styles from './styles.module.css';

import { ReactNode } from 'react';
import cn from 'classnames';

import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectLayoutEscondeFundo, selectLayoutFecharProps, selectLayoutProporcoes, selectLayoutTitulo } from 'Redux/selectors/layoutContextualizadoSelectors';
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

LayoutContextualizado.Conteudo = function Conteudo({ children, forcarLarguraTotal }: { children: ReactNode; forcarLarguraTotal?: boolean | undefined }) {
    const titulo = useAppSelector(selectLayoutTitulo);
    const escondeFundo = useAppSelector(selectLayoutEscondeFundo);
    const fecharProps = useAppSelector(selectLayoutFecharProps);
    const proporcoes = useAppSelector(selectLayoutProporcoes);
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    const width = forcarLarguraTotal ? '100%' : `${proporcoes.proporcaoConteudo}%`;

    return (
        <div className={cn(styles.recipiente_layout_contextualizado_conteudo, escondeFundo && styles.fundo_layout_contextualizado_conteudo)} style={{ width }} {...scrollableProps}>
            <div className={styles.recipiente_layout_contextualizado_conteudo__header}>
                {fecharProps != undefined && <FerramentaRetornoPagina props={fecharProps} />}
                {titulo && <h1 id={styles.titulo_conteudo}>{titulo}</h1>}
            </div>
            <div className={styles.recipiente_layout_contextualizado_conteudo__body}>
                {children}
            </div>
        </div>
    );
};

LayoutContextualizado.Menu = function Menu({ children }: { children: ReactNode }) {
    const proporcoes = useAppSelector(selectLayoutProporcoes);
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_layout_contextualizado_menu} style={{ width: `${proporcoes.proporcaoMenu}%` }} {...scrollableProps}>
            {children}
        </div>
    );
};