'use client';

import { createContext, useContext, useState } from 'react';

import SPA__PaginaAcessar__Redefinir from 'Conteineres/PaginaAcessar/paginas/SPA__PaginaAcessar__Redefinir/SPA__PaginaAcessar__Redefinir';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { redefinirSenhaAcesso, extraiMotivoErroAcesso } from 'Funcionalidades/Acessos/acessos.api';

type DTO__Redefinir = { novaSenha: string; confirmarSenha: string };

const FORMULARIO_REDEFINIR = defineFormularioCreate<DTO__Redefinir>({
    valoresIniciais: { novaSenha: '', confirmarSenha: '' },
    campos: {
        novaSenha: { tipo: 'text', label: 'Nova Senha', obrigatorio: true, trim: false },
        confirmarSenha: { tipo: 'text', label: 'Confirmação da nova senha', obrigatorio: true, trim: false },
    },
});

interface Contexto__PaginaAcessar__Redefinir__Props {
    formularioRedefinir: FormularioCreateEstado<DTO__Redefinir>;
    redefinida: boolean;
    erroRedefinicao: string | null;
    voltarParaLogin: () => void;
};

const Contexto__PaginaAcessar__Redefinir = createContext<Contexto__PaginaAcessar__Redefinir__Props | undefined>(undefined);

export const useContexto__PaginaAcessar__Redefinir = (): Contexto__PaginaAcessar__Redefinir__Props => {
    const context = useContext(Contexto__PaginaAcessar__Redefinir);
    if (!context) throw new Error('useContexto__PaginaAcessar__Redefinir precisa estar dentro de um Contexto__PaginaAcessar__Redefinir');
    return context;
};

export const Contexto__PaginaAcessar__Redefinir__Provider = ({ tokenRecuperacao, voltarParaLogin }: { tokenRecuperacao: string; voltarParaLogin: () => void }) => {
    const [redefinida, setRedefinida] = useState(false);
    const [erroRedefinicao, setErroRedefinicao] = useState<string | null>(null);

    const formularioRedefinir = useFormularioCreate(FORMULARIO_REDEFINIR, async payload => {
        setErroRedefinicao(null);
        if (payload.novaSenha !== payload.confirmarSenha) { setErroRedefinicao('A confirmação não confere com a nova senha'); return; }

        try {
            await redefinirSenhaAcesso(tokenRecuperacao, payload.novaSenha);
            setRedefinida(true);
        } catch (erroCapturado) {
            setErroRedefinicao(extraiMotivoErroAcesso(erroCapturado instanceof Error ? erroCapturado : null, 'Não foi possível redefinir a senha'));
        }
    });

    return (
        <Contexto__PaginaAcessar__Redefinir.Provider value={{ formularioRedefinir, redefinida, erroRedefinicao, voltarParaLogin }}>
            <SPA__PaginaAcessar__Redefinir />
        </Contexto__PaginaAcessar__Redefinir.Provider>
    );
};