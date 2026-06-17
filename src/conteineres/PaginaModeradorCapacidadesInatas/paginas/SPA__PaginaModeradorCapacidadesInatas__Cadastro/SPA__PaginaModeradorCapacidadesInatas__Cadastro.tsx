import styles from './styles.module.css';

import { useContexto__PaginaModeradorCapacidadesInatas__Cadastro } from 'Contextos/Contexto__PaginaModeradorCapacidadesInatas__Cadastro/contexto';

export default function SPA__PaginaModeradorCapacidadesInatas__Cadastro() {
    const { formularioNovaCapacidadeInata, salvar } = useContexto__PaginaModeradorCapacidadesInatas__Cadastro();

    return (
        <section className={styles.recipiente_cadastro}>
            <div className={styles.painel_formulario}>
                <header className={styles.cabecalho_formulario}>
                    <h2>Nova Capacidade Inata</h2>
                </header>

                <label className={styles.campo}>
                    <span>Nome</span>
                    <input type="text" {...formularioNovaCapacidadeInata.input('nome')} />
                    {formularioNovaCapacidadeInata.erro('nome') && <small className={styles.erro_campo}>{formularioNovaCapacidadeInata.erro('nome')}</small>}
                </label>
                <label className={styles.campo}>
                    <span>Interação</span>
                    <input type="text" {...formularioNovaCapacidadeInata.input('nomeInteracao')} />
                    {formularioNovaCapacidadeInata.erro('nomeInteracao') && <small className={styles.erro_campo}>{formularioNovaCapacidadeInata.erro('nomeInteracao')}</small>}
                </label>

                <footer className={styles.rodape_formulario}>
                    <button type="button" className={styles.botao_salvar} onClick={salvar} disabled={!formularioNovaCapacidadeInata.podeSalvar}>{formularioNovaCapacidadeInata.salvando ? 'Salvando...' : 'Salvar Capacidade'}</button>
                </footer>
            </div>
        </section>
    );
};
