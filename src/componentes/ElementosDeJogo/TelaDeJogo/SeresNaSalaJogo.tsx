'use client';

import styles from './SeresNaSalaJogo.module.css';

import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';

export function SeresNaSalaJogo() {
    const { estadoCarregamento, mapaLogicoSalaJogo, seresNaSala } = useContextoTelaDeJogoMapaLogico();

    if (estadoCarregamento !== 'pronto' || mapaLogicoSalaJogo === null) return null;

    return (
        <aside className={styles.painel_seres_na_sala}>
            <header className={styles.cabecalho_seres_na_sala}>
                <strong>Seres na Sala</strong>
                <span>{seresNaSala.length} carregado{seresNaSala.length === 1 ? '' : 's'}</span>
            </header>

            {seresNaSala.length === 0 ? <span className={styles.estado_vazio_seres_na_sala}>Nenhum ser persistido carregado.</span> : (
                <div className={styles.lista_seres_na_sala}>
                    {seresNaSala.map(ser => (
                        <article key={ser.id} className={styles.item_ser_na_sala}>
                            <strong>{ser.nome}</strong>
                            <div className={styles.lista_membros_ser_na_sala}>
                                {ser.membros.map(membro => (
                                    <section key={membro.id} className={styles.item_membro_ser_na_sala}>
                                        <span>{membro.nome}</span>
                                        <div className={styles.lista_capacidades_ser_na_sala}>
                                            {membro.capacidades.map(capacidade => <small key={capacidade.id}>{capacidade.nome}</small>)}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </aside>
    );
};