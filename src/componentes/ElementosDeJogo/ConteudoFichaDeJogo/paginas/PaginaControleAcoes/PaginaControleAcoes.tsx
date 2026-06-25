import styles from './styles.module.css';

import { useState } from 'react';
import type { AcaoDisponivel, EstadoTemporalSalaDeJogoRuntime, KeyCombatenteMissaoFuncionalSalaDeJogoRuntime, SerNaSalaJogoWsDto } from 'types-nora-api';

import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';
import type { GrupoAcoesPorCapacidadeFicha } from 'Contextos/ContextoFichaDePersonagem/contexto';
import { useContextoControleAcoesRuntime } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAcoesRuntime/contexto';
import { useContextoTelaDeJogoMapaLogicoOpcional } from 'Componentes/ElementosDeJogo/TelaDeJogo/ContextoTelaDeJogoMapaLogico';
import { useContextoMovimentacaoSalaJogoOpcional } from 'Componentes/ElementosDeJogo/TelaDeJogo/ContextoMovimentacaoSalaJogo';

export default function PaginaControleAcoes() {
    const { acoesPorStatusECapacidade, desativarAcoes } = useContextoFichaDePersonagem();
    const { executaAcao, executaEsperar, estadoTemporalSalaJogo } = useContextoControleAcoesRuntime();
    const mapaLogico = useContextoTelaDeJogoMapaLogicoOpcional();
    const movimentacao = useContextoMovimentacaoSalaJogoOpcional();
    const [acaoComSelecaoAlvo, setAcaoComSelecaoAlvo] = useState<AcaoDisponivel | null>(null);
    const seresNaSala = mapaLogico?.seresNaSala ?? [];

    function solicitaExecucaoAcao(acao: AcaoDisponivel): void {
        if (acao.execucao.tipo === 'combatente_sala') {
            setAcaoComSelecaoAlvo(acao);
            return;
        }

        executaAcao(acao.key);
    };

    function executaAcaoComAlvo(keyCombatenteAlvo: KeyCombatenteMissaoFuncionalSalaDeJogoRuntime): void {
        if (!acaoComSelecaoAlvo) return;
        executaAcao(acaoComSelecaoAlvo.key, keyCombatenteAlvo);
        setAcaoComSelecaoAlvo(null);
    };

    return (
        <div className={styles.painel_acoes}>
            {acoesPorStatusECapacidade.realizaveis.length > 0 && <SecaoAcoesFicha titulo="Ações Realizáveis" grupos={acoesPorStatusECapacidade.realizaveis} desativarAcoes={desativarAcoes} executaAcao={solicitaExecucaoAcao} />}
            {estadoTemporalSalaJogo && movimentacao && <SecaoAcaoLocomocao estadoTemporalSalaJogo={estadoTemporalSalaJogo} desativarAcoes={desativarAcoes} modoMovimentacaoAtivo={movimentacao.modoMovimentacaoAtivo} iniciaModoMovimentacao={movimentacao.iniciaModoMovimentacao} cancelaModoMovimentacao={movimentacao.cancelaModoMovimentacao} />}
            {estadoTemporalSalaJogo && <SecaoAcaoTemporalEsperar estadoTemporalSalaJogo={estadoTemporalSalaJogo} desativarAcoes={desativarAcoes} executaEsperar={executaEsperar} />}
            {acoesPorStatusECapacidade.bloqueadas.length > 0 && <SecaoAcoesFicha titulo="Ações Bloqueadas" grupos={acoesPorStatusECapacidade.bloqueadas} desativarAcoes={desativarAcoes} executaAcao={solicitaExecucaoAcao} />}
            {acaoComSelecaoAlvo && <ModalSelecaoAlvoAcao acao={acaoComSelecaoAlvo} seresNaSala={seresNaSala} cancelar={() => setAcaoComSelecaoAlvo(null)} confirmar={executaAcaoComAlvo} />}
        </div>
    );
};

