'use client';

import { createContext, useContext, useState } from 'react';

import SPA__PaginaAcessar__Recuperar from 'Conteineres/PaginaAcessar/paginas/SPA__PaginaAcessar__Recuperar/SPA__PaginaAcessar__Recuperar';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import { solicitarRecuperacaoAcesso } from 'Funcionalidades/Acessos/acessos.api';

type DTO__Recuperar = { identificador: string };

const FORMULARIO_RECUPERAR = defineFormularioCreate<DTO__Recuperar>({
    valoresIniciais: { identificador: '' },
    campos: {
        identificador: { tipo: 'text', label: 'Email ou Apelido', obrigatorio: true },
    },
});

interface Contexto__PaginaAcessar__Recuperar__Props {
    formularioRecuperar: FormularioCreateEstado<DTO__Recuperar>;
    solicitado: boolean;
    erroSolicitacao: string | null;
    voltarParaLogin: () => void;
};

const Contexto__PaginaAcessar__Recuperar = createContext<Contexto__PaginaAcessar__Recuperar__Props | undefined>(undefined);

export const useContexto__PaginaAcessar__Recuperar = (): Contexto__PaginaAcessar__Recuperar__Props => {
    const context = useContext(Contexto__PaginaAcessar__Recuperar);
    if (!context) throw new Error('useContexto__PaginaAcessar__Recuperar precisa estar dentro de um Contexto__PaginaAcessar__Recuperar');
    return context;
};

export const Contexto__PaginaAcessar__Recuperar__Provider = ({ voltarParaLogin }: { voltarParaLogin: () => void }) => {
    const [solicitado, setSolicitado] = useState(false);
    const [erroSolicitacao, setErroSolicitacao] = useState<string | null>(null);

    const formularioRecuperar = useFormularioCreate(FORMULARIO_RECUPERAR, async payload => {
        setErroSolicitacao(null);
        try {
            await solicitarRecuperacaoAcesso(payload.identificador);
            setSolicitado(true);
        } catch (erroCapturado) {
            setErroSolicitacao('Não foi possível solicitar a recuperação. Tente novamente');
        }
    });

    return (
        <Contexto__PaginaAcessar__Recuperar.Provider value={{ formularioRecuperar, solicitado, erroSolicitacao, voltarParaLogin }}>
            <SPA__PaginaAcessar__Recuperar />
        </Contexto__PaginaAcessar__Recuperar.Provider>
    );
};