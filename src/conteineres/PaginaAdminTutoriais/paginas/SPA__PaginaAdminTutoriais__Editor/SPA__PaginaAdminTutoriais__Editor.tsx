import styles from './styles.module.css';

import { useContexto__PaginaAdminTutoriais__Editor } from 'Contextos/Contexto__PaginaAdminTutoriais__Editor/contexto';
import PassoNavegador from './PassoNavegador';
import PalcoTutorial from './PalcoTutorial';
import BotoesPassoEditor from './BotoesPassoEditor';
import BlocoEditor from './BlocoEditor';

export default function SPA__PaginaAdminTutoriais__Editor() {
    const editor = useContexto__PaginaAdminTutoriais__Editor();

    if (editor.erro) return <section className={styles.editor}><small className={styles.erro}>{editor.erro}</small></section>;
    if (editor.carregando || !editor.pronto) return <section className={styles.editor}><strong>{editor.carregando ?? 'Carregando Tutorial'}</strong></section>;

    return (
        <section className={styles.editor}>
            <header className={styles.cabecalho}><h2>{editor.estaEditando ? 'Editar Tutorial' : 'Novo Tutorial'}</h2></header>

            <label className={styles.campo}>
                <span>Chave</span>
                <input type="text" {...editor.formulario.input('chaveTutorial')} disabled={editor.estaEditando || editor.formulario.salvando} />
                {editor.formulario.erro('chaveTutorial') && <small className={styles.erro}>{editor.formulario.erro('chaveTutorial')}</small>}
            </label>

            <label className={styles.campo}>
                <span>Nome</span>
                <input type="text" {...editor.formulario.input('nome')} />
                {editor.formulario.erro('nome') && <small className={styles.erro}>{editor.formulario.erro('nome')}</small>}
            </label>

            <label className={styles.campo_inline}><input type="checkbox" {...editor.formulario.checkbox('ativo')} /><span>Ativo</span></label>

            <label className={styles.campo_inline}>
                <span>Largura do Tutorial (%)</span>
                <input type="number" min={1} max={100} step="any" value={editor.larguraPercentual} onChange={evento => editor.setLarguraPercentual(Number(evento.target.value))} />
            </label>

            <PassoNavegador />
            {editor.passoAtivo && (
                <div className={styles.toolbar_blocos}>
                    <button type="button" onClick={() => editor.acoes.adicionaBlocoTexto(editor.passoAtivo!.idLocal)}>Adicionar bloco de texto</button>
                    <button type="button" onClick={() => editor.acoes.adicionaBlocoImagem(editor.passoAtivo!.idLocal)}>Adicionar bloco de imagem</button>
                </div>
            )}
            <PalcoTutorial />
            {editor.passoAtivo && <BotoesPassoEditor passo={editor.passoAtivo} aoAtualizar={(campo, valor) => editor.acoes.atualizaTextoBotao(editor.passoAtivo!.idLocal, campo, valor)} />}
            <BlocoEditor />

            {editor.erroEdicao && <p className={styles.erro}>{editor.erroEdicao}</p>}
            {editor.erroSalvar && <p className={styles.erro}>{editor.erroSalvar}</p>}

            <footer className={styles.rodape}>
                <button type="button" className={styles.botao_voltar} onClick={editor.voltarParaListagem}>Voltar</button>
                <button type="button" className={styles.botao_salvar} onClick={editor.salvar} disabled={!editor.podeSalvar}>{editor.formulario.salvando ? 'Salvando...' : 'Salvar Tutorial'}</button>
            </footer>
        </section>
    );
};
