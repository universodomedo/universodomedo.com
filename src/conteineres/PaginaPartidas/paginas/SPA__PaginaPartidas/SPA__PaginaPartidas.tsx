import styles from './styles.module.css';

import CatalogoDeMissoes from 'Componentes/ElementosDeJogo/CatalogoDeMissoes/CatalogoDeMissoes';
import { FundoArteCapaPartida } from 'Conteineres/PaginaPartidas/paginas/SPA__PaginaPartidas/FundoArteCapaPartida';
import { MusicaFundoPartida } from 'Conteineres/PaginaPartidas/paginas/SPA__PaginaPartidas/MusicaFundoPartida';
import type { Contexto__PaginaPartidas__Props } from 'Contextos/Contexto__PaginaPartidas/contexto';

export default function SPA__PaginaPartidas({ catalogosDisponiveis, idPartidaSelecionada, partidaSelecionada, podeJogarPartidaSelecionada, carregando, jogando, erro, selecionarPartida, jogarPartidaSelecionada }: Contexto__PaginaPartidas__Props) {
    const textoBotaoJogar = resolveTextoBotaoJogar(carregando, jogando, partidaSelecionada, podeJogarPartidaSelecionada);

    return (
        <div className={styles.pagina_partidas}>
            <FundoArteCapaPartida idProjetoCapa={partidaSelecionada?.arteCapa?.idProjeto ?? null} />
            <MusicaFundoPartida idMusicaConfigurada={partidaSelecionada?.idMusicaConfigurada ?? null} nomePartida={partidaSelecionada?.nome ?? null} />
            {erro && <div className={styles.erro}>{erro}</div>}
            <section className={styles.secao_detalhamento}>
                <button type="button" className={styles.botao_jogar} disabled={!podeJogarPartidaSelecionada || jogando || carregando} onClick={jogarPartidaSelecionada}>
                    {textoBotaoJogar}
                </button>
            </section>
            <section className={styles.secao_catalogo}><CatalogoDeMissoes catalogos={catalogosDisponiveis} idMissaoSelecionada={idPartidaSelecionada} carregando={carregando} aoSelecionarMissao={partida => selecionarPartida(partida.id)} /></section>
        </div>
    );
};

function resolveTextoBotaoJogar(carregando: boolean, jogando: boolean, partidaSelecionada: Contexto__PaginaPartidas__Props['partidaSelecionada'], podeJogarPartidaSelecionada: boolean): string {
    if (carregando) return 'Carregando Partidas';
    if (jogando) return 'Iniciando...';
    if (!partidaSelecionada) return 'Selecione uma Partida';
    if (!podeJogarPartidaSelecionada) return 'Partida não configurada';

    return 'Jogar Partida';
};
