'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoSessoesMestreEmEsperaProvider, useContextoSessoesMestreEmEspera } from "Contextos/ContextoSessoesMestreEmEspera/contexto";
import RecipienteCapa from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/RecipienteCapa/page';
import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';

export function PaginaPlay_SessoesMestre_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.mestre.sessoesMestre}>
            <ContextoSessoesMestreEmEsperaProvider>
                <PaginaSessoesMestre_Contexto />
            </ContextoSessoesMestreEmEsperaProvider>
        </ControladorSlot>
    );
};

function PaginaSessoesMestre_Contexto() {
    const { sessoesEmEspera, selecionaSessao } = useContextoSessoesMestreEmEspera();

    if (sessoesEmEspera.length < 1) return <h1>Você não tem nenhuma Sessão em Espera</h1>

    return (
        <>
            <h1>Suas Sessões em Espera</h1>

            <div className={styles.recipiente_sessoes}>
                {sessoesEmEspera.map(sessao => (
                    <div key={sessao.id} className={styles.recipiente_sessao}>
                        <div className={styles.toolbar_sessao}>
                            <div className={styles.toolbar_esquerda}>
                                <h3>Sessão {sessao.id} — {sessao.tituloInteligente.tituloCompleto}</h3>
                            </div>

                            <div className={styles.toolbar_direita}>
                                <span className={styles.etiqueta}>{sessao.estiloSessao}</span>
                            </div>
                        </div>
                        <DivClicavel key={0} className={styles.corpo_sessao} onClick={() => selecionaSessao(sessao.id)}>
                            <>
                                <RecipienteCapa className={styles.recipiente_capa} sessao={sessao} />

                                <div className={styles.dados_corpo_sessao}>
                                    <h4>Prevista para {formataData(sessao.dataPrevisaoInicio, 'dd/MM/yyyy HH:mm')}</h4>
                                </div>
                            </>
                        </DivClicavel>
                    </div>
                ))}
            </div>
        </>
    );
};