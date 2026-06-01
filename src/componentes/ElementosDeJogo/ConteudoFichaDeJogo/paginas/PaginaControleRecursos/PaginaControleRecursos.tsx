import styles from './styles.module.css';

import type { RecursoFichaEmJogo } from 'types-nora-api';

import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';

export default function PaginaControleRecursos() {
    const { recursosPorDisponibilidade } = useContextoFichaDePersonagem();

    return (
        <div className={styles.painel_recursos}>
            <SecaoRecursos titulo="Recursos Disponíveis" recursos={recursosPorDisponibilidade.disponiveis} />
            <SecaoRecursos titulo="Recursos Indisponíveis" recursos={recursosPorDisponibilidade.indisponiveis} />
        </div>
    );
};

function SecaoRecursos({ titulo, recursos }: { titulo: string; recursos: RecursoFichaEmJogo[]; }) {
    return (
        <section className={styles.secao_recursos}>
            <h3 className={styles.titulo_secao}>{titulo}</h3>
            {recursos.length === 0 && <p className={styles.sem_recursos}>Nenhum recurso nesta seção</p>}
            {recursos.length > 0 && (
                <div className={styles.lista_recursos}>
                    {recursos.map(recurso => <RecursoFicha key={recurso.key} recurso={recurso} />)}
                </div>
            )}
        </section>
    );
};

function RecursoFicha({ recurso }: { recurso: RecursoFichaEmJogo; }) {
    const status = recurso.disponivel ? 'Disponível' : 'Indisponível';

    return (
        <article className={`${styles.recurso} ${recurso.disponivel ? styles.recurso_disponivel : styles.recurso_indisponivel}`} aria-label={`${recurso.nome} - ${status}`}>
            <strong className={styles.nome_recurso}>{recurso.nome}</strong>
            <span className={`${styles.status_recurso} ${recurso.disponivel ? styles.status_disponivel : styles.status_indisponivel}`}>{status}</span>
        </article>
    );
};
