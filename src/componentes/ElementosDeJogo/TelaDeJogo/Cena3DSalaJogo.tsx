'use client';

import styles from './Cena3DSalaJogo.module.css';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import type { EstadoTemporalSalaDeJogoRuntime, ResultadoMissaoFuncionalSalaDeJogoRuntime, ResumoMissaoFuncionalSalaDeJogoRuntime } from 'types-nora-api';

import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';
import { CenaSalaJogoR3F } from './CenaSalaJogoR3F';

interface Cena3DSalaJogoProps {
    readonly missaoFuncional: ResumoMissaoFuncionalSalaDeJogoRuntime | null;
    readonly resultadoMissaoFuncional: ResultadoMissaoFuncionalSalaDeJogoRuntime | null;
    readonly estadoTemporalSalaJogo: EstadoTemporalSalaDeJogoRuntime | null;
};

interface ObjetivosMissaoSalaJogoProps {
    readonly missaoFuncional: ResumoMissaoFuncionalSalaDeJogoRuntime;
    readonly concluida: boolean;
};

interface RelogioFiccionalSalaJogoProps {
    readonly estadoTemporalSalaJogo: EstadoTemporalSalaDeJogoRuntime;
};

export function Cena3DSalaJogo({ missaoFuncional, resultadoMissaoFuncional, estadoTemporalSalaJogo }: Cena3DSalaJogoProps) {
    const { estadoCarregamento, erro, mapaLogicoSalaJogo, keysInteragiveisPercebidosNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, selecionaOcupante, selecionaInteragivel, limpaSelecaoOcupante, limpaSelecaoInteragivel } = useContextoTelaDeJogoMapaLogico();

    if (estadoCarregamento === 'carregando') {
        return (
            <div className={styles.estado_cena_3d_sala_jogo}>
                <strong>Carregando cenário 3D da sala</strong>
                <span>Aguardando mapa lógico da Sala de Jogo.</span>
            </div>
        );
    }

    if (estadoCarregamento === 'erro' || mapaLogicoSalaJogo === null) {
        return (
            <div className={styles.estado_cena_3d_sala_jogo}>
                <strong>Cenário 3D indisponível</strong>
                <span>{erro ?? 'Payload do mapa lógico ausente.'}</span>
            </div>
        );
    }

    return (
        <div className={styles.recipiente_cena_3d_sala_jogo}>
            <CenaSalaJogoR3F payload={mapaLogicoSalaJogo} keysInteragiveisPercebidosNovos={keysInteragiveisPercebidosNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} aoSelecionarOcupante={selecionaOcupante} aoSelecionarInteragivel={selecionaInteragivel} aoLimparSelecao={() => { limpaSelecaoOcupante(); limpaSelecaoInteragivel(); }} />
            {missaoFuncional && <ObjetivosMissaoSalaJogo missaoFuncional={missaoFuncional} concluida={resultadoMissaoFuncional?.resultado === 'VITORIA'} />}
            {estadoTemporalSalaJogo && <RelogioFiccionalSalaJogo estadoTemporalSalaJogo={estadoTemporalSalaJogo} />}
        </div>
    );
};

function RelogioFiccionalSalaJogo({ estadoTemporalSalaJogo }: RelogioFiccionalSalaJogoProps) {
    const [momentoAtualMs, setMomentoAtualMs] = useState(estadoTemporalSalaJogo.momentoAtualMs);

    useEffect(() => {
        const momentoReferenciaMs = estadoTemporalSalaJogo.momentoAtualMs;
        const recebidoLocalmenteEmMs = Date.now();
        setMomentoAtualMs(momentoReferenciaMs);

        if (estadoTemporalSalaJogo.status !== 'RODANDO') return;

        const intervalo = window.setInterval(() => {
            setMomentoAtualMs(limitaMomentoFiccionalProjetado(momentoReferenciaMs + Math.max(0, Date.now() - recebidoLocalmenteEmMs) * estadoTemporalSalaJogo.escalaTempo, estadoTemporalSalaJogo.momentoLimiteProjecaoMs));
        }, 33);

        return () => {
            window.clearInterval(intervalo);
        };
    }, [estadoTemporalSalaJogo]);

    return (
        <section className={styles.relogio_ficcional_sala_jogo} aria-label="Tempo da Sala">
            <span>{estadoTemporalSalaJogo.status === 'RODANDO' ? 'Tempo em andamento' : 'Tempo pausado'}</span>
            <strong>{formataMomentoFiccional(momentoAtualMs)}</strong>
        </section>
    );
};

function limitaMomentoFiccionalProjetado(momentoMs: number, momentoLimiteProjecaoMs: number | null): number {
    if (momentoLimiteProjecaoMs === null) return momentoMs;
    return Math.min(momentoMs, momentoLimiteProjecaoMs);
};

function ObjetivosMissaoSalaJogo({ missaoFuncional, concluida }: ObjetivosMissaoSalaJogoProps) {
    return (
        <section className={styles.objetivos_missao_sala_jogo} aria-label="Condições de Vitória">
            <strong>{missaoFuncional.nome}</strong>
            <ul>
                {missaoFuncional.condicoesVitoria.map(condicao => (
                    <li key={condicao.key} className={concluida ? styles.condicao_vitoria_concluida : styles.condicao_vitoria_pendente}>
                        {concluida && <FontAwesomeIcon icon={faCheck} />}
                        <span>{condicao.descricao}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

function formataMomentoFiccional(momentoMs: number): string {
    const data = new Date(momentoMs);
    const dia = formataNumeroRelogio(data.getUTCDate(), 2);
    const mes = formataNumeroRelogio(data.getUTCMonth() + 1, 2);
    const ano = data.getUTCFullYear();
    const hora = formataNumeroRelogio(data.getUTCHours(), 2);
    const minuto = formataNumeroRelogio(data.getUTCMinutes(), 2);
    const segundo = formataNumeroRelogio(data.getUTCSeconds(), 2);
    const milissegundo = formataNumeroRelogio(data.getUTCMilliseconds(), 3);

    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}.${milissegundo}`;
};

function formataNumeroRelogio(valor: number, tamanho: number): string { return String(valor).padStart(tamanho, '0'); };
