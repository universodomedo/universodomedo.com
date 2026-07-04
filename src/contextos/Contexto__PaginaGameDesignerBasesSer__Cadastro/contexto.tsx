'use client';

import { createContext, useContext } from 'react';
import { EventosApiRest } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerBasesSer__Props } from '../Contexto__PaginaGameDesignerBasesSer/contexto';
import SPA__PaginaGameDesignerBasesSer__Cadastro from 'Conteineres/PaginaGameDesignerBasesSer/paginas/SPA__PaginaGameDesignerBasesSer__Cadastro/SPA__PaginaGameDesignerBasesSer__Cadastro';

type FormularioNovaBaseSer = {
    readonly nome: string;
    readonly descricao: string;
};

const FORMULARIO_CREATE_BASE_SER = defineFormularioCreate<FormularioNovaBaseSer>({
    valoresIniciais: { nome: '', descricao: '' },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Ex: Humano' },
        descricao: { tipo: 'text', label: 'Descrição', obrigatorio: false, maxLength: 240 },
    },
});

interface Contexto__PaginaGameDesignerBasesSer__Cadastro__Props {
    formularioNovaBase: FormularioCreateEstado<FormularioNovaBaseSer>;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    cancelaCadastro: Contexto__PaginaGameDesignerBasesSer__Props['voltaParaListagem'];
    concluiCadastro: Contexto__PaginaGameDesignerBasesSer__Props['concluiCadastro'];
};

const Contexto__PaginaGameDesignerBasesSer__Cadastro = createContext<Contexto__PaginaGameDesignerBasesSer__Cadastro__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerBasesSer__Cadastro = (): Contexto__PaginaGameDesignerBasesSer__Cadastro__Props => {
    const context = useContext(Contexto__PaginaGameDesignerBasesSer__Cadastro);
    if (!context) throw new Error('useContexto__PaginaGameDesignerBasesSer__Cadastro precisa estar dentro de um Contexto__PaginaGameDesignerBasesSer__Cadastro');
    return context;
};

export const Contexto__PaginaGameDesignerBasesSer__Cadastro__Provider = ({ cancelaCadastro, concluiCadastro }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Nova Base de Ser', fecharProps: { tipo: 'acao', executar: cancelaCadastro, tituloTooltip: 'Voltar para Listagem' } });

    const formularioNovaBase = useFormularioCreate(FORMULARIO_CREATE_BASE_SER, async valores => {
        const descricao = valores.descricao.trim().length > 0 ? valores.descricao.trim() : null;
        const criada = await NoraApi.RestPOST(EventosApiRest.POST.BasesSer.criar, { nome: valores.nome, descricao }, { mensagemErro: 'Não foi possível criar a Base de Ser.' });
        concluiCadastro(criada.id);
    });

    const podeSalvar = formularioNovaBase.podeSalvar;

    async function salvar(): Promise<void> { if (podeSalvar) await formularioNovaBase.salvar(); };

    return (
        <Contexto__PaginaGameDesignerBasesSer__Cadastro.Provider value={{ formularioNovaBase, podeSalvar, salvar }}>
            <SPA__PaginaGameDesignerBasesSer__Cadastro />
        </Contexto__PaginaGameDesignerBasesSer__Cadastro.Provider>
    );
};
