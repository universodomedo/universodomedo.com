import styles from './styles.module.css';

import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import PlayerYouTube from 'Componentes/Elementos/PlayerYouTube/PlayerYouTube';
import PlayerSpotify from 'Componentes/Elementos/PlayerSpotify/PlayerSpotify';

export function TrailerGrupoAventura() {
    const { grupoAventuraSelecionado } = useContextoPaginaAventura();

    if (!grupoAventuraSelecionado.gruposAventura![0].linkTrailerYoutube) return (
        <SecaoDeConteudo id={styles.recipiente_trailer_vazio}>
            <h3>Essa Aventura ainda não possui um Trailer</h3>
        </SecaoDeConteudo>
    );

    return (
        <SecaoDeConteudo id={styles.recipiente_trailer}>
            <PlayerYouTube urlSufixo={grupoAventuraSelecionado.gruposAventura![0].linkTrailerYoutube.sufixo} />
        </SecaoDeConteudo>
    );
};

export function VideoEpisodio() {
    const { sessaoSelecionada } = useContextoPaginaAventura();

    if (!sessaoSelecionada) return <p>Sessão não encontrada</p>;

    if (!sessaoSelecionada.linkSessaoYoutube) return (
        <SecaoDeConteudo id={styles.recipiente_trailer_vazio}>
            <h3>Esse Episódio ainda não possui Vídeo</h3>
        </SecaoDeConteudo>
    );

    return (
        <SecaoDeConteudo id={styles.recipiente_video}>
            <PlayerYouTube urlSufixo={sessaoSelecionada.linkSessaoYoutube.sufixo} />
        </SecaoDeConteudo>
    );
};

export function PodcastEpisodio() {
    const { sessaoSelecionada } = useContextoPaginaAventura();

    if (!sessaoSelecionada) return <p>Sessão não encontrada</p>;

    if (!sessaoSelecionada.linkSessaoSpotify) return (
        <SecaoDeConteudo id={styles.recipiente_trailer_vazio}>
            <h3>Esse Episódio ainda não possui Podcast</h3>
        </SecaoDeConteudo>
    );

    return (
        <SecaoDeConteudo id={styles.recipiente_podcast}>
            <PlayerSpotify urlSufixo={sessaoSelecionada.linkSessaoSpotify.sufixo} />
        </SecaoDeConteudo>
    );
};