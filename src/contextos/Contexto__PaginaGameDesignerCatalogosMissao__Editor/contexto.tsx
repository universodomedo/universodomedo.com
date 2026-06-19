'use client';

import { createContext, useContext } from 'react';
import { EventosApiRest, type PAYLOAD__CriarCatalogoMissao, type PAYLOAD__EditarCatalogoMissao } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerCatalogosMissao__Props } from '../Contexto__PaginaGameDesignerCatalogosMissao/contexto';
import SPA__PaginaGameDesignerCatalogosMissao__Editor from 'Conteineres/PaginaGameDesignerCatalogosMissao/paginas/SPA__PaginaGameDesignerCatalogosMissao__Editor/SPA__PaginaGameDesignerCatalogosMissao__Editor';

type FormularioCatalogoMissao = {
    readonly nome: string;
};

type PropsProvider = {
    catalogoEmEdicao: Contexto__PaginaGameDesignerCatalogosMissao__Props['catalogoEmEdicao'];
    voltarParaListagem: Contexto__PaginaGameDesignerCatalogosMissao__Props['voltarParaListagem'];
    concluiSalvamento: Contexto__PaginaGameDesignerCatalogosMissao__Props['concluiSalvamento'];
};

interface Contexto__PaginaGameDesignerCatalogosMissao__Editor__Props {
    formularioCatalogoMissao: FormularioCreateEstado<FormularioCatalogoMissao>;
    estaEditando: boolean;
    voltarParaListagem: () => void;
};

const Contexto__PaginaGameDesignerCatalogosMissao__Editor = createContext<Contexto__PaginaGameDesignerCatalogosMissao__Editor__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCatalogosMissao__Editor = (): Contexto__PaginaGameDesignerCatalogosMissao__Editor__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCatalogosMissao__Editor);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCatalogosMissao__Editor precisa estar dentro de um Contexto__PaginaGameDesignerCatalogosMissao__Editor');
    return context;
};

export const Contexto__PaginaGameDesignerCatalogosMissao__Editor__Provider = ({ catalogoEmEdicao, voltarParaListagem, concluiSalvamento }: PropsProvider) => {
    const estaEditando = catalogoEmEdicao !== null;
    useConfigurarLayoutContextualizado({ subtitulo: estaEditando ? 'Editar Catálogo de Missão' : 'Novo Catálogo de Missão', fecharProps: { tipo: 'acao', executar: voltarParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    const formularioCatalogoMissao = useFormularioCatalogoMissao(catalogoEmEdicao, concluiSalvamento);

    return (
        <Contexto__PaginaGameDesignerCatalogosMissao__Editor.Provider value={{ formularioCatalogoMissao, estaEditando, voltarParaListagem }}>
            <SPA__PaginaGameDesignerCatalogosMissao__Editor />
        </Contexto__PaginaGameDesignerCatalogosMissao__Editor.Provider>
    );
};

function useFormularioCatalogoMissao(catalogoEmEdicao: PropsProvider['catalogoEmEdicao'], concluiSalvamento: () => void): FormularioCreateEstado<FormularioCatalogoMissao> {
    const definicao = defineFormularioCreate<FormularioCatalogoMissao>({
        valoresIniciais: { nome: catalogoEmEdicao?.nome ?? '' },
        campos: {
            nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 255, placeholder: 'Ex: Missões Funcionais' },
        },
    });

    return useFormularioCreate(definicao, async valores => {
        if (catalogoEmEdicao) {
            const payload: PAYLOAD__EditarCatalogoMissao = { id: catalogoEmEdicao.id, nome: valores.nome };
            await NoraApi.RestPOST(EventosApiRest.POST.CatalogosMissao.editar, payload, { mensagemErro: 'Não foi possível editar o Catálogo de Missão.' });
        } else {
            const payload: PAYLOAD__CriarCatalogoMissao = { nome: valores.nome };
            await NoraApi.RestPOST(EventosApiRest.POST.CatalogosMissao.criar, payload, { mensagemErro: 'Não foi possível criar o Catálogo de Missão.' });
        }

        concluiSalvamento();
    });
};