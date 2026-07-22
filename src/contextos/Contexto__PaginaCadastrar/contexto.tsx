'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PAYLOAD__CadastrarAcesso } from 'types-nora-api';

import { cadastrarAcesso } from 'Funcionalidades/Acessos/acessos.api';

export type EtapaCadastro = 'FORMULARIO' | 'EMAIL_ENVIADO';

export interface Contexto__PaginaCadastrar__Props {
    etapa: EtapaCadastro;
    emailEnviadoPara: string | null;
    aoCadastrar: (payload: PAYLOAD__CadastrarAcesso) => Promise<void>;
};

const Contexto__PaginaCadastrar = createContext<Contexto__PaginaCadastrar__Props | undefined>(undefined);

export const useContexto__PaginaCadastrar = (): Contexto__PaginaCadastrar__Props => {
    const context = useContext(Contexto__PaginaCadastrar);
    if (!context) throw new Error('useContexto__PaginaCadastrar precisa estar dentro de um Contexto__PaginaCadastrar');
    return context;
};

export const Contexto__PaginaCadastrar__Provider = ({ children }: { children: ReactNode }) => {
    const [etapa, setEtapa] = useState<EtapaCadastro>('FORMULARIO');
    const [emailEnviadoPara, setEmailEnviadoPara] = useState<string | null>(null);

    async function aoCadastrar(payload: PAYLOAD__CadastrarAcesso): Promise<void> {
        const resposta = await cadastrarAcesso(payload);
        setEmailEnviadoPara(resposta.email);
        setEtapa('EMAIL_ENVIADO');
    };

    return (
        <Contexto__PaginaCadastrar.Provider value={{ etapa, emailEnviadoPara, aoCadastrar }}>
            {children}
        </Contexto__PaginaCadastrar.Provider>
    );
};