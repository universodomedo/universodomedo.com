'use client';

import styles from './styles.module.css';
import Link from 'next/link';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';

import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSpotify, faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";

export default function MenuSwiperEsquerda() {
    const { menuAberto, setMenuAberto, tamanhoReduzido } = useContextoMenuSwiperEsquerda();

    return (
        <>
            {menuAberto && (<div id={styles.overlay_swiper_esquerda} onClick={() => { setMenuAberto(false) }} />)}
            <div id={styles.swiper_esquerda} className={`${menuAberto ? styles.aberto : ''}`}>
                <div className={`${styles.recipiente_botao_swiper_esquerda} ${tamanhoReduzido && !menuAberto ? styles.tamanho_reduzido : ''}`} onClick={() => { setMenuAberto(!menuAberto) }}>
                    <ElementoSVG src={"/imagensFigma/swiper-esquerda-botao.svg"} />
                </div>

                <ConteudoSwiperEsquerda />
            </div>
        </>
    );
};

function ConteudoSwiperEsquerda() {
    const obterItensMenu = (): { link: string, target: string, titulo: string, }[] => {
        return [
            { link: '/definicoes', target: '', titulo: 'Definições' },
            { link: '/em-jogo', target: '', titulo: 'Ficha de Demonstração' },
            // { link: '/minha-pagina', target: '', titulo: 'Minha Página' },
            { link: '/minhas-disponibilidades', target: '', titulo: 'Minhas Disponibilidades' },
            // { link: '/linha-do-tempo', target: '', titulo: 'Linha do Tempo' },
        ];
    }

    const itensMenu = obterItensMenu();

    return (
        <div className={styles.recipiente_conteudo_swiper_esquerda}>
            <div id={styles.fundo_camada_1} />
            <div id={styles.fundo_camada_2} />
            <div id={styles.fundo_camada_3} />
            <div className={styles.conteudo_swiper_esquerda}>
                <div id={styles.recipiente_moldura_superior}>
                    <ElementoSVG src={"/imagensFigma/swiper-esquerda-moldura-menu.svg"} />
                </div>
                <div id={styles.recipiente_lista_menu}>
                    <div className={styles.recipiente_logo_swiper_esquerda}>
                        <Link href={'/'}><ElementoSVG src={"/imagensFigma/logo-cabecalho.svg"} /></Link>
                    </div>
                    <div id={styles.recipiente_lista}>
                        {itensMenu.map((item, index) => (
                            <Link key={index} href={item.link} target={item.target} className={styles.item_menu}>
                                <div className={styles.conteudo_item_menu}>
                                    <h3>{item.titulo}</h3>
                                    <div className={styles.recipiente_icone_link}>
                                        <ElementoSVG src={"/imagensFigma/indicador-item-swiper-esquerda.svg"} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div id={styles.recipiente_icones_swiper_esquerda}>
                        <Link target='_blank' href='https://discord.universodomedo.com'><FontAwesomeIcon icon={faDiscord} /></Link>
                        <Link target='_blank' href='https://open.spotify.com/show/10qzPjLpugVhzn90ufDBuN'><FontAwesomeIcon icon={faSpotify} /></Link>
                        <Link target='_blank' href='https://youtube.universodomedo.com'><FontAwesomeIcon icon={faYoutube} /></Link>
                        <Link target='_blank' href='https://twitch.universodomedo.com'><FontAwesomeIcon icon={faTwitch} /></Link>
                    </div>
                </div>
                <div id={styles.recipiente_moldura_inferior}>
                    <ElementoSVG src={"/imagensFigma/swiper-esquerda-moldura-menu.svg"} />
                </div>
            </div>
        </div>
    );
};