'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ItemPermissaoDto } from 'types-nora-api';

import { useContextoPaginaPermissoesUsuarios } from 'Contextos/ContextoPaginaPermissoesUsuarios/contexto';
import AlterarEstadoUsuarioItemPermissao from 'Componentes/AlterarEstadoUsuarioItemPermissao/page';

interface ContextoAcessoDeUsuarioEmItemProps {
    temAcessoLeaf: (item: ItemPermissaoDto) => boolean;
    solicitaAlteracaoAcesso: (idItemSendoAlterado: number | null) => void;
};

const ContextoAcessoDeUsuarioEmItem = createContext<ContextoAcessoDeUsuarioEmItemProps | undefined>(undefined);

export const useContextoAcessoDeUsuarioEmItem = (): ContextoAcessoDeUsuarioEmItemProps => {
    const context = useContext(ContextoAcessoDeUsuarioEmItem);
    if (!context) throw new Error('useContextoAcessoDeUsuarioEmItem precisa estar dentro de um ContextoAcessoDeUsuarioEmItem');
    return context;
};

export const ContextoAcessoDeUsuarioEmItemProvider = ({ children }: { children: React.ReactNode }) => {
    const { usuarioSelecionado } = useContextoPaginaPermissoesUsuarios();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idItemPermissaoSendoAlterado, setIdItemPermissaoSendoAlterado] = useState<number | null>(null);

    const idsItensComPermissaoConcedida = useMemo(() => new Set((usuarioSelecionado?.permissoes ?? []).filter(permissao => permissao.permissoesEstado.temPermissao).map(permissao => permissao.fkPermissoesItemId)), [usuarioSelecionado]);

    const temAcessoLeaf = (item: ItemPermissaoDto) => idsItensComPermissaoConcedida.has(item.id);

    const solicitaAlteracaoAcesso = (idItemSendoAlterado: number | null) => { setIdItemPermissaoSendoAlterado(idItemSendoAlterado); setIsModalOpen(true); };

    return (
        <ContextoAcessoDeUsuarioEmItem.Provider value={{ temAcessoLeaf, solicitaAlteracaoAcesso }}>
            {children}
            <AlterarEstadoUsuarioItemPermissao isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} idItemPermissaoSendoAlterado={idItemPermissaoSendoAlterado} />
        </ContextoAcessoDeUsuarioEmItem.Provider>
    );
};