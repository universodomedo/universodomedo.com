import styles from './styles.module.css';

import { useEffect, useState, type CSSProperties } from 'react';
import type { AcaoDisponivel, AcaoTemporalSalaDeJogoRuntime, EstadoTemporalSalaDeJogoRuntime, InteragivelPercebidoSalaJogoWsDto, KeyCombatenteMissaoFuncionalSalaDeJogoRuntime, SerNaSalaJogoWsDto } from 'types-nora-api';

import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';
import type { GrupoAcoesPorCapacidadeFicha } from 'Contextos/ContextoFichaDePersonagem/contexto';
import { useContextoControleAcoesRuntime } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAcoesRuntime/contexto';
import { useContextoTelaDeJogoMapaLogicoOpcional } from 'Componentes/ElementosDeJogo/TelaDeJogo/ContextoTelaDeJogoMapaLogico';

type CooldownAcaoExecutandoFicha = { keyAcao: string; estilo: CSSProperties };

export default function PaginaControleAcoes() {
    const { acoesPorStatusECapacidade, desativarAcoes } = useContextoFichaDePersonagem();
    const { executaAcao, executaEsperar, estadoTemporalSalaJogo } = useContextoControleAcoesRuntime();
    const mapaLogico = useContextoTelaDeJogoMapaLogicoOpcional();
    const [acaoComSelecaoAlvo, setAcaoComSelecaoAlvo] = useState<AcaoDisponivel | null>(null);
    const [momentoProjetadoMs, setMomentoProjetadoMs] = useState(0);
    const seresNaSala = mapaLogico?.seresNaSala ?? [];
    const interagiveisPercebidos = mapaLogico?.interagiveisPercebidos ?? [];
    const tempoRodando = estadoTemporalSalaJogo?.status === 'RODANDO';
    const acoesFichaDesativadas = desativarAcoes || tempoRodando;
    const acaoEmExecucao = estadoTemporalSalaJogo?.acoesTemporais.find(acaoTemporal => acaoTemporal.status === 'EM_ANDAMENTO' && acaoTemporal.tipo === 'atacar') ?? null;

    useEffect(() => {
        if (!estadoTemporalSalaJogo) return;
        const momentoReferenciaMs = estadoTemporalSalaJogo.momentoAtualMs;
        const recebidoLocalmenteEmMs = Date.now();
        setMomentoProjetadoMs(momentoReferenciaMs);

        if (estadoTemporalSalaJogo.status !== 'RODANDO') return;

        const intervalo = window.setInterval(() => {
            const projetado = momentoReferenciaMs + Math.max(0, Date.now() - recebidoLocalmenteEmMs);
            setMomentoProjetadoMs(estadoTemporalSalaJogo.momentoLimiteProjecaoMs === null ? projetado : Math.min(projetado, estadoTemporalSalaJogo.momentoLimiteProjecaoMs));
        }, 30);

        return () => window.clearInterval(intervalo);
    }, [estadoTemporalSalaJogo]);

    const cooldownAcaoExecutando = obtemCooldownAcaoExecutando(acaoEmExecucao, momentoProjetadoMs);

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
            {acoesPorStatusECapacidade.realizaveis.length > 0 && <SecaoAcoesFicha titulo="Ações Realizáveis" grupos={acoesPorStatusECapacidade.realizaveis} desativarAcoes={acoesFichaDesativadas} cooldownAcaoExecutando={cooldownAcaoExecutando} executaAcao={solicitaExecucaoAcao} />}
            {estadoTemporalSalaJogo && <SecaoAcaoTemporalEsperar estadoTemporalSalaJogo={estadoTemporalSalaJogo} desativarAcoes={desativarAcoes} executaEsperar={executaEsperar} />}
            {acoesPorStatusECapacidade.bloqueadas.length > 0 && <SecaoAcoesFicha titulo="Ações Bloqueadas" grupos={acoesPorStatusECapacidade.bloqueadas} desativarAcoes={acoesFichaDesativadas} cooldownAcaoExecutando={cooldownAcaoExecutando} executaAcao={solicitaExecucaoAcao} />}
            {acaoComSelecaoAlvo && <ModalSelecaoAlvoAcao acao={acaoComSelecaoAlvo} seresNaSala={seresNaSala} interagiveisPercebidos={interagiveisPercebidos} cancelar={() => setAcaoComSelecaoAlvo(null)} confirmar={executaAcaoComAlvo} />}
        </div>
    );
};

