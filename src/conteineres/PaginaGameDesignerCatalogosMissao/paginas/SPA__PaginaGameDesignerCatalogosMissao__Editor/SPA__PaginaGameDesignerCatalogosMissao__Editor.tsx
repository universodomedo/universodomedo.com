import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerCatalogosMissao__Editor } from 'Contextos/Contexto__PaginaGameDesignerCatalogosMissao__Editor/contexto';

export default function SPA__PaginaGameDesignerCatalogosMissao__Editor() {
    const { formularioCatalogoMissao, estaEditando, voltarParaListagem } = useContexto__PaginaGameDesignerCatalogosMissao__Editor();

    return (
        <section className={styles.editor_catalogo}>
            <label className={styles.campo_formulario}>
                <span>Nome</span>
                <input type="text" {...formularioCatalogoMissao.input('nome')} />
                {formularioCatalogoMissao.erro('nome') && <small>{formularioCatalogoMissao.erro('nome')}</small>}
            </label>
            <div className={styles.acoes_editor}>
                <button type="button" className={styles.botao_secundario} onClick={voltarParaListagem}>Cancelar</button>
                <button type="button" className={styles.botao_principal} onClick={() => void formularioCatalogoMissao.salvar()} disabled={!formularioCatalogoMissao.podeSalvar}>
                    {formularioCatalogoMissao.salvando ? 'Salvando...' : estaEditando ? 'Salvar Catálogo' : 'Criar Catálogo'}
                </button>
            </div>
        </section>
    );
};