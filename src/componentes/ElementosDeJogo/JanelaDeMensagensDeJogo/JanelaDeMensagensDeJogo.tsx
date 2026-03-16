'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { Eventos_Emite } from 'types-nora-api';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

export default function JanelaDeMensagensDeJogo() {
    const [messages, setMessages] = useState<string[]>([]);
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirMensagemSalaDeJogo, { conteudoMensagem: '' }, {
        onSuccess: data => {
            setMessages((prev) => [data.conteudoMensagem, ...prev]);
        },
        onError: err => {
            
        }
    });

    return (
        <div className={styles.recipiente_pagina_game_engine}>
            <div className={styles.janela_mensagens_de_jogo} {...scrollableProps}>
                {messages.map((msg, index) => (
                    <h2 key={index}>{msg}</h2>
                ))}
            </div>
        </div>
    );
};