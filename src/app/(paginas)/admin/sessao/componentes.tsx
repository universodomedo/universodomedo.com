'use client';

import styles from './styles.module.css';

import { useContextoCadastroNovoLink } from 'Contextos/ContextoCadastroNovoLink/contexto';
import Link from 'next/link';
import { LinkDto } from 'types-nora-api';

export function AreaVideoYoutube({ linkVideo }: { linkVideo: LinkDto }) {
    const { iniciaProcessoVinculoLink } = useContextoCadastroNovoLink();

    return (
        <>
            <div id={styles.recipiente_area_video_youtube}>
                {linkVideo ? (
                    <Link href={linkVideo.urlCompleta} target='_blank'><p>Tem Vídeo</p></Link>
                ) : (
                    <button onClick={() => iniciaProcessoVinculoLink(1, false)}>Configurar Vídeo</button>
                )}
            </div>
        </>
    );
};

export function AreaPodcastSpotify({ linkPodcast }: { linkPodcast: LinkDto }) {
    const { iniciaProcessoVinculoLink } = useContextoCadastroNovoLink();

    return (
        <>
            <div id={styles.recipiente_area_video_youtube}>
                {linkPodcast ? (
                    <Link href={linkPodcast.urlCompleta} target='_blank'><p>Tem Podcast</p></Link>
                ) : (
                    <button onClick={() => iniciaProcessoVinculoLink(3, false)}>Configurar Podcast</button>
                )}
            </div>
        </>
    );
};