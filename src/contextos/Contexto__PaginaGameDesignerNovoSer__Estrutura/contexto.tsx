'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { EventosApiRest } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useEditorEstruturaMembros } from 'Componentes/EditorMembros/useEditorEstruturaMembros';
import type { LayoutBaseEditorEstrutura } from 'Contextos/Contexto__EditorEstrutura/contexto';
import SPA__PaginaGameDesignerNovoSer__Estrutura from 'Conteineres/PaginaGameDesignerNovoSer/paginas/SPA__PaginaGameDesignerNovoSer__Estrutura/SPA__PaginaGameDesignerNovoSer__Estrutura';

interface Contexto__PaginaGameDesignerNovoSer__Estrutura__Props {
    editor: ReturnType<typeof useEditorEstruturaMembros>;
    carregando: boolean;
    erro: string | null;
    salvando: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
    layoutBase: LayoutBaseEditorEstrutura;
};

type PropsProvider = {
    idSer: number;
    voltar: () => void;
};

const Contexto__PaginaGameDesignerNovoSer__Estrutura = createContext<Contexto__PaginaGameDesignerNovoSer__Estrutura__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerNovoSer__Estrutura = (): Contexto__PaginaGameDesignerNovoSer__Estrutura__Props => {
    const context = useContext(Contexto__PaginaGameDesignerNovoSer__Estrutura);
    if (!context) throw new Error('useContexto__PaginaGameDesignerNovoSer__Estrutura precisa estar dentro de um Contexto__PaginaGameDesignerNovoSer__Estrutura');
    return context;
};

// Subfluxo Estrutura própria do jogável NÃO-HUMANO (por Ser): mesmo Controlador de Fluxo do EditorEstrutura da estrutura humana, contra o jsonb próprio do Ser.
// Humano usa a estrutura da espécie (página estrutura-ser-humano); clicar num humano/não-jogável cai no erro orientativo do backend.
export const Contexto__PaginaGameDesignerNovoSer__Estrutura__Provider = ({ idSer, voltar }: PropsProvider) => {
    const editor = useEditorEstruturaMembros();
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    const carregar = editor.carregar;

    // Layout base do subfluxo: o Controlador do EditorEstrutura é o dono do layout por subvista e compõe a partir daqui.
    const layoutBase: LayoutBaseEditorEstrutura = { subtitulo: `Estrutura própria · Ser #${idSer}`, fecharProps: { tipo: 'acao', executar: voltar, tituloTooltip: 'Voltar para Listagem' } };

    useEffect(() => {
        let ativo = true;

        async function carrega(): Promise<void> {
            try {
                const dados = await NoraApi.RestGET(EventosApiRest.GET.EstruturaNaoHumano.obter, { id: idSer }, { mensagemErro: 'Não foi possível carregar a estrutura própria do Ser.' });
                if (ativo) carregar(dados.membros);
            } catch {
                if (ativo) setErro('Este Ser não possui estrutura própria (humano usa a estrutura da espécie; não jogável não possui estrutura).');
            } finally {
                if (ativo) setCarregando(false);
            }
        };

        void carrega();

        return () => { ativo = false; };
    }, [carregar, idSer]);

    const podeSalvar = erro === null && editor.valido && !salvando;

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;
        setSalvando(true);

        try {
            const dados = await NoraApi.RestPOST(EventosApiRest.POST.EstruturaNaoHumano.salvar, { idSer, membros: editor.montaInput() }, { mensagemErro: 'Não foi possível salvar a estrutura própria do Ser.' });
            editor.carregar(dados.membros);
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Contexto__PaginaGameDesignerNovoSer__Estrutura.Provider value={{ editor, carregando, erro, salvando, podeSalvar, salvar, layoutBase }}>
            <SPA__PaginaGameDesignerNovoSer__Estrutura />
        </Contexto__PaginaGameDesignerNovoSer__Estrutura.Provider>
    );
};
