import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerMissoesDetalhes__Editor } from 'Contextos/Contexto__PaginaGameDesignerMissoesDetalhes__Editor/contexto';

export default function SPA__PaginaGameDesignerMissoesDetalhes__Editor() {
    const { missaoSelecionada, formularioMissaoDetalhe, voltarParaListagem } = useContexto__PaginaGameDesignerMissoesDetalhes__Editor();

    return (
        <section className={styles.editor_configuracao}>
            <header className={styles.cabecalho_editor}>
                <strong>Missão #{missaoSelecionada.id}</strong>
                <span>Detalhe editorial da missão jogável</span>
            </header>
            <label className={styles.campo_formulario}>
                <span>Nome</span>
                <input type="text" {...formularioMissaoDetalhe.input('nome')} />
                {formularioMissaoDetalhe.erro('nome') && <small>{formularioMissaoDetalhe.erro('nome')}</small>}
            </label>
            <label className={styles.campo_formulario}>
                <span>Descrição</span>
                <textarea rows={6} {...formularioMissaoDetalhe.textarea('descricao')} />
                {formularioMissaoDetalhe.erro('descricao') && <small>{formularioMissaoDetalhe.erro('descricao')}</small>}
            </label>
            <div className={styles.acoes_editor}>
                <button type="button" className={styles.botao_secundario} onClick={voltarParaListagem}>Cancelar</button>
                <button type="button" className={styles.botao_principal} onClick={() => void formularioMissaoDetalhe.salvar()} disabled={!formularioMissaoDetalhe.podeSalvar}>
                    {formularioMissaoDetalhe.salvando ? 'Salvando...' : 'Salvar Detalhes'}
                </button>
            </div>
        </section>
    );
};
