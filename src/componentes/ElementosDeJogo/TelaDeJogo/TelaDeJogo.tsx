'use client';

import styles from './styles.module.css';

import type { SalaDeJogo_Codigo } from 'types-nora-api';

import { ContextoTelaDeJogoMapaLogicoProvider } from './ContextoTelaDeJogoMapaLogico';
import { InspecaoOcupanteMapaLogico } from './InspecaoOcupanteMapaLogico';
import { InteragiveisPercebidosSalaJogo } from './InteragiveisPercebidosSalaJogo';
import { MapaLogico2DSalaJogo } from './MapaLogico2DSalaJogo';
import { SeresNaSalaJogo } from './SeresNaSalaJogo';

type TelaDeJogoProps = {
    codigoSala: SalaDeJogo_Codigo;
};

export default function TelaDeJogo(props: TelaDeJogoProps) {
    return (
        <div className={styles.recipiente_tela_jogo}>
            <ContextoTelaDeJogoMapaLogicoProvider codigoSala={props.codigoSala}>
                <MapaLogico2DSalaJogo />
                <SeresNaSalaJogo />
                <InteragiveisPercebidosSalaJogo />
                <InspecaoOcupanteMapaLogico />
            </ContextoTelaDeJogoMapaLogicoProvider>
        </div>
    );
};
