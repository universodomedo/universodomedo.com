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
            <header className={styles.cabecalho_janela_mensagens_de_jogo}>
                <strong>Histórico da Cena</strong>
                <span>{mensagensSalaJogo.length} registro{mensagensSalaJogo.length === 1 ? '' : 's'}</span>
            </header>
            <div className={styles.janela_mensagens_de_jogo} {...scrollableProps}>
                {mensagensSalaJogo.length === 0 ? <span className={styles.estado_vazio_mensagens_de_jogo}>Nenhuma ação registrada nesta Sala.</span> : mensagensSalaJogo.map((mensagemVisualizada) => (
                    <article key={mensagemVisualizada.idAcao} className={styles.item_mensagem_de_jogo}>
                        <header className={styles.metadados_mensagem_de_jogo}>
                            <span>{formataTipoAcao(mensagemVisualizada.tipoAcao)}</span>
                            <span>{formataSegundoSala(mensagemVisualizada.segundoDaPartida)}</span>
                            <span>{mensagemVisualizada.visibilidade}</span>
                        </header>
                        <RenderMensagemSalaJogo mensagem={mensagemVisualizada.mensagem} />
                    </article>
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
            <header className={styles.cabecalho_janela_mensagens_de_jogo}>
                <strong>Mensagens de Jogo</strong>
                <span>{objetoMensagemSalaJogo.mensagens.length} registro{objetoMensagemSalaJogo.mensagens.length === 1 ? '' : 's'}</span>
            </header>
            <div className={styles.janela_mensagens_de_jogo} {...scrollableProps}>
                {objetoMensagemSalaJogo.mensagens.length === 0 ? <span className={styles.estado_vazio_mensagens_de_jogo}>Nenhuma mensagem recebida.</span> : objetoMensagemSalaJogo.mensagens.map((mensagem, index) => (
                    <article key={index} className={styles.item_mensagem_de_jogo}>
                        <RenderMensagemSalaJogo mensagem={mensagem} />
                    </article>
                ))}
            </div>
        </div>
    );
};

function mesclarMensagensSalaJogo(mensagensAtuais: MensagemSalaJogoVisualizada[], mensagensNovas: MensagemSalaJogoVisualizada[]): MensagemSalaJogoVisualizada[] {
    const idsMensagensNovas = new Set(mensagensNovas.map(mensagem => mensagem.idAcao));
    return [...mensagensNovas, ...mensagensAtuais.filter(mensagem => !idsMensagensNovas.has(mensagem.idAcao))];
};

function formataTipoAcao(tipoAcao: MensagemSalaJogoVisualizada['tipoAcao']): string {
    if (tipoAcao === 'acao_executada') return 'Ação';
    if (tipoAcao === 'teste_pericia_executado') return 'Teste';
    return 'Registro';
};

function formataSegundoSala(segundoDaPartida: number): string {
    const minutos = Math.floor(segundoDaPartida / 60);
    const segundos = segundoDaPartida % 60;

    if (minutos <= 0) return `${segundos}s`;
    return `${minutos}min ${segundos}s`;
};

function RenderMensagemSalaJogo({ mensagem, nivel = 0 }: { mensagem: MensagemSalaJogo; nivel?: number; }) {
    const possuiSubMensagens = mensagem.subNivel.mensagens.length > 0;

    if (!possuiSubMensagens) {
        return (
            <div className={styles.linha_mensagem_de_jogo} style={{ marginLeft: `${nivel}em` }}>
                <p>{mensagem.mensagem}</p>
            </div>
        );
    }

    return (
        <details className={styles.grupo_mensagem_de_jogo} style={{ marginLeft: `${nivel}em` }} open={nivel === 0}>
            <summary>{mensagem.mensagem}</summary>

            {mensagem.subNivel.mensagens.map((subMensagem, index) => (
                <RenderMensagemSalaJogo key={index} mensagem={subMensagem} nivel={nivel + 1} />
            ))}
        </details>
    );
};
