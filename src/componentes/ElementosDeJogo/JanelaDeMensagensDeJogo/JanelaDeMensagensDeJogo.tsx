'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { Eventos_Emite, type MensagemSalaJogo, type MensagemSalaJogoVisualizada, type ObjetoMensagemSalaJogo, type SalaDeJogo_Codigo } from 'types-nora-api';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import { toast } from 'Hooks/useToast';

export default function JanelaDeMensagensDeJogo({ codigoSala }: { codigoSala?: SalaDeJogo_Codigo; }) {
    if (codigoSala) return <JanelaDeMensagensDeJogoRuntime codigoSala={codigoSala} />;

    return <JanelaDeMensagensDeJogoLegada />;
};

function JanelaDeMensagensDeJogoRuntime({ codigoSala }: { codigoSala: SalaDeJogo_Codigo; }) {
    const [mensagensSalaJogo, setMensagensSalaJogo] = useState<MensagemSalaJogoVisualizada[]>([]);
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    useEmitWsComDisparoInicial(Eventos_Emite.ExecucaoDeJogo.eventos.emitirMensagensSalaJogo, { codigoSala }, {
        onSuccess: (data) => {
            setMensagensSalaJogo((mensagensAtuais) => data.modo === 'historico' ? data.mensagens : mesclarMensagensSalaJogo(mensagensAtuais, data.mensagens));
        },
        onError: (_err) => {
            toast.erro('Houve um erro recebendo Mensagem de Jogo');
        },
    });

    return (
        <div className={styles.recipiente_pagina_game_engine}>
            <div className={styles.janela_mensagens_de_jogo} {...scrollableProps}>
                {mensagensSalaJogo.map((mensagemVisualizada) => (
                    <RenderMensagemSalaJogo key={mensagemVisualizada.idAcao} mensagem={mensagemVisualizada.mensagem} />
                ))}
            </div>
        </div>
    );
};

function JanelaDeMensagensDeJogoLegada() {
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

function mesclarMensagensSalaJogo(mensagensAtuais: MensagemSalaJogoVisualizada[], mensagensNovas: MensagemSalaJogoVisualizada[]): MensagemSalaJogoVisualizada[] {
    const idsMensagensNovas = new Set(mensagensNovas.map(mensagem => mensagem.idAcao));
    return [...mensagensNovas, ...mensagensAtuais.filter(mensagem => !idsMensagensNovas.has(mensagem.idAcao))];
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
