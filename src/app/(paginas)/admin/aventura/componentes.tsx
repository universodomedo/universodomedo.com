'use client';

import styles from './styles.module.css';

import Link from 'next/link';
import { AventuraDto, DetalheSessaoCanonicaDto, LinkDto } from 'types-nora-api';

import { ContextoCadastroNovoLinkGrupoAventuraProvider, useContextoCadastroNovoLinkGrupoAventura } from 'Contextos/ContextoCadastroNovoLinkGrupoAventura/contexto';

export function AdministrarAventura_ConteudoGeral({ aventura }: { aventura: AventuraDto; }) {
    return (
        <ContextoCadastroNovoLinkGrupoAventuraProvider idGrupoAventura={aventura.gruposAventura![0].id}>
            <div id={styles.recipiente_acoes_aventura}>
                <h1>{aventura.titulo} - {aventura.gruposAventura![0].nome}</h1>

                <AreaLinkTrailer linkTrailer={aventura.gruposAventura![0].linkTrailerYoutube} />

                <AreaLinkPlaylist linkPlaylist={aventura.gruposAventura![0].linkPlaylistYoutube} />

                <AreaLinkSerie linkSerie={aventura.gruposAventura![0].linkSerieSpotify} />

                <AreaEpisodios detalhesSessaoCanonica={aventura.gruposAventura![0].detalhesSessaoesCanonicas} />
            </div>
        </ContextoCadastroNovoLinkGrupoAventuraProvider>
    );
};

export function AreaLinkTrailer({ linkTrailer }: { linkTrailer: LinkDto }) {
    const { iniciaProcessoVinculoLinkGrupoAventura } = useContextoCadastroNovoLinkGrupoAventura();

    return (
        <div id={styles.recipiente_area_link_trailer}>
            {linkTrailer ? (
                <Link href={linkTrailer.urlCompleta} target='_blank'><p>Tem Trailer</p></Link>
            ) : (
                <button onClick={() => iniciaProcessoVinculoLinkGrupoAventura(1)}>Configurar Trailer</button>
            )}
        </div>
    );
};

export function AreaLinkPlaylist({ linkPlaylist }: { linkPlaylist: LinkDto }) {
    const { iniciaProcessoVinculoLinkGrupoAventura } = useContextoCadastroNovoLinkGrupoAventura();

    return (
        <div id={styles.recipiente_area_link_trailer}>
            {linkPlaylist ? (
                <Link href={linkPlaylist.urlCompleta} target='_blank'><p>Tem Playlist</p></Link>
            ) : (
                <button onClick={() => iniciaProcessoVinculoLinkGrupoAventura(3)}>Configurar Playlist</button>
            )}
        </div>
    );
};

export function AreaLinkSerie({ linkSerie }: { linkSerie: LinkDto }) {
    const { iniciaProcessoVinculoLinkGrupoAventura } = useContextoCadastroNovoLinkGrupoAventura();

    return (
        <div id={styles.recipiente_area_link_trailer}>
            {linkSerie ? (
                <Link href={linkSerie.urlCompleta} target='_blank'><p>Tem Série</p></Link>
            ) : (
                <button onClick={() => iniciaProcessoVinculoLinkGrupoAventura(5)}>Configurar Série</button>
            )}
        </div>
    );
};

export function AreaEpisodios({ detalhesSessaoCanonica }: { detalhesSessaoCanonica: DetalheSessaoCanonicaDto[] }) {
    return (
        <div id={styles.recipiente_area_episodios}>
            <h1>{detalhesSessaoCanonica.length} Episódios</h1>
            <div id={styles.recipiente_area_lista_episodios}>
                {detalhesSessaoCanonica.sort((a, b) => a.episodio - b.episodio).map(detalheSessaoCanonica => {
                    const temEpisodioYoutubeVinculado = detalheSessaoCanonica.linkSessaoYoutube !== null;
                    const temEpisodioSpotifyVinculado = detalheSessaoCanonica.linkSessaoSpotify !== null;


                    return (
                        <Link key={detalheSessaoCanonica.sessao.id} href={`/admin/sessao/${detalheSessaoCanonica.sessao.id}`} className={ !temEpisodioYoutubeVinculado && !temEpisodioSpotifyVinculado ? styles.episodio_sem_nenhum_vinculo : temEpisodioYoutubeVinculado !== temEpisodioSpotifyVinculado ? styles.episodio_com_algum_vinculo : styles.episodio_completo_vinculo}>{detalheSessaoCanonica.episodioPorExtenso}</Link>
                    );
                })}
            </div>
        </div>
    );
};