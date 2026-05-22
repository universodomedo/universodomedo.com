'use client';

import { createContext, useContext } from 'react';
import { DTO__CREATE__Emblema } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorEmblemas__Props } from '../Contexto__PaginaModeradorEmblemas/contexto';
import SPA__PaginaModeradorEmblemas__NovoEmblema from 'Conteineres/PaginaModeradorEmblemas/paginas/SPA__PaginaModeradorEmblemas__NovoEmblema/SPA__PaginaModeradorEmblemas__NovoEmblema';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { criaEmblema } from 'Uteis/ApiConsumer/ConsumerMiddleware';

const FORMULARIO_CREATE_EMBLEMA = defineFormularioCreate<DTO__CREATE__Emblema>({
    valoresIniciais: {
        nome: '',
        nomeVisual: null,
        descricao: '',
    },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, maxLength: 120, placeholder: 'Ex: Guardião do Véu' },
        nomeVisual: { tipo: 'text', label: 'Nome Visual', nullable: true, maxLength: 180, placeholder: 'Ex: Guardião do Véu Ancestral' },
        descricao: { tipo: 'textarea', label: 'Descrição', obrigatorio: true, maxLength: 2000, placeholder: 'Descreva o significado, uso ou contexto do emblema.' },
    },
});

interface Contexto__PaginaModeradorEmblemas__NovoEmblema__Props {
    formularioNovoEmblema: FormularioCreateEstado<DTO__CREATE__Emblema>;
};

const Contexto__PaginaModeradorEmblemas__NovoEmblema = createContext<Contexto__PaginaModeradorEmblemas__NovoEmblema__Props | undefined>(undefined);

export const useContexto__PaginaModeradorEmblemas__NovoEmblema = (): Contexto__PaginaModeradorEmblemas__NovoEmblema__Props => {
    const context = useContext(Contexto__PaginaModeradorEmblemas__NovoEmblema);
    if (!context) throw new Error('useContexto__PaginaModeradorEmblemas__NovoEmblema precisa estar dentro de um Contexto__PaginaModeradorEmblemas__NovoEmblema');
    return context;
};

export const Contexto__PaginaModeradorEmblemas__NovoEmblema__Provider = ({ setEstaEmProcessoCriacao }: { setEstaEmProcessoCriacao: Contexto__PaginaModeradorEmblemas__Props['setEstaEmProcessoCriacao']; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Criando novo registro', fecharProps: { tipo: 'acao', executar: () => setEstaEmProcessoCriacao(false), tituloTooltip: 'Voltar para Listagem' } });

    const formularioNovoEmblema = useFormularioNovoEmblema();

    return (
        <Contexto__PaginaModeradorEmblemas__NovoEmblema.Provider value={{ formularioNovoEmblema }}>
            <SPA__PaginaModeradorEmblemas__NovoEmblema />
        </Contexto__PaginaModeradorEmblemas__NovoEmblema.Provider>
    );
};

function useFormularioNovoEmblema(): FormularioCreateEstado<DTO__CREATE__Emblema> {
    return useFormularioCreate(FORMULARIO_CREATE_EMBLEMA, async payload => {
        await criaEmblema(payload);
    });
};