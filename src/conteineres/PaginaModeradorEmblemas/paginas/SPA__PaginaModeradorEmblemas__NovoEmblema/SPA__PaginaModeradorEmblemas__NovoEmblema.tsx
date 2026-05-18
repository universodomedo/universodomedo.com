import styles from './styles.module.css';

import { useContexto__PaginaModeradorEmblemas__NovoEmblema } from 'Contextos/Contexto__PaginaModeradorEmblemas__NovoEmblema/contexto';

export default function SPA__PaginaModeradorEmblemas__NovoEmblema() {
    const { nome, nomeVisual, descricao, salvando, podeSalvar, salvar, alteraNome, alteraNomeVisual, alteraDescricao } = useContexto__PaginaModeradorEmblemas__NovoEmblema();

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
                        <input type="text" value={nome} onChange={alteraNome} placeholder="Ex: Guardião do Véu" disabled={salvando} />
                    </label>

                    <label className={styles.campo}>
                        <span>Nome Visual</span>
                        <input type="text" value={nomeVisual} onChange={alteraNomeVisual} placeholder="Ex: Guardião do Véu Ancestral" disabled={salvando} />
                        <small>Opcional. Quando vazio, o nome principal pode ser usado como referência visual.</small>
                    </label>

                    <label className={styles.campo}>
                        <span>Descrição</span>
                        <textarea value={descricao} onChange={alteraDescricao} placeholder="Descreva o significado, uso ou contexto do emblema." disabled={salvando} />
                    </label>
                </div>

                <footer className={styles.rodape_formulario}>
                    <button type="button" className={styles.botao_salvar} onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : 'Salvar Emblema'}</button>
                </footer>
            </div>
        </section>
    );
};