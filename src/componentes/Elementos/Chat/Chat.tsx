'use client';

import styles from './styles.module.css';
import { useState } from 'react';
import { RootState } from 'Redux/store/types';

import { useAppSelector } from 'Redux/hooks/useRedux';
import { DivClicavel } from '../DivClicavel/DivClicavel';
import ConteudoSalaSelecionada from './componentes/ConteudoSalaSelecionada';
import ListaSalas from './componentes/ListaSalas';

export default function ComponenteChat() {
    const [aberto, setAberto] = useState(false);

    if (!aberto) return (
        <button id={styles.botao_abre_janela_chat} onClick={() => setAberto(true)}>
            💬
        </button>
    );

    return (
        <div id={styles.recipiente_corpo_chat}>
            <DivClicavel id={styles.icone_fechar_chat} onClick={() => setAberto(false)}>x</DivClicavel>
            <CorpoChat />
        </div>
    );
};

function CorpoChat() {
    const usuarios = useAppSelector((state: RootState) => state.usuarios.usuarios);

    if (!usuarios || usuarios.length === 0) return (
        <h2 id={styles.mensagem_chat_carregando}>Carregando salas e mensagens..</h2>
    );

    return (
        <>
            <ConteudoSalaSelecionada />

            <ListaSalas />
        </>
    );
};