function obtemCooldownAcaoExecutando(acaoTemporal: AcaoTemporalSalaDeJogoRuntime | null, momentoAtualMs: number): CooldownAcaoExecutandoFicha | null {
    if (!acaoTemporal || !acaoTemporal.ataque) return null;

    const ataque = acaoTemporal.ataque;
    const emExecucao = momentoAtualMs < ataque.momentoImpactoMs;
    const inicioFaseMs = emExecucao ? acaoTemporal.momentoInicioMs : ataque.momentoImpactoMs;
    const fimFaseMs = emExecucao ? ataque.momentoImpactoMs : (acaoTemporal.momentoFimPrevistoMs ?? ataque.momentoImpactoMs);
    const progressoFase = Math.min(1, Math.max(0, (momentoAtualMs - inicioFaseMs) / Math.max(1, fimFaseMs - inicioFaseMs)));
    const coberturaGraus = (1 - progressoFase) * 360;
    const corCobertura = emExecucao ? 'rgba(74, 222, 128, 0.72)' : 'rgba(239, 107, 107, 0.74)';

    return { keyAcao: ataque.keyAcao, estilo: { background: `conic-gradient(${corCobertura} ${coberturaGraus}deg, transparent ${coberturaGraus}deg)` } };
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

function SecaoAcoesFicha({ titulo, grupos, desativarAcoes, cooldownAcaoExecutando, executaAcao }: { titulo: string; grupos: GrupoAcoesPorCapacidadeFicha[]; desativarAcoes: boolean; cooldownAcaoExecutando: CooldownAcaoExecutandoFicha | null; executaAcao: (acao: AcaoDisponivel) => void; }) {
    return (
        <section className={styles.secao_acoes}>
            <h3 className={styles.titulo_secao}>{titulo}</h3>
            {grupos.map(grupo => <GrupoAcoesFicha key={grupo.capacidadeExibicao.key} grupo={grupo} desativarAcoes={desativarAcoes} cooldownAcaoExecutando={cooldownAcaoExecutando} executaAcao={executaAcao} />)}
        </section>
    );
};

function GrupoAcoesFicha({ grupo, desativarAcoes, cooldownAcaoExecutando, executaAcao }: { grupo: GrupoAcoesPorCapacidadeFicha; desativarAcoes: boolean; cooldownAcaoExecutando: CooldownAcaoExecutandoFicha | null; executaAcao: (acao: AcaoDisponivel) => void; }) {
    return (
        <div className={styles.grupo_capacidade}>
            <h4 className={styles.titulo_capacidade}>{grupo.capacidadeExibicao.nome}</h4>
            <div className={styles.lista_acoes}>
                {grupo.acoes.map(acao => <AcaoEmFicha key={acao.key} acao={acao} desativarAcoes={desativarAcoes} cooldownAcaoExecutando={cooldownAcaoExecutando} executaAcao={executaAcao} />)}
            </div>
        </div>
    );
};

function AcaoEmFicha({ acao, desativarAcoes, cooldownAcaoExecutando, executaAcao }: { acao: AcaoDisponivel; desativarAcoes: boolean; cooldownAcaoExecutando: CooldownAcaoExecutandoFicha | null; executaAcao: (acao: AcaoDisponivel) => void; }) {
    const acaoPodeExecutar = acao.habilitado && !desativarAcoes;
    const estaExecutando = cooldownAcaoExecutando !== null && cooldownAcaoExecutando.keyAcao === acao.key;
    const status = estaExecutando ? 'Executando' : acao.habilitado ? 'Realizável' : 'Bloqueada';

    function acionar(): void {
        if (!acaoPodeExecutar) return;
        executaAcao(acao);
    };

    return (
        <button type="button" className={`${styles.acao} ${acao.habilitado ? styles.acao_realizavel : styles.acao_bloqueada} ${(!acaoPodeExecutar && !estaExecutando) ? styles.acao_sem_interacao : ''}`} aria-disabled={!acaoPodeExecutar} aria-label={`${acao.nome} - ${status}`} onClick={acionar}>
            <span className={styles.icone_acao} aria-hidden="true">{acao.capacidadeExibicao.iconeTexto}</span>
            {estaExecutando && <span className={styles.cobertura_cooldown_acao} style={cooldownAcaoExecutando.estilo} aria-hidden="true" />}
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

function ModalSelecaoAlvoAcao({ acao, seresNaSala, interagiveisPercebidos, cancelar, confirmar }: { acao: AcaoDisponivel; seresNaSala: readonly SerNaSalaJogoWsDto[]; interagiveisPercebidos: readonly InteragivelPercebidoSalaJogoWsDto[]; cancelar: () => void; confirmar: (keyCombatenteAlvo: KeyCombatenteMissaoFuncionalSalaDeJogoRuntime) => void; }) {
    const objetosAlvo = interagiveisPercebidos.filter(interagivel => interagivel.tipo === 'objeto');

    return (
        <div className={styles.fundo_modal_alvo}>
            <section className={styles.modal_alvo} role="dialog" aria-modal="true" aria-label={`Selecionar alvo para ${acao.nome}`}>
                <header className={styles.cabecalho_modal_alvo}>
                    <strong>{acao.nome}</strong>
                    <button type="button" onClick={cancelar}>Cancelar</button>
                </header>
                <div className={styles.lista_alvos}>
                    {seresNaSala.length === 0 && objetosAlvo.length === 0 && <span>Nenhum alvo disponível.</span>}
                    {seresNaSala.map(ser => <button key={ser.keyInstancia} type="button" disabled={ser.papel === 'controlado'} onClick={() => confirmar(ser.keyInstancia)}>{ser.nome}{ser.papel === 'controlado' ? ' (ator)' : ''}</button>)}
                    {objetosAlvo.map(objeto => <button key={objeto.key} type="button" onClick={() => confirmar(objeto.key as KeyCombatenteMissaoFuncionalSalaDeJogoRuntime)}>{objeto.nome}</button>)}
                </div>
            </section>
        </div>
    );
};
