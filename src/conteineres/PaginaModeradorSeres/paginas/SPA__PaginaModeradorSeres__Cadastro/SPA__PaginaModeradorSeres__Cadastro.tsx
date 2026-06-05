import styles from './styles.module.css';

import { useContexto__PaginaModeradorSeres__Cadastro } from 'Contextos/Contexto__PaginaModeradorSeres__Cadastro/contexto';

export default function SPA__PaginaModeradorSeres__Cadastro() {
    const contexto = useContexto__PaginaModeradorSeres__Cadastro();
    const carregarMaisCapacidades = contexto.capacidadesInatas.carregarMais;
    const deveMostrarCarregarMaisCapacidades = !!carregarMaisCapacidades && (carregarMaisCapacidades.podeCarregarMais || !!carregarMaisCapacidades.carregando || !!carregarMaisCapacidades.erro);

    return (
        <section className={styles.recipiente_cadastro}>
            <div className={styles.painel_formulario}>
                <header className={styles.cabecalho_formulario}>
                    <h2>Novo Ser</h2>
                </header>

                <label className={styles.campo}>
                    <span>Nome</span>
                    <input type="text" {...contexto.formularioNovoSer.input('nome')} />
                    {contexto.formularioNovoSer.erro('nome') && <small className={styles.erro_campo}>{contexto.formularioNovoSer.erro('nome')}</small>}
                </label>

                <section className={styles.bloco_membros}>
                    <header className={styles.cabecalho_membros}>
                        <h3>Membros</h3>
                        <button type="button" onClick={contexto.adicionaMembro}>Adicionar membro</button>
                    </header>

                    {contexto.mensagemValidacaoMembros && <p className={styles.erro_campo}>{contexto.mensagemValidacaoMembros}</p>}
                    {(contexto.capacidadesInatas.carregando || contexto.capacidadesInatas.erro || deveMostrarCarregarMaisCapacidades) && (
                        <div className={styles.estado_capacidades}>
                            {contexto.capacidadesInatas.contador && <span>{contexto.capacidadesInatas.contador}</span>}
                            {contexto.capacidadesInatas.carregando && <strong>{contexto.capacidadesInatas.carregando}</strong>}
                            {contexto.capacidadesInatas.erro && <small className={styles.erro_campo}>{contexto.capacidadesInatas.erro}</small>}
                            {carregarMaisCapacidades && deveMostrarCarregarMaisCapacidades && (
                                <div className={styles.area_carregar_mais_capacidades}>
                                    {carregarMaisCapacidades.erro && <small className={styles.erro_campo}>{carregarMaisCapacidades.erro}</small>}
                                    <button type="button" onClick={carregarMaisCapacidades.aoCarregarMais} disabled={!!carregarMaisCapacidades.carregando || !carregarMaisCapacidades.podeCarregarMais}>{carregarMaisCapacidades.carregando ?? carregarMaisCapacidades.textoBotao ?? 'Carregar mais capacidades'}</button>
                                </div>
                            )}
                        </div>
                    )}

                    {contexto.membros.map(membro => (
                        <article key={membro.idLocal} className={styles.card_membro}>
                            <label className={styles.campo}>
                                <span>Nome do membro</span>
                                <input type="text" value={membro.nome} onChange={evento => contexto.atualizaNomeMembro(membro.idLocal, evento.target.value)} />
                            </label>

                            <div className={styles.lista_capacidades}>
                                {contexto.capacidadesInatas.registros.map(capacidade => (
                                    <label key={capacidade.id} className={styles.capacidade}>
                                        <input type="checkbox" checked={membro.capacidadesIds.includes(capacidade.id)} onChange={() => contexto.alternaCapacidadeMembro(membro.idLocal, capacidade.id)} />
                                        <span>{capacidade.nome}</span>
                                    </label>
                                ))}
                            </div>

                            <button type="button" className={styles.botao_remover} onClick={() => contexto.removeMembro(membro.idLocal)}>Remover membro</button>
                        </article>
                    ))}
                </section>

                <footer className={styles.rodape_formulario}>
                    <button type="button" className={styles.botao_salvar} onClick={contexto.salvar} disabled={!contexto.podeSalvarSer}>{contexto.formularioNovoSer.salvando ? 'Salvando...' : 'Salvar Ser'}</button>
                </footer>
            </div>
        </section>
    );
};