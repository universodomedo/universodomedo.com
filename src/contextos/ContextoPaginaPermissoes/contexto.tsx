'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ArvoreItensPermissaoDto, ItemPermissaoDto } from 'types-nora-api';

import { me_criaItem, obtemArvoreItensParaPaginaPermissoes } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { useToast } from 'contextos/ContextoToast/contexto';
import CriarNovoItemPermissao from 'Componentes/CriarNovoItemPermissao/page';

type NodePermissao = ArvoreItensPermissaoDto['tree'][number];

interface ContextoPaginaPermissoesProps {
    arvorePermissoes: ArvoreItensPermissaoDto;
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
    const [carregando, setCarregando] = useState<string | null>('');
    const [arvorePermissoes, setArvorePermissoes] = useState<ArvoreItensPermissaoDto | null>(null);
    const [idItemSelecionado, setIdItemSelecionado] = useState<number | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parentIdCriacao, setParentIdCriacao] = useState<number | null>(null);

    const itemSelecionado: ItemPermissaoDto | null = obtemItemSelecionado();
    const itemPaiSelecionado: ItemPermissaoDto | null = obtemPaiDoSelecionado();
    const filhosItemSelecionado: ItemPermissaoDto[] = itemSelecionado?.children || [];

    const toast = useToast();

    async function buscaArvorePermissoes() {
        setCarregando('Buscando Permissões');

        try {
            setArvorePermissoes(await obtemArvoreItensParaPaginaPermissoes());
        } catch {
            setArvorePermissoes(null);
        } finally {
            setCarregando(null);
        }
    };

    function selecionaIdItem(idItem: number) { setIdItemSelecionado(idItem); };
    function deselecionaItemSelecionado() { setIdItemSelecionado(null); };

    function solicitaCriacaoDePermissao(parentId: number | null) { setParentIdCriacao(parentId); setIsModalOpen(true); }

    function obtemItemPorId(id: number): NodePermissao | null {
        if (!arvorePermissoes) return null;

        function walk(lista: NodePermissao[]): NodePermissao | null {
            for (const n of lista) {
                if (n.id === id) return n;
                const achou = walk(n.children || []);
                if (achou) return achou;
            }
            return null;
        }

        return walk(arvorePermissoes.tree);
    };

    function obtemItemSelecionado(): NodePermissao | null { return (!arvorePermissoes || idItemSelecionado === null) ? null : obtemItemPorId(idItemSelecionado); };

    function obtemPaiDoSelecionado(): NodePermissao | null {
        if (!arvorePermissoes || !itemSelecionado) return null;

        const indexById = arvorePermissoes.indexById as unknown as Record<string, { parentId: number | null }>;
        const parentId = indexById[String(itemSelecionado.id)]?.parentId ?? null;

        return (parentId === null) ? null : obtemItemPorId(parentId);
    };

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
    };

    useEffect(() => {
        buscaArvorePermissoes();
    }, []);

    if (carregando) return <div>{carregando}</div>;
    if (!arvorePermissoes) return <h1>Permissões não encontradas</h1>;

    return (
        <ContextoPaginaPermissoes.Provider value={{ arvorePermissoes, itemSelecionado, itemPaiSelecionado, filhosItemSelecionado, selecionaIdItem, deselecionaItemSelecionado, criaItem, solicitaCriacaoDePermissao }}>
            {children}
            <CriarNovoItemPermissao isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} parentIdCriacao={parentIdCriacao} />
        </ContextoPaginaPermissoes.Provider>
    );
};