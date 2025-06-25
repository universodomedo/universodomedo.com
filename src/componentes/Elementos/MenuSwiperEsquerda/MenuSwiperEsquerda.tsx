'use client';

import styles from './styles.module.css';
import { ReactNode } from 'react';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';
import { desconectar } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSpotify, faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";
import { faUserSecret, faUserTie, faFireFlameCurved, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoPerformance } from "Contextos/ContextoPerformace/contexto";

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
    const { estaAutenticado, ehMestre, ehAdmin, numeroPendenciasPersonagem } = useContextoAutenticacao();
    const { animacoesLigadas, setAnimacoesHabilitadas } = useContextoPerformance();

    function logout() {
        desconectar();
        window.location.href = `/`;
    }

    const obterItensMenu = (): { link: string, target: string, titulo: string, condicao?: boolean }[] => {
        return [
            { link: '/aventuras', target: '', titulo: 'Aventuras' },
            { link: '/sessao', target: '', titulo: 'Sessão Ao Vivo' },
            { link: '/definicoes', target: '', titulo: 'Definições' },
            { link: '/dicas', target: '', titulo: 'Dicas' },
            { link: '/em-jogo', target: '', titulo: 'Ficha de Demonstração' },
            { link: '/minha-pagina', target: '', titulo: 'Minha Página', condicao: estaAutenticado },
            { link: '/meus-personagens', target: '', titulo: 'Meus Personagens', condicao: estaAutenticado },
            // { link: '/minhas-disponibilidades', target: '', titulo: 'Minhas Disponibilidades', condicao: estaAutenticado },
            // { link: '/linha-do-tempo', target: '', titulo: 'Linha do Tempo' },
        ];
    };

    const obterItensConfiguracao = (): { elemento: ReactNode, condicao?: boolean }[] => {
        return [
            { elemento: <FontAwesomeIcon icon={faFireFlameCurved} onClick={() => setAnimacoesHabilitadas(!animacoesLigadas)} /> },
            { elemento: <FontAwesomeIcon icon={faRightToBracket} onClick={logout} />, condicao: estaAutenticado },
            { elemento: <Link href={'/mestre'}><FontAwesomeIcon icon={faUserSecret} /></Link>, condicao: ehMestre },
            { elemento: <Link href={'/admin'}><FontAwesomeIcon icon={faUserTie} /></Link>, condicao: ehAdmin },
        ];
    };

    const itensMenu = obterItensMenu().filter(item => item.condicao === undefined || item.condicao);
    const itensConfiguracao = obterItensConfiguracao().filter(item => item.condicao === undefined || item.condicao);

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
                        {itensMenu.map((item, index) => {
                            const precisaNumeroPendencias = (item.link === '/meus-personagens' && numeroPendenciasPersonagem > 0);

                            return (
                                <Link key={index} href={item.link} target={item.target} className={styles.item_menu}>
                                    <div className={styles.conteudo_item_menu}>
                                        {!precisaNumeroPendencias ? (
                                            <h3>{item.titulo}</h3>
                                        ) : (
                                            <div className={styles.recipiente_item_menu_com_pendencia}>
                                                <h3>{item.titulo}</h3>
                                                <div><span className={styles.numero_pendencias}>{numeroPendenciasPersonagem}</span></div>
                                            </div>
                                        )}
                                        <div className={styles.recipiente_icone_link}>
                                            <ElementoSVG src={"/imagensFigma/indicador-item-swiper-esquerda.svg"} />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                    <div id={styles.recipiente_icones_swiper_esquerda}>
                        <div id={styles.recipiente_configuracoes}>
                            {itensConfiguracao.map((item, index) => (
                                <div key={index} className={styles.recipiente_configuracao_individual}>{item.elemento}</div>
                            ))}
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