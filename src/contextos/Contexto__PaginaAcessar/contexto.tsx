'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { loginAcesso, verificarEmailAcesso, extraiMotivoErroAcesso } from 'Funcionalidades/Acessos/acessos.api';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export type EstadoVerificacaoEmail = { situacao: 'NENHUMA' | 'VERIFICANDO' | 'SUCESSO' | 'FALHA'; mensagem: string | null };
export type EtapaAcessar = 'LOGIN' | 'RECUPERAR' | 'REDEFINIR';
export type RecusaDiscord = 'NENHUMA' | 'SEM_CONTA' | 'JA_MIGRADO';

export interface Contexto__PaginaAcessar__Props {
    etapa: EtapaAcessar;
    verificacaoEmail: EstadoVerificacaoEmail;
    recusaDiscord: RecusaDiscord;
    tokenRecuperacao: string | null;
    aoEntrar: (identificador: string, senha: string) => Promise<void>;
    irParaRecuperar: () => void;
    voltarParaLogin: () => void;
};

const Contexto__PaginaAcessar = createContext<Contexto__PaginaAcessar__Props | undefined>(undefined);

export const useContexto__PaginaAcessar = (): Contexto__PaginaAcessar__Props => {
    const context = useContext(Contexto__PaginaAcessar);
    if (!context) throw new Error('useContexto__PaginaAcessar precisa estar dentro de um Contexto__PaginaAcessar');
    return context;
};

export const Contexto__PaginaAcessar__Provider = ({ children }: { children: ReactNode }) => {
    const { checkAuth } = useContextoAutenticacao();
    const [etapa, setEtapa] = useState<EtapaAcessar>('LOGIN');
    const [recusaDiscord, setRecusaDiscord] = useState<RecusaDiscord>('NENHUMA');
    const [tokenRecuperacao, setTokenRecuperacao] = useState<string | null>(null);
    const [verificacaoEmail, setVerificacaoEmail] = useState<EstadoVerificacaoEmail>({ situacao: 'NENHUMA', mensagem: null });

    // Os links dos emails apontam para /acessar: ?token=... (verificação, vira banner no login) e ?recuperacao=... (abre o subfluxo de redefinição).
    useEffect(() => {
        const parametros = new URLSearchParams(window.location.search);

        // A ponte de migração do Discord devolve o motivo da recusa aqui (sem-conta / ja-migrado) para a tela explicar o caminho certo.
        const discord = parametros.get('discord');
        if (discord === 'sem-conta') setRecusaDiscord('SEM_CONTA');
        if (discord === 'ja-migrado') setRecusaDiscord('JA_MIGRADO');

        const recuperacao = parametros.get('recuperacao');
        if (recuperacao !== null && recuperacao !== '') {
            setTokenRecuperacao(recuperacao);
            setEtapa('REDEFINIR');
            return;
        }

        const token = parametros.get('token');
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

    const irParaRecuperar = () => { setEtapa('RECUPERAR'); };
    const voltarParaLogin = () => { window.history.replaceState(null, '', '/acessar'); setTokenRecuperacao(null); setEtapa('LOGIN'); };

    return (
        <Contexto__PaginaAcessar.Provider value={{ etapa, verificacaoEmail, recusaDiscord, tokenRecuperacao, aoEntrar, irParaRecuperar, voltarParaLogin }}>
            {children}
        </Contexto__PaginaAcessar.Provider>
    );
};