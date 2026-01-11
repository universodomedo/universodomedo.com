'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ContextoAlterarEstadoUsuarioItemPermissaoProps {
    podeSalvar: boolean;
    salvando: boolean;
    salvar: () => void;
};

const ContextoAlterarEstadoUsuarioItemPermissao = createContext<ContextoAlterarEstadoUsuarioItemPermissaoProps | undefined>(undefined);

export const useContextoAlterarEstadoUsuarioItemPermissao = (): ContextoAlterarEstadoUsuarioItemPermissaoProps => {
    const context = useContext(ContextoAlterarEstadoUsuarioItemPermissao);
    if (!context) throw new Error('useContextoAlterarEstadoUsuarioItemPermissao precisa estar dentro de um ContextoAlterarEstadoUsuarioItemPermissao');
    return context;
};

export const ContextoAlterarEstadoUsuarioItemPermissaoProvider = ({ children, isModalOpen, idItemPermissaoSendoAlterado }: { children: React.ReactNode; isModalOpen: boolean; idItemPermissaoSendoAlterado: number; }) => {
    const [salvando, setSalvando] = useState(false);

    // const podeSalvar = useMemo(() => codigoValido && descricaoValida && !salvando, [codigoValido, descricaoValida, salvando]);
    const podeSalvar = false;

    // function reset() { setCodigo(''); setDescricao(''); setSalvando(false); }
    function reset() { setSalvando(false); }

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;

        setSalvando(true);
        try {
            // await criaItem(parentIdCriacao, codigoNormalizado, descricaoNormalizada);
        } finally {
            setSalvando(false);
        }
    }

    useEffect(() => {
        if (isModalOpen) reset();
    }, [isModalOpen, idItemPermissaoSendoAlterado]);

    return (
        <ContextoAlterarEstadoUsuarioItemPermissao.Provider value={{ podeSalvar, salvando, salvar }}>
            {children}
        </ContextoAlterarEstadoUsuarioItemPermissao.Provider>
    );
};