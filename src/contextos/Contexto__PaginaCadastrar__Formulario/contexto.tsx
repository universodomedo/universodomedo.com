'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PAGINAS, type PAYLOAD__CadastrarAcesso } from 'types-nora-api';

import SPA__PaginaCadastrar__Formulario from 'Conteineres/PaginaCadastrar/paginas/SPA__PaginaCadastrar__Formulario/SPA__PaginaCadastrar__Formulario';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { extraiMotivoErroAcesso } from 'Funcionalidades/Acessos/acessos.api';

type DTO__Cadastro = { email: string; senha: string; confirmarSenha: string };

const FORMULARIO_CADASTRO = defineFormularioCreate<DTO__Cadastro>({
    valoresIniciais: { email: '', senha: '', confirmarSenha: '' },
    campos: {
        email: { tipo: 'text', label: 'Email', obrigatorio: true, placeholder: 'Seu email real' },
        senha: { tipo: 'text', label: 'Senha', obrigatorio: true, trim: false },
        confirmarSenha: { tipo: 'text', label: 'Confirmação da senha', obrigatorio: true, trim: false },
    },
});

interface Contexto__PaginaCadastrar__Formulario__Props {
    formularioCadastro: FormularioCreateEstado<DTO__Cadastro>;
    erroCadastro: string | null;
    setTokenCaptcha: (token: string | null) => void;
    podeProsseguir: boolean;
    aoVoltarParaAcessar: () => void;
};

const Contexto__PaginaCadastrar__Formulario = createContext<Contexto__PaginaCadastrar__Formulario__Props | undefined>(undefined);

export const useContexto__PaginaCadastrar__Formulario = (): Contexto__PaginaCadastrar__Formulario__Props => {
    const context = useContext(Contexto__PaginaCadastrar__Formulario);
    if (!context) throw new Error('useContexto__PaginaCadastrar__Formulario precisa estar dentro de um Contexto__PaginaCadastrar__Formulario');
    return context;
};

export const Contexto__PaginaCadastrar__Formulario__Provider = ({ aoCadastrar }: { aoCadastrar: (payload: PAYLOAD__CadastrarAcesso) => Promise<void>; }) => {
    const router = useRouter();
    const [erroCadastro, setErroCadastro] = useState<string | null>(null);
    const [tokenCaptcha, setTokenCaptcha] = useState<string | null>(null);

    // Cadastro pede só email e senha: apelido e Termos são a etapa obrigatória depois da verificação, onde a consulta de disponibilidade fica protegida por sessão.
    const formularioCadastro = useFormularioCreate(FORMULARIO_CADASTRO, async payload => {
        setErroCadastro(null);
        if (payload.senha !== payload.confirmarSenha) { setErroCadastro('A confirmação não confere com a senha'); return; }

        try {
            await aoCadastrar({ email: payload.email, senha: payload.senha, tokenCaptcha });
        } catch (erroCapturado) {
            setErroCadastro(extraiMotivoErroAcesso(erroCapturado instanceof Error ? erroCapturado : null, 'Não foi possível concluir o cadastro'));
        }
    });

    const captchaPendente = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '') !== '' && tokenCaptcha === null;
    const podeProsseguir = formularioCadastro.podeSalvar && !captchaPendente;
    const aoVoltarParaAcessar = () => { router.push(PAGINAS.acessar.template); };

    return (
        <Contexto__PaginaCadastrar__Formulario.Provider value={{ formularioCadastro, erroCadastro, setTokenCaptcha, podeProsseguir, aoVoltarParaAcessar }}>
            <SPA__PaginaCadastrar__Formulario />
        </Contexto__PaginaCadastrar__Formulario.Provider>
    );
};