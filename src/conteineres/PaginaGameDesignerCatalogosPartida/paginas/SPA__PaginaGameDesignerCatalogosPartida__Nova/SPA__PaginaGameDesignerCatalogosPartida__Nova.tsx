import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerCatalogosPartida__Nova } from 'Contextos/Contexto__PaginaGameDesignerCatalogosPartida__Nova/contexto';

export default function SPA__PaginaGameDesignerCatalogosPartida__Nova() {
    const { formularioNovoCatalogo, podeSalvar, salvar } = useContexto__PaginaGameDesignerCatalogosPartida__Nova();
    const inputNome = formularioNovoCatalogo.input('nome');
    const erroNome = formularioNovoCatalogo.erro('nome');

    return (
        <section className={styles.formulario}>
            <label className={styles.campo}>
                <span>Nome do Catálogo</span>
                <input type="text" value={inputNome.value} onChange={inputNome.onChange} disabled={inputNome.disabled} maxLength={inputNome.maxLength} placeholder={inputNome.placeholder} />
                {erroNome && <small className={styles.erro}>{erroNome}</small>}
            </label>

            <div className={styles.acoes}>
                <button type="button" className={styles.botao_principal} onClick={() => void salvar()} disabled={!podeSalvar}>{formularioNovoCatalogo.salvando ? 'Criando…' : 'Criar Catálogo'}</button>
            </div>
        </section>
    );
};
