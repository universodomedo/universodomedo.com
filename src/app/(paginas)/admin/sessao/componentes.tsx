'use client';

import styles from './styles.module.css';

import { useContextoCadastroNovoLinkSessao } from 'Contextos/ContextoCadastroNovoLinkSessao/contexto';
import Link from 'next/link';
import { LinkDto } from 'types-nora-api';

export function AreaVideoYoutube({ linkVideo }: { linkVideo: LinkDto }) {
    const { iniciaProcessoVinculoLinkSessao } = useContextoCadastroNovoLinkSessao();

    return (
        <>
            <div id={styles.recipiente_area_video_youtube}>
                {linkVideo ? (
                    <Link href={linkVideo.urlCompleta} target='_blank'><p>Tem Vídeo</p></Link>
                ) : (
                    <button onClick={() => iniciaProcessoVinculoLinkSessao(1)}>Configurar Vídeo</button>
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
                    <button onClick={() => iniciaProcessoVinculoLinkSessao(3)}>Configurar Podcast</button>
                )}
            </div>
        </>
    );
};