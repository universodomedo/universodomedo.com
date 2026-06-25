'use client';

import { createContext, useContext } from 'react';

import { criaMenu } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import SPA__PaginaAdminGestaoNavegacao__NovoMenu from 'Conteineres/PaginaAdminGestaoNavegacao/paginas/SPA__PaginaAdminGestaoNavegacao__NovoMenu/SPA__PaginaAdminGestaoNavegacao__NovoMenu';

type DTO__CREATE__Menu = { chave: string; tipo: 'principal' | 'interno'; descricao: string | null };

const FORMULARIO_CREATE_MENU = defineFormularioCreate<DTO__CREATE__Menu>({
    valoresIniciais: { chave: '', tipo: 'principal', descricao: null },
    campos: {
        chave: { tipo: 'text', label: 'Chave', obrigatorio: true, maxLength: 120, placeholder: 'ex.: PRINCIPAL ou INTERNO:minhasPaginas.admin' },
        tipo: { tipo: 'text', label: 'Tipo', obrigatorio: true },
        descricao: { tipo: 'text', label: 'Descrição', nullable: true, maxLength: 240, placeholder: 'opcional' },
    },
});

interface Contexto__PaginaAdminGestaoNavegacao__NovoMenu__Props {
    formularioNovoMenu: FormularioCreateEstado<DTO__CREATE__Menu>;
    aoCancelar: () => void;
};

const Contexto__PaginaAdminGestaoNavegacao__NovoMenu = createContext<Contexto__PaginaAdminGestaoNavegacao__NovoMenu__Props | undefined>(undefined);

export const useContexto__PaginaAdminGestaoNavegacao__NovoMenu = (): Contexto__PaginaAdminGestaoNavegacao__NovoMenu__Props => {
    const context = useContext(Contexto__PaginaAdminGestaoNavegacao__NovoMenu);
    if (!context) throw new Error('useContexto__PaginaAdminGestaoNavegacao__NovoMenu precisa estar dentro de um Contexto__PaginaAdminGestaoNavegacao__NovoMenu');
    return context;
};

export const Contexto__PaginaAdminGestaoNavegacao__NovoMenu__Provider = ({ setEstaEmProcessoCriacao, recarregarListagem }: { setEstaEmProcessoCriacao: (v: boolean) => void; recarregarListagem: () => void; }) => {
    const formularioNovoMenu = useFormularioNovoMenu(setEstaEmProcessoCriacao, recarregarListagem);
    const aoCancelar = () => setEstaEmProcessoCriacao(false);

    return (
        <Contexto__PaginaAdminGestaoNavegacao__NovoMenu.Provider value={{ formularioNovoMenu, aoCancelar }}>
            <SPA__PaginaAdminGestaoNavegacao__NovoMenu />
        </Contexto__PaginaAdminGestaoNavegacao__NovoMenu.Provider>
    );
};

function useFormularioNovoMenu(setEstaEmProcessoCriacao: (v: boolean) => void, recarregarListagem: () => void): FormularioCreateEstado<DTO__CREATE__Menu> {
    return useFormularioCreate(FORMULARIO_CREATE_MENU, async payload => {
        await criaMenu({ chave: payload.chave, tipo: payload.tipo, descricao: payload.descricao });
        recarregarListagem();
        setEstaEmProcessoCriacao(false);
    });
};
