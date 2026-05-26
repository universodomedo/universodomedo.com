import styles from './styles.module.css';

import { useContexto__PaginaModeradorHabilidadesPericia__NovaHabilidade } from 'Contextos/Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade/contexto';

export default function SPA__PaginaModeradorHabilidadesPericia__NovaHabilidade() {
    const { pericias, patentes, idPericiaSelecionada, idPatentePericiaSelecionada, selecionaPericia, selecionaPatentePericia, formularioNovaHabilidade, podeSalvar, salvar } = useContexto__PaginaModeradorHabilidadesPericia__NovaHabilidade();

    return (
        <section className={styles.recipiente_nova_habilidade}>
            <div className={styles.painel_formulario}>
                <header className={styles.cabecalho_formulario}>
                    <h2>Nova Habilidade de Perícia</h2>
                    <p>Defina o contexto e cadastre os dados da habilidade.</p>
                </header>

                <div className={styles.formulario}>
                    <div className={styles.campos_contexto}>
                        <label className={styles.campo}>
                            <span>Perícia</span>
                            <select value={idPericiaSelecionada?.toString() ?? ''} onChange={evento => selecionaPericia(evento.target.value ? Number(evento.target.value) : null)} disabled={formularioNovaHabilidade.salvando}>
                                <option value="">Selecione uma Perícia</option>
                                {pericias.map(pericia => <option key={pericia.id} value={pericia.id}>{pericia.nome}</option>)}
                            </select>
                        </label>

                        <label className={styles.campo}>
                            <span>Patente</span>
                            <select value={idPatentePericiaSelecionada?.toString() ?? ''} onChange={evento => selecionaPatentePericia(evento.target.value ? Number(evento.target.value) : null)} disabled={formularioNovaHabilidade.salvando}>
                                <option value="">Selecione uma Patente</option>
                                {patentes.map(patente => <option key={patente.id} value={patente.id}>{patente.nome}</option>)}
                            </select>
                        </label>
                    </div>

                    <label className={styles.campo}>
                        <span>Nome</span>
                        <input type="text" {...formularioNovaHabilidade.input('nome')} />
                        {formularioNovaHabilidade.erro('nome') && <small className={styles.erro_campo}>{formularioNovaHabilidade.erro('nome')}</small>}
                    </label>

                    <label className={styles.campo}>
                        <span>Descrição</span>
                        <textarea {...formularioNovaHabilidade.textarea('descricao')} />
                        {formularioNovaHabilidade.erro('descricao') && <small className={styles.erro_campo}>{formularioNovaHabilidade.erro('descricao')}</small>}
                    </label>
                </div>

                <footer className={styles.rodape_formulario}>
                    <button type="button" className={styles.botao_salvar} onClick={salvar} disabled={!podeSalvar}>{formularioNovaHabilidade.salvando ? 'Salvando...' : 'Salvar Habilidade'}</button>
                </footer>
            </div>
        </section>
    );
};