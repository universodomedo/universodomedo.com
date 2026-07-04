'use client';

import { usePlacarDesafioAoVivo } from './usePlacarDesafioAoVivo';

import styles from './PainelPlacarDesafio.module.css';

// Placar do Desafio AO VIVO no Detalhe do Orbital. Renderizacao pura: consome o estado do hook (WebSocket) e desenha o ranking como tabela com cabecalho de colunas e rolagem horizontal.
export function PainelPlacarDesafio({ tipoDesafio }: { tipoDesafio: string }) {
    const { leaderboard, erro, carregando } = usePlacarDesafioAoVivo(tipoDesafio);

    const entradas = leaderboard?.entradas ?? [];
    const unidade = leaderboard?.metrica.unidade ?? null;
    // Nome da coluna vem da metrica do Desafio (contrato). Enquanto nao ha metrica configurada (metrica padrao 'PONTUACAO', pois ainda nao existe UI de metricas), rotula pelo que a pontuacao de fato mede hoje: dano infligido.
    const metricaConfigurada = leaderboard?.metrica.chave && leaderboard.metrica.chave !== 'PONTUACAO';
    const rotuloMetrica = metricaConfigurada ? leaderboard!.metrica.rotulo : 'Dano Infligido';

    return (
        <section className={styles.placar}>
            <div className={styles.cabecalho}>
                <span className={styles.icone} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4h10v3.5a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4.5v1A3.5 3.5 0 0 0 8 10.5M17 6h2.5v1a3.5 3.5 0 0 1-3.5 3.5" /><path d="M9.5 20h5M12 14.5V20" /></svg>
                </span>
                <h3 className={styles.rotulo}>Placar</h3>
                <span className={styles.aovivo}><span className={styles.aovivo_ponto} aria-hidden="true" />AO VIVO</span>
            </div>

            {carregando && <p className={styles.aviso}>Carregando o Placar…</p>}
            {!carregando && erro && <p className={styles.aviso}>{erro}</p>}
            {!carregando && !erro && entradas.length === 0 && <p className={styles.aviso}>Ninguém no Placar ainda. Seja o primeiro a jogar!</p>}

            {entradas.length > 0 && (
                <div className={styles.rolagem}>
                    <div className={styles.tabela}>
                        <div className={styles.linha_cabecalho}>
                            <span className={styles.col_pos}>#</span>
                            <span className={styles.col_nome}>Jogador</span>
                            <span className={styles.col_pont}>{rotuloMetrica}{unidade ? ` (${unidade})` : ''}</span>
                        </div>

                        {entradas.map(entrada => (
                            <div key={entrada.usuarioId} className={styles.linha} data-topo={entrada.colocacao <= 3 ? 'sim' : undefined}>
                                <span className={styles.col_pos}>{entrada.colocacao}º</span>
                                <span className={styles.col_nome} title={entrada.usuarioNome}>{entrada.usuarioNome}</span>
                                <span className={styles.col_pont}>{formataPontuacao(entrada.pontuacao)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

function formataPontuacao(valor: number): string { return Number.isInteger(valor) ? String(valor) : valor.toFixed(1); };
