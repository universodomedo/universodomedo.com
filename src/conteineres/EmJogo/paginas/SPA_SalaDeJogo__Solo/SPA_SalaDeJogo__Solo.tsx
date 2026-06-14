'use client';

import { useState } from 'react';
import { Eventos_Emite } from 'types-nora-api';
import type { J_DadosFichaEmJogo, LogicaJogoUsuario_ObjetoInicialSalaDto__Solo } from 'types-nora-api';

import ConteudoFichaDeJogo from 'Componentes/ElementosDeJogo/ConteudoFichaDeJogo/ConteudoFichaDeJogo';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

type PropsSPA_SalaDeJogo__Solo = {
    objetoInicialSala: LogicaJogoUsuario_ObjetoInicialSalaDto__Solo;
};

export default function SPA_SalaDeJogo__Solo(props: PropsSPA_SalaDeJogo__Solo) {
    const [fichaSolo, setFichaSolo] = useState<J_DadosFichaEmJogo | null>(null);

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirFichaEmJogo, {
        codigoSala: props.objetoInicialSala.codigoSalaDeJogo,
        idFicha: props.objetoInicialSala.fichaSolo.idFicha,
    }, {
        onSuccess: data => {
            setFichaSolo(data.fichaAtualizada);
        },
        onError: err => {
            setFichaSolo(null);
            toast.erro(`Houve um erro ao carregar a ficha do Modo Solo: ${err.mensagem}`);
        },
    });

    return (
        <main>
            <h1>Modo Solo iniciado</h1>
            <p>Sala: {props.objetoInicialSala.codigoSalaDeJogo}</p>
            <p>Estado: {props.objetoInicialSala.estado}</p>
            <p>Ficha: {props.objetoInicialSala.fichaSolo.idFicha}</p>
            <p>Código da ficha runtime: {props.objetoInicialSala.fichaSolo.codigoRecuperarFichaRuntime}</p>
            {fichaSolo ? <ConteudoFichaDeJogo JDadosFichaEmJogo={fichaSolo} desativarAcoes exibirHabilidadesRuntime exibirAcoesRuntime exibirModificadoresRuntime /> : <h2>Carregando ficha do Modo Solo...</h2>}
        </main>
    );
};