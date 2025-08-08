'use client';

import styles from './styles.module.css';

import Link from 'next/link';
import { DetalheSessaoCanonicaDto, LinkDto } from 'types-nora-api';

import { useContextoCadastroNovoLinkSessao } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';
import { ContextoCadastroNovoLinkSessaoProvider } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';
import { LayoutVisualizacaoPadrao_ConteudoGeral } from 'Contextos/ContextoLayoutVisualizacaoPadrao/hooks';

export function AdministrarSessao_ConteudoGeral({ detalheSessao }: { detalheSessao: DetalheSessaoCanonicaDto }) {
    return (
        <LayoutVisualizacaoPadrao_ConteudoGeral>
            {detalheSessao.grupoAventura ? <SessaoDeAventura detalheSessao={detalheSessao} /> : <SessaoUnica detalheSessao={detalheSessao} />}
        </LayoutVisualizacaoPadrao_ConteudoGeral>
    );
};

function SessaoDeAventura({ detalheSessao }: { detalheSessao: DetalheSessaoCanonicaDto }) {
    // ja verificado
    if (!detalheSessao.grupoAventura) return <></>;

    return (
        <ContextoCadastroNovoLinkSessaoProvider detalheSessao={detalheSessao} idGrupoAventura={detalheSessao.grupoAventura.id}>
            <div id={styles.recipiente_acoes_aventura}>
                <div>
                    <h1>{detalheSessao.episodioPorExtenso}</h1>
                    <h3>{detalheSessao.grupoAventura.aventura.titulo} - {detalheSessao.grupoAventura.nome}</h3>
                </div>

                <AreaVideoYoutube linkVideo={detalheSessao.linkSessaoYoutube} />

                <AreaPodcastSpotify linkPodcast={detalheSessao.linkSessaoSpotify} />
            </div>
        </ContextoCadastroNovoLinkSessaoProvider>
    );
};

function SessaoUnica({ detalheSessao }: { detalheSessao: DetalheSessaoCanonicaDto }) {
    return (
        <></>
    );
};

export function AreaVideoYoutube({ linkVideo }: { linkVideo: LinkDto }) {
    const { iniciaProcessoVinculoLinkSessao } = useContextoCadastroNovoLinkSessao();

    return (
        <>
            <div id={styles.recipiente_area_video_youtube}>
                {linkVideo ? (
                    <Link href={linkVideo.urlCompleta} target='_blank'><p>Tem Vídeo</p></Link>
                ) : (
                    <button onClick={() => iniciaProcessoVinculoLinkSessao(2)}>Configurar Vídeo</button>
                )}
            </div>
        </>
    );
};

export function AreaPodcastSpotify({ linkPodcast }: { linkPodcast: LinkDto }) {
    const { iniciaProcessoVinculoLinkSessao } = useContextoCadastroNovoLinkSessao();

    return (
        <>
            <div id={styles.recipiente_area_video_youtube}>
                {linkPodcast ? (
                    <Link href={linkPodcast.urlCompleta} target='_blank'><p>Tem Podcast</p></Link>
                ) : (
                    <button onClick={() => iniciaProcessoVinculoLinkSessao(4)}>Configurar Podcast</button>
                )}
            </div>
        </>
    );
};