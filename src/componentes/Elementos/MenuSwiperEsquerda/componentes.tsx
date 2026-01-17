'use client';

import styles from './styles.module.css';

import { type JSX } from 'react';
import { filtrarMenuPorAcesso, MENU_PRINCIPAL, type MenuNode } from 'types-nora-api';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export function ItensMenuSwiperEsquerda() {
    const { estaAutenticado, verificarCapacidade } = useContextoAutenticacao();
    const itens = filtrarMenuPorAcesso(MENU_PRINCIPAL, { estaAutenticado, verificarCapacidade });

    return (
        <div id={styles.recipiente_lista}>
            {itens.map((item, index) => <RenderNode key={`${index}`} node={item} />)}
        </div>
    );
};

function RenderNode({ node }: { node: MenuNode }): JSX.Element | null {
    if (node.tipo === 'item') {
        return (
            <div className={styles.item_menu}>
                <LinkInterno destino={node.destino} className={styles.conteudo_item_menu}><ConteudoItemLink titulo={node.titulo} /></LinkInterno>
            </div>
        );
    }

    if (node.itens.length === 0) return null;

    return (
        <div className={styles.item_menu}>
            <h3>{node.titulo}</h3>
            <div className={styles.recipiente_subitens}>
                {node.itens.map((sub, idx) => (<RenderNode key={`${node.titulo}-${idx}`} node={sub} />))}
            </div>
        </div>
    );
};

function ConteudoItemLink({ titulo }: { titulo: string }): JSX.Element {
    return (
        <>
            <h3>{titulo}</h3>
            <div className={styles.recipiente_icone_link}>
                <ElementoSVG src="/imagensFigma/indicador-item-swiper-esquerda.svg" />
            </div>
        </>
    );
};