'use client';

import styles from './styles.module.css';

import type { EstadoTemporalSalaDeJogoRuntime, ResultadoMissaoFuncionalSalaDeJogoRuntime, ResumoMissaoFuncionalSalaDeJogoRuntime, SalaDeJogo_Codigo } from 'types-nora-api';

import { Cena3DSalaJogo } from './Cena3DSalaJogo';
import { ContextoTelaDeJogoMapaLogicoProvider } from './ContextoTelaDeJogoMapaLogico';

type TelaDeJogoProps = {
    codigoSala: SalaDeJogo_Codigo;
    missaoFuncional?: ResumoMissaoFuncionalSalaDeJogoRuntime | null;
    resultadoMissaoFuncional?: ResultadoMissaoFuncionalSalaDeJogoRuntime | null;
    estadoTemporalSalaJogo?: EstadoTemporalSalaDeJogoRuntime | null;
};

export default function TelaDeJogo(props: TelaDeJogoProps) {
    return (
        <div className={styles.recipiente_tela_jogo}>
            <ContextoTelaDeJogoMapaLogicoProvider codigoSala={props.codigoSala}>
                <Cena3DSalaJogo missaoFuncional={props.missaoFuncional ?? null} resultadoMissaoFuncional={props.resultadoMissaoFuncional ?? null} estadoTemporalSalaJogo={props.estadoTemporalSalaJogo ?? null} />
            </ContextoTelaDeJogoMapaLogicoProvider>
        </div>
    );
};
