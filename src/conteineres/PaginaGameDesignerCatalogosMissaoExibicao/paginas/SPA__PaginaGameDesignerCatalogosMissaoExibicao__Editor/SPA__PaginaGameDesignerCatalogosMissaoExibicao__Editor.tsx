import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor } from 'Contextos/Contexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor/contexto';

export default function SPA__PaginaGameDesignerCatalogosMissaoExibicao__Editor() {
    const { catalogoSelecionado, formularioCatalogoMissaoExibicao, voltarParaListagem } = useContexto__PaginaGameDesignerCatalogosMissaoExibicao__Editor();

    return (
        <section className={styles.editor_configuracao}>
            <header className={styles.cabecalho_editor}>
                <strong>{catalogoSelecionado.nome}</strong>
                <span>ID {catalogoSelecionado.id}</span>
            </header>
            <label className={styles.campo_checkbox}>
                <input type="checkbox" {...formularioCatalogoMissaoExibicao.checkbox('ativo')} />
                <span>Ativo na exibição</span>
            </label>
            <label className={styles.campo_formulario}>
                <span>Ordem</span>
                <input type="text" inputMode="numeric" {...formularioCatalogoMissaoExibicao.input('ordem')} />
                {formularioCatalogoMissaoExibicao.erro('ordem') && <small>{formularioCatalogoMissaoExibicao.erro('ordem')}</small>}
            </label>
            <div className={styles.acoes_editor}>
                <button type="button" className={styles.botao_secundario} onClick={voltarParaListagem}>Cancelar</button>
                <button type="button" className={styles.botao_principal} onClick={() => void formularioCatalogoMissaoExibicao.salvar()} disabled={!formularioCatalogoMissaoExibicao.podeSalvar}>
                    {formularioCatalogoMissaoExibicao.salvando ? 'Salvando...' : 'Salvar Exibição'}
                </button>
            </div>
        </section>
    );
};
