'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PAGINAS } from 'types-nora-api';

import SPA__PaginaAcessar__Login from 'Conteineres/PaginaAcessar/paginas/SPA__PaginaAcessar__Login/SPA__PaginaAcessar__Login';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { extraiMotivoErroAcesso } from 'Funcionalidades/Acessos/acessos.api';
import type { EstadoVerificacaoEmail } from 'Contextos/Contexto__PaginaAcessar/contexto';

type DTO__Login = { identificador: string; senha: string };

const FORMULARIO_LOGIN = defineFormularioCreate<DTO__Login>({
    valoresIniciais: { identificador: '', senha: '' },
    campos: {
        identificador: { tipo: 'text', label: 'Email ou Apelido', obrigatorio: true },
        senha: { tipo: 'text', label: 'Senha', obrigatorio: true, trim: false },
    },
});

interface Contexto__PaginaAcessar__Login__Props {
    formularioLogin: FormularioCreateEstado<DTO__Login>;
    erroLogin: string | null;
    verificacaoEmail: EstadoVerificacaoEmail;
    aoEntrarComDiscord: () => void;
    aoCriarConta: () => void;
};

const Contexto__PaginaAcessar__Login = createContext<Contexto__PaginaAcessar__Login__Props | undefined>(undefined);

export const useContexto__PaginaAcessar__Login = (): Contexto__PaginaAcessar__Login__Props => {
    const context = useContext(Contexto__PaginaAcessar__Login);
    if (!context) throw new Error('useContexto__PaginaAcessar__Login precisa estar dentro de um Contexto__PaginaAcessar__Login');
    return context;
};

export const Contexto__PaginaAcessar__Login__Provider = ({ verificacaoEmail, aoEntrar }: { verificacaoEmail: EstadoVerificacaoEmail; aoEntrar: (identificador: string, senha: string) => Promise<void>; }) => {
    const router = useRouter();
    const [erroLogin, setErroLogin] = useState<string | null>(null);

    const formularioLogin = useFormularioCreate(FORMULARIO_LOGIN, async payload => {
        setErroLogin(null);
        try {
            await aoEntrar(payload.identificador, payload.senha);
        } catch (erroCapturado) {
            setErroLogin(extraiMotivoErroAcesso(erroCapturado instanceof Error ? erroCapturado : null, 'Não foi possível entrar'));
        }
    });

    const aoEntrarComDiscord = () => { window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`; };
    const aoCriarConta = () => { router.push(PAGINAS.cadastrar.template); };

    return (
        <Contexto__PaginaAcessar__Login.Provider value={{ formularioLogin, erroLogin, verificacaoEmail, aoEntrarComDiscord, aoCriarConta }}>
            <SPA__PaginaAcessar__Login />
        </Contexto__PaginaAcessar__Login.Provider>
    );
};