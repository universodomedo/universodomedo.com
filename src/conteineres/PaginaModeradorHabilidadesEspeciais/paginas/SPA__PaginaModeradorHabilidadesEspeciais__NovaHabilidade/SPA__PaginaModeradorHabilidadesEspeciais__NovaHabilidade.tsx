import styles from './styles.module.css';

import { useContexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade } from 'Contextos/Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade/contexto';

export default function SPA__PaginaModeradorHabilidadesEspeciais__NovaHabilidade() {
    const { formularioNovaHabilidade, custoEhValido, podeSalvar, salvar } = useContexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade();

    return (
        <section className={styles.recipiente_nova_habilidade}>
            <div className={styles.painel_formulario}>
                <header className={styles.cabecalho_formulario}>
                    <h2>Nova Habilidade Especial</h2>
                    <p>Cadastre a habilidade e defina seu custo em pontos de progressão.</p>
                </header>

                <div className={styles.formulario}>
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

                    <label className={styles.campo}>
                        <span>Custo em Pontos de Habilidade Especial</span>
                        <input type="number" min="1" step="1" {...formularioNovaHabilidade.input('custoPontosHabilidadeEspecial')} />
                        {formularioNovaHabilidade.valores.custoPontosHabilidadeEspecial.trim().length > 0 && !custoEhValido && <small className={styles.erro_campo}>Informe um número inteiro maior que zero.</small>}
                    </label>
                </div>

                <footer className={styles.rodape_formulario}>
                    <button type="button" className={styles.botao_salvar} onClick={salvar} disabled={!podeSalvar}>{formularioNovaHabilidade.salvando ? 'Salvando...' : 'Salvar Habilidade'}</button>
                </footer>
            </div>
        </section>
    );
};
