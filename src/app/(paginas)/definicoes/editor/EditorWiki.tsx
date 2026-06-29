'use client';

import { ItemBlocoWiki, PAYLOAD__SalvarPaginaWiki, SecaoWiki } from 'types-nora-api';

import { useEditorWiki } from './useEditorWiki';
import styles from './editorWiki.module.css';

const TIPOS_BLOCO: ItemBlocoWiki['tipo'][] = ['Paragrafo', 'ParagrafoSecreto', 'SeparadorGrupo', 'ListaColecao', 'ListaPaginas'];

export default function EditorWiki({ inicial, secao = 'definicao' }: { inicial?: Partial<PAYLOAD__SalvarPaginaWiki>; secao?: SecaoWiki }) {
    const editor = useEditorWiki(inicial, secao);

    return (
        <div className={styles.editor}>
            <h2>Editar página da wiki — {secao === 'dica' ? 'Dicas' : 'Definições'}</h2>

            <div className={styles.campos}>
                <label>Chave (rota)<input value={editor.campos.chave} onChange={e => editor.setChave(e.target.value)} placeholder="ex: Atributos — vazio = índice" /></label>
                <label>Título<input value={editor.campos.titulo} onChange={e => editor.setTitulo(e.target.value)} /></label>
                <label>Subtítulo<input value={editor.campos.subtitulo} onChange={e => editor.setSubtitulo(e.target.value)} /></label>
                <label>Página pai (chave)<input value={editor.campos.chavePai ?? ''} onChange={e => editor.setChavePai(e.target.value)} /></label>
                <label>Ordem<input type="number" value={editor.campos.ordem} onChange={e => editor.setOrdem(Number(e.target.value))} /></label>
            </div>

            <section className={styles.lista}>
                <header className={styles.cabecalhoLista}><h3>Blocos</h3><button type="button" onClick={editor.adicionaBloco}>+ bloco</button></header>
                {editor.blocos.map((bloco, indice) => (
                    <div key={indice} className={styles.item}>
                        <select value={bloco.tipo} onChange={e => editor.atualizaBloco(indice, { tipo: e.target.value as ItemBlocoWiki['tipo'] })}>
                            {TIPOS_BLOCO.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                        </select>
                        {bloco.tipo === 'Paragrafo' && <textarea value={bloco.conteudo ?? ''} onChange={e => editor.atualizaBloco(indice, { conteudo: e.target.value })} placeholder="texto do parágrafo" />}
                        {bloco.tipo === 'ListaColecao' && <input value={bloco.chaveColecaoDinamica ?? ''} onChange={e => editor.atualizaBloco(indice, { chaveColecaoDinamica: e.target.value })} placeholder="coleção viva: ex Atributos, Pericias" />}
                        <button type="button" onClick={() => editor.removeBloco(indice)}>remover</button>
                    </div>
                ))}
            </section>

            <section className={styles.lista}>
                <header className={styles.cabecalhoLista}><h3>Conexões (simétricas)</h3><button type="button" onClick={editor.adicionaConexao}>+ conexão</button></header>
                {editor.conexoes.map((conexao, indice) => (
                    <div key={indice} className={styles.item}>
                        <input value={conexao.chaveParceira} onChange={e => editor.atualizaConexao(indice, { chaveParceira: e.target.value })} placeholder="chave da página parceira" />
                        <input value={conexao.rotulo ?? ''} onChange={e => editor.atualizaConexao(indice, { rotulo: e.target.value })} placeholder="rótulo (opcional)" />
                        <label className={styles.checkbox}><input type="checkbox" checked={conexao.secreto ?? false} onChange={e => editor.atualizaConexao(indice, { secreto: e.target.checked })} /> secreta</label>
                        <button type="button" onClick={() => editor.removeConexao(indice)}>remover</button>
                    </div>
                ))}
            </section>

            <div className={styles.acoes}>
                <button type="button" className={styles.salvar} onClick={editor.salvar} disabled={editor.envio.enviando}>{editor.envio.enviando ? 'Salvando...' : 'Salvar página'}</button>
                <button type="button" className={styles.remover} onClick={editor.remover} disabled={editor.envio.enviando}>Remover página</button>
                {editor.envio.erro && <span className={styles.erro}>{editor.envio.erro}</span>}
                {editor.envio.sucesso && <span className={styles.sucesso}>Operação concluída.</span>}
            </div>
        </div>
    );
}