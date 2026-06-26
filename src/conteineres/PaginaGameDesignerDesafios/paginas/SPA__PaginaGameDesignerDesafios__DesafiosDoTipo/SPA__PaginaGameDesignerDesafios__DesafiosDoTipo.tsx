import styles from './styles.module.css';

import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo } from 'Contextos/Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo/contexto';
import type { DesafioResumo } from 'types-nora-api';

export default function SPA__PaginaGameDesignerDesafios__DesafiosDoTipo() {
    const { grupo, editorDesafio, abrirCriacao } = useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo();

    return (
        <section className={styles.pagina}>
            {editorDesafio !== null && <EditorDesafio />}

            <ListagemComposta
                listagem={{ registros: grupo.desafios, carregando: null, erro: null, mensagemListaVazia: 'Nenhum Desafio neste tipo.' }}
                modoExibicao={ListagemCompostaModoExibicao.LINHA}
                obterIdRegistro={desafio => desafio.id}
                renderizarItem={desafio => <RegistroDesafio desafio={desafio} />}
                novoRegistro={{ estaEmProcessoCriacao: false, aoIniciarCriacao: abrirCriacao, textoBotao: 'Novo Desafio' }}
            />
        </section>
    );
};

function RegistroDesafio({ desafio }: { desafio: DesafioResumo; }) {
    const { salvando, alternarAtivoDesafio, abrirEdicao } = useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo();

    return (
        <article className={styles.registro_desafio}>
            <div className={styles.dados_desafio}>
                <strong>{desafio.nome}</strong>
                <span>Ordem {desafio.ordem}</span>
                {desafio.descricao && <p>{desafio.descricao}</p>}
            </div>
            <AlternaOpcao opcao={desafio.ativo} onChange={ativo => void alternarAtivoDesafio(desafio, ativo)} desabilitado={salvando} />
            <button type="button" className={styles.botao_secundario} onClick={() => abrirEdicao(desafio)}>Editar</button>
        </article>
    );
};

function EditorDesafio() {
    const { salvando, editorDesafio, alterarEditor, cancelarEditor, salvarEditor } = useContexto__PaginaGameDesignerDesafios__DesafiosDoTipo();
    if (!editorDesafio) return null;

    return (
        <section className={styles.editor}>
            <label className={styles.campo}>
                <span>Nome do Desafio</span>
                <input type="text" value={editorDesafio.nome} onChange={evento => alterarEditor({ nome: evento.target.value })} maxLength={255} />
            </label>
            <label className={styles.campo}>
                <span>Descrição</span>
                <textarea value={editorDesafio.descricao} onChange={evento => alterarEditor({ descricao: evento.target.value })} maxLength={4000} rows={5} />
            </label>
            <div className={styles.acoes_editor}>
                <button type="button" className={styles.botao_secundario} onClick={cancelarEditor}>Cancelar</button>
                <button type="button" className={styles.botao_principal} onClick={() => void salvarEditor()} disabled={salvando || editorDesafio.nome.trim().length === 0 || editorDesafio.descricao.trim().length === 0}>Salvar</button>
            </div>
        </section>
    );
};