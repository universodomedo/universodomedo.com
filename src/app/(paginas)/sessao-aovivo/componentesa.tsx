'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import ControladorSwiperFicha from 'Componentes/ElementosDeJogo/ControladorSwiperFicha/CotroladorSwiperFicha';

export function PaginaSessao_Slot() {
    return (
        <>
            <PaginaSessao_Mensagens />
            <ControladorSwiperFicha />
        </>
    );
};

export function PaginaSessao_Mensagens() {
    const [messages, setMessages] = useState<string[]>([]);

    // useSocketEvent<string>(SOCKET_EVENTOS.GameEngine.receberMensagem, (mensagem) => {
    //     setMessages((prev) => [mensagem, ...prev]);
    // });

    return (
        <div id={styles.recipiente_pagina_game_engine}>
            <div id={styles.recipiente_mensagens_game_engine}>
                {messages.map((msg, index) => (
                    <h2 key={index}>{msg}</h2>
                ))}
            </div>
        </div>
    );
};