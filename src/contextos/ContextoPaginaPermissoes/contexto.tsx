'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { type ArvoreItensPermissaoDto, type ItemPermissaoDto } from 'types-nora-api';

import { me_criaItem } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import { useContextoArvoreItensPermissoes } from 'Contextos/ContextoArvoreItensPermissoes/contexto';
import CriarNovoItemPermissao from 'Componentes/CriarNovoItemPermissao/page';

type NodePermissao = ArvoreItensPermissaoDto['tree'][number];

interface ContextoPaginaPermissoesProps {
    itemSelecionado: ItemPermissaoDto | null;
    itemPaiSelecionado: ItemPermissaoDto | null;
    filhosItemSelecionado: ItemPermissaoDto[];
    selecionaIdItem: (idItem: number) => void;
    deselecionaItemSelecionado: () => void;
    criaItem: (parentId: number | null, codigo: string, descricao: string) => Promise<boolean>;
    solicitaCriacaoDePermissao: (parentId: number | null) => void;
};

const ContextoPaginaPermissoes = createContext<ContextoPaginaPermissoesProps | undefined>(undefined);

export const useContextoPaginaPermissoes = (): ContextoPaginaPermissoesProps => {
    const context = useContext(ContextoPaginaPermissoes);
    if (!context) throw new Error('useContextoPaginaPermissoes precisa estar dentro de um ContextoPaginaPermissoes');
    return context;
};

export const ContextoPaginaPermissoesProvider = ({ children }: { children: React.ReactNode }) => {
    const { arvorePermissoes } = useContextoArvoreItensPermissoes();

    const [idItemSelecionado, setIdItemSelecionado] = useState<number | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parentIdCriacao, setParentIdCriacao] = useState<number | null>(null);

    const nodesById = useMemo(() => {
        const map = new Map<number, NodePermissao>();

        const walk = (lista: NodePermissao[]) => {
            for (const n of lista) {
                map.set(n.id, n);
                if (n.children && n.children.length) walk(n.children);
            }
        };

        walk(arvorePermissoes.tree);
        return map;
    }, [arvorePermissoes]);

    const itemSelecionado: ItemPermissaoDto | null = useMemo(() => {
        if (idItemSelecionado === null) return null;
        return nodesById.get(idItemSelecionado) ?? null;
    }, [idItemSelecionado, nodesById]);

    const itemPaiSelecionado: ItemPermissaoDto | null = useMemo(() => {
        if (!itemSelecionado) return null;

        const parentId = (arvorePermissoes.indexById as Record<string, { parentId: number | null } | undefined>)[String(itemSelecionado.id)]?.parentId ?? null;
        if (parentId === null) return null;

        return nodesById.get(parentId) ?? null;
    }, [arvorePermissoes, itemSelecionado, nodesById]);

    const filhosItemSelecionado: ItemPermissaoDto[] = useMemo(() => {
        return itemSelecionado?.children || [];
    }, [itemSelecionado]);

    function selecionaIdItem(idItem: number) { setIdItemSelecionado(idItem); }
    function deselecionaItemSelecionado() { setIdItemSelecionado(null); }

    function solicitaCriacaoDePermissao(parentId: number | null) { setParentIdCriacao(parentId); setIsModalOpen(true); }

    async function criaItem(parentId: number | null, codigo: string, descricao: string): Promise<boolean> {
        const ok = await me_criaItem(parentId, codigo, descricao);

        if (!ok) {
            await toast.erro('Falha ao criar permissão', 'Backend rejeitou a criação');
            return false;
        }

        setIsModalOpen(false);
        setParentIdCriacao(null);

        await toast.sucesso('Permissão criada', 'Item criado com sucesso.', { recarregaPagina: true });
        return true;
    }

    return (
        <ContextoPaginaPermissoes.Provider value={{ itemSelecionado, itemPaiSelecionado, filhosItemSelecionado, selecionaIdItem, deselecionaItemSelecionado, criaItem, solicitaCriacaoDePermissao }}>
            {children}
            <CriarNovoItemPermissao isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} parentIdCriacao={parentIdCriacao} />
        </ContextoPaginaPermissoes.Provider>
    );
};