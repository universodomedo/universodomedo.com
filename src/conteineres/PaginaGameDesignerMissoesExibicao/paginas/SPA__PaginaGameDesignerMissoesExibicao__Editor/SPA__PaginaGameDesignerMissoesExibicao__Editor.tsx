import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerMissoesExibicao__Editor } from 'Contextos/Contexto__PaginaGameDesignerMissoesExibicao__Editor/contexto';

export default function SPA__PaginaGameDesignerMissoesExibicao__Editor() {
    const { missaoSelecionada, detalheSelecionado, listagemCatalogosMissao, formularioMissaoExibicao, voltarParaListagem } = useContexto__PaginaGameDesignerMissoesExibicao__Editor();

    return (
        <section className={styles.editor_configuracao}>
            <header className={styles.cabecalho_editor}>
                <strong>{detalheSelecionado?.nome ?? `Missão #${missaoSelecionada.id}`}</strong>
                <span>ID {missaoSelecionada.id}</span>
            </header>
            <label className={styles.campo_formulario}>
                <span>Catálogo</span>
                <select value={formularioMissaoExibicao.valores.fkCatalogosMissaoId} onChange={evento => formularioMissaoExibicao.setCampo('fkCatalogosMissaoId', evento.target.value)} disabled={formularioMissaoExibicao.salvando}>
                    <option value="">Selecione um catálogo</option>
                    {listagemCatalogosMissao.registros.map(catalogo => <option key={catalogo.id} value={String(catalogo.id)}>{catalogo.nome}</option>)}
                </select>
                {formularioMissaoExibicao.erro('fkCatalogosMissaoId') && <small>{formularioMissaoExibicao.erro('fkCatalogosMissaoId')}</small>}
            </label>
            <label className={styles.campo_checkbox}>
                <input type="checkbox" {...formularioMissaoExibicao.checkbox('ativo')} />
                <span>Ativa na exibição</span>
            </label>
            <label className={styles.campo_formulario}>
                <span>Ordem</span>
                <input type="text" inputMode="numeric" {...formularioMissaoExibicao.input('ordem')} />
                {formularioMissaoExibicao.erro('ordem') && <small>{formularioMissaoExibicao.erro('ordem')}</small>}
            </label>
            <div className={styles.acoes_editor}>
                <button type="button" className={styles.botao_secundario} onClick={voltarParaListagem}>Cancelar</button>
                <button type="button" className={styles.botao_principal} onClick={() => void formularioMissaoExibicao.salvar()} disabled={!formularioMissaoExibicao.podeSalvar}>
                    {formularioMissaoExibicao.salvando ? 'Salvando...' : 'Salvar Exibição'}
                </button>
            </div>
        </section>
    );
};
