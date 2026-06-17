'use client';

import styles from './styles.module.css';

import type { SalaDeJogo_Codigo } from 'types-nora-api';

import { Cena3DSalaJogo } from './Cena3DSalaJogo';
import { ContextoTelaDeJogoMapaLogicoProvider } from './ContextoTelaDeJogoMapaLogico';
import { InspecaoInteragivelMapaLogico } from './InspecaoInteragivelMapaLogico';
import { InspecaoOcupanteMapaLogico } from './InspecaoOcupanteMapaLogico';
import { InteragiveisPercebidosSalaJogo } from './InteragiveisPercebidosSalaJogo';
import { SeresNaSalaJogo } from './SeresNaSalaJogo';

type TelaDeJogoProps = {
    codigoSala: SalaDeJogo_Codigo;
};

export default function TelaDeJogo(props: TelaDeJogoProps) {
    return (
        <div className={styles.recipiente_tela_jogo}>
            <ContextoTelaDeJogoMapaLogicoProvider codigoSala={props.codigoSala}>
                <Cena3DSalaJogo />
                <SeresNaSalaJogo />
                <InteragiveisPercebidosSalaJogo />
                <InspecaoInteragivelMapaLogico />
                <InspecaoOcupanteMapaLogico />
            </ContextoTelaDeJogoMapaLogicoProvider>
        </div>
    );
};
