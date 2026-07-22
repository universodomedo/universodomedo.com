'use client';

import { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { PAGINAS } from 'types-nora-api';

import SPA__PaginaCadastrar__EmailEnviado from 'Conteineres/PaginaCadastrar/paginas/SPA__PaginaCadastrar__EmailEnviado/SPA__PaginaCadastrar__EmailEnviado';

interface Contexto__PaginaCadastrar__EmailEnviado__Props {
    email: string;
    aoIrParaAcessar: () => void;
};

const Contexto__PaginaCadastrar__EmailEnviado = createContext<Contexto__PaginaCadastrar__EmailEnviado__Props | undefined>(undefined);

export const useContexto__PaginaCadastrar__EmailEnviado = (): Contexto__PaginaCadastrar__EmailEnviado__Props => {
    const context = useContext(Contexto__PaginaCadastrar__EmailEnviado);
    if (!context) throw new Error('useContexto__PaginaCadastrar__EmailEnviado precisa estar dentro de um Contexto__PaginaCadastrar__EmailEnviado');
    return context;
};

export const Contexto__PaginaCadastrar__EmailEnviado__Provider = ({ email }: { email: string }) => {
    const router = useRouter();

    const aoIrParaAcessar = () => { router.push(PAGINAS.acessar.template); };

    return (
        <Contexto__PaginaCadastrar__EmailEnviado.Provider value={{ email, aoIrParaAcessar }}>
            <SPA__PaginaCadastrar__EmailEnviado />
        </Contexto__PaginaCadastrar__EmailEnviado.Provider>
    );
};