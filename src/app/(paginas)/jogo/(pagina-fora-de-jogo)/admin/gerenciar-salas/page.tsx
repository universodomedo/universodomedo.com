'use client';

import styles from './styles.module.css';
import { useState } from 'react';
import { Eventos_Emite, PAGINAS, SalaDeJogoDto } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesPlay from 'Componentes/ElementosDeMenu/ListaAcoesPlay/page';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { RenderItemSala } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/SalaDeJogoEmVisualizacao/page';

export default function PaginaPlay_GerenciarSalas() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.PLAY, comCabecalho: false, usuarioObrigatorio: false }}>
            <LayoutContextualizado proporcaoConteudo={84}>
                <LayoutContextualizado.Conteudo>
                    <PaginaPlay_GerenciarSalas_Slot />
                </LayoutContextualizado.Conteudo>
                <LayoutContextualizado.Menu>
                    <ListaAcoesPlay />
                </LayoutContextualizado.Menu>
            </LayoutContextualizado>
        </ControladorSlot>
    );
};

function PaginaPlay_GerenciarSalas_Slot() {
    const [salas, setSalas] = useState<SalaDeJogoDto[]>([]);

    useEmitWsComDisparoInicial(
        Eventos_Emite.Jogo.eventos.emitirTodasSalas,
        {
            onSuccess: data => {
                console.log('onSuccess');
                console.log(data);
                setSalas(data.salas);
            },
            onError: err => {
                alert('onError');
            }
        }
    );

    return (
        <>
            <h1>Salas</h1>
            {salas.length > 0 ? (
                <div className={styles.recipiente_lista_salas}>
                    {salas.map((sala, index) => <RenderItemSala key={index} salaDeJogo={sala} />)}
                </div>
            ) : (
                <h3>nenhuma sala de em andamento</h3>
            )}
        </>
    );
};