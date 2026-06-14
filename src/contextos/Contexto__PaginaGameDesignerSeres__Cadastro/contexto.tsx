'use client';

import { createContext, useContext } from 'react';
import { EventosApiRest, TIPOS_SER, type PAYLOAD__CriarSerRegistroComDetalhe } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerSeres__Props } from '../Contexto__PaginaGameDesignerSeres/contexto';
import SPA__PaginaGameDesignerSeres__Cadastro from 'Conteineres/PaginaGameDesignerSeres/paginas/SPA__PaginaGameDesignerSeres__Cadastro/SPA__PaginaGameDesignerSeres__Cadastro';

type FormularioNovoSer = {
    readonly idTipoSer: string;
    readonly nome: string;
};

const FORMULARIO_CREATE_SER_REGISTRO = defineFormularioCreate<FormularioNovoSer>({
    valoresIniciais: { idTipoSer: String(TIPOS_SER.SER_UNICO.id), nome: '' },
    campos: {
        idTipoSer: { tipo: 'text', label: 'Tipo Ser', obrigatorio: true },
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Ex: Investigador Sem Nome' },
    },
});

interface Contexto__PaginaGameDesignerSeres__Cadastro__Props {
    formularioNovoSer: FormularioCreateEstado<FormularioNovoSer>;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    cancelaCadastro: Contexto__PaginaGameDesignerSeres__Props['voltaParaListagem'];
    concluiCadastro: Contexto__PaginaGameDesignerSeres__Props['concluiCadastro'];
};

const Contexto__PaginaGameDesignerSeres__Cadastro = createContext<Contexto__PaginaGameDesignerSeres__Cadastro__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerSeres__Cadastro = (): Contexto__PaginaGameDesignerSeres__Cadastro__Props => {
    const context = useContext(Contexto__PaginaGameDesignerSeres__Cadastro);
    if (!context) throw new Error('useContexto__PaginaGameDesignerSeres__Cadastro precisa estar dentro de um Contexto__PaginaGameDesignerSeres__Cadastro');
    return context;
};

export const Contexto__PaginaGameDesignerSeres__Cadastro__Provider = ({ cancelaCadastro, concluiCadastro }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Novo Ser', fecharProps: { tipo: 'acao', executar: cancelaCadastro, tituloTooltip: 'Voltar para Listagem' } });

    const formularioNovoSer = useFormularioCreate(FORMULARIO_CREATE_SER_REGISTRO, async valores => {
        const payload: PAYLOAD__CriarSerRegistroComDetalhe = { idTipoSer: Number(valores.idTipoSer), nome: valores.nome };
        await NoraApi.RestPOST(EventosApiRest.POST.SerRegistro.criarComDetalhe, payload, { mensagemErro: 'Não foi possível criar o Ser.' });
        concluiCadastro();
    });

    async function salvar(): Promise<void> { await formularioNovoSer.salvar(); };

    return (
        <Contexto__PaginaGameDesignerSeres__Cadastro.Provider value={{ formularioNovoSer, salvar }}>
            <SPA__PaginaGameDesignerSeres__Cadastro />
        </Contexto__PaginaGameDesignerSeres__Cadastro.Provider>
    );
};
