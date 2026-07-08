'use client';

import { Contexto__EditorEstrutura__Provider, EditorEstrutura__AplicaLayoutBase } from 'Contextos/Contexto__EditorEstrutura/contexto';
import { useContexto__PaginaGameDesignerEstruturaSerHumano } from 'Contextos/Contexto__PaginaGameDesignerEstruturaSerHumano/contexto';

// A página delega ao Controlador de Fluxo do EditorEstrutura (Visão Geral / Membro / Ação); persistência via callbacks do contexto da página.
export default function SPA__PaginaGameDesignerEstruturaSerHumano() {
    const { editor, carregando, salvando, podeSalvar, salvar, layoutBase } = useContexto__PaginaGameDesignerEstruturaSerHumano();

    if (carregando) return <><EditorEstrutura__AplicaLayoutBase layoutBase={layoutBase} /><p>Carregando estrutura humana...</p></>;

    return <Contexto__EditorEstrutura__Provider editor={editor} salvando={salvando} podeSalvar={podeSalvar} salvar={salvar} layoutBase={layoutBase} />;
};
