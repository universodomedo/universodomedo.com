import styles from './styles.module.css';

import { useState, type DragEvent } from 'react';

import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import EditorRuntimeMissao from './EditorRuntimeMissao/EditorRuntimeMissao';
import { useContexto__PaginaGameDesignerMissoesJogaveis } from 'Contextos/Contexto__PaginaGameDesignerMissoesJogaveis/contexto';
import type { CatalogoMissaoJogavelResumo, MissaoJogavelResumo } from 'types-nora-api';

export default function SPA__PaginaGameDesignerMissoesJogaveis() {
    const contexto = useContexto__PaginaGameDesignerMissoesJogaveis();
    const [idCatalogoArrastado, setIdCatalogoArrastado] = useState<number | null>(null);
    const [missaoArrastada, setMissaoArrastada] = useState<{ readonly idCatalogo: number; readonly idMissao: number; } | null>(null);

    if (contexto.carregando && !contexto.estrutura) return <section className={styles.estado}>Carregando...</section>;

    return (
        <section className={styles.pagina}>
            <header className={styles.barra_acoes}>
                <button type="button" className={styles.botao_principal} onClick={contexto.abrirCriacaoCatalogo} disabled={contexto.salvando}>Novo Catálogo</button>
                <button type="button" className={styles.botao_secundario} onClick={() => void contexto.recarregar()} disabled={contexto.salvando}>Atualizar</button>
            </header>

            {contexto.erro && <div className={styles.alerta}>{contexto.erro}</div>}
            {contexto.editorCatalogo && <EditorCatalogo />}
            {contexto.editorMissao && <EditorMissao />}
            {contexto.editorRuntimeMissao && <EditorRuntimeMissao key={contexto.editorRuntimeMissao.idMissao} />}

            <div className={styles.lista_catalogos}>
                {(contexto.estrutura?.catalogos ?? []).map(catalogo => (
                    <CatalogoItem key={catalogo.id} catalogo={catalogo} idCatalogoArrastado={idCatalogoArrastado} setIdCatalogoArrastado={setIdCatalogoArrastado} missaoArrastada={missaoArrastada} setMissaoArrastada={setMissaoArrastada} />
                ))}
            </div>

            {(contexto.estrutura?.missoesSemCatalogo.length ?? 0) > 0 && (
                <section className={styles.bloco_sem_catalogo}>
                    <strong>Missões sem Catálogo</strong>
                    {(contexto.estrutura?.missoesSemCatalogo ?? []).map(missao => <span key={missao.id}>{missao.nome}</span>)}
                </section>
            )}
        </section>
    );
};

function CatalogoItem({ catalogo, idCatalogoArrastado, setIdCatalogoArrastado, missaoArrastada, setMissaoArrastada }: { catalogo: CatalogoMissaoJogavelResumo; idCatalogoArrastado: number | null; setIdCatalogoArrastado: (id: number | null) => void; missaoArrastada: { readonly idCatalogo: number; readonly idMissao: number; } | null; setMissaoArrastada: (missao: { readonly idCatalogo: number; readonly idMissao: number; } | null) => void; }) {
    const contexto = useContexto__PaginaGameDesignerMissoesJogaveis();
    const aberto = contexto.idsCatalogosAbertos.includes(catalogo.id);

    function onDragOver(evento: DragEvent<HTMLElement>): void { evento.preventDefault(); }

    function onDropCatalogo(): void {
        if (idCatalogoArrastado !== null) void contexto.reordenarCatalogos(idCatalogoArrastado, catalogo.id);
        setIdCatalogoArrastado(null);
    };

    return (
        <article className={styles.catalogo} draggable onDragStart={() => setIdCatalogoArrastado(catalogo.id)} onDragEnd={() => setIdCatalogoArrastado(null)} onDragOver={onDragOver} onDrop={onDropCatalogo}>
            <header className={styles.cabecalho_catalogo}>
                <button type="button" className={styles.botao_colapso} onClick={() => contexto.alternarCatalogoAberto(catalogo.id)}>{aberto ? '▾' : '▸'}</button>
                <div className={styles.dados_catalogo}>
                    <strong>{catalogo.nome}</strong>
                    <span>ID {catalogo.id} · Ordem {catalogo.ordem} · {catalogo.missoes.length} missões</span>
                </div>
                <AlternaOpcao opcao={catalogo.ativo} onChange={ativo => void contexto.alternarAtivoCatalogo(catalogo, ativo)} />
                <button type="button" className={styles.botao_secundario} onClick={() => contexto.abrirEdicaoCatalogo(catalogo)}>Editar</button>
                <button type="button" className={styles.botao_principal} onClick={() => contexto.abrirCriacaoMissao(catalogo)}>Nova Missão</button>
            </header>

            {aberto && (
                <div className={styles.lista_missoes}>
                    {catalogo.missoes.map(missao => <MissaoItem key={missao.id} catalogo={catalogo} missao={missao} missaoArrastada={missaoArrastada} setMissaoArrastada={setMissaoArrastada} />)}
                </div>
            )}
        </article>
    );
};

