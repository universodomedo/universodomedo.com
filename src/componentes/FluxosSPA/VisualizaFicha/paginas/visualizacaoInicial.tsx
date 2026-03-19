'use client';

import styles from '../styles.module.css';

import { useContextoPaginaFichaTemporaria } from 'Contextos/ContextoPaginaFichaTemporaria/contexto';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { ContadorRegressivo } from 'Componentes/Elementos/ContadorRegressivo/ContadorRegressivo';
import Tooltip from 'Componentes/Elementos/Tooltip/Tooltip';

export default function SPA__VisualizaFicha__VisualizacaoInicial() {
    const { fichaTemporaria, podeDeletarFichaTemporaria, deletaFichaTemporaria } = useContextoPaginaFichaTemporaria();

    return (
        <div className={styles.recipiente_ficha}>
            <div className={styles.recipiente_dados_ficha}>
                {fichaTemporaria.detalheSessaoUnicaAmarrada && (
                    <div className={styles.recipiente_dados_sessao}>
                        <SecaoDeConteudo className={styles.recipiente_dados_sessao_unica_amarrada_nessa_ficha} fit>
                            <>
                                <h1>{fichaTemporaria.detalheSessaoUnicaAmarrada.tituloRascunho}</h1>
                                <div className={styles.recipiente_capa_sessao_amarrada}>
                                    <RecipienteImagem src={fichaTemporaria.detalheSessaoUnicaAmarrada.capaSessao} />
                                </div>
                                <h3>Começa em <ContadorRegressivo dataAlvo={fichaTemporaria.detalheSessaoUnicaAmarrada.dataPrevisaoInicio} /></h3>
                            </>
                        </SecaoDeConteudo>
                    </div>
                )}
            </div>
            <div className={styles.recipiente_acoes_ficha}>
                {podeDeletarFichaTemporaria ? (
                    <button onClick={deletaFichaTemporaria}>Deletar Ficha</button>
                ) : (
                    <Tooltip>
                        <Tooltip.Trigger>
                            <button onClick={deletaFichaTemporaria} disabled={!podeDeletarFichaTemporaria}>Deletar Ficha</button>
                        </Tooltip.Trigger>

                        <Tooltip.Content>
                            <>
                                <h2>Essa Ficha está cadastrada como participante de uma Sessão Única e não pode ser deletada</h2>
                                <h2>Ela será liberada após o fim da Sessão</h2>
                            </>
                        </Tooltip.Content>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};