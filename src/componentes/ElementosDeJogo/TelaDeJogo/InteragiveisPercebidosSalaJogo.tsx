'use client';

import styles from './InteragiveisPercebidosSalaJogo.module.css';

import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';

export function InteragiveisPercebidosSalaJogo() {
    const { estadoCarregamento, mapaLogicoSalaJogo, interagiveisPercebidos, keysInteragiveisPercebidosNovos } = useContextoTelaDeJogoMapaLogico();

    if (estadoCarregamento !== 'pronto' || mapaLogicoSalaJogo === null) return null;

    return (
        <aside className={styles.painel_interagiveis_percebidos}>
            <header className={styles.cabecalho_interagiveis_percebidos}>
                <strong>Interagíveis percebidos</strong>
                <span>{interagiveisPercebidos.length} percebido{interagiveisPercebidos.length === 1 ? '' : 's'}</span>
            </header>

            {interagiveisPercebidos.length === 0 ? <span className={styles.estado_vazio_interagiveis_percebidos}>Nenhum interagível percebido.</span> : (
                <div className={styles.lista_interagiveis_percebidos}>
                    {interagiveisPercebidos.map(interagivel => {
                        const ehNovo = keysInteragiveisPercebidosNovos.includes(interagivel.key);
                        const className = ehNovo ? `${styles.item_interagivel_percebido} ${styles.item_interagivel_percebido_novo}` : styles.item_interagivel_percebido;

                        return (
                            <article key={interagivel.key} className={className}>
                                <strong>{interagivel.nome}{ehNovo ? <span className={styles.marcador_interagivel_novo}>Novo</span> : null}</strong>
                                <span>{interagivel.tipo}</span>
                                <p>{interagivel.descricao}</p>
                                {interagivel.posicao ? <small>Posição {interagivel.posicao.x}m,{interagivel.posicao.y}m</small> : null}
                            </article>
                        );
                    })}
                </div>
            )}
        </aside>
    );
};