function MissaoItem({ catalogo, missao, missaoArrastada, setMissaoArrastada }: { catalogo: CatalogoMissaoJogavelResumo; missao: MissaoJogavelResumo; missaoArrastada: { readonly idCatalogo: number; readonly idMissao: number; } | null; setMissaoArrastada: (missao: { readonly idCatalogo: number; readonly idMissao: number; } | null) => void; }) {
    const contexto = useContexto__PaginaGameDesignerMissoesJogaveis();

    function onDragOver(evento: DragEvent<HTMLElement>): void { evento.preventDefault(); }

    function onDropMissao(): void {
        if (missaoArrastada && missaoArrastada.idCatalogo === catalogo.id) void contexto.reordenarMissoesCatalogo(catalogo, missaoArrastada.idMissao, missao.id);
        setMissaoArrastada(null);
    };

    return (
        <article className={styles.missao} draggable onDragStart={() => setMissaoArrastada({ idCatalogo: catalogo.id, idMissao: missao.id })} onDragEnd={() => setMissaoArrastada(null)} onDragOver={onDragOver} onDrop={onDropMissao}>
            <div className={styles.dados_missao}>
                <strong>{missao.nome}</strong>
                <span>ID {missao.id} · Ordem {missao.ordem} · {missao.runtimeConfigurado ? 'Runtime configurado' : 'Sem runtime - ativação bloqueada'}</span>
                {missao.descricao && <p>{missao.descricao}</p>}
            </div>
            <AlternaOpcao opcao={missao.ativo} onChange={ativo => void contexto.alternarAtivoMissao(missao, ativo)} desabilitado={contexto.salvando || !missao.runtimeConfigurado} />
            <button type="button" className={styles.botao_secundario} onClick={() => void contexto.abrirEditorRuntimeMissao(missao)} disabled={contexto.salvando}>Runtime</button>
            <button type="button" className={styles.botao_secundario} onClick={() => contexto.abrirEdicaoMissao(catalogo, missao)}>Editar</button>
        </article>
    );
};

function EditorCatalogo() {
    const contexto = useContexto__PaginaGameDesignerMissoesJogaveis();
    const editor = contexto.editorCatalogo;
    if (!editor) return null;

    return (
        <section className={styles.editor}>
            <label className={styles.campo}>
                <span>Nome do Catálogo</span>
                <input type="text" value={editor.nome} onChange={evento => contexto.alterarEditorCatalogoNome(evento.target.value)} maxLength={255} />
            </label>
            <div className={styles.acoes_editor}>
                <button type="button" className={styles.botao_secundario} onClick={contexto.cancelarEditorCatalogo}>Cancelar</button>
                <button type="button" className={styles.botao_principal} onClick={() => void contexto.salvarEditorCatalogo()} disabled={contexto.salvando || editor.nome.trim().length === 0}>Salvar</button>
            </div>
        </section>
    );
};

function EditorMissao() {
    const contexto = useContexto__PaginaGameDesignerMissoesJogaveis();
    const editor = contexto.editorMissao;
    if (!editor || !contexto.estrutura) return null;

    return (
        <section className={styles.editor}>
            <label className={styles.campo}>
                <span>Nome da Missão</span>
                <input type="text" value={editor.nome} onChange={evento => contexto.alterarEditorMissao({ ...editor, nome: evento.target.value })} maxLength={255} />
            </label>
            <label className={styles.campo}>
                <span>Catálogo</span>
                <select value={editor.fkCatalogosMissaoId} onChange={evento => contexto.alterarEditorMissao({ ...editor, fkCatalogosMissaoId: Number(evento.target.value) })}>
                    {contexto.estrutura.catalogos.map(catalogo => <option key={catalogo.id} value={catalogo.id}>{catalogo.nome}</option>)}
                </select>
            </label>
            <label className={styles.campo}>
                <span>Descrição</span>
                <textarea value={editor.descricao} onChange={evento => contexto.alterarEditorMissao({ ...editor, descricao: evento.target.value })} maxLength={4000} rows={5} />
            </label>
            <div className={styles.acoes_editor}>
                <button type="button" className={styles.botao_secundario} onClick={contexto.cancelarEditorMissao}>Cancelar</button>
                <button type="button" className={styles.botao_principal} onClick={() => void contexto.salvarEditorMissao()} disabled={contexto.salvando || editor.nome.trim().length === 0 || editor.descricao.trim().length === 0}>Salvar</button>
            </div>
        </section>
    );
};

