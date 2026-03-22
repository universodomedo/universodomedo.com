'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { Eventos_Emite, type ObjetoMensagemSalaJogo, type MensagemSalaJogo } from 'types-nora-api';

import { useEmitWsComDisparoInicial, useRecebeEmitWs } from 'Hooks/useEventoWs';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import { toast } from 'Hooks/useToast';

export default function JanelaDeMensagensDeJogo() {
    const [objetoMensagemSalaJogo, setObjetoMensagemSalaJogo] = useState<ObjetoMensagemSalaJogo>({ mensagens: [] });
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    useEmitWsComDisparoInicial(Eventos_Emite.ExecucaoDeJogo.eventos.emitirMensagemSalaJogo, { mensagemSalaJogo: { escutando: true } }, {
        onSuccess: (data) => {
            const mensagemSalaJogo = data.mensagemSalaJogo;
            if (!mensagemSalaJogo) return;

            setObjetoMensagemSalaJogo((prev) => ({ mensagens: [mensagemSalaJogo, ...prev.mensagens] }));
        },
        onError: (_err) => {
            toast.erro('Houve um erro recebendo Mensagem de Jogo');
        },
    });

    return (
        <div className={styles.recipiente_pagina_game_engine}>
            <div className={styles.janela_mensagens_de_jogo} {...scrollableProps}>
                {objetoMensagemSalaJogo.mensagens.map((mensagem, index) => (
                    <RenderMensagemSalaJogo key={index} mensagem={mensagem} />
                ))}
            </div>
        </div>
    );
};

function RenderMensagemSalaJogo({ mensagem, nivel = 0 }: { mensagem: MensagemSalaJogo; nivel?: number; }) {
    const possuiSubMensagens = mensagem.subNivel.mensagens.length > 0;

    if (!possuiSubMensagens) {
        return (
            <div style={{ marginLeft: `${nivel}em` }}>
                <p>{mensagem.mensagem}</p>
            </div>
        );
    }

    return (
        <details style={{ marginLeft: `${nivel}em` }} open={nivel === 0}>
            <summary>{mensagem.mensagem}</summary>

            {mensagem.subNivel.mensagens.map((subMensagem, index) => (
                <RenderMensagemSalaJogo key={index} mensagem={subMensagem} nivel={nivel + 1} />
            ))}
        </details>
    );
};