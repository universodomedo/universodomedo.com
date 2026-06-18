'use client';

import styles from './SeresNaSalaJogo.module.css';

import { Eventos_Envia, type KeyCombatenteMissaoFuncionalSalaDeJogoRuntime } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';

export function SeresNaSalaJogo() {
    const { estadoCarregamento, mapaLogicoSalaJogo, seresNaSala } = useContextoTelaDeJogoMapaLogico();

    if (estadoCarregamento !== 'pronto' || mapaLogicoSalaJogo === null) return null;

    function executaAcaoSerNaSala(keyAcao: string, keyCombatenteAlvo: KeyCombatenteMissaoFuncionalSalaDeJogoRuntime): void {
        if (mapaLogicoSalaJogo === null) return;
        eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.executaAcaoSerNaSala, { codigoSala: mapaLogicoSalaJogo.codigoSala, keyAcao, keyCombatenteAlvo });
    };

    return (
        <aside className={styles.painel_seres_na_sala}>
            <header className={styles.cabecalho_seres_na_sala}>
                <strong>Seres na Sala</strong>
                <span>{seresNaSala.length} carregado{seresNaSala.length === 1 ? '' : 's'}</span>
            </header>

            {seresNaSala.length === 0 ? <span className={styles.estado_vazio_seres_na_sala}>Nenhum ser persistido carregado.</span> : (
                <div className={styles.lista_seres_na_sala}>
                    {seresNaSala.map(ser => (
                        <article key={ser.keyInstancia} className={styles.item_ser_na_sala}>
                            <strong>{ser.nome}</strong>
                            <span className={styles.posicao_ser_na_sala}>Posição {ser.posicao.x}m,{ser.posicao.y}m</span>
                            {ser.estatisticasDanificaveis.length > 0 ? (
                                <div className={styles.lista_estatisticas_ser_na_sala}>
                                    {ser.estatisticasDanificaveis.map(estatistica => <small key={estatistica.id}>{estatistica.nome}: {estatistica.valorAtual}/{estatistica.valorMaximo}</small>)}
                                </div>
                            ) : null}
                            <div className={styles.lista_membros_ser_na_sala}>
                                {ser.membros.map(membro => (
                                    <section key={membro.id} className={styles.item_membro_ser_na_sala}>
                                        <span>{membro.nome}</span>
                                        <div className={styles.lista_capacidades_ser_na_sala}>
                                            {membro.capacidades.map(capacidade => <small key={capacidade.id}>{capacidade.nome} / {capacidade.nomeInteracao}</small>)}
                                        </div>
                                        {membro.acoesDisponiveis.length > 0 ? (
                                            <div className={styles.bloco_acoes_ser_na_sala}>
                                                <strong className={styles.titulo_acoes_ser_na_sala}>Ações disponíveis</strong>
                                                <div className={styles.lista_acoes_ser_na_sala}>
                                                    {membro.acoesDisponiveis.map(acao => {
                                                        const alvos = seresNaSala.filter(serAlvo => serAlvo.keyInstancia !== ser.keyInstancia);
                                                        if (ser.papel !== 'controlado') return <small key={acao.key} title={`${acao.origem.nomeMembro} / ${acao.origem.nomeCapacidadeInata} / ${acao.origem.nomeInteracaoCapacidadeInata}`}>{acao.nome}</small>;
                                                        if (alvos.length === 0) return <small key={acao.key} title="Nenhum alvo disponível">{acao.nome}</small>;
                                                        return alvos.map(alvo => <button key={`${acao.key}:${alvo.keyInstancia}`} type="button" title={`${acao.origem.nomeMembro} / ${acao.origem.nomeCapacidadeInata} / ${acao.origem.nomeInteracaoCapacidadeInata}`} onClick={() => executaAcaoSerNaSala(acao.key, alvo.keyInstancia)}>{acao.nome} em {alvo.nome}</button>);
                                                    })}
                                                </div>
                                            </div>
                                        ) : null}
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