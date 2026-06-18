import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerSeres__EditarMembros } from 'Contextos/Contexto__PaginaGameDesignerSeres__EditarMembros/contexto';

export default function SPA__PaginaGameDesignerSeres__EditarMembros() {
    const contexto = useContexto__PaginaGameDesignerSeres__EditarMembros();
    const carregarMaisCapacidades = contexto.capacidadesInatas.carregarMais;

    if (contexto.carregando) return <section className={styles.editor}><p>Carregando membros...</p></section>;

    return (
        <section className={styles.editor}>
            <header className={styles.cabecalho}>
                <button type="button" className={styles.botao_voltar} onClick={contexto.voltar} disabled={contexto.salvando}>← Voltar</button>
                <h2>Capacidades Inatas dos Membros</h2>
            </header>

            <div className={styles.bloco_membros}>
                <div className={styles.cabecalho_membros}>
                    <h3>Membros</h3>
                    <button type="button" onClick={contexto.adicionaMembro} disabled={contexto.salvando}>Adicionar membro</button>
                </div>

                {contexto.mensagemValidacao && <p className={styles.erro_campo}>{contexto.mensagemValidacao}</p>}
                {contexto.capacidadesInatas.carregando && <strong>{contexto.capacidadesInatas.carregando}</strong>}
                {contexto.capacidadesInatas.erro && <small className={styles.erro_campo}>{contexto.capacidadesInatas.erro}</small>}
                {carregarMaisCapacidades && carregarMaisCapacidades.podeCarregarMais && (
                    <button type="button" onClick={carregarMaisCapacidades.aoCarregarMais} disabled={!!carregarMaisCapacidades.carregando}>{carregarMaisCapacidades.carregando ?? 'Carregar mais capacidades'}</button>
                )}

                {contexto.membros.map(membro => {
                    const capacidadesDoMembro = contexto.capacidadesInatas.registros.filter(capacidade => membro.idsCapacidadesInatas.includes(capacidade.id));

                    return (
                        <article key={membro.idLocal} className={styles.card_membro}>
                            <label className={styles.campo}>
                                <span>Nome do membro</span>
                                <input type="text" value={membro.nome} onChange={evento => contexto.atualizaNomeMembro(membro.idLocal, evento.target.value)} disabled={contexto.salvando} />
                            </label>

                            <div className={styles.lista_capacidades}>
                                {contexto.capacidadesInatas.registros.map(capacidade => (
                                    <label key={capacidade.id} className={styles.capacidade}>
                                        <input type="checkbox" checked={membro.idsCapacidadesInatas.includes(capacidade.id)} onChange={() => contexto.alternaCapacidadeMembro(membro.idLocal, capacidade.id)} disabled={contexto.salvando} />
                                        <span>{capacidade.nome}</span>
                                    </label>
                                ))}
                            </div>

                            <div className={styles.bloco_acoes_membro}>
                                <div className={styles.cabecalho_acoes_membro}>
                                    <strong>Ações do membro</strong>
                                    <button type="button" onClick={() => contexto.adicionaAcaoMembro(membro.idLocal)} disabled={contexto.salvando || capacidadesDoMembro.length < 1}>Adicionar ação</button>
                                </div>

                                {membro.acoes.length > 0 && (
                                    <div className={styles.lista_acoes_membro}>
                                        {membro.acoes.map(acao => (
                                            <div key={acao.idLocal} className={styles.acao_membro}>
                                                <label className={styles.campo}>
                                                    <span>Nome da ação</span>
                                                    <input type="text" value={acao.nome} onChange={evento => contexto.atualizaNomeAcaoMembro(membro.idLocal, acao.idLocal, evento.target.value)} disabled={contexto.salvando} />
                                                </label>

                                                <label className={styles.campo}>
                                                    <span>Capacidade Inata utilizada</span>
                                                    <select value={acao.idCapacidadeInata} onChange={evento => contexto.atualizaCapacidadeAcaoMembro(membro.idLocal, acao.idLocal, Number(evento.target.value))} disabled={contexto.salvando}>
                                                        <option value={0}>Selecione</option>
                                                        {capacidadesDoMembro.map(capacidade => <option key={capacidade.id} value={capacidade.id}>{capacidade.nome}</option>)}
                                                    </select>
                                                </label>

                                                <button type="button" className={styles.botao_remover} onClick={() => contexto.removeAcaoMembro(membro.idLocal, acao.idLocal)} disabled={contexto.salvando}>Remover ação</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button type="button" className={styles.botao_remover} onClick={() => contexto.removeMembro(membro.idLocal)} disabled={contexto.salvando}>Remover membro</button>
                        </article>
                    );
                })}
            </div>

            <footer className={styles.rodape}>
                <button type="button" className={styles.botao_salvar} onClick={contexto.salvar} disabled={!contexto.podeSalvar}>{contexto.salvando ? 'Salvando...' : 'Salvar membros'}</button>
            </footer>
        </section>
    );
};