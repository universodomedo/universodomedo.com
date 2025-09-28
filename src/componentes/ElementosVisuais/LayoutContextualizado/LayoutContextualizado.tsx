'use client';

import styles from './styles.module.css';

import { createContext, ReactNode, useContext } from 'react';
import cn from 'classnames';

import useScrollable from '../ElementoScrollable/useScrollable';
import { FerramentaRetornoPagina, LayoutContextualizadoFecharProps } from 'Componentes/Elementos/FerramentaRetornoPagina/FerramentaRetornoPagina';


interface ProporcoesContextType {
    proporcaoConteudo: number;
    proporcaoMenu: number;
};

const ProporcoesContext = createContext<ProporcoesContextType>({
    proporcaoConteudo: 70,
    proporcaoMenu: 30,
});

function useProporcoesLayout() {
    const context = useContext(ProporcoesContext);
    if (!context) throw new Error('useProporcoesLayout deve ser usado dentro de LayoutContextualizado');
    return context;
};


export default function LayoutContextualizado({ children, proporcaoConteudo }: { children: ReactNode; proporcaoConteudo: number; }) {
    const proporcaoValida = Math.max(0, Math.min(100, proporcaoConteudo));
    const proporcaoMenu = 100 - proporcaoValida;

    return (
        <ProporcoesContext.Provider value={{ proporcaoConteudo: proporcaoValida, proporcaoMenu: proporcaoMenu }}>
            <div id={styles.recipiente_layout_contextualizado}>
                <div id={styles.recipiente_areas_layout_contextualizado}>
                    {children}
                </div>
            </div>
        </ProporcoesContext.Provider>
    );
};

LayoutContextualizado.Conteudo = function Conteudo({ children, escondeFundo = false, titulo, props }: { children: ReactNode; escondeFundo?: boolean; titulo?: string; props?: LayoutContextualizadoFecharProps }) {
    const { proporcaoConteudo } = useProporcoesLayout();
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_layout_contextualizado_conteudo} className={cn(escondeFundo && styles.fundo_layout_contextualizado_conteudo)} style={{ width: `${proporcaoConteudo}%` }} {...scrollableProps}>
            {props != undefined && <FerramentaRetornoPagina props={props} />}
            {titulo && <h1 id={styles.titulo_conteudo}>{titulo}</h1>}
            {children}
        </div>
    );
};

LayoutContextualizado.Menu = function Menu({ children }: { children: ReactNode }) {
    const { proporcaoMenu } = useProporcoesLayout();
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_layout_contextualizado_menu} style={{ width: `${proporcaoMenu}%` }} {...scrollableProps}>
            {children}
        </div>
    );
};