import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';
import { PodcastEpisodio, TrailerGrupoAventura, VideoEpisodio } from './subcomponentes';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';

export function CabecalhoGrupoAventura() {
    const { grupoAventuraSelecionado, detalheSessaoSelecionada } = useContextoPaginaAventura();

    return (
        <SecaoDeConteudo>
            <h1>{grupoAventuraSelecionado.aventura.titulo}</h1>
            {detalheSessaoSelecionada && (<h3>{detalheSessaoSelecionada.episodioPorExtenso}</h3>)}
        </SecaoDeConteudo>
    );
};

export function CorpoGrupoAventura() {
    const { detalheSessaoSelecionada } = useContextoPaginaAventura();

    if (!detalheSessaoSelecionada) return <CorpoPaginaInicial />

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