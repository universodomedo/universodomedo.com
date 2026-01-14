'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { Eventos_Emite, MENUS_INTERNOS, SalaDeJogoDto } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { RenderItemSala } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/SalaDeJogoEmVisualizacao/page';

export default function PaginaPlay_GerenciarSalas() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <PaginaPlay_GerenciarSalas_Slot />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <MenuInterno itens={MENUS_INTERNOS.PAGINAS.jogo} />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function PaginaPlay_GerenciarSalas_Slot() {
	useConfigurarLayoutContextualizado({ proporcaoConteudo: 84 });
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