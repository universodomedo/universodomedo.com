'use client';

import styles from './styles.module.css';

import Link from 'next/link';
import { DetalheSessaoAventuraCompletaDto, DetalheSessaoAventuraSemGrupoDto, LinkCompletaDto, PAGINAS } from 'types-nora-api';

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaAdminAventuraProvider, useContextoPaginaAdminAventura } from 'Contextos/ContextoPaginaAdminAventura/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { ContextoCadastroNovoLinkGrupoAventuraProvider, useContextoCadastroNovoLinkGrupoAventura } from 'Contextos/ContextoCadastroNovoLinkGrupoAventura/contexto';
import { CabecalhoDeAventura } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';

export function AdministrarAventura_Client({ idGrupoAventura }: { idGrupoAventura: number }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.aventura}>
            <ContextoPaginaAdminAventuraProvider idGrupoAventura={idGrupoAventura}>
                <AdministrarAventura_Contexto />
            </ContextoPaginaAdminAventuraProvider>
        </ControladorSlot>
    );
};

function AdministrarAventura_Contexto() {
    const { grupoAventura } = useContextoPaginaAdminAventura();
    useConfigurarLayoutContextualizado({ titulo: `Gerenciamento da Aventura: ${grupoAventura.nomeUnicoGrupoAventura}`, fecharProps: { tipo: 'href', paginaRetorno: PAGINAS.minhasPaginas.admin.aventuras, tituloTooltip: 'Voltar para Aventuras' } });

    return (
        <ContextoCadastroNovoLinkGrupoAventuraProvider idGrupoAventura={grupoAventura.id}>
            <CabecalhoDeAventura tipo={'grupoAventura'} grupoAventura={grupoAventura} />

            <BotoesAventura />

            <AreaEpisodios detalhesSessaoAventura={grupoAventura.detalhesSessoesAventuras} />
        </ContextoCadastroNovoLinkGrupoAventuraProvider>
    );
};

function BotoesAventura() {
    const { grupoAventura } = useContextoPaginaAdminAventura();

    return (
        <SecaoDeConteudo id={styles.recipiente_botoes_aventura}>
            <></>
            {/* <AreaLinkTrailer linkTrailer={grupoAventura.linkTrailerYoutube} />

            <AreaLinkPlaylist linkPlaylist={grupoAventura.linkPlaylistYoutube} />

            <AreaLinkSerie linkSerie={grupoAventura.linkSerieSpotify} /> */}
        </SecaoDeConteudo>
    );
}

function AreaLinkTrailer({ linkTrailer }: { linkTrailer: LinkCompletaDto }) {
    const { iniciaProcessoVinculoLinkGrupoAventura } = useContextoCadastroNovoLinkGrupoAventura();

    return (
        <div id={styles.recipiente_area_link_trailer}>
            {linkTrailer && linkTrailer.urlCompleta ? (
                <Link href={linkTrailer.urlCompleta} target='_blank'><p>Tem Trailer</p></Link>
            ) : (
                <button onClick={() => iniciaProcessoVinculoLinkGrupoAventura(1)}>Configurar Trailer</button>
            )}
        </div>
    );
};

function AreaLinkPlaylist({ linkPlaylist }: { linkPlaylist: LinkCompletaDto }) {
    const { iniciaProcessoVinculoLinkGrupoAventura } = useContextoCadastroNovoLinkGrupoAventura();

    return (
        <div id={styles.recipiente_area_link_trailer}>
            {linkPlaylist && linkPlaylist.urlCompleta ? (
                <Link href={linkPlaylist.urlCompleta} target='_blank'><p>Tem Playlist</p></Link>
            ) : (
                <button onClick={() => iniciaProcessoVinculoLinkGrupoAventura(3)}>Configurar Playlist</button>
            )}
        </div>
    );
};

function AreaLinkSerie({ linkSerie }: { linkSerie: LinkCompletaDto }) {
    const { iniciaProcessoVinculoLinkGrupoAventura } = useContextoCadastroNovoLinkGrupoAventura();

    return (
        <div id={styles.recipiente_area_link_trailer}>
            {linkSerie && linkSerie.urlCompleta ? (
                <Link href={linkSerie.urlCompleta} target='_blank'><p>Tem Série</p></Link>
            ) : (
                <button onClick={() => iniciaProcessoVinculoLinkGrupoAventura(5)}>Configurar Série</button>
            )}
        </div>
    );
};

function AreaEpisodios({ detalhesSessaoAventura }: { detalhesSessaoAventura: DetalheSessaoAventuraSemGrupoDto[] }) {
    return (
        <SecaoDeConteudo id={styles.recipiente_area_episodios}>
            <h1>{detalhesSessaoAventura.length} Episódios</h1>
            <div id={styles.recipiente_area_lista_episodios}>
                
                {detalhesSessaoAventura.sort((a, b) => a.episodio - b.episodio).map(detalheSessaoAventura => {
                    const temEpisodioYoutubeVinculado = detalheSessaoAventura.sessao.linkSessaoYoutube !== null;
                    const temEpisodioSpotifyVinculado = detalheSessaoAventura.sessao.linkSessaoSpotify !== null;

                    return <LinkInterno key={detalheSessaoAventura.sessao.id} destino={{ pagina: PAGINAS.minhasPaginas.admin.sessao, params: { id: String(detalheSessaoAventura.sessao.id) } }} className={!temEpisodioYoutubeVinculado && !temEpisodioSpotifyVinculado ? styles.episodio_sem_nenhum_vinculo : temEpisodioYoutubeVinculado !== temEpisodioSpotifyVinculado ? styles.episodio_com_algum_vinculo : styles.episodio_completo_vinculo}>{detalheSessaoAventura.episodioPorExtenso}</LinkInterno>;
                })}
            </div>
        </SecaoDeConteudo>
    );
};