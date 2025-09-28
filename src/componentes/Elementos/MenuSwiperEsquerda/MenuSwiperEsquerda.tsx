'use client';

import styles from './styles.module.css';
import { ReactNode } from 'react';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';
import { desconectar, obtemObjetoAutenticacao } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSpotify, faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";
import { faUserSecret, faUserTie, faFireFlameCurved, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
// import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { ItensMenuSwiperEsquerda } from './componentes';
import { DivClicavel } from '../DivClicavel/DivClicavel';

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
    // const { estaAutenticado } = useContextoAutenticacao();

    async function logout() {
        await obtemObjetoAutenticacao();
        desconectar();
        window.location.href = `/`;
    }
    
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
                    <ItensMenuSwiperEsquerda />
                    <div id={styles.recipiente_icones_swiper_esquerda}>
                        <div id={styles.recipiente_configuracoes}>
                            {/* {estaAutenticado && <DivClicavel onClick={logout}><h2>Desconectar</h2></DivClicavel>} */}
                        </div>
                        <div id={styles.recipiente_icones_redes_sociais}>
                            <Link target='_blank' href='https://discord.universodomedo.com'><FontAwesomeIcon icon={faDiscord} /></Link>
                            <Link target='_blank' href='https://open.spotify.com/show/10qzPjLpugVhzn90ufDBuN'><FontAwesomeIcon icon={faSpotify} /></Link>
                            <Link target='_blank' href='https://youtube.universodomedo.com'><FontAwesomeIcon icon={faYoutube} /></Link>
                            <Link target='_blank' href='https://twitch.universodomedo.com'><FontAwesomeIcon icon={faTwitch} /></Link>
                        </div>
                    </div>
                </div>
                <div id={styles.recipiente_moldura_inferior}>
                    <ElementoSVG src={"/imagensFigma/swiper-esquerda-moldura-menu.svg"} />
                </div>
            </div>
        </div>
    );
};