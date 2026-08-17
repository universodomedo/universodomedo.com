'use client';

import { createContext, useContext } from 'react';
import type { PAYLOAD__CriarRoteiroEditor3D } from 'types-nora-api';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import SPA__PaginaColaboradorRoteirosEditor3D__Cadastro from 'Conteineres/PaginaColaboradorRoteirosEditor3D/paginas/SPA__PaginaColaboradorRoteirosEditor3D__Cadastro/SPA__PaginaColaboradorRoteirosEditor3D__Cadastro';

type FormularioNovoRoteiro = PAYLOAD__CriarRoteiroEditor3D;

const FORMULARIO_CREATE_ROTEIRO = defineFormularioCreate<FormularioNovoRoteiro>({
    valoresIniciais: { nome: '', objetivo: '' },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Ex.: Cômodo fechado — 6 superfícies' },
        objetivo: { tipo: 'textarea', label: 'Objetivo', obrigatorio: true, maxLength: 2000, placeholder: 'O que este roteiro prova quando executa até o fim' },
    },
});

interface Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro__Props {
    formularioNovoRoteiro: FormularioCreateEstado<FormularioNovoRoteiro>;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    criarRoteiro: (nome: string, objetivo: string) => Promise<void>;
};

const Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro = createContext<Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorRoteirosEditor3D__Cadastro = (): Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro__Props => {
    const context = useContext(Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro);
    if (!context) throw new Error('useContexto__PaginaColaboradorRoteirosEditor3D__Cadastro precisa estar dentro de um Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro');
    return context;
};

// Layout contextual (subtítulo/fecharProps) é dirigido pelo contexto geral (dono único); este subfluxo só apresenta.
export const Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro__Provider = ({ criarRoteiro }: PropsProvider) => {
    const formularioNovoRoteiro = useFormularioCreate(FORMULARIO_CREATE_ROTEIRO, async payload => {
        await criarRoteiro(payload.nome, payload.objetivo);
    });

    async function salvar(): Promise<void> { await formularioNovoRoteiro.salvar(); };

    return (
        <Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro.Provider value={{ formularioNovoRoteiro, salvar }}>
            <SPA__PaginaColaboradorRoteirosEditor3D__Cadastro />
        </Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro.Provider>
    );
};