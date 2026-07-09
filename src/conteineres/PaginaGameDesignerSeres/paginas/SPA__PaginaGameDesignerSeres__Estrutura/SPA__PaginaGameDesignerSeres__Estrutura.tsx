'use client';

import { Contexto__EditorEstrutura__Provider } from 'Contextos/Contexto__EditorEstrutura/contexto';
import { useContexto__PaginaGameDesignerSeres__Estrutura } from 'Contextos/Contexto__PaginaGameDesignerSeres__Estrutura/contexto';

// O subfluxo delega ao Controlador de Fluxo do EditorEstrutura (Visão Geral / Membro / Ação); persistência via callbacks do contexto do subfluxo.
export default function SPA__PaginaGameDesignerSeres__Estrutura() {
    const { editor, carregando, erro, salvando, podeSalvar, salvar } = useContexto__PaginaGameDesignerSeres__Estrutura();

    if (carregando) return <p>Carregando estrutura própria do Ser...</p>;
    if (erro) return <p>{erro}</p>;

    return <Contexto__EditorEstrutura__Provider editor={editor} salvando={salvando} podeSalvar={podeSalvar} salvar={salvar} />;
};
