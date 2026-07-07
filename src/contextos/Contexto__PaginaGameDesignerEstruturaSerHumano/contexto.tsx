'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { EventosApiRest } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { useEditorEstruturaMembros } from 'Componentes/EditorMembros/useEditorEstruturaMembros';

interface Contexto__PaginaGameDesignerEstruturaSerHumano__Props {
    editor: ReturnType<typeof useEditorEstruturaMembros>;
    carregando: boolean;
    salvando: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
};

const Contexto__PaginaGameDesignerEstruturaSerHumano = createContext<Contexto__PaginaGameDesignerEstruturaSerHumano__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerEstruturaSerHumano = (): Contexto__PaginaGameDesignerEstruturaSerHumano__Props => {
    const context = useContext(Contexto__PaginaGameDesignerEstruturaSerHumano);
    if (!context) throw new Error('useContexto__PaginaGameDesignerEstruturaSerHumano precisa estar dentro de um Contexto__PaginaGameDesignerEstruturaSerHumano');
    return context;
};

export const Contexto__PaginaGameDesignerEstruturaSerHumano__Provider = ({ children }: { children: ReactNode; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Estrutura Humana', fecharProps: undefined });

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
        <Contexto__PaginaGameDesignerEstruturaSerHumano.Provider value={{ editor, carregando, salvando, podeSalvar, salvar }}>
            {children}
        </Contexto__PaginaGameDesignerEstruturaSerHumano.Provider>
    );
};
