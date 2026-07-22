'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { loginAcesso, verificarEmailAcesso, extraiMotivoErroAcesso } from 'Funcionalidades/Acessos/acessos.api';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export type EstadoVerificacaoEmail = { situacao: 'NENHUMA' | 'VERIFICANDO' | 'SUCESSO' | 'FALHA'; mensagem: string | null };

export interface Contexto__PaginaAcessar__Props {
    verificacaoEmail: EstadoVerificacaoEmail;
    aoEntrar: (identificador: string, senha: string) => Promise<void>;
};

const Contexto__PaginaAcessar = createContext<Contexto__PaginaAcessar__Props | undefined>(undefined);

export const useContexto__PaginaAcessar = (): Contexto__PaginaAcessar__Props => {
    const context = useContext(Contexto__PaginaAcessar);
    if (!context) throw new Error('useContexto__PaginaAcessar precisa estar dentro de um Contexto__PaginaAcessar');
    return context;
};

export const Contexto__PaginaAcessar__Provider = ({ children }: { children: ReactNode }) => {
    const { checkAuth } = useContextoAutenticacao();
    const [verificacaoEmail, setVerificacaoEmail] = useState<EstadoVerificacaoEmail>({ situacao: 'NENHUMA', mensagem: null });

    // O link do email de verificação aponta para /acessar?token=...; a verificação acontece aqui e o resultado vira banner na tela de login.
    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        if (token === null || token === '') return;

        setVerificacaoEmail({ situacao: 'VERIFICANDO', mensagem: null });
        verificarEmailAcesso(token)
            .then(resposta => setVerificacaoEmail({ situacao: 'SUCESSO', mensagem: `Email ${resposta.email} verificado. Sua conta está ativa — entre abaixo` }))
            .catch(erroCapturado => setVerificacaoEmail({ situacao: 'FALHA', mensagem: extraiMotivoErroAcesso(erroCapturado instanceof Error ? erroCapturado : null, 'Não foi possível verificar o email') }));
    }, []);

    async function aoEntrar(identificador: string, senha: string): Promise<void> {
        await loginAcesso({ identificador, senha });
        await checkAuth();
    };

    return (
        <Contexto__PaginaAcessar.Provider value={{ verificacaoEmail, aoEntrar }}>
            {children}
        </Contexto__PaginaAcessar.Provider>
    );
};