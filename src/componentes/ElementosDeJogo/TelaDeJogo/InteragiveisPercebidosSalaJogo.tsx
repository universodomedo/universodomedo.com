'use client';

import styles from './InteragiveisPercebidosSalaJogo.module.css';

import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';

export function InteragiveisPercebidosSalaJogo() {
    const { estadoCarregamento, mapaLogicoSalaJogo, interagiveisPercebidos } = useContextoTelaDeJogoMapaLogico();

    if (estadoCarregamento !== 'pronto' || mapaLogicoSalaJogo === null) return null;

    return (
        <aside className={styles.painel_interagiveis_percebidos}>
            <header className={styles.cabecalho_interagiveis_percebidos}>
                <strong>Interagíveis percebidos</strong>
                <span>{interagiveisPercebidos.length} percebido{interagiveisPercebidos.length === 1 ? '' : 's'}</span>
            </header>

            {interagiveisPercebidos.length === 0 ? <span className={styles.estado_vazio_interagiveis_percebidos}>Nenhum interagível percebido.</span> : (
                <div className={styles.lista_interagiveis_percebidos}>
                    {interagiveisPercebidos.map(interagivel => (
                        <article key={interagivel.key} className={styles.item_interagivel_percebido}>
                            <strong>{interagivel.nome}</strong>
                            <span>{interagivel.tipo}</span>
                            <p>{interagivel.descricao}</p>
                            {interagivel.posicao ? <small>Posição {interagivel.posicao.x}m,{interagivel.posicao.y}m</small> : null}
                        </article>
                    ))}
                </div>
            )}
        </aside>
    );
};
