'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PAGINAS, type PAYLOAD__CadastrarAcesso } from 'types-nora-api';

import SPA__PaginaCadastrar__Formulario from 'Conteineres/PaginaCadastrar/paginas/SPA__PaginaCadastrar__Formulario/SPA__PaginaCadastrar__Formulario';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { extraiMotivoErroAcesso } from 'Funcionalidades/Acessos/acessos.api';

type DTO__Cadastro = { apelido: string; email: string; senha: string; confirmarSenha: string };

const FORMULARIO_CADASTRO = defineFormularioCreate<DTO__Cadastro>({
    valoresIniciais: { apelido: '', email: '', senha: '', confirmarSenha: '' },
    campos: {
        apelido: { tipo: 'text', label: 'Apelido', obrigatorio: true, maxLength: 25, placeholder: 'Nome público, definitivo' },
        email: { tipo: 'text', label: 'Email', obrigatorio: true, placeholder: 'Seu email real' },
        senha: { tipo: 'text', label: 'Senha', obrigatorio: true, trim: false },
        confirmarSenha: { tipo: 'text', label: 'Confirmação da senha', obrigatorio: true, trim: false },
    },
});

interface Contexto__PaginaCadastrar__Formulario__Props {
    formularioCadastro: FormularioCreateEstado<DTO__Cadastro>;
    erroCadastro: string | null;
    setTokenCaptcha: (token: string | null) => void;
    mostrarTermos: boolean;
    setMostrarTermos: (mostrar: boolean) => void;
    checkTopicosSensiveis: boolean;
    setCheckTopicosSensiveis: (valor: boolean) => void;
    termo1: boolean;
    setTermo1: (valor: boolean) => void;
    termo2: boolean;
    setTermo2: (valor: boolean) => void;
    termosAceitos: boolean;
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
    const [mostrarTermos, setMostrarTermos] = useState(false);
    const [checkTopicosSensiveis, setCheckTopicosSensiveis] = useState(false);
    const [termo1, setTermo1] = useState(false);
    const [termo2, setTermo2] = useState(false);

    const termosAceitos = termo1 && termo2;

    const formularioCadastro = useFormularioCreate(FORMULARIO_CADASTRO, async payload => {
        setErroCadastro(null);
        if (payload.senha !== payload.confirmarSenha) { setErroCadastro('A confirmação não confere com a senha'); return; }
        if (!termosAceitos) { setErroCadastro('Os Termos de Aceite precisam ser aceitos'); return; }

        try {
            await aoCadastrar({ apelido: payload.apelido, email: payload.email, senha: payload.senha, tokenCaptcha });
        } catch (erroCapturado) {
            setErroCadastro(extraiMotivoErroAcesso(erroCapturado instanceof Error ? erroCapturado : null, 'Não foi possível concluir o cadastro'));
        }
    });

    // Com a site key presente, o token do Turnstile é pré-requisito do envio (o backend do mesmo ambiente valida com a secret correspondente).
    const captchaPendente = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '') !== '' && tokenCaptcha === null;
    const podeProsseguir = formularioCadastro.podeSalvar && termosAceitos && !captchaPendente;
    const aoVoltarParaAcessar = () => { router.push(PAGINAS.acessar.template); };

    return (
        <Contexto__PaginaCadastrar__Formulario.Provider value={{ formularioCadastro, erroCadastro, setTokenCaptcha, mostrarTermos, setMostrarTermos, checkTopicosSensiveis, setCheckTopicosSensiveis, termo1, setTermo1, termo2, setTermo2, termosAceitos, podeProsseguir, aoVoltarParaAcessar }}>
            <SPA__PaginaCadastrar__Formulario />
        </Contexto__PaginaCadastrar__Formulario.Provider>
    );
};