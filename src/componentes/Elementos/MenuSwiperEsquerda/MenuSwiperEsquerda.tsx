'use client';

import styles from './styles.module.css';
import Link from 'next/link';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';

import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';

export default function MenuSwiperEsquerda() {
    const { menuAberto, setMenuAberto, tamanhoReduzido } = useContextoMenuSwiperEsquerda();

    return (
        <>
            {menuAberto && (
                <div id={styles.overlay_swiper_esquerda} onClick={() => { setMenuAberto(false) }}></div>
            )}
            <div id={styles.swiper_esquerda} className={`${menuAberto ? styles.aberto : ''}`}>
                <ElementoBaseSwiperEsquerda />

                <ElementoBotaoSwiperEsquerda tamanhoReduzido={tamanhoReduzido} menuAberto={menuAberto} onClick={() => { setMenuAberto(!menuAberto) }} />

                <ConteudoSwiperEsquerda />
            </div>
        </>
    );
};

function ElementoBaseSwiperEsquerda() {
    return (
        <div id={styles.recipiente_base}>
            <div id={styles.recipiente_base_relative}>
                <div id={styles.recipiente_SVG_Borda}>
                    <ElementoSVG src={"/imagensFigma/swiper-esquerda-borda.svg"} />
                </div>

                <div id={styles.recipiente_SVG_Base}>
                    <ElementoSVG src={"/imagensFigma/swiper-esquerda-base.svg"} />
                </div>
            </div>
        </div>
    );
};

function ElementoBotaoSwiperEsquerda({ tamanhoReduzido, menuAberto, onClick }: { tamanhoReduzido: boolean, menuAberto: boolean, onClick: () => void }) {
    return (
        <div className={`${styles.recipiente_botao_swiper_esquerda} ${tamanhoReduzido && !menuAberto ? styles.tamanho_reduzido : ''}`} onClick={onClick}>
            <div className={styles.recipiente_icone_botao}>
                <ElementoSVG src={"/imagensFigma/icone-hamburguer.svg"} />
            </div>

            <ElementoSVG src={"/imagensFigma/swiper-esquerda-botao.svg"} />
        </div>
    );
};

function ConteudoSwiperEsquerda() {
    const obterItensMenu = (): { link: string, target: string, titulo: string, }[] => {
        return [
            { link: '/', target: '', titulo: 'Início' },
            { link: '/definicoes', target: '', titulo: 'Definições' },
            { link: '/em-jogo', target: '', titulo: 'Ficha de Demonstração' },
            { link: '/minha-pagina', target: '', titulo: 'Minha Página' },
            { link: '/linha-do-tempo', target: '', titulo: 'Linha do Tempo' },
        ];
    }

    const itensMenu = obterItensMenu();

    return (
        <div className={styles.conteudo_swiper_esquerda}>
            <div id={styles.recipiente_moldura_superior}>
                <ElementoSVG src={"/imagensFigma/swiper-esquerda-moldura-menu.svg"} />
            </div>
            <div id={styles.recipiente_lista_menu}>
                {itensMenu.map((item, index) => (
                    <Link key={index} href={item.link} target={item.target}><h3>{item.titulo}</h3></Link>
                ))}
            </div>
            <div id={styles.recipiente_moldura_inferior}>
                <ElementoSVG src={"/imagensFigma/swiper-esquerda-moldura-menu.svg"} />
            </div>
        </div>
    );
};