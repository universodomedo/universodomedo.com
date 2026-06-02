import styles from './styles.module.css';

import type { RecursoFichaEmJogo } from 'types-nora-api';

import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';

export default function PaginaControleRecursos() {
    const { recursosPorGrupoFuncional } = useContextoFichaDePersonagem();

    return (
        <div className={styles.painel_recursos}>
            {recursosPorGrupoFuncional.length === 0 && <p className={styles.sem_recursos}>Nenhum recurso disponível para exibição</p>}
            {recursosPorGrupoFuncional.map(grupo => <GrupoRecursos key={grupo.grupoFuncional.key} titulo={grupo.grupoFuncional.nome} recursos={grupo.recursos} />)}
        </div>
    );
};

function GrupoRecursos({ titulo, recursos }: { titulo: string; recursos: RecursoFichaEmJogo[]; }) {
    return (
        <section className={styles.grupo_recursos}>
            <h3 className={styles.titulo_grupo}>{titulo}</h3>
            <div className={styles.lista_recursos}>
                {recursos.map(recurso => <RecursoFicha key={recurso.key} recurso={recurso} />)}
            </div>
        </section>
    );
};

function RecursoFicha({ recurso }: { recurso: RecursoFichaEmJogo; }) {
    const textoUsoAcoes = recurso.podeUsarEmAcoes ? 'Pode ser usado em ações' : 'Não pode ser usado em ações';

    return (
        <article className={`${styles.recurso} ${obtemClasseEstadoRecurso(recurso.estadoResumo.tipo)}`} aria-label={`${recurso.nome} - ${recurso.estadoResumo.nome}`}>
            <div className={styles.dados_recurso}>
                <div className={styles.cabecalho_recurso}>
                    <strong className={styles.nome_recurso}>{recurso.nome}</strong>
                    <span className={styles.estado_recurso}>{recurso.estadoResumo.nome}</span>
                </div>
                <span className={styles.descricao_estado}>{recurso.descricaoEstado}</span>
                <span className={`${styles.uso_acoes} ${recurso.podeUsarEmAcoes ? styles.uso_acoes_disponivel : styles.uso_acoes_indisponivel}`}>{textoUsoAcoes}</span>
                {recurso.impactos.length > 0 && (
                    <ul className={styles.lista_impactos}>
                        {recurso.impactos.map(impacto => <li key={impacto} className={styles.impacto_recurso}>{impacto}</li>)}
                    </ul>
                )}
            </div>
        </article>
    );
};

function obtemClasseEstadoRecurso(tipoEstado: RecursoFichaEmJogo['estadoResumo']['tipo']): string {
    if (tipoEstado === 'livre') return styles.recurso_livre;
    if (tipoEstado === 'indisponivel') return styles.recurso_indisponivel;
    return styles.recurso_ocupado;
};
