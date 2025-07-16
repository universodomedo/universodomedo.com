'use client';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { GrupoAventuraDto } from 'types-nora-api';
import { obtemGruposPorMestre } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface OpcoesBusca {
    ordenacao: {
        tipo: 'dataCriacao' | null;
        direcao: 'asc' | 'desc' | null;
    };
    filtro: {
        termo: string;
    };
}

interface ContextoMestreAventurasProps {
    aventurasFiltradas: GrupoAventuraDto[];
    opcoesBusca: OpcoesBusca;
    atualizarFiltro: (termo: string) => void;
    toggleOrdenacaoData: () => void;
};

const ContextoMestreAventuras = createContext<ContextoMestreAventurasProps | undefined>(undefined);

export const useContextoMestreAventuras = (): ContextoMestreAventurasProps => {
    const context = useContext(ContextoMestreAventuras);
    if (!context) throw new Error('useContextoMestreAventuras precisa estar dentro de um ContextoMestreAventuras');
    return context;
};

export const ContextoMestreAventurasProvider = ({ children }: { children: React.ReactNode }) => {
    const { usuarioLogado } = useContextoAutenticacao();
    const [gruposAventurasListadas, setGruposAventurasListadas] = useState<GrupoAventuraDto[] | null>(null);

    const [opcoesBusca, setOpcoesBusca] = useState<OpcoesBusca>({
        ordenacao: {
            tipo: null,
            direcao: null,
        },
        filtro: {
            termo: '',
        }
    });

    const atualizarFiltro = (termo: string) => {
        setOpcoesBusca(prev => ({
            ...prev,
            filtro: {
                ...prev.filtro,
                termo: termo.toLowerCase(),
            },
        }));
    };

    const toggleOrdenacaoData = () => {
        setOpcoesBusca(prev => {
            const direcaoAtual = prev.ordenacao.direcao;

            if (!direcaoAtual) return { ...prev, ordenacao: { tipo: 'dataCriacao', direcao: 'asc' } };
            if (direcaoAtual === 'asc') return { ...prev, ordenacao: { ...prev.ordenacao, direcao: 'desc' } };
            return { ...prev, ordenacao: { tipo: null, direcao: null } };
        });
    };

    const aventurasFiltradas = (() => {
        if (!gruposAventurasListadas) return [];

        let resultado = gruposAventurasListadas.filter(grupo => grupo.nomeUnicoGrupoAventura.toLowerCase().includes(opcoesBusca.filtro.termo.toLowerCase()));

        // 2. Aplica ordenação se existir
        if (opcoesBusca.ordenacao.direcao) {
            resultado = [...resultado].sort((a, b) => {
                const dateA = new Date(a.aventura.dataCriacao).getTime();
                const dateB = new Date(b.aventura.dataCriacao).getTime();
                return opcoesBusca.ordenacao.direcao === 'asc'
                    ? dateA - dateB
                    : dateB - dateA;
            });
        }

        return resultado;
    })();

    async function buscaGruposAventuras() {
        setGruposAventurasListadas(await obtemGruposPorMestre(usuarioLogado!.id));
    }

    useEffect(() => {
        buscaGruposAventuras();
    }, []);

    return (
        <ContextoMestreAventuras.Provider value={{ aventurasFiltradas, opcoesBusca, atualizarFiltro, toggleOrdenacaoData }}>
            {children}
        </ContextoMestreAventuras.Provider>
    );
};