'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { me_atualizaEstadoItem } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import { PermissaoEstado, useContextoAcessoDeUsuarioEmItem } from 'Contextos/ContextoAcessoDeUsuarioEmItem/contexto';
import { useContextoPaginaPermissoesUsuarios } from 'Contextos/ContextoPaginaPermissoesUsuarios/contexto';

interface ContextoAlterarEstadoUsuarioItemPermissaoProps {
    podeSalvar: boolean;
    salvando: boolean;
    salvar: () => void;
    estadoSelecionado: PermissaoEstado | null;
    setEstadoSelecionado: (estado: PermissaoEstado | null) => void;
};

const ContextoAlterarEstadoUsuarioItemPermissao = createContext<ContextoAlterarEstadoUsuarioItemPermissaoProps | undefined>(undefined);

export const useContextoAlterarEstadoUsuarioItemPermissao = (): ContextoAlterarEstadoUsuarioItemPermissaoProps => {
    const context = useContext(ContextoAlterarEstadoUsuarioItemPermissao);
    if (!context) throw new Error('useContextoAlterarEstadoUsuarioItemPermissao precisa estar dentro de um ContextoAlterarEstadoUsuarioItemPermissao');
    return context;
};

export const ContextoAlterarEstadoUsuarioItemPermissaoProvider = ({ children, isModalOpen, idItemPermissaoSendoAlterado }: { children: React.ReactNode; isModalOpen: boolean; idItemPermissaoSendoAlterado: number; }) => {
    const { itemSendoAlterado, estadoAtualItemSendoAlterado } = useContextoAcessoDeUsuarioEmItem();
    const { usuarioSelecionado } = useContextoPaginaPermissoesUsuarios();

    const [salvando, setSalvando] = useState(false);
    const [estadoSelecionado, setEstadoSelecionado] = useState<PermissaoEstado | null>(null);

    const podeSalvar = useMemo(() => estadoSelecionado !== null && estadoSelecionado.id !== estadoAtualItemSendoAlterado?.id && !salvando, [estadoSelecionado, estadoAtualItemSendoAlterado, salvando]);

    function reset() { setEstadoSelecionado(null); setSalvando(false); };

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;

        const ok = await me_atualizaEstadoItem(itemSendoAlterado!.id, usuarioSelecionado!.id, estadoSelecionado!.id);

        if (!ok) await toast.erro('Falha ao atualizar permissão', 'Backend rejeitou a atualização');
        else await toast.sucesso('Permissão atualizada', `Usuário ${usuarioSelecionado?.username} agora tem Permissão ${estadoSelecionado?.chave} para o Item ${itemSendoAlterado?.codigo}.`, { recarregaPagina: true });
    };

    useEffect(() => {
        if (isModalOpen) reset();
    }, [isModalOpen, idItemPermissaoSendoAlterado]);

    return (
        <ContextoAlterarEstadoUsuarioItemPermissao.Provider value={{ podeSalvar, salvando, salvar, estadoSelecionado, setEstadoSelecionado }}>
            {children}
        </ContextoAlterarEstadoUsuarioItemPermissao.Provider>
    );
};