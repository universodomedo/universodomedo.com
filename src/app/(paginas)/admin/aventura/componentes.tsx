'use client';

import styles from './styles.module.css';

import { useContextoCadastroNovoLinkGrupoAventura } from 'Contextos/ContextoCadastroNovoLinkGrupoAventura/contexto';
import Link from 'next/link';
import { DetalheSessaoCanonicaDto, LinkDto, SessaoDto } from 'types-nora-api';

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
                {detalhesSessaoCanonica.sort((a, b) => a.episodio - b.episodio).map(detalheSessaoCanonica => (
                    <Link key={detalheSessaoCanonica.sessao.id} href={`/admin/sessao/${detalheSessaoCanonica.sessao.id}`}>{detalheSessaoCanonica.episodioPorExtenso}</Link>
                ))}
            </div>
        </div>
    );
};