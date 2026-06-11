'use client';

import type { LogicaJogoUsuario_ObjetoInicialSalaDto__Solo } from 'types-nora-api';

type PropsSPA_SalaDeJogo__Solo = {
    objetoInicialSala: LogicaJogoUsuario_ObjetoInicialSalaDto__Solo;
};

export default function SPA_SalaDeJogo__Solo(props: PropsSPA_SalaDeJogo__Solo) {
    return (
        <main>
            <h1>Modo Solo iniciado</h1>
            <p>Sala: {props.objetoInicialSala.codigoSalaDeJogo}</p>
            <p>Estado: {props.objetoInicialSala.estado}</p>
            <p>Missão funcional ainda não configurada.</p>
        </main>
    );
};