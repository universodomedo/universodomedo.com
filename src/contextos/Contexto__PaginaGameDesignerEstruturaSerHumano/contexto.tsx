'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { EventosApiRest, PAGINAS } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useEditorEstruturaMembros } from 'Componentes/EditorMembros/useEditorEstruturaMembros';
import type { LayoutBaseEditorEstrutura } from 'Contextos/Contexto__EditorEstrutura/contexto';

interface Contexto__PaginaGameDesignerEstruturaSerHumano__Props {
    editor: ReturnType<typeof useEditorEstruturaMembros>;
    carregando: boolean;
    salvando: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
    layoutBase: LayoutBaseEditorEstrutura;
};

const Contexto__PaginaGameDesignerEstruturaSerHumano = createContext<Contexto__PaginaGameDesignerEstruturaSerHumano__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerEstruturaSerHumano = (): Contexto__PaginaGameDesignerEstruturaSerHumano__Props => {
    const context = useContext(Contexto__PaginaGameDesignerEstruturaSerHumano);
    if (!context) throw new Error('useContexto__PaginaGameDesignerEstruturaSerHumano precisa estar dentro de um Contexto__PaginaGameDesignerEstruturaSerHumano');
    return context;
};

// Layout base da página (título estável vem da PAGINA): o Controlador de Fluxo do EditorEstrutura é o dono do layout por subvista e compõe a partir daqui.
const LAYOUT_BASE_ESTRUTURA_HUMANA: LayoutBaseEditorEstrutura = { subtitulo: 'Referência viva da espécie', fecharProps: { tipo: 'href', paginaRetorno: PAGINAS.minhasPaginas.gameDesigner, tituloTooltip: 'Voltar para Página de Game Designer' } };

export const Contexto__PaginaGameDesignerEstruturaSerHumano__Provider = ({ children }: { children: ReactNode; }) => {
    const editor = useEditorEstruturaMembros();
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const carregar = editor.carregar;

    useEffect(() => {
        let ativo = true;

        async function carrega(): Promise<void> {
            try {
                const dados = await NoraApi.RestGET(EventosApiRest.GET.EstruturaSerHumano.obter, {}, { mensagemErro: 'Não foi possível carregar a estrutura humana.' });
                if (ativo) carregar(dados.membros);
            } catch {
                if (ativo) carregar([]);
            } finally {
                if (ativo) setCarregando(false);
            }
        };

        void carrega();

        return () => { ativo = false; };
    }, [carregar]);

    const podeSalvar = editor.valido && !salvando;

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;
        setSalvando(true);

        try {
            const dados = await NoraApi.RestPOST(EventosApiRest.POST.EstruturaSerHumano.salvar, { membros: editor.montaInput() }, { mensagemErro: 'Não foi possível salvar a estrutura humana.' });
            editor.carregar(dados.membros);
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Contexto__PaginaGameDesignerEstruturaSerHumano.Provider value={{ editor, carregando, salvando, podeSalvar, salvar, layoutBase: LAYOUT_BASE_ESTRUTURA_HUMANA }}>
            {children}
        </Contexto__PaginaGameDesignerEstruturaSerHumano.Provider>
    );
};
