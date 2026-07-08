'use client';

import { Contexto__EditorEstrutura__Provider, EditorEstrutura__AplicaLayoutBase } from 'Contextos/Contexto__EditorEstrutura/contexto';
import { useContexto__PaginaGameDesignerNovoSer__Estrutura } from 'Contextos/Contexto__PaginaGameDesignerNovoSer__Estrutura/contexto';

// O subfluxo delega ao Controlador de Fluxo do EditorEstrutura (Visão Geral / Membro / Ação); persistência via callbacks do contexto do subfluxo.
export default function SPA__PaginaGameDesignerNovoSer__Estrutura() {
    const { editor, carregando, erro, salvando, podeSalvar, salvar, layoutBase } = useContexto__PaginaGameDesignerNovoSer__Estrutura();

    if (carregando) return <><EditorEstrutura__AplicaLayoutBase layoutBase={layoutBase} /><p>Carregando estrutura própria do Ser...</p></>;
    if (erro) return <><EditorEstrutura__AplicaLayoutBase layoutBase={layoutBase} /><p>{erro}</p></>;

    return <Contexto__EditorEstrutura__Provider editor={editor} salvando={salvando} podeSalvar={podeSalvar} salvar={salvar} layoutBase={layoutBase} />;
};
