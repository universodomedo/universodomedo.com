'use client';

import { createContext, useContext, useState } from 'react';
import type { TipoDesafio, TipoPartida } from 'types-nora-api';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Props } from '../Contexto__PaginaGameDesignerConfiguracaoPartida/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Nova from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Nova/SPA__PaginaGameDesignerConfiguracaoPartida__Nova';

type FormularioNovaPartida = {
    readonly nome: string;
};

const FORMULARIO_CREATE_PARTIDA = defineFormularioCreate<FormularioNovaPartida>({
    valoresIniciais: { nome: '' },
    campos: {
        nome: { tipo: 'text', label: 'Nome da Partida', obrigatorio: true, maxLength: 255, placeholder: 'Ex: Missão Funcional 1' },
    },
});

interface Contexto__PaginaGameDesignerConfiguracaoPartida__Nova__Props {
    formularioNovaPartida: FormularioCreateEstado<FormularioNovaPartida>;
    tipo: TipoPartida;
    setTipo: (tipo: TipoPartida) => void;
    tipoDesafio: TipoDesafio;
    setTipoDesafio: (tipoDesafio: TipoDesafio) => void;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    criarPartida: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['criarPartida'];
    cancelar: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['voltaParaListagem'];
    concluir: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['concluiCadastro'];
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Nova = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Nova__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Nova = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Nova__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Nova);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Nova precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Nova');
    return context;
};

export const Contexto__PaginaGameDesignerConfiguracaoPartida__Nova__Provider = ({ criarPartida, cancelar, concluir }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Nova Partida', fecharProps: { tipo: 'acao', executar: cancelar, tituloTooltip: 'Voltar para Listagem' } });

    const [tipo, setTipo] = useState<TipoPartida>('MISSAO');
    const [tipoDesafio, setTipoDesafio] = useState<TipoDesafio>('ESPECIAL');

    const formularioNovaPartida = useFormularioCreate(FORMULARIO_CREATE_PARTIDA, async valores => {
        await criarPartida({ nome: valores.nome, tipo, tipoDesafio: tipo === 'DESAFIO' ? tipoDesafio : null });
        concluir();
    });

    const podeSalvar = formularioNovaPartida.podeSalvar;

    async function salvar(): Promise<void> { if (podeSalvar) await formularioNovaPartida.salvar(); };

    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Nova.Provider value={{ formularioNovaPartida, tipo, setTipo, tipoDesafio, setTipoDesafio, podeSalvar, salvar }}>
            <SPA__PaginaGameDesignerConfiguracaoPartida__Nova />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Nova.Provider>
    );
};
