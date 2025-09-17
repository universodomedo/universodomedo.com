'use client';

import styles from './styles.module.css';

import Link from 'next/link';
import { DetalheSessaoAventuraDto, GrupoAventuraDto, LinkDto } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { ListaAcoesAdmin } from '../componentes';
import { ContextoCadastroNovoLinkGrupoAventuraProvider, useContextoCadastroNovoLinkGrupoAventura } from 'Contextos/ContextoCadastroNovoLinkGrupoAventura/contexto';
import { CabecalhoDeAventura } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';

export function AdministrarAventura_Slot({ grupoAventura }: { grupoAventura: GrupoAventuraDto; }) {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo hrefPaginaRetorno={'/minhas-paginas/admin/aventuras'}>
                <AdministrarAventura_Conteudo grupoAventura={grupoAventura} />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesAdmin />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function AdministrarAventura_Conteudo({ grupoAventura }: { grupoAventura: GrupoAventuraDto; }) {
    return (
        <ContextoCadastroNovoLinkGrupoAventuraProvider idGrupoAventura={grupoAventura.id}>
            <CabecalhoDeAventura pathCapa={grupoAventura.aventura.imagemCapa!.fullPath} titulo={grupoAventura.nomeUnicoGrupoAventura} />

            <BotoesAventura grupoAventura={grupoAventura} />

            <AreaEpisodios detalhesSessaoAventura={grupoAventura.detalhesSessoesAventuras} />
        </ContextoCadastroNovoLinkGrupoAventuraProvider>
    );
};

function BotoesAventura({ grupoAventura }: { grupoAventura: GrupoAventuraDto; }) {
    return (
        <SecaoDeConteudo id={styles.recipiente_botoes_aventura}>
            <AreaLinkTrailer linkTrailer={grupoAventura.linkTrailerYoutube} />

            <AreaLinkPlaylist linkPlaylist={grupoAventura.linkPlaylistYoutube} />

            <AreaLinkSerie linkSerie={grupoAventura.linkSerieSpotify} />
        </SecaoDeConteudo>
    );
}

function AreaLinkTrailer({ linkTrailer }: { linkTrailer: LinkDto }) {
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

function AreaLinkPlaylist({ linkPlaylist }: { linkPlaylist: LinkDto }) {
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

function AreaLinkSerie({ linkSerie }: { linkSerie: LinkDto }) {
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

function AreaEpisodios({ detalhesSessaoAventura }: { detalhesSessaoAventura: DetalheSessaoAventuraDto[] }) {
    return (
        <SecaoDeConteudo id={styles.recipiente_area_episodios}>
            <h1>{detalhesSessaoAventura.length} Episódios</h1>
            <div id={styles.recipiente_area_lista_episodios}>
                {detalhesSessaoAventura.sort((a, b) => a.episodio - b.episodio).map(detalheSessaoAventura => {
                    const temEpisodioYoutubeVinculado = detalheSessaoAventura.sessao.detalheSessaoCanonica.linkSessaoYoutube !== null;
                    const temEpisodioSpotifyVinculado = detalheSessaoAventura.sessao.detalheSessaoCanonica.linkSessaoSpotify !== null;


                    return (
                        <Link key={detalheSessaoAventura.sessao.id} href={`/minhas-paginas/admin/sessao/${detalheSessaoAventura.sessao.id}`} className={!temEpisodioYoutubeVinculado && !temEpisodioSpotifyVinculado ? styles.episodio_sem_nenhum_vinculo : temEpisodioYoutubeVinculado !== temEpisodioSpotifyVinculado ? styles.episodio_com_algum_vinculo : styles.episodio_completo_vinculo}>{detalheSessaoAventura.episodioPorExtenso}</Link>
                    );
                })}
            </div>
        </SecaoDeConteudo>
    );
};