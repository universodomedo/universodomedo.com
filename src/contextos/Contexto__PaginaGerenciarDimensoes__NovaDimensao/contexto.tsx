'use client';

import { createContext, useContext, useState } from 'react';
import type { DTO__CREATE__DimensaoClima } from 'types-nora-api';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaDimensaoClima } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { Contexto__PaginaGerenciarDimensoes__Props } from '../Contexto__PaginaGerenciarDimensoes/contexto';
import SPA__PaginaGerenciarDimensoes__NovaDimensao from 'Conteineres/PaginaGerenciarDimensoes/paginas/SPA__PaginaGerenciarDimensoes__NovaDimensao/SPA__PaginaGerenciarDimensoes__NovaDimensao';

type FormularioNovaDimensao = Pick<DTO__CREATE__DimensaoClima, 'nome' | 'rotuloOposto'>;

const FORMULARIO_CREATE_DIMENSAO = defineFormularioCreate<FormularioNovaDimensao>({
    valoresIniciais: { nome: '', rotuloOposto: null },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 80, placeholder: 'Ex.: Desespero, Gore, Tensão' },
        rotuloOposto: { tipo: 'text', label: 'Oposto', nullable: true, maxLength: 80, placeholder: 'Ex.: Tranquilidade' },
    },
});

interface Contexto__PaginaGerenciarDimensoes__NovaDimensao__Props {
    formularioNovaDimensao: FormularioCreateEstado<FormularioNovaDimensao>;
    erro: string | null;
};

type PropsProvider = {
    cancelaCriacao: Contexto__PaginaGerenciarDimensoes__Props['cancelaCriacao'];
    concluiCriacao: Contexto__PaginaGerenciarDimensoes__Props['concluiCriacao'];
};

const Contexto__PaginaGerenciarDimensoes__NovaDimensao = createContext<Contexto__PaginaGerenciarDimensoes__NovaDimensao__Props | undefined>(undefined);

export const useContexto__PaginaGerenciarDimensoes__NovaDimensao = (): Contexto__PaginaGerenciarDimensoes__NovaDimensao__Props => {
    const context = useContext(Contexto__PaginaGerenciarDimensoes__NovaDimensao);
    if (!context) throw new Error('useContexto__PaginaGerenciarDimensoes__NovaDimensao precisa estar dentro de um Contexto__PaginaGerenciarDimensoes__NovaDimensao');
    return context;
};

export const Contexto__PaginaGerenciarDimensoes__NovaDimensao__Provider = ({ cancelaCriacao, concluiCriacao }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Nova dimensão de clima', fecharProps: { tipo: 'acao', executar: cancelaCriacao, tituloTooltip: 'Voltar para o catálogo' } });

    const [erro, setErro] = useState<string | null>(null);
    const formularioNovaDimensao = useFormularioNovaDimensao(concluiCriacao, setErro);

    return (
        <Contexto__PaginaGerenciarDimensoes__NovaDimensao.Provider value={{ formularioNovaDimensao, erro }}>
            <SPA__PaginaGerenciarDimensoes__NovaDimensao />
        </Contexto__PaginaGerenciarDimensoes__NovaDimensao.Provider>
    );
};

function useFormularioNovaDimensao(concluiCriacao: () => void, setErro: (erro: string | null) => void): FormularioCreateEstado<FormularioNovaDimensao> {
    return useFormularioCreate(FORMULARIO_CREATE_DIMENSAO, async payload => {
        setErro(null);
        try {
            await criaDimensaoClima({ nome: payload.nome, bipolar: payload.rotuloOposto !== null, rotuloOposto: payload.rotuloOposto });
            concluiCriacao();
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Falha ao criar a dimensão.');
        }
    });
};
