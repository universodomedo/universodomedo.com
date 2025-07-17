'use client';

import styles from './styles.module.css';

import { useContextoCadastroNovoLinkGrupoAventura } from 'Contextos/ContextoCadastroNovoLinkGrupoAventura/contexto';
import Link from 'next/link';
import { LinkDto, SessaoDto } from 'types-nora-api';

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
                <button onClick={() => iniciaProcessoVinculoLinkGrupoAventura(2)}>Configurar Playlist</button>
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
                <button onClick={() => iniciaProcessoVinculoLinkGrupoAventura(4)}>Configurar Série</button>
            )}
        </div>
    );
};

export function AreaEpisodios({ episodios }: { episodios: SessaoDto[] }) {
    return (
        <div id={styles.recipiente_area_episodios}>
            <h1>{episodios.length} Episódios</h1>
            <div id={styles.recipiente_area_lista_episodios}>
                {episodios.sort((a, b) => a.id - b.id).map(episodio => (
                    <Link key={episodio.id} href={`/admin/sessao/${episodio.id}`}>{episodio.episodioPorExtenso}</Link>
                ))}
            </div>
        </div>
    );
};