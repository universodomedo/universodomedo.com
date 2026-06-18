'use client';

import styles from './Cena3DSalaJogo.module.css';

import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import type { ResultadoMissaoFuncionalSalaDeJogoRuntime, ResumoMissaoFuncionalSalaDeJogoRuntime } from 'types-nora-api';

import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';
import { criaDocumentoCena3DSalaJogo } from './Cena3DSalaJogo.helpers';
import { Ambiente3DSalaJogo } from './Ambiente3DSalaJogo';

interface Cena3DSalaJogoProps {
    readonly missaoFuncional: ResumoMissaoFuncionalSalaDeJogoRuntime | null;
    readonly resultadoMissaoFuncional: ResultadoMissaoFuncionalSalaDeJogoRuntime | null;
};

interface ObjetivosMissaoSalaJogoProps {
    readonly missaoFuncional: ResumoMissaoFuncionalSalaDeJogoRuntime;
    readonly concluida: boolean;
};

export function Cena3DSalaJogo({ missaoFuncional, resultadoMissaoFuncional }: Cena3DSalaJogoProps) {
    const { estadoCarregamento, erro, mapaLogicoSalaJogo, keysInteragiveisPercebidosNovos } = useContextoTelaDeJogoMapaLogico();
    const documento = useMemo(() => mapaLogicoSalaJogo === null ? null : criaDocumentoCena3DSalaJogo(mapaLogicoSalaJogo, keysInteragiveisPercebidosNovos), [keysInteragiveisPercebidosNovos, mapaLogicoSalaJogo]);

    if (estadoCarregamento === 'carregando') {
        return (
            <div className={styles.estado_cena_3d_sala_jogo}>
                <strong>Carregando cenário 3D da sala</strong>
                <span>Aguardando mapa lógico da Sala de Jogo.</span>
            </div>
        );
    }

    if (estadoCarregamento === 'erro' || documento === null) {
        return (
            <div className={styles.estado_cena_3d_sala_jogo}>
                <strong>Cenário 3D indisponível</strong>
                <span>{erro ?? 'Payload do mapa lógico ausente.'}</span>
            </div>
        );
    }

    return (
        <div className={styles.recipiente_cena_3d_sala_jogo}>
            <Ambiente3DSalaJogo documento={documento} />
            {missaoFuncional && <ObjetivosMissaoSalaJogo missaoFuncional={missaoFuncional} concluida={resultadoMissaoFuncional?.resultado === 'VITORIA'} />}
        </div>
    );
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
