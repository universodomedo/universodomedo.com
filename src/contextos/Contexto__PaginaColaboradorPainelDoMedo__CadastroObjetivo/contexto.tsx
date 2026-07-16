'use client';

import { createContext, useContext } from 'react';
import type { PAYLOAD__CriarObjetivo } from 'types-nora-api';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__CadastroObjetivo from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__CadastroObjetivo/SPA__PaginaColaboradorPainelDoMedo__CadastroObjetivo';

type FormularioNovoObjetivo = PAYLOAD__CriarObjetivo;

const FORMULARIO_CREATE_OBJETIVO = defineFormularioCreate<FormularioNovoObjetivo>({
    valoresIniciais: { nome: '' },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Ex.: Modelos 3D em Sala de Jogo' },
    },
});

interface Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo__Props {
    formularioNovoObjetivo: FormularioCreateEstado<FormularioNovoObjetivo>;
    salvar: () => Promise<void>;
    cancelar: () => void;
};

const Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo = createContext<Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo = (): Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo precisa estar dentro de um Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo');
    return context;
};

// Layout contextual (subtitulo/fecharProps) e dirigido pelo contexto geral (dono unico); este subfluxo so apresenta.
export const Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo__Provider = () => {
    const { criaObjetivo, irParaListagem } = useContexto__PaginaColaboradorPainelDoMedo();

    const formularioNovoObjetivo = useFormularioCreate(FORMULARIO_CREATE_OBJETIVO, async payload => {
        await criaObjetivo(payload.nome);
        irParaListagem();
    });

    async function salvar(): Promise<void> { await formularioNovoObjetivo.salvar(); };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo.Provider value={{ formularioNovoObjetivo, salvar, cancelar: irParaListagem }}>
            <SPA__PaginaColaboradorPainelDoMedo__CadastroObjetivo />
        </Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo.Provider>
    );
};
