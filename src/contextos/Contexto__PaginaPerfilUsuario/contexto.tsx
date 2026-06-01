'use client';

import { createContext, useContext } from 'react';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';

interface Contexto__PaginaPerfilUsuario__Props {
    registroUsuario: NonNullable<ReturnType<typeof obtemUsuarioPaginaPerfil>['data']>;
};

const Contexto__PaginaPerfilUsuario = createContext<Contexto__PaginaPerfilUsuario__Props | undefined>(undefined);

export const useContexto__PaginaPerfilUsuario = (): Contexto__PaginaPerfilUsuario__Props => {
    const context = useContext(Contexto__PaginaPerfilUsuario);
    if (!context) throw new Error('useContexto__PaginaPerfilUsuario precisa estar dentro de um Contexto__PaginaPerfilUsuario');
    return context;
};

export const Contexto__PaginaPerfilUsuario__Provider = ({ children, idUsuario }: { children: React.ReactNode; idUsuario: number; }) => {
    const registroUsuario = obtemUsuarioPaginaPerfil(idUsuario);

    if (!registroUsuario.data) return;

    return (
        <Contexto__PaginaPerfilUsuario.Provider value={{ registroUsuario: registroUsuario.data }}>
            {children}
        </Contexto__PaginaPerfilUsuario.Provider>
    );
};

//

export function obtemUsuarioPaginaPerfil(idUsuario: number) {
    return useNoraGraphQLRegistro('Usuario', {
        props: { idUsuario },
        select: ['id', 'username', 'arteCapaPerfil', 'customizacao'],
        pk: idUsuario,
        carregando: 'Buscando Usuário',
        mensagemErro: 'Houve um erro recuperando o Usuário',
        carregamento: 'BLOQUEIA_INTERFACE',
    });
};