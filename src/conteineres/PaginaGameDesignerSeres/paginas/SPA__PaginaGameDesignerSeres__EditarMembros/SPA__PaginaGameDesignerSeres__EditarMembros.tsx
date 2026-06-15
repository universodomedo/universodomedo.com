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

                {contexto.membros.map(membro => (
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

                        <button type="button" className={styles.botao_remover} onClick={() => contexto.removeMembro(membro.idLocal)} disabled={contexto.salvando}>Remover membro</button>
                    </article>
                ))}
            </div>

            <footer className={styles.rodape}>
                <button type="button" className={styles.botao_salvar} onClick={contexto.salvar} disabled={!contexto.podeSalvar}>{contexto.salvando ? 'Salvando...' : 'Salvar membros'}</button>
            </footer>
        </section>
    );
};
