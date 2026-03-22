'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { UsuarioCompletaDto } from 'types-nora-api';

import { obtemDadosEPermissoes } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaPermissoesUsuariosProps {
    usuarioSelecionado: UsuarioCompletaDto | null;
    selecionaIdUsuario: (idUsuario: number | null) => void;
};

const ContextoPaginaPermissoesUsuarios = createContext<ContextoPaginaPermissoesUsuariosProps | undefined>(undefined);

export const useContextoPaginaPermissoesUsuarios = (): ContextoPaginaPermissoesUsuariosProps => {
    const context = useContext(ContextoPaginaPermissoesUsuarios);
    if (!context) throw new Error('useContextoPaginaPermissoesUsuarios precisa estar dentro de um ContextoPaginaPermissoesUsuarios');
    return context;
};

export const ContextoPaginaPermissoesUsuariosProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [idUsuarioSelecionado, setIdUsuarioSelecionado] = useState<number | null>(null);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioCompletaDto | null>(null);

    async function buscaUsuarioComPermissoes() {
        setCarregando('Buscando Usuário e suas Permissões');
        
        try {
            if (idUsuarioSelecionado) setUsuarioSelecionado(await obtemDadosEPermissoes(idUsuarioSelecionado));
            else setUsuarioSelecionado(null);
        } catch {
            setUsuarioSelecionado(null);
        } finally {
            setCarregando(null);
        }
    };

    function selecionaIdUsuario(idUsuario: number | null) { setIdUsuarioSelecionado(idUsuario); }

    useEffect(() => {
        if (idUsuarioSelecionado) buscaUsuarioComPermissoes();
        else setUsuarioSelecionado(null);
    }, [idUsuarioSelecionado]);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoPaginaPermissoesUsuarios.Provider value={{ usuarioSelecionado, selecionaIdUsuario }}>
            {children}
        </ContextoPaginaPermissoesUsuarios.Provider>
    );
};