function SecaoAcaoTemporalEsperar({ estadoTemporalSalaJogo, desativarAcoes, executaEsperar }: { estadoTemporalSalaJogo: EstadoTemporalSalaDeJogoRuntime; desativarAcoes: boolean; executaEsperar: () => void; }) {
    const acaoPodeExecutar = estadoTemporalSalaJogo.status !== 'RODANDO' && !desativarAcoes;
    const status = estadoTemporalSalaJogo.status === 'RODANDO' ? 'Tempo em andamento' : 'Realizável';

    function acionar(): void {
        if (!acaoPodeExecutar) return;
        executaEsperar();
    };

    return (
        <section className={styles.secao_acoes}>
            <h3 className={styles.titulo_secao}>Ações Temporais</h3>
            <div className={styles.grupo_capacidade}>
                <h4 className={styles.titulo_capacidade}>Tempo da Sala</h4>
                <div className={styles.lista_acoes}>
                    <button type="button" className={`${styles.acao} ${acaoPodeExecutar ? styles.acao_realizavel : styles.acao_bloqueada} ${!acaoPodeExecutar ? styles.acao_sem_interacao : ''}`} aria-disabled={!acaoPodeExecutar} aria-label={`Esperar - ${status}`} onClick={acionar}>
                        <span className={styles.icone_acao} aria-hidden="true">E</span>
                        <span className={styles.resumo_acao} role="tooltip">
                            <strong>Esperar</strong>
                            <span>Tempo da Sala</span>
                            <span>Retoma a passagem do tempo</span>
                            <span>{status}</span>
                            <span className={styles.lista_requisitos}>
                                <span>{estadoTemporalSalaJogo.status === 'RODANDO' ? 'O tempo já está em andamento' : 'O tempo está pausado'}</span>
                            </span>
                            <small>sala.temporal.esperar</small>
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

function SecaoAcaoLocomocao({ estadoTemporalSalaJogo, desativarAcoes, modoMovimentacaoAtivo, iniciaModoMovimentacao, cancelaModoMovimentacao }: { estadoTemporalSalaJogo: EstadoTemporalSalaDeJogoRuntime; desativarAcoes: boolean; modoMovimentacaoAtivo: boolean; iniciaModoMovimentacao: () => void; cancelaModoMovimentacao: () => void; }) {
    const acaoPodeExecutar = estadoTemporalSalaJogo.status !== 'RODANDO' && !desativarAcoes;
    const status = estadoTemporalSalaJogo.status === 'RODANDO' ? 'Em locomoção' : modoMovimentacaoAtivo ? 'Selecionando destino' : 'Realizável';

    function acionar(): void {
        if (!acaoPodeExecutar) return;
        if (modoMovimentacaoAtivo) { cancelaModoMovimentacao(); return; }
        iniciaModoMovimentacao();
    };

    return (
        <section className={styles.secao_acoes}>
            <h3 className={styles.titulo_secao}>Locomoção</h3>
            <div className={styles.grupo_capacidade}>
                <h4 className={styles.titulo_capacidade}>Movimento</h4>
                <div className={styles.lista_acoes}>
                    <button type="button" className={`${styles.acao} ${acaoPodeExecutar ? styles.acao_realizavel : styles.acao_bloqueada} ${!acaoPodeExecutar ? styles.acao_sem_interacao : ''}`} aria-disabled={!acaoPodeExecutar} aria-pressed={modoMovimentacaoAtivo} aria-label={`Teste Locomoção - ${status}`} onClick={acionar}>
                        <span className={styles.icone_acao} aria-hidden="true">L</span>
                        <span className={styles.resumo_acao} role="tooltip">
                            <strong>{modoMovimentacaoAtivo ? 'Cancelar movimentação' : 'Teste Locomoção'}</strong>
                            <span>Movimento</span>
                            <span>{modoMovimentacaoAtivo ? 'Clique no chão para definir o destino' : 'Selecione um ponto no chão para se mover'}</span>
                            <span>{status}</span>
                            <small>sala.locomocao.teste</small>
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

function SecaoAcoesFicha({ titulo, grupos, desativarAcoes, executaAcao }: { titulo: string; grupos: GrupoAcoesPorCapacidadeFicha[]; desativarAcoes: boolean; executaAcao: (acao: AcaoDisponivel) => void; }) {
    return (
        <section className={styles.secao_acoes}>
            <h3 className={styles.titulo_secao}>{titulo}</h3>
            {grupos.map(grupo => <GrupoAcoesFicha key={grupo.capacidadeExibicao.key} grupo={grupo} desativarAcoes={desativarAcoes} executaAcao={executaAcao} />)}
        </section>
    );
};

function GrupoAcoesFicha({ grupo, desativarAcoes, executaAcao }: { grupo: GrupoAcoesPorCapacidadeFicha; desativarAcoes: boolean; executaAcao: (acao: AcaoDisponivel) => void; }) {
    return (
        <div className={styles.grupo_capacidade}>
            <h4 className={styles.titulo_capacidade}>{grupo.capacidadeExibicao.nome}</h4>
            <div className={styles.lista_acoes}>
                {grupo.acoes.map(acao => <AcaoEmFicha key={acao.key} acao={acao} desativarAcoes={desativarAcoes} executaAcao={executaAcao} />)}
            </div>
        </div>
    );
};

function AcaoEmFicha({ acao, desativarAcoes, executaAcao }: { acao: AcaoDisponivel; desativarAcoes: boolean; executaAcao: (acao: AcaoDisponivel) => void; }) {
    const acaoPodeExecutar = acao.habilitado && !desativarAcoes;
    const status = acao.habilitado ? 'Realizável' : 'Bloqueada';

    function acionar(): void {
        if (!acaoPodeExecutar) return;
        executaAcao(acao);
    };

    return (
        <button type="button" className={`${styles.acao} ${acao.habilitado ? styles.acao_realizavel : styles.acao_bloqueada} ${!acaoPodeExecutar ? styles.acao_sem_interacao : ''}`} aria-disabled={!acaoPodeExecutar} aria-label={`${acao.nome} - ${status}`} onClick={acionar}>
            <span className={styles.icone_acao} aria-hidden="true">{acao.capacidadeExibicao.iconeTexto}</span>
            <span className={styles.resumo_acao} role="tooltip">
                <strong>{acao.nome}</strong>
                <span>{acao.capacidadeExibicao.nome}</span>
                <span>{acao.origemExibicao.nome}</span>
                <span>{status}</span>
                <span className={styles.lista_requisitos}>
                    {acao.requisitos.length === 0 && <span>Sem requisitos adicionais</span>}
                    {acao.requisitos.map(requisito => <span key={requisito.descricao} className={requisito.cumprido ? styles.requisito_cumprido : styles.requisito_bloqueado}>{requisito.descricao}</span>)}
                </span>
                <small>{acao.key}</small>
            </span>
        </button>
    );
};

function ModalSelecaoAlvoAcao({ acao, seresNaSala, cancelar, confirmar }: { acao: AcaoDisponivel; seresNaSala: readonly SerNaSalaJogoWsDto[]; cancelar: () => void; confirmar: (keyCombatenteAlvo: KeyCombatenteMissaoFuncionalSalaDeJogoRuntime) => void; }) {
    return (
        <div className={styles.fundo_modal_alvo}>
            <section className={styles.modal_alvo} role="dialog" aria-modal="true" aria-label={`Selecionar alvo para ${acao.nome}`}>
                <header className={styles.cabecalho_modal_alvo}>
                    <strong>{acao.nome}</strong>
                    <button type="button" onClick={cancelar}>Cancelar</button>
                </header>
                <div className={styles.lista_alvos}>
                    {seresNaSala.length === 0 && <span>Nenhum alvo disponível.</span>}
                    {seresNaSala.map(ser => <button key={ser.keyInstancia} type="button" disabled={ser.papel === 'controlado'} onClick={() => confirmar(ser.keyInstancia)}>{ser.nome}{ser.papel === 'controlado' ? ' (ator)' : ''}</button>)}
                </div>
            </section>
        </div>
    );
};
