import styles from './styles.module.css';

import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';

import PlayerYouTube from 'Componentes/Elementos/PlayerYouTube/PlayerYouTube';
import { ContainerFragmentoAssistindoSessao } from './componentes';
import PlayerSpotify from 'Componentes/Elementos/PlayerSpotify/PlayerSpotify';

export function TrailerGrupoAventura() {
    const { grupoAventuraSelecionado } = useContextoPaginaAventura();

    if (!grupoAventuraSelecionado.gruposAventura![0].linkTrailerYoutube) return (
        <ContainerFragmentoAssistindoSessao className={styles.recipiente_trailer_vazio}>
            <h3>Essa Aventura ainda não possui um Trailer</h3>
        </ContainerFragmentoAssistindoSessao>
    );

    return (
        <ContainerFragmentoAssistindoSessao className={styles.recipiente_trailer}>
            <PlayerYouTube urlSufixo={grupoAventuraSelecionado.gruposAventura![0].linkTrailerYoutube.sufixo} />
        </ContainerFragmentoAssistindoSessao>
    );
};

export function VideoEpisodio() {
    const { sessaoSelecionada } = useContextoPaginaAventura();

    if (!sessaoSelecionada) return <p>Sessão não encontrada</p>;

    if (!sessaoSelecionada.linkSessaoYoutube) return (
        <ContainerFragmentoAssistindoSessao className={styles.recipiente_trailer_vazio}>
            <h3>Esse Episódio ainda não possui Vídeo</h3>
        </ContainerFragmentoAssistindoSessao>
    );

    return (
        <ContainerFragmentoAssistindoSessao className={styles.recipiente_trailer}>
            <PlayerYouTube urlSufixo={sessaoSelecionada.linkSessaoYoutube.sufixo} />
        </ContainerFragmentoAssistindoSessao>
    );
};

export function PodcastEpisodio() {
    const { sessaoSelecionada } = useContextoPaginaAventura();

    if (!sessaoSelecionada) return <p>Sessão não encontrada</p>;

    if (!sessaoSelecionada.linkSessaoSpotify) return (
        <ContainerFragmentoAssistindoSessao className={styles.recipiente_trailer_vazio}>
            <h3>Esse Episódio ainda não possui Podcast</h3>
        </ContainerFragmentoAssistindoSessao>
    );

    return (
        <ContainerFragmentoAssistindoSessao className={styles.recipiente_video}>
            <PlayerSpotify urlSufixo={sessaoSelecionada.linkSessaoSpotify.sufixo} />
        </ContainerFragmentoAssistindoSessao>
    );
};