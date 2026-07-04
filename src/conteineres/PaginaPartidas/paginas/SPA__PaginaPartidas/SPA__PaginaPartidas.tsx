import styles from './styles.module.css';

import { useCallback } from 'react';

import CatalogoDeMissoes, { type CatalogoDeMissoesItem } from 'Componentes/ElementosDeJogo/CatalogoDeMissoes/CatalogoDeMissoes';
import { FundoArteCapaPartida } from 'Conteineres/PaginaPartidas/paginas/SPA__PaginaPartidas/FundoArteCapaPartida';
import { MusicaFundoPartida } from 'Conteineres/PaginaPartidas/paginas/SPA__PaginaPartidas/MusicaFundoPartida';
import { BloqueioDeSilencio } from 'Componentes/Elementos/CentralAudio/BloqueioDeSilencio';
import { DetalhePartida } from 'Conteineres/PaginaPartidas/paginas/SPA__PaginaPartidas/DetalhePartida';
import type { Contexto__PaginaPartidas__Props } from 'Contextos/Contexto__PaginaPartidas/contexto';

export default function SPA__PaginaPartidas({ catalogosDisponiveis, idPartidaInicial, partidaSelecionada, podeJogarPartidaSelecionada, carregando, jogando, erro, selecionarPartida, jogarPartidaSelecionada }: Contexto__PaginaPartidas__Props) {
    const textoBotaoJogar = resolveTextoBotaoJogar(carregando, jogando, partidaSelecionada, podeJogarPartidaSelecionada);
    // TODO(desafio-cooldown): somar aqui o estado de ESPERA do Desafio (cooldown) para desabilitar o botão enquanto o timer corre — ver resolveTextoBotaoJogar.
    const botaoDesabilitado = !podeJogarPartidaSelecionada || jogando || carregando;
    const aoFocarMissao = useCallback((missao: CatalogoDeMissoesItem | null) => selecionarPartida(missao ? missao.id : null), [selecionarPartida]);

    return (
        <div className={styles.pagina_partidas}>
            <FundoArteCapaPartida idProjetoCapa={partidaSelecionada?.arteCapa?.idProjeto ?? null} />
            <MusicaFundoPartida idMusicaConfigurada={partidaSelecionada?.idMusicaConfigurada ?? null} nomePartida={partidaSelecionada?.nome ?? null} />
            <BloqueioDeSilencio />
            {erro && <div className={styles.erro}>{erro}</div>}
            <section className={styles.secao_detalhamento}>
                {partidaSelecionada && <DetalhePartida key={partidaSelecionada.id} partida={partidaSelecionada} textoBotaoJogar={textoBotaoJogar} desabilitado={botaoDesabilitado} aoJogar={jogarPartidaSelecionada} />}
            </section>
            <section className={styles.secao_catalogo}><CatalogoDeMissoes catalogos={catalogosDisponiveis} carregando={carregando} aoFocarMissao={aoFocarMissao} idMissaoInicial={idPartidaInicial} /></section>
        </div>
    );
};

function resolveTextoBotaoJogar(carregando: boolean, jogando: boolean, partidaSelecionada: Contexto__PaginaPartidas__Props['partidaSelecionada'], podeJogarPartidaSelecionada: boolean): string {
    if (carregando) return 'Carregando Partidas';
    if (jogando) return 'Iniciando...';
    if (!partidaSelecionada) return 'Selecione uma Partida';
    if (!podeJogarPartidaSelecionada) return 'Partida não configurada';

    const ehDesafio = partidaSelecionada.tipo === 'DESAFIO';

    // TODO(desafio-cooldown): quando o item for um DESAFIO em ESPERA (janela de participação fechada),
    // o texto aqui deve virar o timer de disponibilidade (ex.: "Disponível em 2h 15m") e o botão fica
    // desabilitado (ver botaoDesabilitado). O estado/tempo vem do backend (Painel de Desafios Ativos) — lógica ainda não implementada.

    return ehDesafio ? 'Iniciar Desafio' : 'Iniciar Partida';
};
