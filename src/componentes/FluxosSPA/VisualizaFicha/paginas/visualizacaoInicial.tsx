'use client';

import styles from '../styles.module.css';

import { useContextoPaginaFicha } from "Contextos/ContextoPaginaFicha/contexto";
import { useContextoPaginaFichas } from 'Contextos/ContextoPaginaFichas/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import VisualizacaoFichaDeJogo from 'Componentes/ElementosVisuais/VisualizacaoFichaDeJogo/VisualizacaoFichaDeJogo';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { ContadorRegressivo } from 'Componentes/Elementos/ContadorRegressivo/ContadorRegressivo';
import Tooltip from 'Componentes/Elementos/Tooltip/Tooltip';

export default function SPA__VisualizaFicha__VisualizacaoInicial() {
    const { fichaSelecionada, podeDeletarFichaTemporaria, deletaFichaTemporaria } = useContextoPaginaFicha();
    const { deselecionaFicha } = useContextoPaginaFichas();
    useConfigurarLayoutContextualizado({ titulo: fichaSelecionada.nomeComDetalhe!, fecharProps: { tipo: 'acao', executar: () => deselecionaFicha(), tituloTooltip: 'Voltar' } }, 'patch');

    return (
        <div className={styles.recipiente_ficha}>
            <div className={styles.recipiente_dados_ficha}>
                <VisualizacaoFichaDeJogo fichaDeJogo={fichaSelecionada.fichaDeJogo!} />
                {fichaSelecionada?.paiTipo === 'TEMPORARIA' && fichaSelecionada.fichaTemporaria?.detalheSessaoUnicaAmarrada && (
                    <div className={styles.recipiente_dados_sessao}>
                        <SecaoDeConteudo className={styles.recipiente_dados_sessao_unica_amarrada_nessa_ficha} fit>
                            <>
                                <h1>{fichaSelecionada.fichaTemporaria?.detalheSessaoUnicaAmarrada.rascunho?.titulo}</h1>
                                <div className={styles.recipiente_capa_sessao_amarrada}>
                                    <RecipienteImagem src={fichaSelecionada.fichaTemporaria?.detalheSessaoUnicaAmarrada.sessao.imagemCapa.caminhoCapa} />
                                </div>
                                <h3>Começa em <ContadorRegressivo dataAlvo={fichaSelecionada.fichaTemporaria?.detalheSessaoUnicaAmarrada.sessao.dataPrevisaoInicio} /></h3>
                            </>
                        </SecaoDeConteudo>
                    </div>
                )}
            </div>
            {fichaSelecionada?.paiTipo === 'TEMPORARIA' && (
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
            )}
        </div>
    );
};