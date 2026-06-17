'use client';

import styles from './InteragiveisPercebidosSalaJogo.module.css';

import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';

export function InteragiveisPercebidosSalaJogo() {
    const { estadoCarregamento, mapaLogicoSalaJogo, interagiveisPercebidos, keysInteragiveisPercebidosNovos, keyInteragivelSelecionado, selecionaInteragivel } = useContextoTelaDeJogoMapaLogico();

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
                        const estaSelecionado = keyInteragivelSelecionado === interagivel.key;
                        const className = `${styles.item_interagivel_percebido} ${ehNovo ? styles.item_interagivel_percebido_novo : ''} ${estaSelecionado ? styles.item_interagivel_percebido_selecionado : ''}`;

                        return (
                            <button key={interagivel.key} type="button" className={className} onClick={() => selecionaInteragivel(interagivel.key)}>
                                <strong>{interagivel.nome}{ehNovo ? <span className={styles.marcador_interagivel_novo}>Novo</span> : null}</strong>
                                <span>{interagivel.tipo}</span>
                                <span className={styles.descricao_interagivel_percebido}>{interagivel.descricao}</span>
                                {interagivel.posicao ? <small>Posição {interagivel.posicao.x}m,{interagivel.posicao.y}m</small> : null}
                            </button>
                        );
                    })}
                </div>
            )}
        </aside>
    );
};
