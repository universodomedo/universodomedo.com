'use client';

import styles from './InspecaoInteragivelMapaLogico.module.css';

import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';

export function InspecaoInteragivelMapaLogico() {
    const { estadoCarregamento, mapaLogicoSalaJogo, interagivelSelecionado, limpaSelecaoInteragivel } = useContextoTelaDeJogoMapaLogico();

    if (estadoCarregamento !== 'pronto' || mapaLogicoSalaJogo === null || interagivelSelecionado === null) return null;

    return (
        <aside className={styles.painel_inspecao_interagivel}>
            <header className={styles.cabecalho_inspecao_interagivel}>
                <div>
                    <strong>{interagivelSelecionado.nome}</strong>
                    <span>{interagivelSelecionado.tipo}</span>
                    {interagivelSelecionado.posicao ? <span>Posição {interagivelSelecionado.posicao.x},{interagivelSelecionado.posicao.y}</span> : <span>Sem posição no mapa</span>}
                    <small>{interagivelSelecionado.key}</small>
                </div>
                <button type="button" onClick={limpaSelecaoInteragivel} aria-label="Limpar seleção do interagível">Fechar</button>
            </header>

            <p>{interagivelSelecionado.descricao}</p>
        </aside>
    );
};
