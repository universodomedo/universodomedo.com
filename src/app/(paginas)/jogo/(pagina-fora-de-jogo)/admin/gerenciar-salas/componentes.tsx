'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { Eventos_Emite, SalaDeJogoDto, PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../../../JogoRouteGuard';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { RenderItemSala } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/SalaDeJogoEmVisualizacao/page';

export function PaginaPlay_GerenciarSalas_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.admin.gerenciarSalas} embrulho={JogoRouteGuard}>
            <PaginaPlay_GerenciarSalas_Slot />
        </ControladorSlot>
    );
};

function PaginaPlay_GerenciarSalas_Slot() {
    const [salas, setSalas] = useState<SalaDeJogoDto[]>([]);

    useEmitWsComDisparoInicial(
        Eventos_Emite.Jogo.eventos.emitirTodasSalas,
        {
            onSuccess: data => {
                setSalas(data.salas);
            },
            onError: err => {
                alert('onError');
            }
        }
    );

    return (
        <>
            {salas.length > 0 ? (
                <div className={styles.recipiente_lista_salas}>
                    {salas.map((sala, index) => <RenderItemSala key={index} salaDeJogo={sala} />)}
                </div>
            ) : (
                <h3>Nenhuma Sala de Jogo de em andamento</h3>
            )}
        </>
    );
};