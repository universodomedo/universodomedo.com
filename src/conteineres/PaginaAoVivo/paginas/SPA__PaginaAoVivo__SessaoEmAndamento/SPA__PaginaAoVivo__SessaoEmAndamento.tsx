'use client';

import styles from './styles.module.css';

import { useContextoPaginaAoVivo__SessaoEmAndamento } from 'Contextos/ContextoPaginaAoVivo__SessaoEmAndamento/contexto';
import PersonagemEmVisualizacaoDeSessao from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/PersonagemEmVisualizacaoDeSessao/page';
import JanelaDeMensagensDeJogo from 'Componentes/ElementosDeJogo/JanelaDeMensagensDeJogo/JanelaDeMensagensDeJogo';
import TelaDeJogo from 'Componentes/ElementosDeJogo/TelaDeJogo/TelaDeJogo';

export default function SPA__PaginaAoVivo__SessaoEmAndamento() {
    const { sessaoEmAndamento } = useContextoPaginaAoVivo__SessaoEmAndamento();

    return (
        <div id={styles.recipiente_pagina_sessao_emandamento}>
            <div id={styles.recipiente_espaco_sessao}>
                <div id={styles.recipiente_titulo_sessao}>
                    <span id={styles.udm}>Universo do Medo</span>
                </div>

                <div id={styles.recipiente_corpo_sessao}>
                    <div id={styles.recipiente_esquerda_tela_jogo}>
                        <div id={styles.recipiente_nome_aventura}>
                            <h1>{sessaoEmAndamento.tituloSessao}</h1>
                        </div>
                        <div id={styles.recipiente_lista_retratos}>
                            {sessaoEmAndamento.jogadores.map(jogador => (
                                <div key={jogador.usuario.id} className={styles.recipiente_retrato}>
                                    <PersonagemEmVisualizacaoDeSessao tipo={'participante'} participanteSessao={jogador} />
                                </div>
                            ))}
                        </div>
                        <div className={styles.recipiente_em_pagina_sessao_aovivo_janela_mensagens_de_jogo}>
                            <JanelaDeMensagensDeJogo />
                        </div>
                    </div>

                    <div className={styles.recipiente_container_tela_de_jogo}>
                        <TelaDeJogo capaSessao={sessaoEmAndamento.capaSessao} />
                    </div>
                </div>
            </div>
            {/* <IconeFaixaEtaria />s */}
        </div>
    );
};