import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';
import { PodcastEpisodio, TrailerGrupoAventura, VideoEpisodio } from './subcomponentes';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';

export function CabecalhoGrupoAventura() {
    const { grupoAventuraSelecionado, sessaoSelecionada } = useContextoPaginaAventura();

    return (
        <SecaoDeConteudo>
            <h1>{grupoAventuraSelecionado.titulo}</h1>
            {sessaoSelecionada && (<h3>{sessaoSelecionada.episodioPorExtenso}</h3>)}
        </SecaoDeConteudo>
    );
};

export function CorpoGrupoAventura() {
    const { sessaoSelecionada } = useContextoPaginaAventura();

    if (!sessaoSelecionada) return <CorpoPaginaInicial />

    return <CorpoEpisodio />
};

function CorpoPaginaInicial() {
    return (
        <>
            <TrailerGrupoAventura />
        </>
    );
};

function CorpoEpisodio() {
    return (
        <>
            <VideoEpisodio />
            <PodcastEpisodio />
        </>
    );
};