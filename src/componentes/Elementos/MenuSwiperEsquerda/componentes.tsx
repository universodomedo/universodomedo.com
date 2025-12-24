'use client';

import styles from './styles.module.css';
import { type JSX } from 'react';
import { PAGINAS, type PaginaDestino, type PaginaFolha, type PaginaParams } from 'types-nora-api';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';
import LinkInteligente from 'Componentes/Elementos/LinkInteligente/LinkInteligente';

type MenuParams<P extends PaginaFolha> = keyof PaginaParams<P> extends never ? never : Required<PaginaParams<P>>;

type DestinoMenu<P extends PaginaFolha> = MenuParams<P> extends never ? { pagina: P; params?: never } : { pagina: P; params: MenuParams<P> };

type ItemMenuGrupo = { titulo: string; subitens: readonly ItemMenu[] };

type ItemMenuLink<P extends PaginaFolha> = { titulo: string; destino: DestinoMenu<P> };

type ItemMenuLinkQualquer = PaginaFolha extends infer P ? P extends PaginaFolha ? ItemMenuLink<P> : never : never;

type ItemMenu = ItemMenuGrupo | ItemMenuLinkQualquer;

function item<P extends PaginaFolha>(titulo: string, pagina: P, ...rest: MenuParams<P> extends never ? [] : [MenuParams<P>]): ItemMenuLink<P> { return rest.length > 0 ? { titulo, destino: { pagina, params: rest[0] } as DestinoMenu<P> } : { titulo, destino: { pagina } as DestinoMenu<P> } };

function grupo(titulo: string, subitens: readonly ItemMenu[]): ItemMenuGrupo { return { titulo, subitens }; };

export function ItensMenuSwiperEsquerda() {
    const itensMenu = [
        grupo('Minhas Páginas', [
            item('Jogador', PAGINAS.minhasPaginas.jogador),
            item('Disponibilidades', PAGINAS.minhasPaginas.minhasDisponibilidades),
            item('Mestre', PAGINAS.minhasPaginas.mestre),
            item('Administrador', PAGINAS.minhasPaginas.admin),
        ]),
        item('Personagens', PAGINAS.personagens),
        item('Jogue Agora!', PAGINAS.jogo),
        item('Assistir', PAGINAS.aventuras),
        item('Sessão Ao Vivo', PAGINAS.sessaoAovivo),
        item('Hall', PAGINAS.minhaPagina),
        item('Definições', PAGINAS.definicoes, { slug: [] }),
        item('Dicas', PAGINAS.dicas, { slug: [] }),
    ] as const satisfies readonly ItemMenu[];

    return (
        <div id={styles.recipiente_lista}>
            {itensMenu.map((itemMenu, index) => (<RenderItem key={`${index}`} item={itemMenu} />))}
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
    if ('subitens' in item) {
        if (item.subitens.length === 0) return null;

        return (
            <div className={styles.item_menu}>
                <h3>{item.titulo}</h3>
                <div className={styles.recipiente_subitens}>
                    {item.subitens.map((sub, idx) => (<RenderItem key={`${item.titulo}-${idx}`} item={sub} />))}
                </div>
            </div>
        );
    }

    const destino = item.destino as unknown as PaginaDestino;

    return (
        <div className={styles.item_menu}>
            <LinkInteligente destino={destino} className={styles.conteudo_item_menu}><ConteudoItemLink titulo={item.titulo} /></LinkInteligente>
        </div>
    );
};