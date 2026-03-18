// to do

// import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';
// import { PodcastEpisodio, TrailerGrupoAventura, VideoEpisodio } from './subcomponentes';
// import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';

// export function CorpoGrupoAventura() {
//     const { sessaoSelecionada } = useContextoPaginaAventura();

//     if (!sessaoSelecionada) return <CorpoPaginaInicial />

//     return <CorpoEpisodio />
// };

// function CorpoPaginaInicial() {
//     return (
//         <>
//             <TrailerGrupoAventura />
//         </>
//     );
// };

// function CorpoEpisodio() {
//     const { sessaoSelecionada } = useContextoPaginaAventura();

//     return (
//         <>
//             <SecaoDeConteudo fit><></>
//                 {/* {sessaoSelecionada && (<h3>{sessaoSelecionada.detalheSessaoAventura.episodioPorExtenso}</h3>)} */}
//             </SecaoDeConteudo>

//             <VideoEpisodio />
//             <PodcastEpisodio />
//         </>
//     );
// };