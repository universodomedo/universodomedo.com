'use client';

import { createContext, useContext, useEffect } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaAssinaturaArtista__Edicao from 'Conteineres/PaginaAssinaturaArtista/paginas/SPA__PaginaAssinaturaArtista__Edicao/SPA__PaginaAssinaturaArtista__Edicao';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import type { AssinaturaArtistaPersistida, FonteAssinaturaArtista, PAYLOAD__SalvarAssinaturaArtista } from 'types-nora-api';

type DTO__SalvarAssinatura = {
    readonly texto: string;
    readonly fonte: FonteAssinaturaArtista;
};

// A fonte é um select (useFormularioCreate só tem text/textarea/checkbox); aqui ela é um campo 'text' validado como obrigatório e controlado por setCampo + <select>.
const FORMULARIO_ASSINATURA = defineFormularioCreate<DTO__SalvarAssinatura>({
    valoresIniciais: { texto: '', fonte: 'GREAT_VIBES' },
    campos: {
        texto: { tipo: 'text', label: 'Texto da assinatura', obrigatorio: true, maxLength: 80, placeholder: 'Seu nome / assinatura' },
        fonte: { tipo: 'text', label: 'Fonte', obrigatorio: true },
    },
});

interface Contexto__PaginaAssinaturaArtista__Edicao__Props {
    formularioAssinatura: FormularioCreateEstado<DTO__SalvarAssinatura>;
    carregando: boolean;
};

const Contexto__PaginaAssinaturaArtista__Edicao = createContext<Contexto__PaginaAssinaturaArtista__Edicao__Props | undefined>(undefined);

export const useContexto__PaginaAssinaturaArtista__Edicao = (): Contexto__PaginaAssinaturaArtista__Edicao__Props => {
    const context = useContext(Contexto__PaginaAssinaturaArtista__Edicao);
    if (!context) throw new Error('useContexto__PaginaAssinaturaArtista__Edicao precisa estar dentro de um Contexto__PaginaAssinaturaArtista__Edicao');
    return context;
};

export const Contexto__PaginaAssinaturaArtista__Edicao__Provider = ({ assinaturaAtual, carregando, aoSalvar }: { assinaturaAtual: AssinaturaArtistaPersistida | null; carregando: boolean; aoSalvar: (payload: PAYLOAD__SalvarAssinaturaArtista) => Promise<void>; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Texto e fonte da sua assinatura digital' });

    const formularioAssinatura = useFormularioAssinatura(assinaturaAtual, aoSalvar);

    return (
        <Contexto__PaginaAssinaturaArtista__Edicao.Provider value={{ formularioAssinatura, carregando }}>
            <SPA__PaginaAssinaturaArtista__Edicao />
        </Contexto__PaginaAssinaturaArtista__Edicao.Provider>
    );
};

function useFormularioAssinatura(assinaturaAtual: AssinaturaArtistaPersistida | null, aoSalvar: (payload: PAYLOAD__SalvarAssinaturaArtista) => Promise<void>): FormularioCreateEstado<DTO__SalvarAssinatura> {
    const formulario = useFormularioCreate(FORMULARIO_ASSINATURA, async payload => { await aoSalvar(payload); });

    // Pré-preenche com a assinatura já cadastrada quando ela carrega.
    useEffect(() => {
        if (assinaturaAtual === null) return;
        formulario.setCampo('texto', assinaturaAtual.texto);
        formulario.setCampo('fonte', assinaturaAtual.fonte);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assinaturaAtual]);

    return formulario;
};
