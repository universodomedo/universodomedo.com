'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ItemPermissaoDto, PERMISSOES_ESTADOS } from 'types-nora-api';

import { useContextoArvoreItensPermissoes } from 'Contextos/ContextoArvoreItensPermissoes/contexto';
import { useContextoPaginaPermissoesUsuarios } from 'Contextos/ContextoPaginaPermissoesUsuarios/contexto';
import AlterarEstadoUsuarioItemPermissao from 'Componentes/AlterarEstadoUsuarioItemPermissao/page';

export type PermissaoEstadoChave = keyof typeof PERMISSOES_ESTADOS;
export type PermissaoEstado = (typeof PERMISSOES_ESTADOS)[PermissaoEstadoChave];

interface ContextoAcessoDeUsuarioEmItemProps {
    temAcessoLeaf: (item: ItemPermissaoDto) => boolean;
    solicitaAlteracaoAcesso: (idItemSendoAlterado: number | null) => void;
    itemSendoAlterado: ItemPermissaoDto | null;
    estadoAtualItemSendoAlterado: PermissaoEstado | null;
};

const ContextoAcessoDeUsuarioEmItem = createContext<ContextoAcessoDeUsuarioEmItemProps | undefined>(undefined);

export const useContextoAcessoDeUsuarioEmItem = (): ContextoAcessoDeUsuarioEmItemProps => {
    const context = useContext(ContextoAcessoDeUsuarioEmItem);
    if (!context) throw new Error('useContextoAcessoDeUsuarioEmItem precisa estar dentro de um ContextoAcessoDeUsuarioEmItem');
    return context;
};

export const ContextoAcessoDeUsuarioEmItemProvider = ({ children }: { children: React.ReactNode }) => {
    const { obtemItemPermissaoPorId } = useContextoArvoreItensPermissoes();
    const { usuarioSelecionado } = useContextoPaginaPermissoesUsuarios();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idItemPermissaoSendoAlterado, setIdItemPermissaoSendoAlterado] = useState<number | null>(null);

    const isPermissaoEstadoChave = (value: string): value is PermissaoEstadoChave => value in PERMISSOES_ESTADOS;

    const estadoPorItemId = useMemo(() => {
        const map = new Map<number, PermissaoEstado>();
        for (const permissao of usuarioSelecionado?.permissoes ?? []) {
            const chave = permissao.permissoesEstado.chave;
            if (isPermissaoEstadoChave(chave)) map.set(permissao.fkPermissoesItemId, PERMISSOES_ESTADOS[chave]);
        }
        return map;
    }, [usuarioSelecionado]);

    const obtemEstadoDesseItemNesseUsuario = useCallback((item: ItemPermissaoDto): PermissaoEstado | null => estadoPorItemId.get(item.id) ?? null, [estadoPorItemId]);

    const temAcessoLeaf = (item: ItemPermissaoDto) => {
        const estado = obtemEstadoDesseItemNesseUsuario(item);
        if (!estado) return false;
        return estado.permissao === true;
    };

    const solicitaAlteracaoAcesso = (idItemSendoAlterado: number | null) => { setIdItemPermissaoSendoAlterado(idItemSendoAlterado); setIsModalOpen(true); };

    const itemSendoAlterado: ItemPermissaoDto | null = idItemPermissaoSendoAlterado === null ? null : obtemItemPermissaoPorId(idItemPermissaoSendoAlterado);
    const estadoAtualItemSendoAlterado = useMemo(() => (itemSendoAlterado ? obtemEstadoDesseItemNesseUsuario(itemSendoAlterado) : null), [itemSendoAlterado, obtemEstadoDesseItemNesseUsuario]);

    return (
        <ContextoAcessoDeUsuarioEmItem.Provider value={{ temAcessoLeaf, solicitaAlteracaoAcesso, itemSendoAlterado, estadoAtualItemSendoAlterado }}>
            {children}
            <AlterarEstadoUsuarioItemPermissao isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} idItemPermissaoSendoAlterado={idItemPermissaoSendoAlterado} />
        </ContextoAcessoDeUsuarioEmItem.Provider>
    );
};