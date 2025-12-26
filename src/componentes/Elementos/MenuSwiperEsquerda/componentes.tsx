'use client';

import styles from './styles.module.css';
import { type JSX } from 'react';
import { filtrarMenuPorAcesso, MENU_SWIPER_ESQUERDA, type ItemMenu } from 'types-nora-api';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';
import LinkInteligente from 'Componentes/Elementos/LinkInteligente/LinkInteligente';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export function ItensMenuSwiperEsquerda() {
    const { estaAutenticado, verificarCapacidade } = useContextoAutenticacao();
    const itens = filtrarMenuPorAcesso(MENU_SWIPER_ESQUERDA, { estaAutenticado, verificarCapacidade });

    return (
        <div id={styles.recipiente_lista}>
            {itens.map((item, index) => (<RenderItem key={`${index}`} item={item} />))}
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

function RenderItem({ item }: { item: ItemMenu }): JSX.Element | null {
    const subItens = item.subItens && item.subItens.length > 0 ? item.subItens : undefined;
    const temSubItens = subItens != null;

    if (!item.destino && !temSubItens) return null;

    return (
        <div className={styles.item_menu}>
            {!item.destino ? (
                <h3>{item.titulo}</h3>
            ) : (
                <LinkInteligente destino={item.destino} className={styles.conteudo_item_menu}><ConteudoItemLink titulo={item.titulo} /></LinkInteligente>
            )}

            {temSubItens && (
                <div className={styles.recipiente_subitens}>
                    {subItens!.map((sub, idx) => (<RenderItem key={`${item.titulo}-${idx}`} item={sub} />))}
                </div>
            )}
        </div>
    );
};