'use client';

import { createContext, useContext } from 'react';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerCatalogosPartida__Props } from '../Contexto__PaginaGameDesignerCatalogosPartida/contexto';
import SPA__PaginaGameDesignerCatalogosPartida__Nova from 'Conteineres/PaginaGameDesignerCatalogosPartida/paginas/SPA__PaginaGameDesignerCatalogosPartida__Nova/SPA__PaginaGameDesignerCatalogosPartida__Nova';

type FormularioNovoCatalogo = {
    readonly nome: string;
};

const FORMULARIO_CREATE_CATALOGO = defineFormularioCreate<FormularioNovoCatalogo>({
    valoresIniciais: { nome: '' },
    campos: {
        nome: { tipo: 'text', label: 'Nome do Catálogo', obrigatorio: true, maxLength: 120, placeholder: 'Ex: Missões Funcionais' },
    },
});

interface Contexto__PaginaGameDesignerCatalogosPartida__Nova__Props {
    formularioNovoCatalogo: FormularioCreateEstado<FormularioNovoCatalogo>;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    criarCatalogo: Contexto__PaginaGameDesignerCatalogosPartida__Props['criarCatalogo'];
    cancelar: Contexto__PaginaGameDesignerCatalogosPartida__Props['voltaParaListagem'];
    concluir: Contexto__PaginaGameDesignerCatalogosPartida__Props['concluiCadastro'];
};

const Contexto__PaginaGameDesignerCatalogosPartida__Nova = createContext<Contexto__PaginaGameDesignerCatalogosPartida__Nova__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCatalogosPartida__Nova = (): Contexto__PaginaGameDesignerCatalogosPartida__Nova__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCatalogosPartida__Nova);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCatalogosPartida__Nova precisa estar dentro de um Contexto__PaginaGameDesignerCatalogosPartida__Nova');
    return context;
};

export const Contexto__PaginaGameDesignerCatalogosPartida__Nova__Provider = ({ criarCatalogo, cancelar, concluir }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ titulo: 'Novo Catálogo', fecharProps: { tipo: 'acao', executar: cancelar, tituloTooltip: 'Voltar para Listagem' } });

    const formularioNovoCatalogo = useFormularioCreate(FORMULARIO_CREATE_CATALOGO, async valores => {
        await criarCatalogo(valores.nome);
        concluir();
    });

    const podeSalvar = formularioNovoCatalogo.podeSalvar;

    async function salvar(): Promise<void> { if (podeSalvar) await formularioNovoCatalogo.salvar(); };

    return (
        <Contexto__PaginaGameDesignerCatalogosPartida__Nova.Provider value={{ formularioNovoCatalogo, podeSalvar, salvar }}>
            <SPA__PaginaGameDesignerCatalogosPartida__Nova />
        </Contexto__PaginaGameDesignerCatalogosPartida__Nova.Provider>
    );
};
