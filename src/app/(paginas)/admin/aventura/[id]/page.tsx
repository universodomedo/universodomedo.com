import styles from '../styles.module.css';

import { ContextoCadastroNovoLinkGrupoAventuraProvider } from 'Contextos/ContextoCadastroNovoLinkGrupoAventura/contexto';
import { buscaGrupoAventuraEspecifico } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { AreaEpisodios, AreaLinkTrailer, AreaLinkPlaylist, AreaLinkSerie } from '../componentes';

export default async function AdministrarAventura({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const aventura = await buscaGrupoAventuraEspecifico(Number(id));

    if (!aventura) return <div>Aventura não encontrada</div>

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