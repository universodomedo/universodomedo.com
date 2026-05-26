import styles from './styles.module.css';

import { useContexto__PaginaModeradorHabilidadesPericia__Detalhe } from 'Contextos/Contexto__PaginaModeradorHabilidadesPericia__Detalhe/contexto';

export default function SPA__PaginaModeradorHabilidadesPericia__Detalhe() {
    const { habilidade } = useContexto__PaginaModeradorHabilidadesPericia__Detalhe();

    return (
        <section className={styles.recipiente_detalhe}>
            <article className={styles.painel_detalhe}>
                <header className={styles.cabecalho_detalhe}>
                    <h2>{habilidade.nome}</h2>
                    <div className={styles.contexto}>
                        <div>
                            <span>Perícia</span>
                            <strong>{habilidade.pericia.nome}</strong>
                        </div>
                        <div>
                            <span>Patente</span>
                            <strong>{habilidade.patentePericia.nome}</strong>
                        </div>
                    </div>
                </header>

                <div className={styles.descricao}>
                    <span>Descrição</span>
                    <p>{habilidade.descricao}</p>
                </div>
            </article>
        </section>
    );
};