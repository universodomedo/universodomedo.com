'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { type ArvoreItensPermissaoDto } from 'types-nora-api';

import { obtemArvoreItensParaPaginaPermissoes } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoArvoreItensPermissoesProps {
    arvorePermissoes: ArvoreItensPermissaoDto;
};

const ContextoArvoreItensPermissoes = createContext<ContextoArvoreItensPermissoesProps | undefined>(undefined);

export const useContextoArvoreItensPermissoes = (): ContextoArvoreItensPermissoesProps => {
    const context = useContext(ContextoArvoreItensPermissoes);
    if (!context) throw new Error('useContextoArvoreItensPermissoes precisa estar dentro de um ContextoArvoreItensPermissoes');
    return context;
};

export const ContextoArvoreItensPermissoesProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>('');
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

    useEffect(() => {
        buscaArvorePermissoes();
    }, []);

    if (carregando) return <div>{carregando}</div>;
    if (!arvorePermissoes) return <h1>Permissões não encontradas</h1>;

    return (
        <ContextoArvoreItensPermissoes.Provider value={{ arvorePermissoes }}>
            {children}
        </ContextoArvoreItensPermissoes.Provider>
    );
};