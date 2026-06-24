import styles from './styles.module.css';

import { useContexto__PaginaGerenciarDimensoes__NovaDimensao } from 'Contextos/Contexto__PaginaGerenciarDimensoes__NovaDimensao/contexto';

export default function SPA__PaginaGerenciarDimensoes__NovaDimensao() {
    const { formularioNovaDimensao, erro } = useContexto__PaginaGerenciarDimensoes__NovaDimensao();

    return (
        <section className={styles.recipiente_nova_dimensao}>
            <div className={styles.painel_formulario}>
                <header className={styles.cabecalho_formulario}>
                    <h2>Nova dimensão de clima</h2>
                    <p>Só o nome cria uma dimensão de 0 a 10. Preenchendo o oposto, vira um eixo de dois polos (−10 a 10).</p>
                </header>

                <div className={styles.formulario}>
                    <label className={styles.campo}>
                        <span>Nome</span>
                        <input type="text" {...formularioNovaDimensao.input('nome')} />
                        {formularioNovaDimensao.erro('nome') && <small className={styles.erro_campo}>{formularioNovaDimensao.erro('nome')}</small>}
                    </label>

                    <label className={styles.campo}>
                        <span>Oposto</span>
                        <input type="text" {...formularioNovaDimensao.input('rotuloOposto')} />
                        <small className={styles.dica_campo}>Opcional — preencha para formar um eixo de dois polos.</small>
                    </label>

                    {erro ? <p className={styles.erro}>{erro}</p> : null}
                </div>

                <footer className={styles.rodape_formulario}>
                    <button type="button" className={styles.botao_salvar} onClick={formularioNovaDimensao.salvar} disabled={!formularioNovaDimensao.podeSalvar}>{formularioNovaDimensao.salvando ? 'Salvando...' : 'Salvar'}</button>
                </footer>
            </div>
        </section>
    );
};
