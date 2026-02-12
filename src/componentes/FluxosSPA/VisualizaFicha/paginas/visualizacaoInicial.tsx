'use client';

import styles from '../styles.module.css';

import { useContextoPaginaFicha } from "Contextos/ContextoPaginaFicha/contexto";
import { useContextoPaginaFichas } from 'Contextos/ContextoPaginaFichas/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import VisualizacaoFichaDeJogo from 'Componentes/ElementosVisuais/VisualizacaoFichaDeJogo/VisualizacaoFichaDeJogo';

export default function SPA__VisualizaFicha__VisualizacaoInicial() {
    const { fichaSelecionada, deletaFichaTemporaria } = useContextoPaginaFicha();
    const { deselecionaFicha } = useContextoPaginaFichas();
    useConfigurarLayoutContextualizado({ titulo: fichaSelecionada.nomeComDetalhe!, fecharProps: { tipo: 'acao', executar: () => deselecionaFicha(), tituloTooltip: 'Voltar' } }, 'patch');

    return (
        <div className={styles.recipiente_ficha}>
            <div className={styles.recipiente_dados_ficha}>
                <h1>{fichaSelecionada.nome}</h1>

                <VisualizacaoFichaDeJogo fichaDeJogo={fichaSelecionada.fichaDeJogo!} />
            </div>
            {fichaSelecionada?.paiTipo === 'TEMPORARIA' && (
                <div className={styles.recipiente_acoes_ficha}>
                    <button onClick={deletaFichaTemporaria}>Deletar Ficha</button>
                </div>
            )}
        </div>
    );
};