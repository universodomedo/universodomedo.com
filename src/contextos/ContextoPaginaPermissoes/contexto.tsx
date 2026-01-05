'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ArvoreItensPermissaoDto, ItemPermissaoDto } from 'types-nora-api';

import { obtemArvoreItensParaPaginaPermissoes } from 'Uteis/ApiConsumer/ConsumerMiddleware';

type NodePermissao = ArvoreItensPermissaoDto['tree'][number];

interface ContextoPaginaPermissoesProps {
    arvorePermissoes: ArvoreItensPermissaoDto;
    itemSelecionado: ItemPermissaoDto | null;
    selecionaIdItem: (idItem: number) => void;
    deselecionaItemSelecionado: () => void;
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
    const itemSelecionado: ItemPermissaoDto | null = obtemItemSelecionado();

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

    async function selecionaIdItem(idItem: number) { setIdItemSelecionado(idItem); };
    async function deselecionaItemSelecionado() { setIdItemSelecionado(null); };

    function obtemItemSelecionado(): NodePermissao | null {
        if (!arvorePermissoes) return null;
        if (idItemSelecionado === null) return null;

        function walk(lista: NodePermissao[]): NodePermissao | null {
            for (const n of lista) {
                if (n.id === idItemSelecionado) return n;
                const achou = walk(n.children || []);
                if (achou) return achou;
            }
            return null;
        }

        return walk(arvorePermissoes.tree);
    }

    useEffect(() => {
        buscaArvorePermissoes();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    if (!arvorePermissoes) return <h1>Permissões não encontradas</h1>;

    return (
        <ContextoPaginaPermissoes.Provider value={{ arvorePermissoes, itemSelecionado, selecionaIdItem, deselecionaItemSelecionado }}>
            {children}
        </ContextoPaginaPermissoes.Provider>
    );
};