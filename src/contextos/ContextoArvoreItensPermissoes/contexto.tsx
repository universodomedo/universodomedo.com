'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ItemPermissaoDto, type ArvoreItensPermissaoDto } from 'types-nora-api';

import { obtemArvoreItensParaPaginaPermissoes } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoArvoreItensPermissoesProps {
    arvorePermissoes: ArvoreItensPermissaoDto;
    obtemItemPermissaoPorId: (id: number) => ItemPermissaoDto | null;
};

const ContextoArvoreItensPermissoes = createContext<ContextoArvoreItensPermissoesProps | undefined>(undefined);

export const useContextoArvoreItensPermissoes = (): ContextoArvoreItensPermissoesProps => {
    const context = useContext(ContextoArvoreItensPermissoes);
    if (!context) throw new Error('useContextoArvoreItensPermissoes precisa estar dentro de um ContextoArvoreItensPermissoes');
    return context;
};

export const ContextoArvoreItensPermissoesProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [arvorePermissoes, setArvorePermissoes] = useState<ArvoreItensPermissaoDto | null>(null);

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

    function obtemItemPermissaoPorId(id: number): ItemPermissaoDto | null {
        function walk(lista: ItemPermissaoDto[]): ItemPermissaoDto | null {
            for (const n of lista) {
                if (n.id === id) return n;
                const achou = walk(n.children || []);
                if (achou) return achou;
            }
            return null;
        }
        return arvorePermissoes ? walk(arvorePermissoes.tree) : null;
    };

    useEffect(() => {
        buscaArvorePermissoes();
    }, []);

    if (carregando) return <div>{carregando}</div>;
    if (!arvorePermissoes) return <h1>Permissões não encontradas</h1>;

    return (
        <ContextoArvoreItensPermissoes.Provider value={{ arvorePermissoes, obtemItemPermissaoPorId }}>
            {children}
        </ContextoArvoreItensPermissoes.Provider>
    );
};