'use client';

import styles from './styles.module.css';
import { JSX } from 'react';

import Link from 'next/link';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';

interface ItemMenu {
    titulo: string;
    condicao?: boolean;
    link?: string;
    subitens?: ItemMenu[];
};

export function ItensMenuSwiperEsquerda() {
    const { estaAutenticado, ehMestre, ehAdmin } = useContextoAutenticacao();

    const itensMenu: ItemMenu[] = [
        {
            titulo: "Minhas Páginas",
            subitens: [
                { titulo: "Jogador", link: "/minhas-paginas/jogador", condicao: estaAutenticado },
                { titulo: "Mestre", link: "/minhas-paginas/mestre", condicao: ehMestre },
                { titulo: "Administrador", link: "/minhas-paginas/admin", condicao: ehAdmin }
            ]
        },
        { titulo: "Assistir", link: "/aventuras" },
        { titulo: "Sessão Ao Vivo", link: "/sessao-aovivo" },
        { titulo: "Hall", link: "/minha-pagina", condicao: estaAutenticado },
        { titulo: "Definições", link: "/definicoes" },
        { titulo: "Dicas", link: "/dicas" }
    ];

    const renderItem = (item: ItemMenu, key: string): JSX.Element | null => {
        if (item.condicao === false) return null;

        const temSubitens = item.subitens && item.subitens.length > 0;

        return (
            <div key={key} className={styles.item_menu}>
                {!item.link ? (
                    <h3>{item.titulo}</h3>
                ) : (
                    <Link href={item.link} className={styles.conteudo_item_menu}>
                        <h3>{item.titulo}</h3>
                        <div className={styles.recipiente_icone_link}>
                            <ElementoSVG src="/imagensFigma/indicador-item-swiper-esquerda.svg" />
                        </div>
                    </Link>
                )}

                {temSubitens && (
                    <div className={styles.recipiente_subitens}>
                        {item.subitens!.map((sub, idx) => renderItem(sub, `${key}-${idx}`))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div id={styles.recipiente_lista}>
            {itensMenu.map((item, index) => renderItem(item, `${index}`))}
        </div>
    );
}