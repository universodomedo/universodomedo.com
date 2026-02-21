'use client';

import styles from './styles.module.css';

import { Eventos_Envia, Eventos_EnviaERecebe, PAGINAS, SalaDeJogo_TipoParticipante } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../JogoRouteGuard';
import { ContextoEMJOGOProvider, useContextoEMJOGO } from 'Contextos/ContextoEMJOGO/contexto';
import { eventoWs } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';
import { RecipienteFichaPersonagem } from 'Contextos/ContextoFichaPersonagem/contexto';
import JanelaDeMensagensDeJogo from 'Componentes/ElementosDeJogo/JanelaDeMensagensDeJogo/JanelaDeMensagensDeJogo';

export function Pagina_EmJogo_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.emJogo} embrulho={JogoRouteGuard}>
            <ContextoEMJOGOProvider>
                <PaginaEmJogo_Contexto />
            </ContextoEMJOGOProvider>
        </ControladorSlot>
    );
};

function PaginaEmJogo_Contexto() {
    const { objetoEmJogo } = useContextoEMJOGO();

    return (
        <div className={styles.recipiente_pagina_de_jogo}>
            {objetoEmJogo.tipoParticipante === SalaDeJogo_TipoParticipante.SALA__NARRADOR
                ? <PaginaEmJogo_Narrador />
                : <PaginaEmJogo_Jogador />
            }
        </div>
    )
};

function PaginaEmJogo_Narrador() {
    const executaRequisicaoDeFechamentoDeSala = async () => {
        const confirmou = window.confirm(`Deseja finalizar a sessao?`);

        if (!confirmou) return;

        eventoWs(Eventos_EnviaERecebe.Jogo.eventos.requisicaoDeFechamentoDeSalaAberta, {}, {
            onSuccess: retorno => { toast.sucesso('Sala Fechada', `Sala fechada com sucesso`, { recarregaPagina: true }); },
            onError: err => { toast.erro('Falha ao fechar sala', err.mensagem); }
        });
    };

    const executaTesteSimples = async () => {
        eventoWs(Eventos_Envia.Jogo.eventos.executaTestePericia_PROTOTIPO, { tipo: 'TESTE_NARRADOR' });
    };

    return (
        <>
            <div className={styles.recipiente_pagina_de_jogo_conteudo}>
                <div className={styles.recipiente_em_sala_de_jogo_janela_mensagens_de_jogo}>
                    <JanelaDeMensagensDeJogo />
                </div>
                <div className={styles.recipente_pagina_de_jogo_botoes}>
                    <button onClick={executaTesteSimples}>Teste Simples</button>
                    <button onClick={executaRequisicaoDeFechamentoDeSala}>Finalizar</button>
                </div>
            </div>
        </>
    );
};

function PaginaEmJogo_Jogador() {
    const { objetoEmJogo } = useContextoEMJOGO();

    if (objetoEmJogo.tipoParticipante === SalaDeJogo_TipoParticipante.SALA__NARRADOR) return;

    return (
        <>
            <div className={styles.recipiente_pagina_de_jogo_conteudo}>
                <div className={styles.recipiente_em_sala_de_jogo_janela_mensagens_de_jogo}>
                    <JanelaDeMensagensDeJogo />
                </div>
            </div>
            {objetoEmJogo.fichaDeJogo && <RecipienteFichaPersonagem ficha={objetoEmJogo.fichaDeJogo} />}
        </>
    );
};