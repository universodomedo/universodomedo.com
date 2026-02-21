'use client';

import styles from './styles.module.css';

import { useContextoSessaoEmAndamento } from "Contextos/ContextosPaginaAovivo/ContextoSessaoEmAndamento/contexto";
import { useContextoPersonagensEmSessao } from "Contextos/ContextosPaginaAovivo/ContextoPersonagensEmSessao/contexto";

import PersonagemEmVisualizacaoDeSessao from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/PersonagemEmVisualizacaoDeSessao/page';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import JanelaDeMensagensDeJogo from 'Componentes/ElementosDeJogo/JanelaDeMensagensDeJogo/JanelaDeMensagensDeJogo';

export default function PaginaSessao_SessaoEmAndamento() {
    const { sessaoEmAndamento } = useContextoSessaoEmAndamento();
    // const { personagensEmSessao } = useContextoPersonagensEmSessao();
    
    return (
        <div id={styles.recipiente_pagina_sessao_emandamento}>
            <div id={styles.recipiente_espaco_sessao}>
                <div id={styles.recipiente_titulo_sessao}>
                    <span id={styles.udm}>Universo do Medo</span>
                </div>

                <div id={styles.recipiente_corpo_sessao}>
                    <div id={styles.recipiente_esquerda_tela_jogo}>
                        <div id={styles.recipiente_nome_aventura}>
                            <h1>{sessaoEmAndamento!.tituloInteligente.tituloCompleto}</h1>
                        </div>
                        <div id={styles.recipiente_lista_retratos}>
                            {sessaoEmAndamento?.dadosGerais?.participantes.map(participante => (
                                <div key={participante.jogador.id} className={styles.recipiente_retrato}>
                                    <PersonagemEmVisualizacaoDeSessao tipo={'participante'} participanteSessao={participante} />
                                </div>
                            ))}
                        </div>
                        <div className={styles.recipiente_em_pagina_sessao_aovivo_janela_mensagens_de_jogo}>
                            <JanelaDeMensagensDeJogo />
                        </div>
                    </div>

                    <div id={styles.recipiente_tela_jogo}>
                        <RecipienteImagem src={sessaoEmAndamento!.imagemCapa.caminhoCapa} />
                    </div>
                </div>
            </div>
            {/* <IconeFaixaEtaria />s */}
        </div>
    );
};