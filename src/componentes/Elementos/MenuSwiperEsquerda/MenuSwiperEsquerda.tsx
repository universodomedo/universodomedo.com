'use client';

import styles from './styles.module.css';

import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSpotify, faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";
import { ARQUIVOS_INTERNOS, PAGINAS } from 'types-nora-api';

import cn from 'classnames';
import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx'
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';
import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';
import LinkInterno from '../LinkInterno/LinkInterno';
import { ItensMenuSwiperEsquerda } from './componentes';

export default function MenuSwiperEsquerda() {
    const { menuAberto, setMenuAberto, tamanhoReduzido, esconderMenu } = useContextoMenuSwiperEsquerda();

    if (esconderMenu) return;

    return (
        <>
            {menuAberto && (<div className={styles.overlay_swiper_esquerda} onClick={() => { setMenuAberto(false) }} />)}
            <div className={cn(styles.swiper_esquerda, menuAberto && styles.aberto)}>
                <div className={`${styles.recipiente_botao_swiper_esquerda} ${tamanhoReduzido && !menuAberto ? styles.tamanho_reduzido : ''}`} onClick={() => { setMenuAberto(!menuAberto) }}>
                    <RecipienteArquivoInterno arquivo={'MENU_PRINCIPAL__BOTAO_ABRIR'} />
                </div>

                <ConteudoSwiperEsquerda />
            </div>
        </>
    );
};

function ConteudoSwiperEsquerda() {
    return (
        <div className={styles.recipiente_conteudo_swiper_esquerda}>
            <div className={styles.fundo_camada_1} style={{ ['--bg-1' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.MENU_PRINCIPAL__CAMADA_1)}")` }} />
            <div className={styles.fundo_camada_2} style={{ ['--bg-2' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.MENU_PRINCIPAL__CAMADA_2)}")` }} />
            <div className={styles.fundo_camada_3} style={{ ['--bg-3' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.MENU_PRINCIPAL__CAMADA_3)}")` }} />
            <div className={styles.conteudo_swiper_esquerda}>
                <div className={styles.recipiente_moldura_superior}>
                    <RecipienteArquivoInterno arquivo={'MENU_PRINCIPAL__MOLDURA'} className={styles.moldura}/>
                </div>
                <div className={styles.recipiente_lista_menu}>
                    <div className={styles.recipiente_logo_swiper_esquerda}>
                        <LinkInterno destino={PAGINAS.home}>
                            <RecipienteArquivoInterno arquivo={'LOGO'} className={styles.recipiente_arquivo} />
                        </LinkInterno>
                    </div>
                    <ItensMenuSwiperEsquerda />
                    <div className={styles.recipiente_icones_swiper_esquerda}>
                        <div className={styles.recipiente_configuracoes}>
                        </div>
                        <div className={styles.recipiente_icones_redes_sociais}>
                            <Link target='_blank' href='https://discord.universodomedo.com'><FontAwesomeIcon icon={faDiscord} /></Link>
                            <Link target='_blank' href='https://open.spotify.com/show/10qzPjLpugVhzn90ufDBuN'><FontAwesomeIcon icon={faSpotify} /></Link>
                            <Link target='_blank' href='https://youtube.universodomedo.com'><FontAwesomeIcon icon={faYoutube} /></Link>
                            <Link target='_blank' href='https://twitch.universodomedo.com'><FontAwesomeIcon icon={faTwitch} /></Link>
                        </div>
                    </div>
                </div>
                <div className={styles.recipiente_moldura_inferior}>
                    <RecipienteArquivoInterno arquivo={'MENU_PRINCIPAL__MOLDURA'} className={styles.moldura}/>
                </div>
            </div>
        </div>
    );
};