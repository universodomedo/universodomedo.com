import styles from './DetalheRecursoSelecionado.module.css';
import impactosStyles from './DetalheRecursoSelecionadoImpactos.module.css';

import type { RecursoFichaEmJogo } from 'types-nora-api';

import { useContextoPaginaControleRecursos } from './ContextoPaginaControleRecursos';

export default function DetalheRecursoSelecionado() {
    const { recursoSelecionado, limpaSelecaoRecurso } = useContextoPaginaControleRecursos();

    if (!recursoSelecionado) return <p className={styles.detalhe_recurso_vazio}>Selecione um recurso no mapa funcional para ver detalhes operacionais.</p>;

    return (
        <section className={styles.detalhe_recurso_selecionado} aria-label={`Detalhe operacional de ${recursoSelecionado.nome}`}>
            <div className={styles.cabecalho_detalhe_recurso}>
                <div className={styles.identificacao_detalhe_recurso}>
                    <strong className={styles.nome_recurso_detalhe}>{recursoSelecionado.nome}</strong>
                    <span className={styles.estado_recurso_detalhe}>{recursoSelecionado.estadoResumo.nome}</span>
                </div>
                <button type="button" className={styles.botao_limpar_selecao} onClick={limpaSelecaoRecurso}>Limpar seleção</button>
            </div>
            <dl className={styles.lista_detalhes_recurso}>
                <LinhaDetalheRecurso rotulo="Slot" valor={recursoSelecionado.slotVisualFuncional.nome} />
                <LinhaDetalheRecurso rotulo="Área" valor={recursoSelecionado.visualizacaoFuncional.nomeArea} />
                <LinhaDetalheRecurso rotulo="Grupo" valor={recursoSelecionado.grupoFuncional.nome} />
                <LinhaDetalheRecurso rotulo="Estado" valor={recursoSelecionado.estadoResumo.nome} />
                <LinhaDetalheRecurso rotulo="Condição" valor={recursoSelecionado.descricaoEstado} />
                <LinhaDetalheRecurso rotulo="Ações" valor={recursoSelecionado.podeUsarEmAcoes ? 'Pode ser usado em ações' : 'Não pode ser usado em ações'} />
            </dl>
            {recursoSelecionado.impactos.length > 0 && <ImpactosRecurso recurso={recursoSelecionado} />}
        </section>
    );
};

function LinhaDetalheRecurso({ rotulo, valor }: { rotulo: string; valor: string; }) {
    return (
        <div className={styles.linha_detalhe_recurso}>
            <dt className={styles.rotulo_detalhe_recurso}>{rotulo}</dt>
            <dd className={styles.valor_detalhe_recurso}>{valor}</dd>
        </div>
    );
};

function ImpactosRecurso({ recurso }: { recurso: RecursoFichaEmJogo; }) {
    return (
        <div className={impactosStyles.bloco_impactos_detalhe}>
            <strong className={impactosStyles.titulo_impactos_detalhe}>Impactos</strong>
            <ul className={impactosStyles.lista_impactos_detalhe}>
                {recurso.impactos.map(impacto => <li key={impacto} className={impactosStyles.impacto_detalhe}>{impacto}</li>)}
            </ul>
        </div>
    );
};
