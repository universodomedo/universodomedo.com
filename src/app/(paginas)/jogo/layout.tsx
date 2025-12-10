'use client';

import { ReactNode, useState } from "react";
import { Eventos_Emite, PAGINAS, SOCKET_SalaDeJogoDto } from 'types-nora-api';

import JogoRouteGuard from "./JogoRouteGuard";

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

export default function LayoutJogo({ children }: { children: ReactNode }) {
    const [estouEmJogo, setEstouEmJogo] = useState<boolean | null>(null);

    useEmitWsComDisparoInicial(
        Eventos_Emite.Jogo.eventos.emitirEstouEmJogo,
        {
            onSuccess: data => {
                console.log(`ALLOOOUUU`)
                console.log(data.estouEmJogo)
                setEstouEmJogo(data.estouEmJogo);
            },
            onError: err => {
                alert('onError');
            }
        }
    );

    if (estouEmJogo === null) return <p>Carregando...</p>;

    return (
        <JogoRouteGuard estaEmJogo={estouEmJogo}>
            {children}
        </JogoRouteGuard>
    );
};