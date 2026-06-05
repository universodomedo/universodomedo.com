'use client';

import { createContext, useContext } from 'react';
import type { DTO__CREATE__CapacidadeInata } from 'types-nora-api';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaCapacidadeInata } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { Contexto__PaginaModeradorCapacidadesInatas__Props } from '../Contexto__PaginaModeradorCapacidadesInatas/contexto';
import SPA__PaginaModeradorCapacidadesInatas__Cadastro from 'Conteineres/PaginaModeradorCapacidadesInatas/paginas/SPA__PaginaModeradorCapacidadesInatas__Cadastro/SPA__PaginaModeradorCapacidadesInatas__Cadastro';

type FormularioNovaCapacidadeInata = DTO__CREATE__CapacidadeInata;

const FORMULARIO_CREATE_CAPACIDADE_INATA = defineFormularioCreate<FormularioNovaCapacidadeInata>({
    valoresIniciais: { nome: '' },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Ex: Faro apurado' },
    },
});

interface Contexto__PaginaModeradorCapacidadesInatas__Cadastro__Props {
    formularioNovaCapacidadeInata: FormularioCreateEstado<FormularioNovaCapacidadeInata>;
    salvar: () => Promise<void>;
};

type PropsProvider = {
    cancelaCadastro: Contexto__PaginaModeradorCapacidadesInatas__Props['cancelaCadastro'];
    concluiCadastro: Contexto__PaginaModeradorCapacidadesInatas__Props['concluiCadastro'];
};

const Contexto__PaginaModeradorCapacidadesInatas__Cadastro = createContext<Contexto__PaginaModeradorCapacidadesInatas__Cadastro__Props | undefined>(undefined);

export const useContexto__PaginaModeradorCapacidadesInatas__Cadastro = (): Contexto__PaginaModeradorCapacidadesInatas__Cadastro__Props => {
    const context = useContext(Contexto__PaginaModeradorCapacidadesInatas__Cadastro);
    if (!context) throw new Error('useContexto__PaginaModeradorCapacidadesInatas__Cadastro precisa estar dentro de um Contexto__PaginaModeradorCapacidadesInatas__Cadastro');
    return context;
};

export const Contexto__PaginaModeradorCapacidadesInatas__Cadastro__Provider = ({ cancelaCadastro, concluiCadastro }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Nova Capacidade Inata', fecharProps: { tipo: 'acao', executar: cancelaCadastro, tituloTooltip: 'Voltar para Listagem' } });

    const formularioNovaCapacidadeInata = useFormularioCreate(FORMULARIO_CREATE_CAPACIDADE_INATA, async payload => {
        await criaCapacidadeInata(payload);
        concluiCadastro();
    });

    async function salvar(): Promise<void> { await formularioNovaCapacidadeInata.salvar(); };

    return (
        <Contexto__PaginaModeradorCapacidadesInatas__Cadastro.Provider value={{ formularioNovaCapacidadeInata, salvar }}>
            <SPA__PaginaModeradorCapacidadesInatas__Cadastro />
        </Contexto__PaginaModeradorCapacidadesInatas__Cadastro.Provider>
    );
};