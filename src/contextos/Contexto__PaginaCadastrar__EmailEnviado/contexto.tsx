'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PAGINAS } from 'types-nora-api';

import SPA__PaginaCadastrar__EmailEnviado from 'Conteineres/PaginaCadastrar/paginas/SPA__PaginaCadastrar__EmailEnviado/SPA__PaginaCadastrar__EmailEnviado';
import { reenviarVerificacaoAcesso } from 'Funcionalidades/Acessos/acessos.api';

interface Contexto__PaginaCadastrar__EmailEnviado__Props {
    email: string;
    reenvioSolicitado: boolean;
    aoReenviar: () => Promise<void>;
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
    const [reenvioSolicitado, setReenvioSolicitado] = useState(false);

    async function aoReenviar(): Promise<void> {
        await reenviarVerificacaoAcesso(email);
        setReenvioSolicitado(true);
    };

    const aoIrParaAcessar = () => { router.push(PAGINAS.acessar.template); };

    return (
        <Contexto__PaginaCadastrar__EmailEnviado.Provider value={{ email, reenvioSolicitado, aoReenviar, aoIrParaAcessar }}>
            <SPA__PaginaCadastrar__EmailEnviado />
        </Contexto__PaginaCadastrar__EmailEnviado.Provider>
    );
};