import styles from './styles.module.css';

import { useContexto__PaginaModeradorEmblemas__NovoEmblema } from 'Contextos/Contexto__PaginaModeradorEmblemas__NovoEmblema/contexto';

export default function SPA__PaginaModeradorEmblemas__NovoEmblema() {
    const { formularioNovoEmblema } = useContexto__PaginaModeradorEmblemas__NovoEmblema();

    return (
        <section className={styles.recipiente_novo_emblema}>
            <div className={styles.painel_formulario}>
                <header className={styles.cabecalho_formulario}>
                    <h2>Novo Emblema</h2>
                    <p>Cadastre os dados base do emblema antes de configurar arquivos e visualizações.</p>
                </header>

                <div className={styles.formulario}>
                    <label className={styles.campo}>
                        <span>Nome</span>
                        <input type="text" {...formularioNovoEmblema.input('nome')} />
                        {formularioNovoEmblema.erro('nome') && <small className={styles.erro_campo}>{formularioNovoEmblema.erro('nome')}</small>}
                    </label>

                    <label className={styles.campo}>
                        <span>Nome Visual</span>
                        <input type="text" {...formularioNovoEmblema.input('nomeVisual')} />
                        {formularioNovoEmblema.erro('nomeVisual') ? <small className={styles.erro_campo}>{formularioNovoEmblema.erro('nomeVisual')}</small> : <small>Opcional. Quando vazio, o nome principal pode ser usado como referência visual.</small>}
                    </label>

                    <label className={styles.campo}>
                        <span>Descrição</span>
                        <textarea {...formularioNovoEmblema.textarea('descricao')} />
                        {formularioNovoEmblema.erro('descricao') && <small className={styles.erro_campo}>{formularioNovoEmblema.erro('descricao')}</small>}
                    </label>
                </div>

                <footer className={styles.rodape_formulario}>
                    <button type="button" className={styles.botao_salvar} onClick={formularioNovoEmblema.salvar} disabled={!formularioNovoEmblema.podeSalvar}>{formularioNovoEmblema.salvando ? 'Salvando...' : 'Salvar Emblema'}</button>
                </footer>
            </div>
        </section>
    );
};